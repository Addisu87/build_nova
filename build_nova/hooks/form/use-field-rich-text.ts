import {
	useState,
	useCallback,
	useRef,
} from "react"

interface RichTextConfig {
	initialValue?: string
	maxLength?: number
	minLength?: number
	allowedTags?: string[]
	allowedAttributes?: Record<string, string[]>
	onValueChange?: (value: string) => void
	onValidationChange?: (isValid: boolean) => void
}

interface RichTextState {
	value: string
	htmlValue: string
	isFocused: boolean
	isValid: boolean
	error: string | null
	selection: {
		start: number
		end: number
	} | null
}

const DEFAULT_CONFIG: Partial<RichTextConfig> = {
	allowedTags: [
		"p",
		"br",
		"strong",
		"em",
		"u",
		"h1",
		"h2",
		"h3",
		"ul",
		"ol",
		"li",
	],
	allowedAttributes: {
		a: ["href", "target"],
		img: ["src", "alt"],
	},
}

export function useFieldRichText(
	config: RichTextConfig,
) {
	const [state, setState] =
		useState<RichTextState>({
			value: config.initialValue || "",
			htmlValue: config.initialValue || "",
			isFocused: false,
			isValid: true,
			error: null,
			selection: null,
		})
	const editorRef = useRef<HTMLDivElement>(null)

	const validateContent = useCallback(
		(value: string): boolean => {
			const { maxLength, minLength } = config

			if (minLength && value.length < minLength) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `Content must be at least ${minLength} characters long`,
				}))
				return false
			}

			if (maxLength && value.length > maxLength) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `Content must not exceed ${maxLength} characters`,
				}))
				return false
			}

			setState((prevState) => ({
				...prevState,
				isValid: true,
				error: null,
			}))

			return true
		},
		[config],
	)

	const sanitizeHtml = useCallback(
		(html: string): string => {
			const { allowedTags, allowedAttributes } =
				config
			const tempDiv =
				document.createElement("div")
			tempDiv.innerHTML = html

			const sanitizeNode = (node: Node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					return
				}

				if (node.nodeType === Node.ELEMENT_NODE) {
					const element = node as HTMLElement
					const tagName =
						element.tagName.toLowerCase()

					// Remove disallowed tags
					if (!allowedTags?.includes(tagName)) {
						element.replaceWith(
							...Array.from(element.childNodes),
						)
						return
					}

					// Remove disallowed attributes
					const allowedAttrs =
						allowedAttributes?.[tagName] || []
					Array.from(element.attributes).forEach(
						(attr) => {
							if (
								!allowedAttrs.includes(attr.name)
							) {
								element.removeAttribute(attr.name)
							}
						},
					)
				}

				Array.from(node.childNodes).forEach(
					sanitizeNode,
				)
			}

			sanitizeNode(tempDiv)
			return tempDiv.innerHTML
		},
		[config],
	)

	const handleInput = useCallback(() => {
		if (!editorRef.current) {
			return
		}

		const htmlValue = editorRef.current.innerHTML
		const sanitizedHtml = sanitizeHtml(htmlValue)
		const textValue =
			editorRef.current.textContent || ""

		const isValid = validateContent(textValue)

		setState((prevState) => ({
			...prevState,
			value: textValue,
			htmlValue: sanitizedHtml,
			isValid,
		}))

		config.onValueChange?.(sanitizedHtml)
		config.onValidationChange?.(isValid)
	}, [config, sanitizeHtml, validateContent])

	const handleFocus = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: true,
		}))
	}, [])

	const handleBlur = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: false,
		}))
	}, [])

	const handleSelectionChange =
		useCallback(() => {
			const selection = window.getSelection()
			if (!selection || !editorRef.current) {
				return
			}

			const range = selection.getRangeAt(0)
			const preCaretRange = range.cloneRange()
			preCaretRange.selectNodeContents(
				editorRef.current,
			)
			preCaretRange.setEnd(
				range.endContainer,
				range.endOffset,
			)

			setState((prevState) => ({
				...prevState,
				selection: {
					start: preCaretRange.toString().length,
					end:
						preCaretRange.toString().length +
						range.toString().length,
				},
			}))
		}, [])

	const insertText = useCallback(
		(text: string) => {
			if (
				!editorRef.current ||
				!state.selection
			) {
				return
			}

			const selection = window.getSelection()
			if (!selection) {
				return
			}

			const range = selection.getRangeAt(0)
			range.deleteContents()
			range.insertNode(
				document.createTextNode(text),
			)
			selection.removeAllRanges()
			selection.addRange(range)
		},
		[state.selection],
	)

	const formatText = useCallback(
		(command: string, value?: string) => {
			document.execCommand(command, false, value)
		},
		[],
	)

	const reset = useCallback(() => {
		if (editorRef.current) {
			editorRef.current.innerHTML =
				config.initialValue || ""
		}

		setState({
			value: config.initialValue || "",
			htmlValue: config.initialValue || "",
			isFocused: false,
			isValid: true,
			error: null,
			selection: null,
		})
	}, [config])

	const getEditorProps = useCallback(() => {
		return {
			ref: editorRef,
			contentEditable: true,
			onInput: handleInput,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onSelect: handleSelectionChange,
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "rich-text-error"
				: undefined,
		}
	}, [
		state,
		handleInput,
		handleFocus,
		handleBlur,
		handleSelectionChange,
	])

	return {
		value: state.value,
		htmlValue: state.htmlValue,
		isFocused: state.isFocused,
		isValid: state.isValid,
		error: state.error,
		selection: state.selection,
		handleInput,
		handleFocus,
		handleBlur,
		handleSelectionChange,
		insertText,
		formatText,
		reset,
		getEditorProps,
	}
}
