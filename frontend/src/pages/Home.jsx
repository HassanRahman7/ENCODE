import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import InputSurface from '../components/InputSurface';
import AIResponse from '../components/AIResponse';
import { AlertCircle, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analyze';

const Home = () => {
    const [stage, setStage] = useState('input'); // input | loading | success | error
    const [analysisData, setAnalysisData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

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
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">

            {/* Subtle Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Main Layout Container */}
            <div className="relative max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center min-h-screen">

                {/* Brand / Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-medium text-blue-300 uppercase tracking-widest backdrop-blur-md">
                        <Zap className="w-3 h-3" />
                        <span>AI Native Health</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        Ingredient Co-Pilot
                    </h1>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto">
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

                        {stage === 'loading' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full flex justify-center py-20"
                            >
                                {/* Visual Placeholder for Loading State - keeps UI stable */}
                                <InputSurface onAnalyze={() => { }} isLoading={true} />
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
                                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center backdrop-blur-xl">
                                    <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-7 h-7 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                                    <p className="text-gray-400 mb-6">{errorMsg}</p>
                                    <button
                                        onClick={resetFlow}
                                        className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl transition-colors font-medium"
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
