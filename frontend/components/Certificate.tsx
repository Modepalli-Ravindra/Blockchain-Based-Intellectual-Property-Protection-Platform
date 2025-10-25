import React from 'react';
import type { User, Asset } from '../types';
import { useTheme } from '../hooks/useTheme';
import Logo from './Logo';

interface CertificateProps {
  asset: Asset;
  user: User;
}

const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(({ asset, user }, ref) => {
  const { theme } = useTheme();
  
  const lightGradient = 'radial-gradient(circle, rgba(241,245,249,1) 0%, rgba(226,232,240,1) 100%)';
  const darkGradient = 'radial-gradient(circle, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)';

  return (
    <div 
      ref={ref} 
      className="p-8 rounded-lg shadow-2xl w-full max-w-3xl border-2 border-blue-500/50 dark:border-blue-400 font-serif text-slate-800 dark:text-white"
      style={{
          background: theme === 'light' ? lightGradient : darkGradient,
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.3)',
      }}
    >
      <div className="text-center border-b-2 border-blue-500/20 dark:border-blue-400/50 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 tracking-wide">Certificate of Ownership</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">This certificate confirms the digital registration of the following asset on the IPProtect platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-lg my-8">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-sans">Asset Name</p>
          <p className="font-semibold text-blue-800 dark:text-blue-200 text-2xl truncate">{asset.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-sans">Registered To</p>
          <p className="font-semibold text-blue-800 dark:text-blue-200 text-xl">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-sans">Owner Email</p>
          <p className="font-semibold text-blue-800 dark:text-blue-200">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-sans">Registration Date & Time</p>
          <p className="font-semibold text-blue-800 dark:text-blue-200">{new Date(asset.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-blue-500/20 dark:border-blue-400/50">
        <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-sans mb-2">Unique Digital Fingerprint (SHA-256 Hash)</p>
        <p className="font-mono text-sm text-blue-700 dark:text-blue-300 bg-slate-200/50 dark:bg-slate-900/50 p-3 rounded-md break-all">{asset.hash}</p>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4">
        <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-sans">Blockchain IP Protect</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-sans">Intellectual Property Protection Platform</p>
        </div>
        <div className="text-blue-500/50 dark:text-blue-400/50">
          <Logo size="lg" showText={false} />
        </div>
      </div>
    </div>
  );
});

export default Certificate;