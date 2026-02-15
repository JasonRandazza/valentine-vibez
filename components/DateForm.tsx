'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Battery, Utensils, CloudRain, Heart, Sparkles } from 'lucide-react';

export default function DateForm({ onVibeGenerated }: { onVibeGenerated: (data: any) => void }) {
    const [loading, setLoading] = useState(false);

    // The New "5-Dimension" State
    const [userVibe, setUserVibe] = useState('');
    const [socialBattery, setSocialBattery] = useState(50); // 0 = Homebody, 100 = Party Animal
    const [hungerLevel, setHungerLevel] = useState(50);     // 0 = Snack, 100 = Feast
    const [weather, setWeather] = useState('Clear');
    const [nostalgiaMode, setNostalgiaMode] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // The "Easter Egg" Sound Logic
        if (userVibe.toLowerCase().includes('web') || userVibe.toLowerCase().includes('spiderman')) {
            new Audio('/SpidermanWeb.m4a').play().catch(() => console.log('No sound file found'));
        }

        setLoading(true);

        try {
            const res = await fetch('/api/generate-vibe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userVibe,
                    socialBattery,
                    hungerLevel,
                    weather,
                    nostalgiaMode
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            onVibeGenerated(data);
        } catch (error) {
            console.error("Vibe generation failed", error);
            alert("Cupid is offline using cached arrows. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-[var(--olive-main)]/20 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 1. The Brain Dump */}
            <div className="space-y-2">
                <label className="block text-base font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--olive-main)]" /> Tell me the vibe...
                </label>
                <textarea
                    value={userVibe}
                    onChange={(e) => setUserVibe(e.target.value)}
                    placeholder="e.g. I had a long day and just want comfort, or... Let's go on an adventure!"
                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--olive-main)] focus:border-transparent min-h-[100px] resize-none text-gray-900 placeholder:text-gray-500 bg-white/60"
                />
            </div>

            {/* 2. Sliders Row */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                        <Battery className="w-4 h-4 text-[var(--olive-main)]" /> Social Battery
                    </label>
                    <input
                        type="range" min="0" max="100"
                        value={socialBattery} onChange={(e) => setSocialBattery(Number(e.target.value))}
                        className="w-full accent-[var(--olive-main)] h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-gray-600">
                        <span>Cozy In</span>
                        <span>Go Out</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                        <Utensils className="w-4 h-4 text-[var(--dusty-rose)]" /> Appetite
                    </label>
                    <input
                        type="range" min="0" max="100"
                        value={hungerLevel} onChange={(e) => setHungerLevel(Number(e.target.value))}
                        className="w-full accent-[var(--dusty-rose)] h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-gray-600">
                        <span>Snack</span>
                        <span>Feast</span>
                    </div>
                </div>
            </div>

            {/* 3. Toggles & Selects */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-black text-gray-800 uppercase mb-1">Weather</label>
                    <div className="relative">
                        <CloudRain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={weather} onChange={(e) => setWeather(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white/60 focus:ring-[var(--olive-main)] text-gray-900 font-medium"
                        >
                            <option value="Clear">Clear Sky</option>
                            <option value="Rainy">Rainy</option>
                            <option value="Cold">Chilly</option>
                            <option value="Snowy">Snowy</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-5">
                    <label className="flex items-center cursor-pointer gap-2 select-none text-sm font-bold text-gray-800">
                        <input
                            type="checkbox"
                            checked={nostalgiaMode}
                            onChange={(e) => setNostalgiaMode(e.target.checked)}
                            className="w-4 h-4 text-[var(--olive-main)] rounded focus:ring-[var(--olive-main)] border-gray-300"
                        />
                        <span>Nostalgia Mode?</span>
                    </label>
                </div>
            </div>

            <motion.button
                type="submit"
                disabled={loading}
                // The "Pulse of Love" animation
                animate={!loading ? {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                        "0px 0px 0px rgba(85, 107, 47, 0)",
                        "0px 0px 15px rgba(85, 107, 47, 0.2)",
                        "0px 0px 0px rgba(85, 107, 47, 0)"
                    ]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[var(--olive-main)] hover:bg-[#4a5e29] text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center min-h-[64px]"
            >
                {loading ? (
                    <div className="flex flex-col items-center gap-1">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        >
                            <Heart className="w-5 h-5 fill-[#DCAE96] text-[#DCAE96]" />
                        </motion.div>
                        <span className="text-[10px] uppercase tracking-widest font-bold animate-pulse">
                            Architecting your vibe...
                        </span>
                    </div>
                ) : (
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Vibe
                    </span>
                )}
            </motion.button>
        </motion.form>
    );
}
