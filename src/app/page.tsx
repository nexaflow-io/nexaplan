'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParticleBackground } from '@/components/background/ParticleBackground';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleAIGenerate = async () => {
    if (!inputValue.trim()) return;
    const params = new URLSearchParams()
    params.set('idea', inputValue.trim())
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <main className="h-screen overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-4 h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center h-full px-4"
        >
          <div className="w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                NexaPlan
              </h1>
              <p className="text-2xl text-gray-300 font-light">
                アイデアを美しいプレゼンテーションに
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-6 bg-gray-900/50 rounded-xl text-white resize-none h-48 border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  placeholder="アイデアを入力してください..."
                />
                <motion.div
                  animate={{
                    opacity: inputValue ? 1 : 0,
                    y: inputValue ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 right-4 text-gray-400 text-sm"
                >
                  {inputValue.length} 文字
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex gap-4"
              >
                <button
                  onClick={handleAIGenerate}
                  disabled={!inputValue.trim()}
                  className="group relative flex-1 py-4 overflow-hidden rounded-xl font-medium text-white
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  {/* グラデーションの背景 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400
                                after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]
                                 transition-colors duration-300" />
                  
                  {/* キラキラエフェクト */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                                bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%)]
                                bg-[length:250%_250%] animate-shimmer
                                transition-opacity duration-500" />
                  
                  {/* ボーダーグロー */}
                  <div className="absolute inset-0 rounded-xl border border-white/10
                                shadow-[0_0_15px_rgba(167,139,250,0.1)] 
                                group-hover:shadow-[0_0_25px_rgba(167,139,250,0.3),inset_0_0_20px_rgba(167,139,250,0.1)]
                                group-hover:border-white/20
                                 transition-shadow duration-300" />
                  
                  {/* テキストとアイコン */}
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="transition-all duration-300 group-hover:scale-105 tracking-wide">
                      AIでスライドを生成
                    </span>
                  </div>
                </button>
                
                <Link
                  href="/editor"
                  className="group relative flex-1 py-4 rounded-xl font-medium text-white/90
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           focus:outline-none focus:ring-2 focus:ring-gray-500/40 text-center
                           bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
                >
                  {/* シンプルなボーダー */}
                  <div className="absolute inset-0 rounded-xl border border-white/10
                                group-hover:border-white/20 transition-colors duration-300" />
                  
                  {/* テキストとアイコン */}
                  <div className="relative flex items-center justify-center gap-2 group-hover:text-white">
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>
                      エディターを開く
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
