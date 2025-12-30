import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputSurface = ({ onAnalyze, isLoading }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        // Clear text if image is selected to prioritize visual input? 
        // Or keep them capable of working together? 
        // For simplicity and "Unified" feel, let's allow both but emphasize the image if present.
    };

    const clearImage = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text && !file) return;
        onAnalyze({ text, file });
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-1 overflow-hidden shadow-2xl shadow-blue-900/10"
            >
                <div className="bg-slate-900/40 rounded-[22px] p-8 sm:p-12 backdrop-blur-sm">

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Show me the ingredients</h2>
                        <p className="text-gray-400">Upload a label or paste the text below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Unified Input Container */}
                        <div className="space-y-6">

                            {/* Image Input Area - Styled as a feature, not a field */}
                            <div
                                className={`relative group cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden min-h-[160px] flex items-center justify-center border-2 border-dashed ${dragActive
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : preview
                                            ? 'border-transparent p-0'
                                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                    }`}
                                onClick={() => !preview && fileInputRef.current?.click()}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <AnimatePresence mode="wait">
                                    {preview ? (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative w-full h-64 sm:h-80 w-full"
                                        >
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full backdrop-blur-md mb-3 font-medium transition-colors"
                                                >
                                                    Change Photo
                                                </button>
                                                <button
                                                    onClick={clearImage}
                                                    className="text-white/70 hover:text-white text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center p-6 text-center"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8 text-blue-400/80" />
                                            </div>
                                            <p className="text-lg font-medium text-white mb-1">Click to upload photo</p>
                                            <p className="text-sm text-gray-500">or drag and drop</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Minimal Text Input */}
                            <div className="relative">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="...or paste the ingredient list here"
                                    className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-center text-lg min-h-[60px] resize-none py-4"
                                    style={{ fieldSizing: "content" }} // Modern CSS, fallback handled by min-h
                                />
                            </div>

                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Primary Action Button - Detached and Centered */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-8 flex justify-center"
            >
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || (!text && !file)}
                    className={`flex items-center space-x-3 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-xl ${isLoading || (!text && !file)
                            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            : 'bg-white text-black hover:scale-105 hover:shadow-2xl hover:bg-blue-50'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <span>Analyze Ingredients</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

export default InputSurface;
