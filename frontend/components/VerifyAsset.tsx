import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { verifyAsset } from '../services/blockchainService';
import type { Asset } from '../types';

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const XCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.944a12.02 12.02 0 009-2.944a12.02 12.02 0 00-1.382-9.008z" />
    </svg>
);

const VerifyAsset: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [verificationResult, setVerificationResult] = useState<{ asset: Asset | null; isVerified: boolean } | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, addReward } = useAuth();
    const { addToast } = useToast();

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && user) {
            setFile(selectedFile);
            setLoading(true);
            setVerificationResult(null);
            const result = await verifyAsset(selectedFile, user.id);
            setVerificationResult(result);
            
            if (result.isVerified) {
                const rewardPoints = 10;
                addReward(rewardPoints);
                addToast(`Asset Verified! You earned ${rewardPoints} points.`, 'success');
            }

            setLoading(false);
        }
    }, [user, addReward, addToast]);

    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400"/>
                Verify Asset
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload a file to check if it's a registered asset in your account and earn points.</p>
            <input type="file" onChange={handleFileChange} disabled={loading} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-200 dark:hover:file:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed" />
            
            {loading && (
                 <div className="mt-4 flex items-center text-slate-500 dark:text-slate-400">
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2 border-blue-500 dark:border-blue-400"></div>
                    <span>Verifying...</span>
                </div>
            )}

            {verificationResult && (
                <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-900/50">
                    {verificationResult.isVerified && verificationResult.asset ? (
                        <div className="flex items-start space-x-3">
                            <CheckCircleIcon />
                            <div>
                                <h4 className="font-bold text-green-600 dark:text-green-400">Asset Verified</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                                    File matches: <span className="font-semibold">{verificationResult.asset.name}</span>
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Registered on: {new Date(verificationResult.asset.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start space-x-3">
                            <XCircleIcon />
                            <div>
                                <h4 className="font-bold text-red-600 dark:text-red-400">Verification Failed</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    No matching asset found in your records. The file may be unregistered or altered.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifyAsset;