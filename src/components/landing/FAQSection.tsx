'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FAQItem = ({ question, answer, isOpen, onClick, index }: FAQItemProps) => {
  return (
    <motion.div 
      className={`mb-4 overflow-hidden rounded-xl ${isOpen ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30' : 'bg-gray-900/50'} backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors duration-200">{question}</span>
        <span className={`ml-6 flex-shrink-0 w-8 h-8 rounded-full ${isOpen ? 'bg-purple-500/20' : 'bg-gray-800'} flex items-center justify-center transition-all duration-300`}>
          <svg
            className={`w-4 h-4 ${isOpen ? 'text-purple-300' : 'text-gray-400'} transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-300 border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection() {
  const faqs = [
    {
      question: "NexaPlanは無料で使えますか？",
      answer: "はい、NexaPlanの基本機能は無料でご利用いただけます。プレゼンテーションの作成、編集、エクスポートなどの主要機能をお試しいただけます。より高度な機能や大量の利用には、将来的に有料プランの提供を検討しています。"
    },
    {
      question: "プログラミングの知識がなくても使えますか？",
      answer: "はい、プログラミングの知識は必要ありません。シンプルなマークダウン記法を使用していますが、直感的なインターフェースで簡単に操作できます。また、AIによる自動生成機能を使えば、テキスト入力だけでプレゼンテーションを作成できます。"
    },
    {
      question: "AIが生成したコンテンツの著作権は誰に帰属しますか？",
      answer: "NexaPlanのAIが生成したコンテンツの著作権はユーザーであるあなたに帰属します。ただし、著作権のある素材や画像を使用する場合は、それぞれの権利者の利用規約に従ってください。"
    },
    {
      question: "カスタムテーマは作成できますか？",
      answer: "はい、カスタムテーマの作成をサポートしています。CSSの知識があれば高度なカスタマイズも可能です。また、将来的にはテーマエディタの提供も予定しており、より簡単にオリジナルテーマを作成できるようになります。"
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative">
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
          <div className="inline-block px-4 py-1 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-sm font-medium text-purple-300 mb-6">
            よくある質問
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
              疑問にお答えします
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            NexaPlanについてよく寄せられる質問とその回答をまとめました。
            さらに詳しい情報が必要な場合は、お気軽にお問い合わせください。
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
