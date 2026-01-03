import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ShieldCheck, Layers } from 'lucide-react';

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

// UI State Stylings
const stateStyles = {
    green: {
        gradient: "from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10",
        border: "border-emerald-200 dark:border-emerald-500/10",
        iconBg: "bg-emerald-200 dark:bg-emerald-500/20",
        iconColor: "text-emerald-700 dark:text-emerald-300",
        title: "text-emerald-900 dark:text-white",
        text: "text-emerald-900 dark:text-emerald-100/80"
    },
    yellow: {
        gradient: "from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10",
        border: "border-amber-200 dark:border-amber-500/10",
        iconBg: "bg-amber-200 dark:bg-amber-500/20",
        iconColor: "text-amber-800 dark:text-amber-300",
        title: "text-amber-900 dark:text-white",
        text: "text-amber-900 dark:text-amber-100/80"
    },
    red: {
        gradient: "from-red-100 to-rose-100 dark:from-red-500/10 dark:to-rose-500/10",
        border: "border-red-200 dark:border-red-500/10",
        iconBg: "bg-red-200 dark:bg-red-500/20",
        iconColor: "text-red-700 dark:text-red-300",
        title: "text-red-900 dark:text-white",
        text: "text-red-900 dark:text-red-100/80"
    }
};

const AIResponse = ({ data, onReset }) => {
    if (!data) return null;

    // Default to yellow (caution) if undefined, or map 'green'/'red' appropriately
    const theme = stateStyles[data.uiState] || stateStyles.yellow;


    return (
        <div className="w-full max-w-3xl mx-auto pb-20">

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mb-8"
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
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >

                {/* Thought 1: The Verdict (Hero) */}
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

                {/* Thought 4: Guidance (Primary Conclusion) */}
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

                        {/* Primary Recommendation (Bold) */}
                        <p className={`text-xl font-bold mb-4 leading-snug ${theme.title}`}>
                            {data.primaryRecommendation || data.guidance}
                        </p>

                        {/* Contextual Explanation (Regular) */}
                        {data.contextualExplanation && (
                            <p className={`text-lg leading-relaxed ${theme.text}`}>
                                {data.contextualExplanation}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Thought 2: Why it Matters */}
                <motion.div
                    variants={cardVariant}
                    className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border transition-colors duration-500
                             bg-white/60 border-emerald-100 shadow-sm
                             dark:bg-white/5 dark:border-white/5 dark:shadow-none"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 rounded-xl
                                      bg-purple-100 text-purple-600
                                      dark:bg-purple-500/10 dark:text-purple-400">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2
                                         text-gray-900 dark:text-white">
                                Why it Matters
                            </h3>
                            <p className="text-lg leading-relaxed whitespace-pre-line
                                        text-gray-700 dark:text-gray-300">
                                {data.whyItMatters}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Thought 3: Trade-offs */}
                <motion.div
                    variants={cardVariant}
                    className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border transition-colors duration-500
                             bg-white/60 border-emerald-100 shadow-sm
                             dark:bg-white/5 dark:border-white/5 dark:shadow-none"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 rounded-xl
                                      bg-amber-100 text-amber-600
                                      dark:bg-amber-500/10 dark:text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2
                                         text-gray-900 dark:text-white">
                                Trade-offs
                            </h3>
                            <p className="text-lg leading-relaxed whitespace-pre-line
                                        text-gray-700 dark:text-gray-300">
                                {data.tradeOffs}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Info */}
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