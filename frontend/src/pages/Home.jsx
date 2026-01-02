import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import InputSurface from '../components/InputSurface';
import AIResponse from '../components/AIResponse';
import { AlertCircle, Zap, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analyze';


const LOADING_MESSAGES = [
    " Reading the fine print so you don't have to...",
    " Decoding hidden additives...",
    " Checking for sneaky sugars...",
    " Consulting the health nutrition expert...",
    " Unmasking the E-numbers...",
    " Calculating the trade-offs...",
    " Scanning for allergens...",
    " Analyzing nutritional density...",
    " Breaking down the ingredients...",
    " Checking for artificial preservatives...",
    " Reviewing health impact...",
];

const Home = () => {
    const [stage, setStage] = useState('input');

    const [analysisData, setAnalysisData] = useState(null);

    const [errorMsg, setErrorMsg] = useState('');

    // --- NEW: Loading Text State ---
    const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);



    // --- NEW: Cycle through messages when loading ---
    useEffect(() => {
        let interval;
        if (stage === 'loading') {
            let i = 0;
            setLoadingText(LOADING_MESSAGES[0]); // Reset to first message
            interval = setInterval(() => {
                i = (i + 1) % LOADING_MESSAGES.length;
                setLoadingText(LOADING_MESSAGES[i]);
            }, 2000); // Change every 2 seconds
        }
        return () => clearInterval(interval);
    }, [stage]);

    const handleAnalyze = async ({ text, file }) => {
        setStage('loading');
        setErrorMsg('');

        try {
            const formData = new FormData();
            if (text) formData.append('text', text);
            if (file) formData.append('image', file);

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAnalysisData(response.data);
            setStage('success');
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
            setStage('error');
        }
    };

    const resetFlow = () => {
        setStage('input');
        setAnalysisData(null);
        setErrorMsg('');

    };

    return (
        <div className="w-full text-gray-900 dark:text-white transition-colors duration-500 selection:bg-emerald-500/30">

            {/* --- LIVING ANIMATED BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-60 bg-emerald-300/40 dark:bg-blue-600/20"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-60 bg-teal-200/40 dark:bg-purple-600/10"
                />
                <motion.div
                    animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full blur-[90px] opacity-40 bg-lime-200/40 dark:bg-cyan-900/10"
                />
            </div>

            <div className="relative max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center min-h-[calc(100vh-100px)]">

                {/* Brand / Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest backdrop-blur-md border shadow-sm transition-colors duration-500
                                  bg-white/40 border-emerald-200/50 text-emerald-800 
                                  dark:bg-white/5 dark:border-white/5 dark:text-blue-300">
                        <Zap className="w-3 h-3" />
                        <span>AI Native Health</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 transition-colors duration-500 text-gray-900 dark:text-white">
                        Ingredient Co-Pilot
                    </h1>

                    <p className="text-lg max-w-lg mx-auto transition-colors duration-500 text-gray-600 dark:text-gray-400">
                        Instant clarity on what you eat. No databases, just intelligence.
                    </p>
                </motion.div>

                {/* Content Area */}
                <div className="w-full relative">
                    <AnimatePresence mode="wait">

                        {stage === 'input' && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4 }}
                            >
                                <InputSurface onAnalyze={handleAnalyze} isLoading={false} />
                            </motion.div>
                        )}

                        {/* --- NEW LOADING STATE WITH TEXT --- */}
                        {stage === 'loading' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full flex flex-col items-center justify-center py-20 text-center"
                            >
                                {/* The Glass Panel for Loading */}
                                <div className="p-10 rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-500
                                              bg-white/40 border-white/50 
                                              dark:bg-emerald-950/30 dark:border-emerald-500/20">

                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                                        <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin relative z-10 mx-auto" />
                                    </div>

                                    <motion.p
                                        key={loadingText} // Key change triggers animation
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-xl font-medium text-gray-800 dark:text-emerald-100 min-h-[30px]"
                                    >
                                        {loadingText}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <AIResponse data={analysisData} onReset={resetFlow} />
                            </motion.div>
                        )}

                        {stage === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center pt-8"
                            >
                                <div className="p-8 rounded-3xl max-w-md text-center backdrop-blur-xl border transition-colors duration-500 shadow-xl
                                              bg-white/40 border-red-200 
                                              dark:bg-red-500/10 dark:border-red-500/20">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                                                  bg-red-100 dark:bg-red-500/20">
                                        <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Analysis Failed</h3>
                                    <p className="mb-6 text-gray-600 dark:text-gray-400">{errorMsg}</p>
                                    <button
                                        onClick={resetFlow}
                                        className="px-8 py-3 rounded-xl transition-colors font-medium
                                                 bg-red-100 hover:bg-red-200 text-red-700
                                                 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-100"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Home;