'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface StepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

function Step({ number, title, description, isLast = false }: StepProps) {
  return (
    <div className="flex items-start mb-8">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
        {!isLast && (
          <div className="h-12 border-l border-gray-700 ml-5 mt-4"></div>
        )}
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  // アニメーションの設定
  const animationDuration = 15; // 全体のアニメーション時間（秒）
  
  // 各ステップの表示タイミング
  const timings = {
    step1: {
      start: 0.05,
      show: 0.3,
      end: 0.35
    },
    step2: {
      start: 0.4,
      processingEnd: 0.5,
      show: 0.65,
      end: 0.7
    },
    step3: {
      start: 0.75,
      show: 0.85,
      end: 0.9
    },
    step4: {
      start: 0.95,
      show: 1,
      end: 1
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">使い方はとても簡単</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            NexaPlanを使えば、アイデアを入力するだけで美しいプレゼンテーションが作成できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 左側：ステップ説明 */}
          <div>
            <Step
              number={1}
              title="アイデアを入力"
              description="あなたのアイデアやコンセプトを自由に入力するだけ。箇条書きでも文章でもOK。"
            />
            <Step
              number={2}
              title="AIが分析"
              description="入力されたテキストをAIが分析し、最適な構造のプレゼンテーションを自動生成します。"
            />
            <Step
              number={3}
              title="エディターで編集"
              description="生成されたプレゼンテーションをマークダウンで簡単に編集できます。"
            />
            <Step
              number={4}
              title="プレビューで確認"
              description="リアルタイムでプレビューを確認しながら、完璧なプレゼンテーションに仕上げましょう。"
              isLast={true}
            />
          </div>

          {/* 右側：デモ画面 */}
          <div className="relative h-[500px] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            {/* ステップインジケーター（削除） */}
            <div className="bg-gray-700 h-8 flex items-center px-4 rounded-t-lg">
              <div className="text-xs text-gray-400">NexaPlan</div>
            </div>

            {/* コンテンツエリア */}
            <div className="p-4 h-[calc(100%-2rem)]">
              {/* ステップ1: アイデア入力 */}
              <motion.div
                className="absolute inset-0 mt-8 p-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: animationDuration,
                  times: [0, timings.step1.start, timings.step1.show, timings.step1.end],
                  repeat: Infinity,
                  repeatDelay: 0
                }}
              >
                <div className="bg-gray-900 rounded-lg p-4 h-full relative">
                  <div className="text-sm text-gray-400 mb-3">アイデア入力</div>
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ステップ 1
                  </div>
                  <motion.div
                    className="h-3 bg-white/10 rounded mb-3"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "100%"] }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Infinity,
                      repeatDelay: animationDuration - 2.5
                    }}
                  />
                  <motion.div
                    className="h-3 bg-white/10 rounded mb-3"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "80%"] }}
                    transition={{
                      duration: 1.8,
                      delay: 0.8,
                      repeat: Infinity,
                      repeatDelay: animationDuration - 2.6
                    }}
                  />
                  <motion.div
                    className="h-3 bg-white/10 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "90%"] }}
                    transition={{
                      duration: 2.2,
                      delay: 1.1,
                      repeat: Infinity,
                      repeatDelay: animationDuration - 3.3
                    }}
                  />
                </div>
              </motion.div>

              {/* ステップ2: AI分析 */}
              <motion.div
                className="absolute inset-0 mt-8 p-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0]
                }}
                transition={{
                  duration: animationDuration,
                  times: [0, timings.step1.end, timings.step2.start, timings.step2.show, timings.step2.end],
                  repeat: Infinity,
                  repeatDelay: 0
                }}
              >
                <div className="bg-gray-900 rounded-lg p-4 h-full relative">
                  <div className="text-sm text-gray-400 mb-3">AI分析</div>
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ステップ 2
                  </div>
                  <div className="h-full flex items-center justify-center">
                    {/* 処理中の表示 */}
                    <motion.div
                      className="text-center absolute"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: animationDuration,
                        times: [
                          0,
                          (timings.step2.start + 0.02) / animationDuration * animationDuration,
                          (timings.step2.processingEnd) / animationDuration * animationDuration
                        ],
                        repeat: Infinity,
                        repeatDelay: 0
                      }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-purple-500 border-r-blue-500 border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
                      <div className="text-white font-medium">AIが処理中...</div>
                    </motion.div>

                    {/* 分析完了の表示 */}
                    <motion.div
                      className="text-center absolute"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0, 1]
                      }}
                      transition={{
                        duration: animationDuration,
                        times: [
                          0,
                          (timings.step2.processingEnd) / animationDuration * animationDuration,
                          (timings.step2.processingEnd + 0.02) / animationDuration * animationDuration
                        ],
                        repeat: Infinity,
                        repeatDelay: 0
                      }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-white font-medium">AI分析完了</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* ステップ3&4: エディターとプレビュー */}
              <motion.div
                className="absolute inset-0 mt-8 p-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0]
                }}
                transition={{
                  duration: animationDuration,
                  times: [0, timings.step2.end, timings.step3.start, timings.step3.show, timings.step3.end],
                  repeat: Infinity,
                  repeatDelay: 0
                }}
              >
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden">
                    <div className="text-sm text-gray-400 mb-3">エディター</div>
                    <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ステップ 3
                    </div>
                    <div className="font-mono text-xs text-gray-300 overflow-hidden">
                      <div className="mb-1">## タイトル</div>
                      <div className="mb-1">- 要点1</div>
                      <div className="mb-1">- 要点2</div>
                      <div className="mb-1">- 要点3</div>
                      <div className="mb-1">---</div>
                      <div className="mb-1">## スライド2</div>
                    </div>
                    <motion.div
                      className="absolute bottom-4 right-4 h-4 w-4 rounded-full bg-green-400"
                      animate={{
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-3">プレビュー</div>
                    <div className="bg-white/5 rounded p-2 h-[calc(100%-2rem)] flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-sm font-bold mb-2">タイトル</h3>
                        <ul className="text-xs text-left list-disc list-inside">
                          <li>要点1</li>
                          <li>要点2</li>
                          <li>要点3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ステップ4: プレビュー強調 */}
              <motion.div
                className="absolute inset-0 mt-8 p-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0, 1]
                }}
                transition={{
                  duration: animationDuration,
                  times: [0, timings.step3.end, timings.step4.start],
                  repeat: Infinity,
                  repeatDelay: 0
                }}
              >
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden opacity-70">
                    <div className="text-sm text-gray-400 mb-3">エディター</div>
                    <div className="font-mono text-xs text-gray-300 overflow-hidden">
                      <div className="mb-1">## タイトル</div>
                      <div className="mb-1">- 要点1</div>
                      <div className="mb-1">- 要点2</div>
                      <div className="mb-1">- 要点3</div>
                      <div className="mb-1">---</div>
                      <div className="mb-1">## スライド2</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20">
                    <div className="text-sm text-gray-400 mb-3">プレビュー</div>
                    <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ステップ 4
                    </div>
                    <div className="bg-white/5 rounded p-2 h-[calc(100%-2rem)] flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-sm font-bold mb-2">タイトル</h3>
                        <ul className="text-xs text-left list-disc list-inside">
                          <li>要点1</li>
                          <li>要点2</li>
                          <li>要点3</li>
                        </ul>
                      </div>
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 -left-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 0
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* ステップインジケーター（下部） */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    opacity: [1, 1, 0.3, 0.3, 0.3],
                    scale: [1, 1, 0.8, 0.8, 0.8]
                  }}
                  transition={{
                    duration: animationDuration,
                    times: [0, timings.step1.show, timings.step1.end, timings.step3.end, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                  }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    opacity: [0.3, 0.3, 1, 1, 0.3, 0.3, 0.3],
                    scale: [0.8, 0.8, 1, 1, 0.8, 0.8, 0.8]
                  }}
                  transition={{
                    duration: animationDuration,
                    times: [0, timings.step1.end, timings.step2.start, timings.step2.show, timings.step2.end, timings.step3.end, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                  }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    opacity: [0.3, 0.3, 1, 1, 0.3, 0.3],
                    scale: [0.8, 0.8, 1, 1, 0.8, 0.8]
                  }}
                  transition={{
                    duration: animationDuration,
                    times: [0, timings.step2.end, timings.step3.start, timings.step3.show, timings.step3.end, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                  }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    opacity: [0.3, 0.3, 0.3, 0.3, 1, 1],
                    scale: [0.8, 0.8, 0.8, 0.8, 1, 1]
                  }}
                  transition={{
                    duration: animationDuration,
                    times: [0, timings.step2.end, timings.step3.start, timings.step3.end, timings.step4.start, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
