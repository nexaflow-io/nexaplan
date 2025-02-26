'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DemoSection() {
  return (
    <section className="py-24 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-900/5 to-black/0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium text-blue-300 mb-6">
            実際の動作を見る
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              シンプルで直感的な操作性
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            NexaPlanは、複雑な作業をシンプルにします。アイデアを入力するだけで、
            AIがプロフェッショナルなプレゼンテーションを生成します。
          </p>
        </motion.div>
        
        {/* デモ動画/アニメーション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
        >
          {/* デモの背景 */}
          <div className="aspect-video bg-gradient-to-tr from-gray-900 to-gray-800 relative">
            {/* エディター風のUI */}
            <div className="absolute inset-0 flex">
              {/* 左側：入力エリア */}
              <div className="w-1/2 border-r border-white/10 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm text-gray-400">アイデア入力</div>
                </div>
                
                <div className="space-y-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="h-4 bg-white/10 rounded"
                  ></motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="h-4 bg-white/10 rounded"
                  ></motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "90%" }}
                    transition={{ duration: 1.7, delay: 0.9 }}
                    viewport={{ once: true }}
                    className="h-4 bg-white/10 rounded"
                  ></motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    transition={{ duration: 1.3, delay: 1.1 }}
                    viewport={{ once: true }}
                    className="h-4 bg-white/10 rounded"
                  ></motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.6, delay: 1.3 }}
                    viewport={{ once: true }}
                    className="h-4 bg-white/10 rounded"
                  ></motion.div>
                </div>
              </div>
              
              {/* 右側：プレビューエリア */}
              <div className="w-1/2 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="ml-auto text-sm text-gray-400">プレビュー</div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 h-[calc(100%-2rem)] flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <h3 className="text-xl font-bold mb-3 text-white">AIが生成したスライド</h3>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-white/20 rounded mx-auto"></div>
                      <div className="h-2 w-full bg-white/20 rounded mx-auto"></div>
                      <div className="h-2 w-5/6 bg-white/20 rounded mx-auto"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* 変換アニメーション */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 1, 0] }}
              transition={{ 
                duration: 2,
                times: [0, 0.5, 1],
                delay: 1.5,
                repeat: 0
              }}
              viewport={{ once: true }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          </div>
          
          {/* 操作ガイド */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full py-2 px-4">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span>入力</span>
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>AI処理</span>
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>プレゼンテーション</span>
            </div>
          </div>
        </motion.div>
        
        {/* CTAボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 text-center"
        >
          <Link 
            href="/idea" 
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-xl font-medium text-white hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
            </div>
            <div className="relative flex items-center gap-2">
              <span>今すぐ試してみる</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
