'use client';

import { useState } from 'react';
import { UserMood, PartnerMood, Weather } from '@/lib/types';
import { motion } from 'framer-motion';

interface DateFormProps {
    onSubmit: (userMood: UserMood, partnerMood: PartnerMood, weather: Weather, isSurprise?: boolean) => void;
}

export default function DateForm({ onSubmit }: DateFormProps) {
    const [userMood, setUserMood] = useState<UserMood>('Chill');
    const [partnerMood, setPartnerMood] = useState<PartnerMood>('Chill');
    const [weather, setWeather] = useState<Weather>('Sunny');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(userMood, partnerMood, weather, false);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-pink-100"
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-pink-900 font-semibold mb-2">Your Mood</label>
                    <select
                        value={userMood}
                        onChange={(e) => setUserMood(e.target.value as UserMood)}
                        className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/50 text-pink-800"
                    >
                        <option value="Chill">Chill 😌</option>
                        <option value="Adventurous">Adventurous 🏃‍♂️</option>
                        <option value="Romantic">Romantic 🌹</option>
                        <option value="Funny">Funny 🤪</option>
                    </select>
                </div>

                <div>
                    <label className="block text-pink-900 font-semibold mb-2">Partner's Mood</label>
                    <select
                        value={partnerMood}
                        onChange={(e) => setPartnerMood(e.target.value as PartnerMood)}
                        className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/50 text-pink-800"
                    >
                        <option value="Chill">Chill 😌</option>
                        <option value="Adventurous">Adventurous 🏃‍♀️</option>
                        <option value="Romantic">Romantic 🌹</option>
                        <option value="Funny">Funny 🤪</option>
                    </select>
                </div>

                <div>
                    <label className="block text-pink-900 font-semibold mb-2">Weather Check</label>
                    <select
                        value={weather}
                        onChange={(e) => setWeather(e.target.value as Weather)}
                        className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/50 text-pink-800"
                    >
                        <option value="Sunny">Sunny ☀️</option>
                        <option value="Rainy">Rainy 🌧️</option>
                        <option value="Cold">Cold ❄️</option>
                        <option value="Snowy">Snowy ☃️</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-olive-main hover:bg-[#4a5f2a] text-cream-bg font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-md border-2 border-transparent"
                    >
                        Find Our Vibe ❤️
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            // Play Sound Effect
                            const audio = new Audio('/sounds/web.mp3'); // User needs to add this file
                            audio.play().catch(e => console.log("Audio play failed (file might be missing):", e));
                            console.log("pshhhhhh (Spiderman web sound)");

                            // Trigger surprise submit
                            onSubmit('Adventurous', 'Funny', 'Rainy', true);
                        }}
                        className="bg-dusty-rose hover:bg-[#c99b84] text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
                        title="Surprise Me!"
                    >
                        🕸️
                    </button>
                </div>
            </div>
        </motion.form>
    );
}
