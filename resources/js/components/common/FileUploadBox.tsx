import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

interface FileUploadBoxProps {
    title?: string;
    description?: string;
    acceptedFileTypes?: string;
    multiple?: boolean;
    onFilesSelected: (files: File[]) => void;
    className?: string;
}

export function FileUploadBox({
    title = "Upload Files",
    description = "Drag and drop your files here, or click to select",
    acceptedFileTypes = ".pdf",
    multiple = false,
    onFilesSelected,
    className = ""
}: FileUploadBoxProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(files);
    }, []);

    const handleFiles = (files: File[]) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            onFilesSelected(files);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelected(newFiles);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <Card 
                className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${isDragOver 
                        ? 'border-[#769fcd] bg-[#f7fbfc]' 
                        : 'border-[#d6e6f2] hover:border-[#b9d7ea] bg-[#f7fbfc]/50'
                    }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <CardContent className="p-8 text-center">
                    <input
                        type="file"
                        multiple={multiple}
                        accept={acceptedFileTypes}
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-[#769fcd]/10 flex items-center justify-center">
                                <Icon
                                    name={selectedFiles.length > 0 ? "CheckCircle" : "Upload"}
                                    className={`h-8 w-8 ${selectedFiles.length > 0 ? 'text-green-600' : 'text-[#769fcd]'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-gray-800">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {description}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Accepted formats: {acceptedFileTypes}
                                </p>
                            </div>
                        </div>
                    </label>
                </CardContent>
            </Card>

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                    <div className="space-y-1">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border border-[#d6e6f2] rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon
                                        name="FileText"
                                        className="h-4 w-4 text-[#769fcd]"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Icon
                                        name="X"
                                        className="h-4 w-4"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}