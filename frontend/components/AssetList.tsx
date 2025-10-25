import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserAssets, deleteAsset } from '../services/blockchainService';
import type { Asset } from '../types';

const DocumentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const CertificateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

interface AssetCardProps {
    asset: Asset;
    onViewCertificate: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
    deleting: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onViewCertificate, onDelete, deleting }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(asset.hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col space-y-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1">
                    <DocumentIcon/>
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 dark:text-white">{asset.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{asset.description || 'No description'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Registered: {new Date(asset.timestamp).toLocaleString()}</p>
                </div>
            </div>
             <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded-md flex items-center justify-between">
                    <span className="truncate pr-2">SHA-256: {asset.hash}</span>
                    <button onClick={handleCopy} title="Copy hash" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        {copied ? 'Copied!' : <CopyIcon />}
                    </button>
                </div>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => onViewCertificate(asset)} 
                        className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1 rounded-md hover:bg-blue-500/10">
                        <CertificateIcon />
                        View Certificate
                    </button>
                    <button
                        onClick={() => onDelete(asset)}
                        disabled={deleting}
                        className="inline-flex items-center text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-3 py-1 rounded-md hover:bg-red-500/10 disabled:opacity-60"
                    >
                        {deleting ? (
                            <>
                                <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin mr-1.5 border-red-500"></span>
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface AssetListProps {
  onViewCertificate: (asset: Asset) => void;
  onFocusRegistrationForm?: () => void;
}

const AssetList: React.FC<AssetListProps> = ({ onViewCertificate, onFocusRegistrationForm }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAssets = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const userAssets = await getUserAssets();
                    setAssets(userAssets);
                } catch (error) {
                    console.error('Error fetching assets:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchAssets();
    }, [user]);

    const handleDelete = async (asset: Asset) => {
        if (!window.confirm('Delete this asset? This cannot be undone.')) return;
        setDeletingId(asset.id);
        try {
            await deleteAsset(asset.id);
            setAssets(prev => prev.filter(a => a.id !== asset.id));
        } catch (error) {
            console.error('Error deleting asset:', error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Registered Assets</h3>
                <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-400"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Registered Assets</h3>
            {assets.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {assets.map(asset => (
                        <AssetCard 
                            key={asset.id} 
                            asset={asset} 
                            onViewCertificate={onViewCertificate} 
                            onDelete={handleDelete}
                            deleting={deletingId === asset.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-2">You haven't registered any assets yet.</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Use the form on the left to add your first digital asset.</p>
                    {onFocusRegistrationForm && (
                        <button 
                            onClick={onFocusRegistrationForm}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Register Asset
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AssetList;