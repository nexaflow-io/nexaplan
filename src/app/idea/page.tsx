'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ParticleBackground } from '@/components/background/ParticleBackground';

export default function IdeaPage() {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleAIGenerate = async () => {
    if (!inputValue.trim()) {
      // 入力が空の場合はテキストエリアにフォーカスして入力を促す
      textareaRef.current?.focus();
      setShowAlert(true);
      // 3秒後にアラートを非表示にする
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    const params = new URLSearchParams()
    params.set('idea', inputValue.trim())
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <main className="h-screen overflow-hidden">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        
        {/* ヘッダー */}
        <header className="relative z-10 py-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/" 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500"
            >
              NexaPlan
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium text-white hover:bg-white/20 transition-all duration-300"
            >
              ホームに戻る
            </Link>
          </div>
        </header>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center h-[calc(100%-80px)] px-4"
        >
          <div className="w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                アイデアを入力
              </h1>
              <p className="text-xl text-gray-300 font-light">
                あなたのアイデアをAIが美しいプレゼンテーションに変換します
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  {/* 入力ガイダンス */}
                  <div className="absolute -top-8 left-0 text-gray-300 text-sm">
                    ここにアイデアを入力してください
                  </div>
                  
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={`w-full p-6 bg-gray-900/50 rounded-xl text-white resize-none h-48 border 
                      ${!inputValue.trim() ? 'border-pink-500/50' : 'border-white/10'} 
                      focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none 
                      transition-all duration-300 backdrop-blur-sm`}
                    placeholder="例: AIを活用した教育システムについてのプレゼンテーション"
                  />
                  
                  {/* 文字カウンター */}
                  <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                    {inputValue.length} 文字
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-4">
                  <button
                    onClick={handleAIGenerate}
                    className="group relative flex-1 py-4 overflow-hidden rounded-xl font-medium text-white
                             transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                             focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    {/* グラデーションの背景 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    
                    {/* ホバー時のアニメーション効果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* ボタンのコンテンツ */}
                    <div className="relative flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AIでスライドを生成
                    </div>
                  </button>
                  
                  <Link
                    href="/editor"
                    className="group relative py-4 px-6 overflow-hidden rounded-xl font-medium text-white
                             transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                             focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    {/* 背景 */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20"></div>
                    
                    {/* ホバー時のアニメーション効果 */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* ボタンのコンテンツ */}
                    <div className="relative flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      エディターを開く
                    </div>
                  </Link>
                </div>
                
                {/* アラートメッセージ */}
                <div className={`transition-all duration-300 ${showAlert ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-lg p-3 text-pink-200 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      アイデアを入力してください
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
