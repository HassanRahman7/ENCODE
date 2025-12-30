import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, ArrowLeft, ShieldCheck, Zap, Layers } from 'lucide-react';

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

const AIResponse = ({ data, onReset }) => {
    if (!data) return null;

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
                    className="text-gray-500 hover:text-white transition-colors flex items-center text-sm font-medium px-4 py-2 rounded-full hover:bg-white/5"
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
                    <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">Analysis Complete</h2>
                    <p className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {data.highLevelInsight}
                    </p>
                </motion.div>

                {/* Thought 2: Why it Matters */}
                <motion.div
                    variants={cardVariant}
                    className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 bg-purple-500/10 rounded-xl text-purple-400">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Why it Matters</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">{data.whyItMatters}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Thought 3: Trade-offs */}
                <motion.div
                    variants={cardVariant}
                    className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 bg-amber-500/10 rounded-xl text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Trade-offs</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">{data.tradeOffs}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Thought 4: Guidance (Primary Conclusion) */}
                <motion.div
                    variants={cardVariant}
                    className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/10 rounded-3xl p-8 md:p-10"
                >
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-emerald-500/20 rounded-full text-emerald-300 mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Recommendation</h3>
                        <p className="text-xl text-emerald-100/80 font-medium">
                            {data.guidance}
                        </p>
                    </div>
                </motion.div>

                {/* Footer Info */}
                {data.uncertainty && (
                    <motion.p variants={cardVariant} className="text-center text-sm text-gray-600 mt-8">
                        AI Observation: {data.uncertainty}
                    </motion.p>
                )}

            </motion.div>
        </div>
    );
};

export default AIResponse;
