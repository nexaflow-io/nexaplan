'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DemoSection from '@/components/landing/DemoSection';
import CTASection from '@/components/landing/CTASection';
import FeatureCard from '@/components/landing/FeatureCard';
import UseCasesSection from '@/components/landing/UseCasesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FAQSection from '@/components/landing/FAQSection';

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  // スクロール位置を追跡
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const particlesArray = Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          opacity: Math.random() * 0.5 + 0.1
        }}
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 3 + Math.random() * 5, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2
        }}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
      />
    ));
    
    setParticles(particlesArray);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden">
      {/* ヒーローセクション */}
      <section className="relative min-h-screen flex items-center">
        {/* 背景グリッド */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* 動的な背景要素 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 左上の光の球体 */}
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"
          />
          
          {/* 右下の光の球体 */}
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
          />
          
          {/* 中央の光の線 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-1/2 left-1/2 w-[200%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45"
          />
          
          {/* 浮遊する粒子 */}
          {particles}
        </div>
        
        {/* スクロールに応じて動く要素 */}
        <motion.div
          style={{ 
            opacity: Math.max(0, 1 - scrollY / 500),
            y: scrollY * 0.5
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-full max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/10 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute top-1/3 left-1/3 w-96 h-96 border border-white/5 rounded-full"
            />
          </div>
        </motion.div>
        
        <div className="container mx-auto px-6 z-10 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium text-purple-300 mb-6">
                  次世代プレゼンテーションツール
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  NexaPlan
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                <span className="text-white font-semibold">アイデアを入力するだけで</span>、<wbr />
                <span className="inline sm:hidden"><br /></span>
                AIが<span className="hidden sm:inline md:hidden"><br /></span>
                <span className="hidden md:inline">　</span>
                美しいプレゼンテーションに変換。<br />
                <span className="text-purple-300">思考から表現へ</span>、瞬時に。
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link 
                  href="/idea" 
                  className="group relative px-8 py-4 overflow-hidden rounded-xl font-medium text-white hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                >
                  {/* ボタンの背景グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  
                  {/* ホバー時のキラキラエフェクト */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
                  </div>
                  
                  {/* ボタンのコンテンツ */}
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>今すぐ始める</span>
                  </div>
                </Link>
                
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 overflow-hidden rounded-xl font-medium text-white hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                >
                  {/* ボタンの背景 */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10"></div>
                  
                  {/* ホバー時のエフェクト */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* ボタンのコンテンツ */}
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>詳細を見る</span>
                  </div>
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-12"
              >
                {/* ユーザー数表示を削除 */}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:w-1/2 relative"
            >
              {/* プレビューウィンドウ */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {/* ウィンドウの背景 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 backdrop-blur-sm"></div>
                
                {/* ウィンドウの内容 */}
                <div className="p-4 h-full flex flex-col">
                  {/* ウィンドウのヘッダー */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm text-gray-300">NexaPlan - プレゼンテーション</div>
                  </div>
                  
                  {/* プレビューコンテンツ */}
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      className="w-full max-w-md"
                    >
                      {/* AIプロセスの可視化 */}
                      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg border border-white/5">
                        {/* 進行状況バー */}
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.5, delay: 1 }}
                          className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 absolute top-0 left-0"
                        />
                        
                        <div className="text-center">
                          {/* 入力テキスト表示 */}
                          <motion.div
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ 
                              opacity: [1, 1, 0],
                              y: [0, 0, -20]
                            }}
                            transition={{ 
                              duration: 2, 
                              times: [0, 0.7, 1],
                              delay: 1 
                            }}
                            className="absolute inset-x-0 p-2 sm:p-4"
                          >
                            <div className="text-xs sm:text-sm text-purple-300 mb-1 sm:mb-2">入力テキスト:</div>
                            <div className="text-white text-left p-1 sm:p-2 bg-gray-800/50 rounded border border-white/10 mb-1 sm:mb-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                                className="h-2 sm:h-4 bg-white/20 rounded"
                              ></motion.div>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "80%" }}
                                transition={{ duration: 1.2, delay: 1.5 }}
                                className="h-2 sm:h-4 bg-white/20 rounded mt-1 sm:mt-2"
                              ></motion.div>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "60%" }}
                                transition={{ duration: 1, delay: 1.8 }}
                                className="h-2 sm:h-4 bg-white/20 rounded mt-1 sm:mt-2"
                              ></motion.div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-blue-300 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>AIが解析中...</span>
                            </div>
                          </motion.div>
                          
                          {/* AI処理中の表示 */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              scale: [0.9, 1, 1.1]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              times: [0, 0.5, 1],
                              delay: 2.5 
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="text-center">
                              {/*レスポンシブ対応*/}
                              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 mb-2 sm:mb-4">
                                <svg className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <div className="text-purple-300 font-medium text-xs sm:text-sm">AIがスライドを生成中...</div>
                            </div>
                          </motion.div>
                          
                          {/* 生成されたスライド */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 3.5 }}
                            className="relative pointer-events-none cursor-default"
                          >
                            {/* スライドのデザイン */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg border border-white/5 pointer-events-none cursor-default w-full">
                              {/* スライドヘッダー - グラデーション */}
                              <div className="h-1 sm:h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                              
                              {/* スライドコンテンツ */}
                              <div className="p-3 sm:p-5">
                                {/* スライドタイトル */}
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 3.7 }}
                                  className="pointer-events-none cursor-default"
                                >
                                  <div className="text-sm sm:text-xl font-bold text-center mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                                    <span className="inline-block">プレゼンテーション</span><br className="xs:hidden sm:hidden md:inline" />
                                    <span className="inline-block">タイトル</span>
                                  </div>
                                </motion.div>
                                
                                {/* スライドの内容 */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5, delay: 4 }}
                                  className="space-y-2 sm:space-y-3 pointer-events-none cursor-default"
                                >
                                  {/* サブタイトル */}
                                  <div className="text-xs sm:text-sm font-medium text-purple-300 mb-1 sm:mb-2 text-center sm:text-left">主なポイント</div>
                                  
                                  {/* 箇条書き */}
                                  <div className="flex items-start gap-1 sm:gap-2 pointer-events-none cursor-default">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 mt-1 sm:mt-1.5"></div>
                                    <div className="h-2 sm:h-3 flex-1 bg-white/20 rounded"></div>
                                  </div>
                                  <div className="flex items-start gap-1 sm:gap-2 pointer-events-none cursor-default">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400 mt-1 sm:mt-1.5"></div>
                                    <div className="h-2 sm:h-3 w-11/12 bg-white/20 rounded"></div>
                                  </div>
                                  <div className="flex items-start gap-1 sm:gap-2 pointer-events-none cursor-default">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-400 mt-1 sm:mt-1.5"></div>
                                    <div className="h-2 sm:h-3 w-10/12 bg-white/20 rounded"></div>
                                  </div>
                                  
                                  {/* グラフ風の要素 */}
                                  <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-white/10 pointer-events-none cursor-default">
                                    <div className="flex items-end h-10 sm:h-16 gap-1 justify-around mt-1 sm:mt-2">
                                      <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '40%' }}
                                        transition={{ duration: 0.5, delay: 4.2 }}
                                        className="w-6 sm:w-8 bg-purple-500/40 rounded-t cursor-default"
                                      ></motion.div>
                                      <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '70%' }}
                                        transition={{ duration: 0.5, delay: 4.3 }}
                                        className="w-6 sm:w-8 bg-blue-500/40 rounded-t cursor-default"
                                      ></motion.div>
                                      <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '50%' }}
                                        transition={{ duration: 0.5, delay: 4.4 }}
                                        className="w-6 sm:w-8 bg-pink-500/40 rounded-t cursor-default"
                                      ></motion.div>
                                      <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '90%' }}
                                        transition={{ duration: 0.5, delay: 4.5 }}
                                        className="w-6 sm:w-8 bg-indigo-500/40 rounded-t cursor-default"
                                      ></motion.div>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                              
                              {/* スライドフッター */}
                              <div className="px-2 sm:px-5 py-1 sm:py-2 flex justify-between items-center text-[10px] sm:text-xs text-gray-400 border-t border-white/10 pointer-events-none cursor-default">
                                <div>NexaPlan</div>
                                <div>1 / 10</div>
                              </div>
                            </div>
                            
                            {/* スライドナビゲーション */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 4.3 }}
                              className="mt-2 sm:mt-4 flex justify-center gap-1 sm:gap-2 pointer-events-none"
                            >
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/50 cursor-default"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30 cursor-default"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30 cursor-default"></div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* コードとプレビューの連携を示す要素 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 4.5 }}
                        className="mt-4 text-center text-sm text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>ホバーでコードとプレビューが連携</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
                
                {/* キラキラエフェクト */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5"
                ></motion.div>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
              
              {/* 技術スタックバッジ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-2 text-xs"
              >
                <span className="text-[10px] text-gray-300 opacity-80">Powered by</span>
                <div className="flex items-center gap-2">
                  <div className="text-blue-400 font-medium text-xs">React</div>
                  <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                  <div className="text-green-400 font-medium text-xs">Next.js</div>
                  <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                  <div className="text-purple-400 font-medium text-xs">AI</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* スクロールガイド */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex flex-col items-center"
          >
            <div className="text-gray-400 text-sm mb-2">スクロールして詳細を見る</div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>
      
      {/* 特徴セクション */}
      <section id="features" className="py-24 relative">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium text-blue-300 mb-6">
              主な特徴
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                プレゼンテーション作成を<br className="hidden md:inline" />革新する機能
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              NexaPlanは、プレゼンテーション作成の新しい方法を提供します。
              AIの力とリアルタイムプレビューで、あなたのアイデアを素早く形にします。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特徴1: AIによるスライド生成 */}
            <FeatureCard 
              icon={
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AIによるスライド生成"
              description="アイデアやテーマを入力するだけで、AIが自動的に構造化された美しいスライドを生成します。複雑な内容も簡潔に、魅力的に表現します。"
              accentColor="from-purple-300 to-blue-300"
            />
            
            {/* 特徴2: リアルタイムプレビュー */}
            <FeatureCard 
              icon={
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
              title="リアルタイムプレビュー"
              description="編集内容がリアルタイムでプレビューに反映されるため、常に最終結果を確認しながら作業できます。ホバーでコードとプレビューが連携する直感的な操作性を実現。"
              accentColor="from-blue-300 to-purple-300"
            />
            
            {/* 特徴3: カスタマイズ可能なテーマ */}
            <FeatureCard 
              icon={
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v14a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              title="カスタマイズ可能なテーマ"
              description="多彩なテーマとスタイルから選択し、プレゼンテーションを自分のブランドやイベントに合わせてカスタマイズできます。プロフェッショナルな印象を与えるデザイン。"
              accentColor="from-pink-300 to-blue-300"
            />
          </div>
        </div>
      </section>
      
      {/* ユースケースセクション */}
      <UseCasesSection />
      
      {/* しくみセクション */}
      <HowItWorksSection />
      
      {/* FAQセクション */}
      <FAQSection />
      
      {/* デモセクション */}
      <DemoSection />
      
      {/* CTAセクション */}
      <CTASection />
      
      {/* フッター */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">NexaPlan</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                アイデアからプレゼンテーションを簡単に作成
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="text-white font-medium mb-3">製品</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">ホーム</Link></li>
                  <li><Link href="/idea" className="text-gray-400 hover:text-white transition-colors">アイデア入力</Link></li>
                  <li><Link href="/editor" className="text-gray-400 hover:text-white transition-colors">エディター</Link></li>
                  <li><a href="https://github.com/nexaflow-io/nexaplan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">リソース</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">ドキュメント</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">チュートリアル</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} NexaPlan. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="https://github.com/nexaflow-io/nexaplan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
