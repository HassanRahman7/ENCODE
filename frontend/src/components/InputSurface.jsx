import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, ArrowRight, Loader2, Mic, StopCircle, ScanLine, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from "react-webcam"; // New Import

const InputSurface = ({ onAnalyze, isLoading }) => {
    const [text, setText] = useState('');
    const [liveText, setLiveText] = useState(''); 
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    
    // Voice State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    
    // Camera Refs
    const fileInputRef = useRef(null);
    const nativeCameraInputRef = useRef(null); // For Mobile
    const webcamRef = useRef(null);            // For Laptop
    
    // Desktop Webcam State
    const [showWebcam, setShowWebcam] = useState(false);

    // --- REAL-TIME VOICE LOGIC ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setText(prev => {
                        const spacer = prev && !prev.endsWith(' ') ? ' ' : '';
                        return prev + spacer + finalTranscript;
                    });
                    setLiveText('');
                } else {
                    setLiveText(interimTranscript);
                }
            };

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => {
                setLiveText((currentLive) => {
                    if (currentLive) {
                        setText(prev => prev + ' ' + currentLive);
                        return '';
                    }
                    return '';
                });
                setIsListening(false);
            };
            
            recognition.onerror = (event) => {
                console.error("Speech error", event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice input not supported in this browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const displayValue = text + (liveText ? (text ? ' ' : '') + liveText : '');

    const handleTextChange = (e) => {
        setText(e.target.value);
        setLiveText('');
    };

    // -------------------

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoading) return;
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoading) return;
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
    };

    const clearImage = (e) => {
        if(e) e.stopPropagation();
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalSubmitText = displayValue; 
        if (!finalSubmitText && !file) return;
        onAnalyze({ text: finalSubmitText, file });
    };

    // --- SMART SCAN LOGIC ---
    const handleScanClick = () => {
        // Simple check: If user is on a mobile device/tablet, use native camera.
        // Otherwise, open the webcam modal for laptop users.
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            nativeCameraInputRef.current?.click();
        } else {
            setShowWebcam(true);
        }
    };

    // Capture photo from Desktop Webcam
    const captureWebcam = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            // Convert base64 to a Blob so it acts like a file upload
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "webcam_capture.jpg", { type: "image/jpeg" });
                    handleFileSelect(file);
                    setShowWebcam(false); // Close modal
                });
        }
    }, [webcamRef]);

    return (
        <div className="w-full max-w-3xl mx-auto">
            
            {/* --- DESKTOP WEBCAM MODAL --- */}
            <AnimatePresence>
                {showWebcam && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <div className="bg-gray-900 p-6 rounded-3xl w-full max-w-lg border border-white/10 relative">
                            <h3 className="text-white text-lg font-bold mb-4 text-center">Scan Ingredients</h3>
                            
                            <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/50 relative bg-black aspect-video">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button 
                                    onClick={() => setShowWebcam(false)}
                                    className="px-6 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={captureWebcam}
                                    className="px-6 py-2 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-400 flex items-center gap-2"
                                >
                                    <Camera className="w-5 h-5"/> Capture
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl p-1 overflow-hidden shadow-2xl transition-all duration-500
                         border border-white/50 dark:border-white/10
                         bg-white/30 backdrop-blur-xl
                         dark:bg-emerald-950/30 dark:backdrop-blur-xl"
            >
                {/* INNER GLASS LAYER */}
                <div className="rounded-[22px] p-8 sm:p-12 relative overflow-hidden transition-colors duration-500
                              bg-white/40 dark:bg-black/20">
                    
                    {/* LISTENING ANIMATION (Red Pulse) */}
                    <AnimatePresence>
                        {isListening && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                            >
                                <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative z-10 text-center mb-10">
                        <h2 className="text-3xl font-bold mb-2 transition-colors duration-500 text-gray-800 dark:text-white">
                            Show me the ingredients
                        </h2>
                        <p className="transition-colors duration-500 text-gray-500 dark:text-gray-400">
                            Upload a label or paste the text below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={`relative z-10 space-y-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>

                        <div className="space-y-6">

                            {/* --- MOBILE: Native Camera Input --- */}
                            <input
                                type="file"
                                ref={nativeCameraInputRef}
                                className="hidden"
                                accept="image/*"
                                capture="environment" 
                                onChange={handleFileChange}
                            />

                            {/* Image Input Area */}
                            <div
                                className={`relative group cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden min-h-[160px] flex items-center justify-center border-2 border-dashed 
                                ${dragActive
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : preview
                                        ? 'border-transparent p-0'
                                        : 'border-emerald-900/10 hover:border-emerald-900/20 hover:bg-emerald-50/50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5'
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
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleScanClick(); }} // Use smart scan here too
                                                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full backdrop-blur-md mb-3 font-medium transition-colors border border-white/20"
                                                >
                                                    Change Photo
                                                </button>
                                                <button
                                                    type="button"
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
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300
                                                          bg-emerald-500/10 dark:bg-white/5">
                                                <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <p className="text-lg font-medium mb-1 text-gray-700 dark:text-white">
                                                Click to upload photo
                                            </p>
                                            <p className="text-sm text-gray-500">or drag and drop</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Text Input with Animated Voice & Scan Button */}
                            <div className="relative">
                                <textarea
                                    value={displayValue} 
                                    onChange={handleTextChange}
                                    disabled={isLoading}
                                    placeholder={isListening ? "Listening..." : "...or paste the ingredient list here"}
                                    // Increased padding-right (pr-24) to fit both buttons
                                    className={`w-full bg-transparent border-none focus:ring-0 text-center text-lg min-h-[60px] resize-none py-4 pr-24 transition-all duration-300
                                              text-gray-800 placeholder-gray-400 dark:text-white dark:placeholder-gray-600
                                              ${isListening ? 'scale-105' : ''}`}
                                    style={{ fieldSizing: "content" }}
                                />
                                
                                {/* BUTTON GROUP (Scan + Mic) */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    
                                    {/* SCAN BUTTON (Smart) */}
                                    <button
                                        type="button"
                                        onClick={handleScanClick}
                                        className="p-3 rounded-full transition-all duration-300 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
                                        title="Scan Ingredients"
                                    >
                                        <ScanLine className="w-5 h-5" />
                                    </button>

                                    {/* MIC BUTTON */}
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`relative p-3 rounded-full transition-all duration-300 group ${
                                            isListening 
                                            ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
                                            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10'
                                        }`}
                                        title={isListening ? "Stop listening" : "Start voice input"}
                                    >
                                        {/* Ripple Effect Ring */}
                                        {isListening && (
                                            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                                        )}
                                        
                                        {isListening ? (
                                            <StopCircle className="w-5 h-5 relative z-10" />
                                        ) : (
                                            <Mic className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-8 flex justify-center"
            >
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || (!text && !liveText && !file)}
                    className={`flex items-center space-x-3 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-xl ${isLoading || (!text && !liveText && !file)
                        ? 'bg-gray-200 text-gray-400 dark:bg-gray-800/50 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 hover:shadow-emerald-500/25'
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