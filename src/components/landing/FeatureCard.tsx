'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: string;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  accentColor = 'from-purple-300 to-blue-300' 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl transform group-hover:scale-[1.03] transition-all duration-300"></div>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full transform group-hover:translate-y-[-5px] transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
          {icon}
        </div>
        <h3 className={`text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${accentColor}`}>
          {title}
        </h3>
        <p className="text-gray-300 mb-6">
          {description}
        </p>
        
        {/* ホバー時のキラキラエフェクト */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
        </div>
      </div>
    </motion.div>
  );
}
