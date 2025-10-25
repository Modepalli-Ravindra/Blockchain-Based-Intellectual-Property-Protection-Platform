import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getUserAssets, shareAssetWithUser } from '../services/blockchainService';
import type { Asset } from '../types';

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const ShareAsset: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [shareableLink, setShareableLink] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [isSharing, setIsSharing] = useState(false);

    const generateShareableLink = useCallback((asset: Asset) => {
        if (!user) return '';

        const dataToEncode = {
            asset: asset,
            owner: {
                name: user.name,
                email: user.email,
            },
        };

        try {
            const jsonString = JSON.stringify(dataToEncode);
            const encodedData = btoa(jsonString);
            return `${window.location.origin}${window.location.pathname}#share=${encodedData}`;
        } catch (error) {
            console.error('Failed to create shareable link:', error);
            addToast('Could not generate shareable link.', 'error');
            return '';
        }
    }, [user, addToast]);

    useEffect(() => {
        if (user) {
            const userAssets = getUserAssets(user.id);
            setAssets(userAssets);
            if (userAssets.length > 0) {
                const initialAssetId = userAssets[0].id;
                setSelectedAssetId(initialAssetId);
                const asset = userAssets.find(a => a.id === initialAssetId);
                if (asset) {
                    setShareableLink(generateShareableLink(asset));
                }
            }
        }
    }, [user, generateShareableLink]);

    const handleAssetSelection = (assetId: string) => {
        setSelectedAssetId(assetId);
        const assetToShare = assets.find(a => a.id === assetId);

        if (assetToShare) {
            setShareableLink(generateShareableLink(assetToShare));
        } else {
            setShareableLink('');
        }
    };
    
    const handleCopyLink = () => {
        if (!shareableLink) {
            addToast('Please select an asset to generate a link.', 'error');
            return;
        }
        navigator.clipboard.writeText(shareableLink)
            .then(() => {
                addToast('Shareable link copied to clipboard!', 'success');
            })
            .catch(() => {
                addToast('Failed to copy link.', 'error');
            });
    };

    const handleShareWithUser = async () => {
        if (!user) return;
        if (!selectedAssetId || !recipientId.trim()) {
            addToast('Please select an asset and enter a recipient User ID.', 'error');
            return;
        }
        
        setIsSharing(true);
        try {
            await shareAssetWithUser(selectedAssetId, user.id, recipientId.trim());
            addToast('Asset shared successfully!', 'success');
            setRecipientId('');
        } catch (error: any) {
            addToast(error.message || 'Failed to share asset.', 'error');
        } finally {
            setIsSharing(false);
        }
    };

    if (assets.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <ShareIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400"/>
                    Share Asset
                </h3>
                <p className="text-slate-500 dark:text-slate-400">You need to register at least one asset before you can share it.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <ShareIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400"/>
                    Share Asset
                </h3>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="asset-select" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Select an Asset to Share</label>
                        <select 
                            id="asset-select" 
                            value={selectedAssetId} 
                            onChange={(e) => handleAssetSelection(e.target.value)}
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Generate Public Link</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Create a unique link to share your asset's certificate with anyone, anywhere.</p>
                 {shareableLink && (
                    <div>
                        <label htmlFor="share-link" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Shareable Link</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input 
                                type="text" 
                                id="share-link"
                                value={shareableLink} 
                                readOnly 
                                className="flex-1 block w-full min-w-0 rounded-none rounded-l-md bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-600 dark:text-slate-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button 
                                onClick={handleCopyLink}
                                type="button" 
                                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            >
                                <CopyIcon />
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Share Directly with a User</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Share the selected asset with another registered user on IPProtect using their User ID.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="recipient-id" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Recipient User ID</label>
                        <input
                            type="text"
                            id="recipient-id"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            placeholder="Enter the user's unique ID"
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleShareWithUser}
                        disabled={isSharing}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSharing && <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {isSharing ? 'Sharing...' : 'Share Asset'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareAsset;