import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSharedWithUserAssets, downloadSharedAsset } from '../services/blockchainService';
import { useToast } from '../hooks/useToast';
import type { SharedAsset, Asset, User } from '../types';
import { downloadCertificate, downloadTextCertificate } from '../services/pdfCertificateService';

// Declare the global window properties for the libraries
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

// --- Icon Components ---
const DocumentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const CertificateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

// --- Card for a single shared asset ---
interface SharedAssetCardProps {
    sharedAsset: SharedAsset;
    onViewCertificate: (asset: Asset, owner: User) => void;
}

const SharedAssetCard: React.FC<SharedAssetCardProps> = ({ sharedAsset, onViewCertificate }) => {
    const { asset, owner, sharedAt } = sharedAsset;
    const { addToast } = useToast();
    const [downloadingAsset, setDownloadingAsset] = useState(false);
    const [downloadingCertificate, setDownloadingCertificate] = useState(false);

    const handleDownloadAsset = async () => {
        setDownloadingAsset(true);
        try {
            // For file downloads, we need to handle the response differently
            const token = localStorage.getItem('authToken');
            
            const response = await fetch(`http://localhost:5000/api/shares/download/${asset.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to download asset');
            }
            
            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `${asset.name}${asset.fileType.split('/')[1] ? `.${asset.fileType.split('/')[1]}` : ''}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }
            
            // Create blob and download
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addToast('Asset downloaded successfully!', 'success');
        } catch (error: any) {
            console.error('Error downloading asset:', error);
            addToast(error.message || 'Failed to download asset', 'error');
        } finally {
            setDownloadingAsset(false);
        }
    };

    const handleDownloadTextCertificate = useCallback(() => {
        try {
            // Create certificate content
            const certificateContent = `
IPProtect Digital Asset Certificate
===================================

Asset Name: ${asset.name}
Asset ID: ${asset.id}
File Type: ${asset.fileType}
Description: ${asset.description || 'No description provided'}

Owner Information:
- Owner Name: ${owner.name}
- Owner Email: ${owner.email}

Sharing Details:
- Shared by: ${owner.name}
- Shared on: ${new Date(sharedAt).toLocaleString()}

File Hash: ${asset.hash}

This certificate verifies the authenticity and ownership of the digital asset.
The file hash can be used to verify the integrity of the original file.

Certificate generated by IPProtect - Secure Digital Asset Management
            `.trim();

            // Create and download text file
            const blob = new Blob([certificateContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${asset.name.replace(/\s+/g, '_')}_certificate.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addToast('Certificate downloaded successfully!', 'success');
        } catch (error) {
            addToast('Failed to generate certificate', 'error');
        }
    }, [asset, owner, sharedAt, addToast]);

    const handleDownloadPdfCertificate = useCallback(async () => {
        setDownloadingCertificate(true);
        try {
            // Try to generate and download PDF certificate
            await downloadCertificate({ asset, owner });
            addToast('PDF certificate downloaded successfully!', 'success');
        } catch (error: any) {
            console.error('Error generating PDF certificate:', error);
            addToast(`PDF generation failed: ${error.message}`, 'error');
            
            // Fallback to text certificate
            try {
                downloadTextCertificate({ asset, owner });
                addToast('Text certificate downloaded successfully!', 'success');
            } catch (textError) {
                console.error('Error generating text certificate:', textError);
                addToast('Failed to generate certificate in any format.', 'error');
            }
        } finally {
            setDownloadingCertificate(false);
        }
    }, [asset, owner, addToast]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col space-y-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1"><DocumentIcon /></div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 dark:text-white">{asset.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{asset.description || 'No description'}</p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 space-y-1">
                        <p>Shared by: <span className="font-semibold text-slate-500 dark:text-slate-400">{owner.name}</span></p>
                        <p>Shared on: {new Date(sharedAt).toLocaleString()}</p>
                        <p>File type: {asset.fileType}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onViewCertificate(asset, owner)}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1 rounded-md hover:bg-blue-500/10">
                        <CertificateIcon />
                        View Certificate
                    </button>
                    <button
                        onClick={handleDownloadTextCertificate}
                        className="inline-flex items-center text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors px-3 py-1 rounded-md hover:bg-green-500/10">
                        <DownloadIcon />
                        Download Text Certificate
                    </button>
                    <button
                        onClick={handleDownloadPdfCertificate}
                        disabled={downloadingCertificate}
                        className="inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors px-3 py-1 rounded-md hover:bg-purple-500/10 disabled:opacity-50">
                        {downloadingCertificate ? (
                            <>
                                <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin mr-1.5 border-purple-500"></div>
                                Downloading PDF...
                            </>
                        ) : (
                            <>
                                <DownloadIcon />
                                Download PDF Certificate
                            </>
                        )}
                    </button>
                </div>
                <button
                    onClick={handleDownloadAsset}
                    disabled={downloadingAsset}
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-3 py-1 rounded-md hover:bg-indigo-500/10 disabled:opacity-50">
                    {downloadingAsset ? (
                        <>
                            <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin mr-1.5 border-indigo-500"></div>
                            Downloading Asset...
                        </>
                    ) : (
                        <>
                            <DownloadIcon />
                            Download Asset
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};


// --- Main list component ---
interface SharedAssetsListProps {
    onViewCertificate: (asset: Asset, owner: User) => void;
}

const SharedAssetsList: React.FC<SharedAssetsListProps> = ({ onViewCertificate }) => {
    const [sharedAssets, setSharedAssets] = useState<SharedAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSharedAssets = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const assets = await getSharedWithUserAssets();
                    setSharedAssets(assets);
                } catch (error) {
                    console.error('Error fetching shared assets:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchSharedAssets();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Assets Shared With Me</h3>
                <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-400"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Assets Shared With Me</h3>
            {sharedAssets.length > 0 ? (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {sharedAssets.map(item => (
                        <SharedAssetCard key={item.asset.id} sharedAsset={item} onViewCertificate={onViewCertificate} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">No assets have been shared with you yet.</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">When another user shares an asset, it will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default SharedAssetsList;