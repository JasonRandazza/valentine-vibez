'use client';
import { motion } from 'framer-motion';

export default function HeartBackground() {
    const orbs = [
        { color: 'bg-[#556B2F]', top: '10%', left: '10%', size: 'w-64 h-64' }, // Olive
        { color: 'bg-[#DCAE96]', top: '60%', left: '70%', size: 'w-80 h-80' }, // Dusty Rose
        { color: 'bg-[#F5F5DC]', top: '30%', left: '40%', size: 'w-96 h-96' }, // Cream
    ];

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FDFCF0]">
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-[100px] opacity-40 ${orb.color} ${orb.size}`}
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, -50, 50, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ top: orb.top, left: orb.left }}
                />
            ))}
        </div>
    );
}
