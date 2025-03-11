import {
	useState,
	useCallback,
	useRef,
} from "react"

interface FileUploadConfig {
	accept?: string
	maxSize?: number
	maxFiles?: number
	multiple?: boolean
	onUpload?: (files: File[]) => void
	onValidationChange?: (isValid: boolean) => void
}

interface FileUploadState {
	files: File[]
	displayNames: string[]
	isDragging: boolean
	isValid: boolean
	error: string | null
	progress: Record<string, number>
}

const DEFAULT_CONFIG: Partial<FileUploadConfig> =
	{
		maxSize: 5 * 1024 * 1024, // 5MB
		maxFiles: 1,
		multiple: false,
	}

export function useFieldFileUpload(
	config: FileUploadConfig,
) {
	const [state, setState] =
		useState<FileUploadState>({
			files: [],
			displayNames: [],
			isDragging: false,
			isValid: true,
			error: null,
			progress: {},
		})
	const fileInputRef =
		useRef<HTMLInputElement>(null)

	const validateFiles = useCallback(
		(files: File[]): boolean => {
			const { accept, maxSize, maxFiles } = config

			if (files.length === 0) {
				return true
			}

			if (maxFiles && files.length > maxFiles) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `Maximum ${maxFiles} file(s) allowed`,
				}))
				return false
			}

			for (const file of files) {
				if (maxSize && file.size > maxSize) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error: `File ${
							file.name
						} exceeds maximum size of ${
							maxSize / 1024 / 1024
						}MB`,
					}))
					return false
				}

				if (accept) {
					const acceptedTypes = accept
						.split(",")
						.map((type) => type.trim())
					const fileType = file.type
					const fileExtension =
						"." +
						file.name
							.split(".")
							.pop()
							?.toLowerCase()

					const isAccepted = acceptedTypes.some(
						(type) => {
							if (type.startsWith(".")) {
								return (
									type.toLowerCase() ===
									fileExtension
								)
							}
							return type === fileType
						},
					)

					if (!isAccepted) {
						setState((prevState) => ({
							...prevState,
							isValid: false,
							error: `File ${file.name} is not an accepted type`,
						}))
						return false
					}
				}
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

	const handleFileSelect = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const selectedFiles = Array.from(
				event.target.files || [],
			)
			handleFiles(selectedFiles)
		},
		[],
	)

	const handleFiles = useCallback(
		(files: File[]) => {
			const isValid = validateFiles(files)
			const displayNames = files.map(
				(file) => file.name,
			)

			setState((prevState) => ({
				...prevState,
				files,
				displayNames,
				isValid,
			}))

			config.onUpload?.(files)
			config.onValidationChange?.(isValid)
		},
		[config, validateFiles],
	)

	const handleDragEnter = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()
			setState((prevState) => ({
				...prevState,
				isDragging: true,
			}))
		},
		[],
	)

	const handleDragLeave = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()
			setState((prevState) => ({
				...prevState,
				isDragging: false,
			}))
		},
		[],
	)

	const handleDragOver = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()
		},
		[],
	)

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()

			setState((prevState) => ({
				...prevState,
				isDragging: false,
			}))

			const droppedFiles = Array.from(
				event.dataTransfer.files,
			)
			handleFiles(droppedFiles)
		},
		[handleFiles],
	)

	const removeFile = useCallback(
		(index: number) => {
			setState((prevState) => {
				const newFiles = [...prevState.files]
				const newDisplayNames = [
					...prevState.displayNames,
				]
				newFiles.splice(index, 1)
				newDisplayNames.splice(index, 1)

				return {
					...prevState,
					files: newFiles,
					displayNames: newDisplayNames,
					isValid: validateFiles(newFiles),
				}
			})
		},
		[validateFiles],
	)

	const clearFiles = useCallback(() => {
		setState({
			files: [],
			displayNames: [],
			isDragging: false,
			isValid: true,
			error: null,
			progress: {},
		})
	}, [])

	const getInputProps = useCallback(() => {
		return {
			ref: fileInputRef,
			type: "file",
			accept: config.accept,
			multiple: config.multiple,
			onChange: handleFileSelect,
			style: { display: "none" },
		}
	}, [config, handleFileSelect])

	const getDropZoneProps = useCallback(() => {
		return {
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleDrop,
			onClick: () =>
				fileInputRef.current?.click(),
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "file-upload-error"
				: undefined,
		}
	}, [
		state,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleDrop,
	])

	return {
		files: state.files,
		displayNames: state.displayNames,
		isDragging: state.isDragging,
		isValid: state.isValid,
		error: state.error,
		progress: state.progress,
		handleFileSelect,
		handleFiles,
		removeFile,
		clearFiles,
		getInputProps,
		getDropZoneProps,
	}
}
