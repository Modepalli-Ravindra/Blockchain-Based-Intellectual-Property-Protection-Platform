import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

const ShieldOutlineIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

// Feature Icons
const BlockchainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const SecurityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const VerificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SmartContractIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const GlobalRegistryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.586-.586a2 2 0 012.828 0l.586.586M15 11v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1m-4 8h16a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const EnterpriseGradeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;


const features = [
    { icon: <BlockchainIcon />, title: "Blockchain Protection", description: "Immutable proof of ownership stored on the blockchain" },
    { icon: <SecurityIcon />, title: "Cryptographic Security", description: "SHA-256 hashing ensures your IP cannot be tampered with" },
    { icon: <VerificationIcon />, title: "Instant Verification", description: "Verify originality in seconds with our advanced matching system" },
    { icon: <SmartContractIcon />, title: "Smart Contracts", description: "Automated licensing and royalty management" },
    { icon: <GlobalRegistryIcon />, title: "Global Registry", description: "Worldwide recognition and protection of your intellectual property" },
    { icon: <EnterpriseGradeIcon />, title: "Enterprise Grade", description: "Built for creators, businesses, and enterprises" },
];

// Diagnostic component for testing API connectivity
const DiagnosticSection: React.FC = () => {
    const [testResults, setTestResults] = React.useState<{[key: string]: string}>({});
    const [isTesting, setIsTesting] = React.useState(false);
    
    const runDiagnosticTests = async () => {
        setIsTesting(true);
        const results: {[key: string]: string} = {};
        
        try {
            // Test 1: Health endpoint
            try {
                const healthResponse = await fetch('http://localhost:5000/api/health');
                results['Health Check'] = `Success: ${healthResponse.status} ${healthResponse.statusText}`;
            } catch (error: any) {
                results['Health Check'] = `Failed: ${error.message}`;
            }
            
            // Test 2: Database endpoint
            try {
                const dbResponse = await fetch('http://localhost:5000/api/debug/data');
                results['Database Connection'] = `Success: ${dbResponse.status} ${dbResponse.statusText}`;
            } catch (error: any) {
                results['Database Connection'] = `Failed: ${error.message}`;
            }
            
            // Test 3: Auth endpoint (without token)
            try {
                const authResponse = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                results['Auth Endpoint'] = `Accessible: ${authResponse.status} ${authResponse.statusText} (expected 401 without token)`;
            } catch (error: any) {
                results['Auth Endpoint'] = `Failed: ${error.message}`;
            }
            
            setTestResults(results);
        } finally {
            setIsTesting(false);
        }
    };
    
    return (
        <section className="w-full py-12 bg-slate-100 dark:bg-slate-800/50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Connection Diagnostics</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Run these tests to diagnose any connection issues with the backend services.
                    </p>
                    
                    <button 
                        onClick={runDiagnosticTests}
                        disabled={isTesting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors mb-6"
                    >
                        {isTesting ? 'Running Tests...' : 'Run Connection Tests'}
                    </button>
                    
                    {Object.keys(testResults).length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Test Results:</h4>
                            {Object.entries(testResults).map(([test, result]) => (
                                <div key={test} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="font-medium text-slate-900 dark:text-white">{test}:</span>
                                    <span className={`font-mono text-sm ${(result as string).startsWith('Success') || (result as string).includes('Accessible') ? 'text-green-600' : 'text-red-600'}`}>
                                        {result}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const ShapesBackground = () => {
    const shapes = [
        { style: 'w-16 h-16 border-2 border-purple-500', top: '15%', left: '10%', animation: 'float 12s' },
        { style: 'w-8 h-8 bg-teal-500', top: '25%', left: '30%', animation: 'float-reverse 8s' },
        { style: 'w-24 h-24 border-2 border-blue-500', top: '10%', left: '80%', animation: 'float 15s' },
        { style: 'w-12 h-12 border-2 border-teal-400 rotate-45', top: '70%', left: '5%', animation: 'float-reverse 10s' },
        { style: 'w-20 h-20 border-2 border-purple-400 rounded-full', top: '80%', left: '40%', animation: 'float 13s' },
        { style: 'w-10 h-10 bg-blue-600', top: '50%', left: '90%', animation: 'float 9s' },
        { style: 'w-14 h-14 border-2 border-teal-500', top: '40%', left: '5%', animation: 'float 11s' },
        { style: 'w-6 h-6 bg-purple-500', top: '85%', left: '95%', animation: 'float-reverse 7s' },
    ];

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {shapes.map((shape, index) => (
                <div 
                    key={index} 
                    className={`shape-item ${shape.style}`}
                    style={{ 
                        top: shape.top, 
                        left: shape.left, 
                        animation: `${shape.animation} infinite`,
                        animationDelay: `${index * 0.5}s`
                    }}
                />
            ))}
        </div>
    );
};


const LandingPage: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
    // diagnostics toggle removed
    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-black text-slate-900 dark:text-white overflow-x-hidden">
            <ShapesBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="sticky top-0 z-20 w-full bg-white/70 dark:bg-black/40 backdrop-blur border-b border-slate-200 dark:border-gray-800/50">
                    <div className="container mx-auto flex justify-between items-center p-4 md:p-6">
                        <Logo size="md" showText={true} />
                        <nav className="flex items-center space-x-2 md:space-x-4">
                            <ThemeToggle />
                            <button onClick={onNavigateToAuth} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Sign In
                            </button>
                            <button onClick={onNavigateToAuth} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow">
                                Sign Up
                            </button>
                        </nav>
                    </div>
                </header>

                <main className="flex-grow">
                    <section className="container mx-auto px-4 md:px-8 py-20 md:py-28">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Protect Your Ideas</h1>
                                <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">Blockchain-backed registration and verification for your digital assets. Fast, secure, and creator-friendly.</p>
                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button onClick={onNavigateToAuth} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700 transition-colors">
                                        Get Started
                                    </button>
                                    <a href="#features" className="px-8 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Learn More
                                    </a>
                                </div>
                                <div className="mt-8 flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">Live Protection</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Verified by 10,000+ creators</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-64 md:h-80 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-500/20 border border-slate-200 dark:border-slate-800">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldOutlineIcon className="w-24 h-24 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" className="w-full py-20 bg-white/60 dark:bg-black/40 backdrop-blur-sm">
                        <div className="container mx-auto text-center px-4">
                            <h2 className="text-3xl md:text-4xl font-bold">Why IPProtect?</h2>
                            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">Enterprise-grade protection powered by cutting-edge blockchain technology.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
                                {features.map((feature, index) => (
                                    <div key={index} className="bg-white/70 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                        {feature.icon}
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="w-full py-24 bg-white/60 dark:bg-black/40">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">Q/A</h2>
                            <div className="mt-10 max-w-3xl mx-auto space-y-4">
                              <details className="group p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                <summary className="flex items-center justify-between cursor-pointer">
                                  <span className="font-semibold">How do I register an asset?</span>
                                  <span className="text-slate-500 group-open:hidden">+</span>
                                  <span className="text-slate-500 hidden group-open:inline">−</span>
                                </summary>
                                <div className="mt-2 text-slate-600 dark:text-slate-400">Go to Dashboard → Register Asset, upload your file, and we’ll hash it and store proof on the blockchain.</div>
                              </details>
                              <details className="group p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                <summary className="flex items-center justify-between cursor-pointer">
                                  <span className="font-semibold">What file types are supported?</span>
                                  <span className="text-slate-500 group-open:hidden">+</span>
                                  <span className="text-slate-500 hidden group-open:inline">−</span>
                                </summary>
                                <div className="mt-2 text-slate-600 dark:text-slate-400">Common images, documents, and media. If needed, we can enable more types.</div>
                              </details>
                              <details className="group p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                <summary className="flex items_center justify-between cursor-pointer">
                                  <span className="font-semibold">Is my file stored on-chain?</span>
                                  <span className="text-slate-500 group-open:hidden">+</span>
                                  <span className="text-slate-500 hidden group-open:inline">−</span>
                                </summary>
                                <div className="mt-2 text-slate-600 dark:text-slate-400">No. Only the cryptographic hash is stored on-chain; files live in secure storage.</div>
                              </details>
                              <details className="group p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                <summary className="flex items-center justify-between cursor-pointer">
                                  <span className="font-semibold">How do I verify authenticity?</span>
                                  <span className="text-slate-500 group-open:hidden">+</span>
                                  <span className="text-slate-500 hidden group-open:inline">−</span>
                                </summary>
                                <div className="mt-2 text-slate-600 dark:text-slate-400">Use Verify Asset to re-hash the file and compare with the registered proof.</div>
                              </details>
                            </div>
                          </div>
                        </section>

                    <section className="w-full py-24 bg:white dark:bg:black">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">How It Works</h2>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">Register, verify, and share your assets with cryptographic proof.</p>
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6 rounded-xl bg:white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Step 1</div>
                                    <h3 className="mt-1 text-xl font-bold">Register</h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">Upload your file and store an immutable hash on the blockchain.</p>
                                </div>
                                <div className="p-6 rounded-xl bg:white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Step 2</div>
                                    <h3 className="mt-1 text-xl font-bold">Verify</h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">Prove authenticity anytime by re-hashing and comparing securely.</p>
                                </div>
                                <div className="p-6 rounded-xl bg:white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Step 3</div>
                                    <h3 className="mt-1 text-xl font-bold">Share</h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">Share assets or certificates with collaborators and clients.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-full py-24 bg-slate-50 dark:bg-slate-800/40">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">Trusted by Creators</h2>
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 rounded-xl bg:white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-700 dark:text-slate-300">“IPProtect gives me peace of mind. My designs are securely registered and easy to verify.”</p>
                                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">— Product Designer</div>
                                </div>
                                <div className="p-6 rounded-xl bg:white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-700 dark:text-slate-300">“Seamless to use and perfect for sharing verified assets with clients.”</p>
                                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">— Creative Agency</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-full py-24">
                        <div className="container mx-auto px-4">
                            <div className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-emerald-900 shadow-2xl ring-1 ring-white/10">
                                {/* Decorative squares inspired by your creative */}
                                <div className="absolute -top-10 right-16 h-36 w-36 rounded-md border border-indigo-400/30"></div>
                                <div className="absolute -bottom-8 left-10 h-28 w-28 rounded-md border border-fuchsia-400/30"></div>

                                {/* Center shield icon */}
                                <div className="flex h-[280px] md:h-[340px] items-center justify-center">
                                    <svg className="w-28 h-28 md:w-36 md:h-36" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="url(#shieldGrad)">
                                        <defs>
                                            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#60a5fa" />
                                                <stop offset="100%" stopColor="#6366f1" />
                                            </linearGradient>
                                        </defs>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>

                                {/* Bottom text band with actions */}
                                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-black/20 backdrop-blur-sm">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to secure your IP?</h3>
                                            <p className="mt-1 text-white/70">Register your first asset in minutes.</p>
                                        </div>
                                        <div className="flex gap-3 justify-start md:justify-end">
                                            <button onClick={onNavigateToAuth} className="px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-semibold shadow hover:from-fuchsia-600 hover:to-violet-700 transition-colors">
                                                Create an account
                                            </button>
                                            <a href="#features" className="px-6 py-3 rounded-lg border border-white/30 text-white/90 hover:bg-white/10 transition-colors">
                                                Learn more
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* diagnostics removed */}
                </main>

                <footer className="border-t border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 py-6 flex items-center justify-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} IPProtect</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;