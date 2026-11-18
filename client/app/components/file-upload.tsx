'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

interface IUploadedFile {
    fileName: string;
    fileUrl: string;
}

const FileUploadComponent: React.FC = () => {
    const [fileInfo, setFileInfo] = useState<IUploadedFile | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    // Fetch previously uploaded file if one exists
    useEffect(() => {
        fetch(`${API_BASE_URL}/current-file`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.fileUrl) {
                    setFileInfo({
                        fileName: data.fileName,
                        fileUrl: data.fileUrl,
                    });
                }
            })
            .catch(() => {
                // Ignore initial fetch errors
            });
    }, []);

    const handleFileUploadClick = () => {
        const el = document.createElement('input');
        el.type = 'file';
        el.accept = '.pdf,application/pdf';
        el.addEventListener('change', async () => {
            if (el.files && el.files.length > 0) {
                const file = el.files.item(0);
                if (file) {
                    // Create instant local blob URL for immediate preview
                    const localPreviewUrl = URL.createObjectURL(file);
                    setFileInfo({
                        fileName: file.name,
                        fileUrl: localPreviewUrl,
                    });
                    setUploading(true);
                    setStatusMessage('Uploading and indexing PDF...');

                    const formData = new FormData();
                    formData.append('pdf', file);

                    try {
                        const res = await fetch(`${API_BASE_URL}/upload/pdf`, {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await res.json();
                        if (data && data.fileUrl) {
                            setFileInfo({
                                fileName: data.fileName || file.name,
                                fileUrl: data.fileUrl,
                            });
                        }
                        setStatusMessage('PDF uploaded & indexed successfully!');
                    } catch (err: any) {
                        setStatusMessage(`Upload failed: ${err.message}`);
                    } finally {
                        setUploading(false);
                    }
                }
            }
        });
        el.click();
    };

    return (
        <div className="h-full flex flex-col w-full">
            {/* Header / Actions bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold truncate text-zinc-100" title={fileInfo?.fileName || 'No file uploaded'}>
                            {fileInfo ? fileInfo.fileName : 'Document Viewer'}
                        </h2>
                        {fileInfo && (
                            <div className="flex items-center gap-1 text-xs text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{uploading ? 'Processing...' : 'Indexed & Active'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    size="sm"
                    variant={fileInfo ? "outline" : "default"}
                    onClick={handleFileUploadClick}
                    disabled={uploading}
                    className="shrink-0 gap-1.5 text-xs"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Uploading...
                        </>
                    ) : fileInfo ? (
                        <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            Change PDF
                        </>
                    ) : (
                        <>
                            <Upload className="w-3.5 h-3.5" />
                            Upload PDF
                        </>
                    )}
                </Button>
            </div>

            {/* Content area: Preview or Empty Upload State */}
            {fileInfo?.fileUrl ? (
                <div className="flex-1 flex flex-col min-h-0 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                    <iframe
                        src={fileInfo.fileUrl}
                        title="PDF Preview"
                        className="w-full h-full border-0"
                    />
                </div>
            ) : (
                <div
                    onClick={handleFileUploadClick}
                    className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-6 cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/70 transition-all text-center"
                >
                    <div className="p-3 bg-zinc-800 rounded-full mb-3 text-zinc-300">
                        <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                        Upload a PDF document
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs">
                        Click here to select a PDF from your computer to preview and ask questions about it.
                    </p>
                </div>
            )}

            {/* Status note */}
            {statusMessage && (
                <p className="text-xs text-zinc-400 mt-2 truncate text-center">
                    {statusMessage}
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;
