import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Header from './Header';
import RegisterAssetForm from './RegisterAssetForm';
import AssetList from './AssetList';
import VerifyAsset from './VerifyAsset';
import Certificate from './Certificate';
import ShareAssetPage from './ShareAssetPage';
import ProfilePage from './ProfilePage';
import SharedAssetsList from './SharedAssetsList';
import type { Asset, User } from '../types';
import { getUserAssets } from '../services/blockchainService';

// Declare global variables from CDN scripts to satisfy TypeScript
declare const jspdf: any;
declare const html2canvas: any;

// --- Icon Components ---
const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const CollectionIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2" />
    </svg>
);
const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.944a12.02 12.02 0 009-2.944a12.02 12.02 0 00-1.382-9.008z" />
    </svg>
);
const ShareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);
const InboxInIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
);
const ProfileIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3 text-amber-500 dark:text-amber-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

type Tab = 'my-assets' | 'verify' | 'share' | 'shared-with-me' | 'profile';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('my-assets');
    const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
    const [selectedAssetForCert, setSelectedAssetForCert] = useState<Asset | null>(null);
    const [certOwner, setCertOwner] = useState<User | null>(null);
    const [totalAssets, setTotalAssets] = useState(0);
    const certificateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTotalAssets = async () => {
            if (user) {
                try {
                    const assets = await getUserAssets();
                    setTotalAssets(assets.length);
                } catch (error) {
                    console.error('Error fetching assets:', error);
                }
            }
        };
        
        fetchTotalAssets();
    }, [user]);

    const handleAssetRegistered = useCallback((newAsset: Asset) => {
        setTotalAssets(prev => prev + 1);
    }, []);

    const handleFocusRegistrationForm = useCallback(() => {
        // Scroll to the registration form and focus on the first input
        const formElement = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                formElement.focus();
            }, 500);
        }
    }, []);

    const handleViewCertificate = useCallback((asset: Asset, owner: User) => {
        setSelectedAssetForCert(asset);
        setCertOwner(owner);
        setIsCertificateModalOpen(true);
    }, []);

    const handleDownloadPdf = useCallback(async () => {
        try {
            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined' || !window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
                console.error('jsPDF not properly loaded. window.jspdf:', window.jspdf);
                addToast('PDF generation library (jsPDF) not properly loaded.', 'error');
                return;
            }
            
            console.log('Creating PDF certificate directly with jsPDF...');
            
            const jsPDFConstructor = window.jspdf.jsPDF;
            const pdf = new jsPDFConstructor({ 
                orientation: 'portrait', 
                unit: 'mm', 
                format: 'a4'
            });
            
            // Fill the entire page with dark background
            pdf.setFillColor(10, 26, 47); // Dark blue background
            pdf.rect(0, 0, 210, 297, 'F'); // Fill entire page
            
            // Set up colors and fonts
            pdf.setDrawColor(59, 130, 246); // Blue border
            pdf.setLineWidth(2);
            
            // Draw border
            pdf.rect(10, 10, 190, 277, 'D');
            
            // Draw inner border
            pdf.setLineWidth(1);
            pdf.rect(15, 15, 180, 267, 'D');
            
            // Set text color to white
            pdf.setTextColor(255, 255, 255);
            
            // Title
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(24);
            pdf.text('Certificate of Ownership', 105, 40, { align: 'center' });
            
            // Subtitle
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.text('This certificate confirms the digital registration of the following asset', 105, 50, { align: 'center' });
            pdf.text('on the IPProtect platform.', 105, 56, { align: 'center' });
            
            // Draw decorative line
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(1);
            pdf.line(30, 65, 180, 65);
            
            // Asset information section
            let yPosition = 80;
            
            if (selectedAssetForCert) {
                // Asset Name
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text('Asset Name:', 25, yPosition);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(12);
                pdf.text(selectedAssetForCert.name, 25, yPosition + 8);
                yPosition += 25;
                
                // Registered To
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text('Registered To:', 25, yPosition);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(12);
                pdf.text(user?.name || 'Unknown', 25, yPosition + 8);
                yPosition += 25;
                
                // Owner Email
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text('Owner Email:', 25, yPosition);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(12);
                pdf.text(user?.email || 'Unknown', 25, yPosition + 8);
                yPosition += 25;
                
                // Registration Date
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text('Registration Date & Time:', 25, yPosition);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(12);
                pdf.text(new Date(selectedAssetForCert.timestamp).toLocaleString(), 25, yPosition + 8);
                yPosition += 25;
                
                // Digital Fingerprint
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text('Unique Digital Fingerprint (SHA-256):', 25, yPosition);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                
                // Split hash into multiple lines
                const hashLines = pdf.splitTextToSize(selectedAssetForCert.hash, 160);
                pdf.text(hashLines, 25, yPosition + 8);
                
                // Draw decorative line before footer
                yPosition += 15 + (hashLines.length * 5);
                pdf.setDrawColor(255, 255, 255);
                pdf.setLineWidth(1);
                pdf.line(30, yPosition, 180, yPosition);
                
                // Footer section
                yPosition += 20;
                
                // IPProtect branding
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(18);
                pdf.text('Blockchain IP Protect', 105, yPosition, { align: 'center' });
                
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                pdf.text('Intellectual Property Protection Platform', 105, yPosition + 8, { align: 'center' });
                
                // Add blockchain and shield logo
                pdf.setFontSize(12);
                
                // Draw blockchain nodes
                const logoX = 170;
                const logoY = yPosition - 8;
                
                // Left side nodes
                pdf.setFillColor(148, 163, 184); // Silver gray
                pdf.setDrawColor(59, 130, 246); // Blue border
                pdf.rect(logoX, logoY, 3, 3, 'FD');
                pdf.rect(logoX, logoY + 4, 3, 3, 'FD');
                pdf.rect(logoX, logoY + 8, 3, 3, 'FD');
                
                // Right side nodes
                pdf.rect(logoX + 6, logoY + 2, 3, 3, 'FD');
                pdf.rect(logoX + 6, logoY + 6, 3, 3, 'FD');
                pdf.rect(logoX + 6, logoY + 10, 3, 3, 'FD');
                
                // Connection lines
                pdf.setDrawColor(255, 255, 255);
                pdf.setLineWidth(0.5);
                pdf.line(logoX + 3, logoY + 1.5, logoX + 6, logoY + 3.5);
                pdf.line(logoX + 3, logoY + 5.5, logoX + 6, logoY + 7.5);
                pdf.line(logoX + 3, logoY + 9.5, logoX + 6, logoY + 11.5);
                
                // Shield
                pdf.setFillColor(59, 130, 246); // Blue shield
                pdf.setDrawColor(148, 163, 184); // Silver border
                pdf.setLineWidth(1);
                
                // Shield shape
                const shieldX = logoX + 12;
                const shieldY = logoY + 1;
                pdf.rect(shieldX, shieldY, 8, 10, 'FD');
                
                // Shield content lines
                pdf.setDrawColor(255, 255, 255);
                pdf.setLineWidth(0.8);
                pdf.line(shieldX + 2, shieldY + 3, shieldX + 6, shieldY + 3);
                pdf.line(shieldX + 2, shieldY + 5, shieldX + 5, shieldY + 5);
                pdf.line(shieldX + 2, shieldY + 7, shieldX + 6, shieldY + 7);
                pdf.line(shieldX + 2, shieldY + 9, shieldX + 4, shieldY + 9);
                
                // Exclamation mark
                pdf.setFillColor(255, 255, 255);
                pdf.circle(shieldX + 3, shieldY + 2, 0.8, 'F');
                pdf.setLineWidth(0.8);
                pdf.line(shieldX + 3, shieldY + 3.5, shieldX + 3, shieldY + 4.5);
            }
            
            // Save the PDF
            console.log('Saving PDF certificate...');
            pdf.save(`IPProtect_Certificate_${selectedAssetForCert?.name.replace(/\s/g, '_')}.pdf`);
            console.log('PDF certificate saved successfully!');
            
            addToast('PDF certificate downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            addToast('An error occurred while generating the PDF: ' + (error.message || 'Unknown error'), 'error');
        }
    }, [selectedAssetForCert, user, addToast]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'my-assets':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-1">
                            <RegisterAssetForm onAssetRegistered={handleAssetRegistered} />
                        </div>
                        <div className="lg:col-span-2">
                            <AssetList 
                                onViewCertificate={(asset) => user && handleViewCertificate(asset, user)} 
                                onFocusRegistrationForm={handleFocusRegistrationForm}
                            />
                        </div>
                    </div>
                );
            case 'verify':
                return <VerifyAsset />;
            case 'share':
                return <ShareAssetPage onNavigateToTab={setActiveTab} />;
            case 'shared-with-me':
                return <SharedAssetsList onViewCertificate={handleViewCertificate} />;
            case 'profile':
                return <ProfilePage />;
            default:
                return null;
        }
    };

    const tabs: { id: Tab; name: string; icon: React.ReactNode }[] = [
        { id: 'my-assets', name: 'My Assets', icon: <CollectionIcon /> },
        { id: 'verify', name: 'Verify Asset', icon: <ShieldCheckIcon /> },
        { id: 'share', name: 'Share Asset', icon: <ShareIcon /> },
        { id: 'shared-with-me', name: 'Shared With Me', icon: <InboxInIcon /> },
        { id: 'profile', name: 'My Profile', icon: <ProfileIcon /> }
    ];

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 md:px-8 py-8">
                <div className="mb-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name}!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and protect your digital intellectual property.</p>
                     <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center px-4 py-2 bg-blue-500/10 dark:bg-blue-400/10 rounded-full text-blue-700 dark:text-blue-300 font-semibold text-sm">
                            <CollectionIcon className="h-5 w-5 mr-3"/>
                            <span>{totalAssets} Assets Registered</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-amber-500/10 dark:bg-amber-400/10 rounded-full text-amber-700 dark:text-amber-300 font-semibold text-sm">
                             <StarIcon />
                            <span>{user?.rewards || 0} Reward Points</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                                    } whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline-block">{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div>
                    {renderTabContent()}
                </div>
            </main>

            {isCertificateModalOpen && selectedAssetForCert && certOwner && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in-down" onClick={() => setIsCertificateModalOpen(false)}>
                    <div className="relative bg-transparent rounded-lg w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                        <div className="absolute -top-4 -right-4 z-10">
                            <button
                                onClick={() => setIsCertificateModalOpen(false)}
                                className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                                aria-label="Close certificate view"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        
                        <Certificate ref={certificateRef} asset={selectedAssetForCert} user={certOwner} />

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleDownloadPdf}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <DownloadIcon />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardPage;