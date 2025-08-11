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
        <div className={`space-y-4 w-full ${className}`}>
            <Card 
                className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer min-h-[200px] shadow-sm hover:shadow-md
                    ${isDragOver 
                        ? 'border-[#769fcd] bg-[#f7fbfc] shadow-lg scale-[1.01]' 
                        : 'border-[#d6e6f2] hover:border-[#b9d7ea] bg-[#f7fbfc]/50'
                    }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <CardContent className="p-4 sm:p-6 md:p-8 text-center flex flex-col items-center justify-center h-full min-h-[180px]">
                    <input
                        type="file"
                        multiple={multiple}
                        accept={acceptedFileTypes}
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
                        <div className="space-y-3 sm:space-y-4 flex flex-col items-center w-full">
                            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#769fcd]/10 flex items-center justify-center transition-all duration-300">
                                <Icon
                                    name={selectedFiles.length > 0 ? "CheckCircle" : "Upload"}
                                    className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 transition-all duration-300 ${selectedFiles.length > 0 ? 'text-green-600' : 'text-[#769fcd]'}`}
                                />
                            </div>
                            <div className="space-y-2 w-full max-w-md">
                                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                                    {title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 px-2">
                                    {description}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">
                                    {acceptedFileTypes}
                                </p>
                            </div>
                        </div>
                    </label>
                </CardContent>
            </Card>

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
                <div className="space-y-3 w-full">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length}):</h4>
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 sm:p-4 bg-white border-2 border-[#d6e6f2] rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <Icon
                                        name="FileText"
                                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#769fcd] flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0 ml-2"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <Icon
                                        name="X"
                                        className="h-3 w-3 sm:h-4 sm:w-4"
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