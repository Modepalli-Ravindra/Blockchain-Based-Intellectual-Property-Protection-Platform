import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { registerAsset } from '../services/blockchainService';
import type { Asset } from '../types';

interface RegisterAssetFormProps {
    onAssetRegistered: (newAsset: Asset) => void;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const RegisterAssetForm: React.FC<RegisterAssetFormProps> = ({ onAssetRegistered }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const { addToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setIsDragging(true);
    }, [loading]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setIsDragging(false);
    }, [loading]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            if (fileInputRef.current) {
                fileInputRef.current.files = e.dataTransfer.files;
            }
        }
    }, [loading]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !file || !user) {
            addToast('Asset name and file are required.', 'error');
            return;
        }
        setLoading(true);

        try {
            const newAsset = await registerAsset({
                userId: user.id,
                name,
                description,
                fileType: file.type
            }, file);
            addToast(`Asset "${newAsset.name}" registered successfully!`, 'success');
            onAssetRegistered(newAsset);
            // Reset form
            setName('');
            setDescription('');
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err: any) {
            addToast(err.message || 'Failed to register asset.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <UploadIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                Register New Asset
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="assetName" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Asset Name</label>
                    <input type="text" id="assetName" value={name} onChange={(e) => setName(e.target.value)}
                           disabled={loading}
                           className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="assetDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Description (Optional)</label>
                    <textarea id="assetDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                              disabled={loading}
                              className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Digital File</label>
                    <div 
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md transition-colors duration-200 ${isDragging ? 'bg-blue-500/10 border-blue-500' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="space-y-1 text-center">
                           <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                            <div className="flex text-sm text-slate-500 dark:text-slate-400">
                                <label htmlFor="file-upload" className={`relative rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-blue-500 px-1 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} disabled={loading}/>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            {file ? 
                                <p className="text-xs text-slate-600 dark:text-slate-300">{file.name}</p> : 
                                <p className="text-xs text-slate-500">Any file type, up to 10MB</p>
                            }
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                    {loading && <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>}
                    {loading ? 'Registering...' : 'Register Asset'}
                </button>
            </form>
        </div>
    );
};

export default RegisterAssetForm;