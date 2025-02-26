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

export default function LandingPageClient() {
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
              duration: 15, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
          
          {/* パーティクル */}
          <div className="absolute inset-0">
            {particles}
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                NexaPlan
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
                アイデアを美しいプレゼンテーションに変える、次世代のAIプレゼンテーションツール
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                今すぐ始める
              </Link>
              <Link href="#demo" className="btn btn-outline btn-lg">
                デモを見る
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-4xl"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <Image
                  src="/dashboard-preview.png"
                  alt="NexaPlan Dashboard"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                <span className="text-sm font-medium">AIパワード</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              プレゼンテーション作成を<span className="text-indigo-400">革新</span>する機能
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              NexaPlanは、あなたのアイデアを美しいプレゼンテーションに変換するための強力なツールを提供します
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="sparkles"
              title="AIコンテンツ生成"
              description="テキスト入力から自動的にスライドコンテンツを生成。時間を節約し、クオリティを向上させます。"
            />
            <FeatureCard
              icon="template"
              title="美しいテンプレート"
              description="プロフェッショナルなデザインのテンプレートで、見栄えの良いプレゼンテーションを簡単に作成できます。"
            />
            <FeatureCard
              icon="chart"
              title="データの可視化"
              description="データを魅力的なグラフやチャートに変換し、情報を効果的に伝えることができます。"
            />
            <FeatureCard
              icon="collaboration"
              title="リアルタイムコラボレーション"
              description="チームメンバーと同時に編集し、フィードバックを即座に反映させることができます。"
            />
            <FeatureCard
              icon="export"
              title="多様なエクスポート形式"
              description="PDF、PowerPoint、画像など、様々な形式でプレゼンテーションをエクスポートできます。"
            />
            <FeatureCard
              icon="customize"
              title="高度なカスタマイズ"
              description="テーマ、フォント、カラーなど、細部までカスタマイズして独自のスタイルを作成できます。"
            />
          </div>
        </div>
      </section>
      
      {/* デモセクション */}
      <DemoSection />
      
      {/* 使用例セクション */}
      <UseCasesSection />
      
      {/* 仕組みセクション */}
      <HowItWorksSection />
      
      {/* FAQ セクション */}
      <FAQSection />
      
      {/* CTA セクション */}
      <CTASection />
      
      {/* フッター */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">NexaPlan</h3>
              <p className="mb-4">次世代のAIプレゼンテーションツール</p>
              <div className="flex space-x-4">
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
        </div>
      </footer>
    </div>
  );
}
