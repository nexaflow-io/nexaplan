'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/10 to-black/0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* 背景エフェクト */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative z-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                アイデアをプレゼンテーションに変える<br />新しい体験を始めましょう
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              NexaPlanを使えば、プレゼンテーション作成の時間を大幅に削減し、
              より創造的な作業に集中できます。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              
              <a 
                href="https://github.com/nexaflow-io/nexaplan" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 overflow-hidden rounded-xl font-medium text-white hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
              >
                {/* ボタンの背景 */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10"></div>
                
                {/* ホバー時のエフェクト */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* ボタンのコンテンツ */}
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>GitHubで見る</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
