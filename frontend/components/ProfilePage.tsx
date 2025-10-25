import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
    }, [user]);

    const handleCopyId = async () => {
        if (!user) return;
        
        try {
            // Try to use the modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                console.log('Using modern clipboard API');
                await navigator.clipboard.writeText(user.id);
                addToast('User ID copied to clipboard!', 'success');
                return;
            } else {
                console.log('Modern clipboard API not available or not in secure context');
            }
        } catch (error) {
            console.error('Modern clipboard API failed:', error);
            // Continue to fallback method
        }
        
        // Fallback for older browsers or if modern API fails
        try {
            console.log('Using fallback method');
            // Create a temporary input element
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.left = '-999999px';
            input.style.top = '-999999px';
            input.style.opacity = '0';
            input.value = user.id;
            document.body.appendChild(input);
            
            // Select the text
            input.focus();
            input.select();
            input.setSelectionRange(0, input.value.length); // For mobile devices
            
            // Try to copy using execCommand
            let successful = false;
            if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
                console.log('Attempting document.execCommand');
                successful = document.execCommand('copy');
                console.log('document.execCommand result:', successful);
            } else {
                console.log('document.execCommand not supported');
            }
            
            // Clean up
            document.body.removeChild(input);
            
            if (successful) {
                addToast('User ID copied to clipboard!', 'success');
            } else {
                // Final fallback: show the ID in an alert
                console.log('All copy methods failed, showing ID in toast');
                addToast('Failed to copy automatically. Your User ID is: ' + user.id, 'error');
            }
        } catch (error) {
            console.error('Fallback copy method failed:', error);
            // Final fallback: show the ID in an alert
            addToast('Failed to copy automatically. Your User ID is: ' + user.id, 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            addToast('Name and email cannot be empty.', 'error');
            return;
        }

        if (name === user?.name && email === user?.email) {
            addToast('No changes detected.', 'success');
            return;
        }

        setLoading(true);
        try {
            await updateUser({ name, email });
            addToast('Profile updated successfully!', 'success');
        } catch (error: any) {
            addToast(error.message || 'Failed to update profile. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <ProfileIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                    My Profile
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">View and update your personal information.</p>
                
                 {user && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Your User ID</label>
                        <div className="flex items-center gap-2">
                             <p className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-900/50 p-2 rounded-md flex-grow break-all">{user.id}</p>
                             <button onClick={handleCopyId} title="Copy User ID" className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors">
                                <CopyIcon className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
                             </button>
                        </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Share this ID with other users to allow them to share assets with you directly.</p>
                    </div>
                 )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="profileName" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                        <input 
                            type="text" 
                            id="profileName" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                    </div>
                    <div>
                        <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
                        <input 
                            type="email" 
                            id="profileEmail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;