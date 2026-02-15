'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Music, MapPin, Utensils, Heart } from 'lucide-react';

interface VibeCardProps {
    plan: {
        title: string;
        description: string;
        location_vibe: string;
        music_link: string;
        food_suggestion: string;
        vibeCheck: string;
    };
}

export default function VibeCard({ plan }: VibeCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="w-full max-w-md h-[500px] perspective-1000">
            <motion.div
                className="relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card */}
                <div className="absolute w-full h-full backface-hidden bg-olive-main text-cream-bg rounded-2xl p-8 flex flex-col justify-center items-center shadow-xl border-4 border-dusty-rose">
                    <Heart size={64} className="mb-6 animate-pulse text-dusty-rose" />
                    <h2 className="text-3xl font-bold text-center mb-4">{plan.title}</h2>
                    <p className="text-center opacity-80 mb-8">{plan.description}</p>
                    <div className="text-sm bg-dusty-rose/20 px-4 py-2 rounded-full">
                        Click to Flip for Details ↻
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute w-full h-full backface-hidden bg-cream-bg text-olive-main rounded-2xl p-8 flex flex-col justify-between shadow-xl border-4 border-olive-main"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div>
                        <h3 className="text-2xl font-bold text-olive-main mb-6 border-b-2 border-olive-main/20 pb-2">The Vibe Check</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-dusty-rose" />
                                <span className="font-medium">{plan.location_vibe}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Utensils className="text-dusty-rose" />
                                <span className="font-medium">{plan.food_suggestion}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Music className="text-dusty-rose" />
                                <span className="font-medium">{plan.music_link}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-olive-main/5 p-4 rounded-xl mt-4">
                        <p className="italic text-sm text-center">"{plan.vibeCheck}"</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
