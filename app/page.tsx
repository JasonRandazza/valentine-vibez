'use client';

import { useState } from 'react';
import { DatePlan, UserMood, PartnerMood, Weather } from '@/lib/types';
import DateForm from '@/components/DateForm';
import VibeCard from '@/components/VibeCard';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [datePlan, setDatePlan] = useState<DatePlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (userMood: UserMood, partnerMood: PartnerMood, weather: Weather, isSurprise?: boolean) => {
    setLoading(true);
    setDatePlan(null);
    try {
      const response = await fetch('/api/generate-vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMood: isSurprise ? 'Funny' : userMood,
          partnerMood: isSurprise ? 'Adventurous' : partnerMood,
          weather,
          userName: 'Jason'
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setDatePlan(data);
    } catch (error) {
      console.error("Failed to generate vibe:", error);
      alert("Cupid is offline using cached arrows. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 text-olive-main"
        >
          <Heart size={64} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 text-dusty-rose"
        >
          <Heart size={96} fill="currentColor" className="text-dusty-rose" />
        </motion.div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-olive-main drop-shadow-sm mb-4"
          >
            ValentineVibe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-olive-main/80 font-medium"
          >
            Find the perfect date based on your mood & weather.
          </motion.p>
        </header>

        <DateForm onSubmit={handleFormSubmit} />

        {loading && (
          <div className="mt-8 text-olive-main animate-bounce font-bold">
            Consulting the Love Oracles... 🔮
          </div>
        )}

        {datePlan && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <VibeCard plan={datePlan} />
          </div>
        )}
      </div>
    </main>
  );
}
