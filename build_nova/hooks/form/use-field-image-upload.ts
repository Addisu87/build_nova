import { useState, useCallback, useRef } from 'react';

interface ImageUploadConfig {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  onUpload?: (files: File[]) => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface ImageUploadState {
  files: File[];
  previews: string[];
  isDragging: boolean;
  isValid: boolean;
  error: string | null;
  progress: Record<string, number>;
}

const DEFAULT_CONFIG: Partial<ImageUploadConfig> = {
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1,
  maxWidth: 1920,
  maxHeight: 1080,
  minWidth: 100,
  minHeight: 100,
};

export function useFieldImageUpload(config: ImageUploadConfig) {
  const [state, setState] = useState<ImageUploadState>({
    files: [],
    previews: [],
    isDragging: false,
    isValid: true,
    error: null,
    progress: {},
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = useCallback(async (file: File): Promise<boolean> => {
    const { maxSize, maxWidth, maxHeight, minWidth, minHeight, aspectRatio } = config;

    // Check file size
    if (maxSize && file.size > maxSize) {
      setState(prevState => ({
        ...prevState,
        isValid: false,
        error: `Image ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`,
      }));
      return false;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setState(prevState => ({
        ...prevState,
        isValid: false,
        error: `File ${file.name} is not an image`,
      }));
      return false;
    }

    // Check image dimensions
    try {
      const dimensions = await getImageDimensions(file);
      const { width, height } = dimensions;

      if (maxWidth && width > maxWidth) {
        setState(prevState => ({
          ...prevState,
          isValid: false,
          error: `Image ${file.name} exceeds maximum width of ${maxWidth}px`,
        }));
        return false;
      }

      if (maxHeight && height > maxHeight) {
        setState(prevState => ({
          ...prevState,
          isValid: false,
          error: `Image ${file.name} exceeds maximum height of ${maxHeight}px`,
        }));
        return false;
      }

      if (minWidth && width < minWidth) {
        setState(prevState => ({
          ...prevState,
          isValid: false,
          error: `Image ${file.name} is below minimum width of ${minWidth}px`,
        }));
        return false;
      }

      if (minHeight && height < minHeight) {
        setState(prevState => ({
          ...prevState,
          isValid: false,
          error: `Image ${file.name} is below minimum height of ${minHeight}px`,
        }));
        return false;
      }

      if (aspectRatio) {
        const ratio = width / height;
        const tolerance = 0.1; // 10% tolerance
        if (Math.abs(ratio - aspectRatio) > tolerance) {
          setState(prevState => ({
            ...prevState,
            isValid: false,
            error: `Image ${file.name} does not match required aspect ratio`,
          }));
          return false;
        }
      }
    } catch (error) {
      console.error('Failed to validate image dimensions:', error);
      return false;
    }

    return true;
  }, [config]);

  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const createPreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    await handleFiles(selectedFiles);
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const validations = await Promise.all(files.map(validateImage));
    const isValid = validations.every(Boolean);

    if (!isValid) {
      return;
    }

    const previews = files.map(createPreview);

    setState(prevState => ({
      ...prevState,
      files,
      previews,
      isValid,
    }));

    config.onUpload?.(files);
    config.onValidationChange?.(isValid);
  }, [config, validateImage, createPreview]);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setState(prevState => ({
      ...prevState,
      isDragging: true,
    }));
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setState(prevState => ({
      ...prevState,
      isDragging: false,
    }));
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setState(prevState => ({
      ...prevState,
      isDragging: false,
    }));

    const droppedFiles = Array.from(event.dataTransfer.files);
    await handleFiles(droppedFiles);
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setState(prevState => {
      const newFiles = [...prevState.files];
      const newPreviews = [...prevState.previews];
      URL.revokeObjectURL(newPreviews[index]);
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prevState,
        files: newFiles,
        previews: newPreviews,
        isValid: true,
      };
    });
  }, []);

  const clearFiles = useCallback(() => {
    setState(prevState => {
      prevState.previews.forEach(preview => URL.revokeObjectURL(preview));
      return {
        files: [],
        previews: [],
        isDragging: false,
        isValid: true,
        error: null,
        progress: {},
      };
    });
  }, []);

  const getInputProps = useCallback(() => {
    return {
      ref: fileInputRef,
      type: 'file',
      accept: config.accept,
      multiple: config.maxFiles ? config.maxFiles > 1 : false,
      onChange: handleFileSelect,
      style: { display: 'none' },
    };
  }, [config, handleFileSelect]);

  const getDropZoneProps = useCallback(() => {
    return {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onClick: () => fileInputRef.current?.click(),
      'aria-invalid': !state.isValid,
      'aria-describedby': state.error ? 'image-upload-error' : undefined,
    };
  }, [state, handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return {
    files: state.files,
    previews: state.previews,
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
  };
} 