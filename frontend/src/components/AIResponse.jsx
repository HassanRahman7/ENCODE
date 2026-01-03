import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ShieldCheck, Layers, Volume2, VolumeX, Scale } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

// --- UPDATED COLOR LOGIC ---
// Light Mode: Use -200 backgrounds (Rich/Darker)
// Dark Mode: Use -500/20 backgrounds (Glowing/Lighter)
const stateStyles = {
    green: {
        gradient: "from-emerald-200 to-teal-200 dark:from-emerald-400/20 dark:to-teal-400/20",
        border: "border-emerald-400 dark:border-emerald-400/50",
        iconBg: "bg-emerald-100 dark:bg-emerald-400/20",
        iconColor: "text-emerald-800 dark:text-emerald-200",
        title: "text-emerald-950 dark:text-emerald-50",
        text: "text-emerald-900 dark:text-emerald-100"
    },
    yellow: {
        gradient: "from-amber-200 to-orange-200 dark:from-amber-400/20 dark:to-orange-400/20",
        border: "border-amber-400 dark:border-amber-400/50",
        iconBg: "bg-amber-100 dark:bg-amber-400/20",
        iconColor: "text-amber-900 dark:text-amber-200",
        title: "text-amber-950 dark:text-amber-50",
        text: "text-amber-900 dark:text-amber-100"
    },
    red: {
        gradient: "from-red-200 to-rose-200 dark:from-red-500/20 dark:to-rose-500/20",
        border: "border-red-400 dark:border-red-400/50",
        iconBg: "bg-red-100 dark:bg-red-500/20",
        iconColor: "text-red-900 dark:text-red-200",
        title: "text-red-950 dark:text-red-50",
        text: "text-red-900 dark:text-red-100"
    }
};

// Helper to force bullets onto new lines with perfect alignment
const renderList = (text, textColorClass) => {
    if (!text) return null;
    const items = text.split('•').map(t => t.trim()).filter(t => t.length > 0);
    
    if (items.length === 0) return <p className={textColorClass}>{text}</p>;

    return (
        <ul className={`space-y-4 ${textColorClass}`}>
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    {/* Bullet Point - Matches text color */}
                    <span className="mr-3 mt-2 min-w-[6px] w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
                    <span className="flex-1 leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    );
};

const AIResponse = ({ data, onReset }) => {
    // --- STATE: Text-to-Speech ---
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const [voice, setVoice] = React.useState(null);

    // --- EFFECT: Load Voices ---
    React.useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const preferredVoice = availableVoices.find(v =>
                v.name.includes("Google US English") ||
                v.name.includes("Zira") ||
                v.name.includes("Samantha")
            ) || availableVoices.find(v => v.name.toLowerCase().includes("female")) || availableVoices[0];

            setVoice(preferredVoice);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => window.speechSynthesis.cancel();
    }, []);

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            if (!data) return;

            const textToSpeak = `
                Recommendation. ${data.primaryRecommendation || data.guidance}.
                ${data.contextualExplanation ? data.contextualExplanation : ''}.
                ${data.expectationVsReality ? `Expectation versus Reality. ${data.expectationVsReality}.` : ''}
                Why it Matters. ${data.whyItMatters}.
                Trade-offs. ${data.tradeOffs}.
            `;

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            if (voice) utterance.voice = voice;
            utterance.rate = 0.95;
            utterance.pitch = 1.05;

            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    if (!data) return null;

    const theme = stateStyles[data.uiState] || stateStyles.yellow;

    return (
        <div className="w-full max-w-3xl mx-auto pb-20">

            {/* Navigation & Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-8 px-2"
            >
                <button
                    onClick={onReset}
                    className="flex items-center text-sm font-medium px-4 py-2 rounded-full transition-colors
                             text-gray-600 hover:text-gray-900 hover:bg-emerald-500/10
                             dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Check another label
                </button>

                <button
                    onClick={toggleSpeech}
                    aria-label={isSpeaking ? "Stop reading aloud" : "Read analysis aloud"}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 border
                              ${isSpeaking
                            ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300 shadow-md"
                            : "bg-white/50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                        }`}
                >
                    {isSpeaking ? (
                        <>
                            <Volume2 className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-medium">Listening</span>
                        </>
                    ) : (
                        <>
                            <VolumeX className="w-4 h-4" />
                            <span className="text-sm font-medium">Read Aloud</span>
                        </>
                    )}
                </button>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >

                {/* Hero Title */}
                <motion.div variants={cardVariant} className="text-center mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3
                                 text-emerald-600 dark:text-blue-400">
                        Analysis Complete
                    </h2>
                    <p className="text-3xl md:text-5xl font-bold leading-tight
                                text-emerald-950 dark:text-white">
                        {data.highLevelInsight}
                    </p>
                </motion.div>

                {/* Recommendation Card */}
                <motion.div
                    variants={cardVariant}
                    className={`rounded-3xl p-8 md:p-10 border transition-colors duration-500
                             bg-gradient-to-br ${theme.gradient} ${theme.border}`}
                >
                    <div className="text-center">
                        <div className={`inline-flex p-3 rounded-full mb-4
                                       ${theme.iconBg} ${theme.iconColor}`}>
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${theme.title}`}>
                            Recommendation
                        </h3>
                        <p className={`text-xl font-bold mb-6 leading-snug ${theme.title}`}>
                            {data.primaryRecommendation || data.guidance}
                        </p>
                        {data.contextualExplanation && (
                            <div className={`text-lg text-left ${theme.text} bg-black/5 dark:bg-black/20 p-6 rounded-2xl`}>
                                {renderList(data.contextualExplanation, theme.text)}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Expectation vs Reality Card (Blue) */}
                {data.expectationVsReality && (
                    <motion.div
                        variants={cardVariant}
                        className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border-2 transition-colors duration-500
                                 bg-blue-200 border-blue-400 
                                 dark:bg-blue-500/20 dark:border-blue-300 shadow-sm"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="mt-1 p-2 rounded-xl
                                          bg-blue-100 text-blue-900
                                          dark:bg-blue-400/20 dark:text-blue-200">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2
                                             text-blue-950 dark:text-blue-100">
                                    Expectation vs. Reality
                                </h3>
                                <div className="text-lg leading-relaxed
                                            text-blue-900 dark:text-blue-100">
                                     {renderList(data.expectationVsReality, "text-blue-900 dark:text-blue-100")}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Why it Matters (Purple) */}
                <motion.div
                    variants={cardVariant}
                    className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border-2 transition-colors duration-500
                             bg-purple-200 border-purple-400
                             dark:bg-purple-500/20 dark:border-purple-300 shadow-sm"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 rounded-xl
                                      bg-purple-100 text-purple-800
                                      dark:bg-purple-400/20 dark:text-purple-200">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2
                                         text-purple-950 dark:text-purple-100">
                                Why it Matters
                            </h3>
                            <div className="text-lg leading-relaxed
                                        text-purple-900 dark:text-purple-100">
                                {renderList(data.whyItMatters, "text-purple-900 dark:text-purple-100")}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Trade-offs (Amber) */}
                <motion.div
                    variants={cardVariant}
                    className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border-2 transition-colors duration-500
                             bg-amber-200 border-amber-400
                             dark:bg-amber-500/20 dark:border-amber-300 shadow-sm"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 rounded-xl
                                      bg-amber-100 text-amber-800
                                      dark:bg-amber-400/20 dark:text-amber-200">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2
                                         text-amber-950 dark:text-amber-100">
                                Trade-offs
                            </h3>
                            <div className="text-lg leading-relaxed
                                        text-amber-900 dark:text-amber-100">
                                {renderList(data.tradeOffs, "text-amber-900 dark:text-amber-100")}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                {data.uncertainty && (
                    <motion.p variants={cardVariant} className="text-center text-sm mt-8
                                                              text-gray-500 dark:text-gray-600">
                        AI Observation: {data.uncertainty}
                    </motion.p>
                )}

            </motion.div>
        </div>
    );
};

export default AIResponse;