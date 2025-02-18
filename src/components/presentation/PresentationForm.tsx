'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateSlides, generateAISlides } from '@/lib/marp-templates';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';

interface PresentationFormProps {
  shouldGenerateAI?: boolean;
  topic?: string | null;
}

interface ElementPosition {
  start: number;
  end: number;
  text: string;
}

interface CodeMirrorRef {
  editor?: {
    focus: () => void;
  };
}

const defaultContent = `---
marp: true
theme: default
paginate: true
backgroundColor: "#ffffff"
size: 16:9
color: "#333333"
style: |
  section {
    font-family: 'Arial', 'Helvetica', sans-serif;
    padding: 80px 50px 20px;
    font-size: 16px;
  }
  h1 {
    color: #2c3e50;
    font-size: 2.5em;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 10px;
  }
  h2 {
    color: #34495e;
    font-size: 2.0em;
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    padding-bottom: 5px;
    border-bottom: 1px solid #34495e;
  }
  h3 {
    color: #7f8c8d;
    font-size: 1.8em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    border: 1px solid #bdc3c7;
    padding: 10px;
    text-align: left;
  }
  th {
    background-color: #ecf0f1;
    color: #2c3e50;
  }
  .highlight {
    background-color: #f1f8e9;
    padding: 5px;
    border-radius: 3px;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  hr {
    display: none;
  }
---

# `;

export default function PresentationForm({ shouldGenerateAI = false, topic = null }: PresentationFormProps) {
  const [markdown, setMarkdown] = useState(defaultContent);
  const [html, setHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const editorCodeMirrorRef = useRef<CodeMirrorRef>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isPreviewHoverEnabled, setIsPreviewHoverEnabled] = useState(true);

  const searchParams = useSearchParams();

  const handleChange = useCallback(async (content: string) => {
    setMarkdown(content)
    try {
      const { html } = await generateSlides({ markdown: content })
      if (html) {
        setHtml(html)
      }
    } catch (error) {
      console.error('Error generating slides:', error)
    }
  }, [])

  useEffect(() => {
    const idea = searchParams.get('idea')
    if (idea) {
      setIsGenerating(true)
      setGenerationStep(1)
      console.log('Generating slides for idea:', idea)
      
      // アニメーションのための遅延
      setTimeout(async () => {
        try {
          setGenerationStep(2)
          const result = await generateAISlides({
            topic: idea,
            additionalInstructions: "プレゼンテーションスライドを生成してください。"
          })
          
          console.log('Generated result:', result)
          if (result && result.markdown && result.html) {
            setGenerationStep(3)
            
            // 最終的な更新のための遅延
            setTimeout(() => {
              setMarkdown(result.markdown)
              setHtml(result.html)
              setIsGenerating(false)
              setGenerationStep(0)
            }, 1000)
          }
        } catch (error) {
          console.error('Error generating slides:', error)
          setIsGenerating(false)
          setGenerationStep(0)
        }
      }, 1000)
    } else {
      setMarkdown('')
      setHtml('')
    }
  }, [searchParams])

  const handleAIGenerate = useCallback(async (topic: string) => {
    try {
      setIsGenerating(true);
      setGenerationStep(1)
      const response = await generateAISlides({
        topic,
        additionalInstructions: "プレゼンテーションスライドを生成してください。"
      });
      if (response.markdown) {
        setMarkdown(response.markdown);
      }
      if (response.html) {
        setHtml(response.html);
      }
    } catch (error) {
      console.error('Error generating slides:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (shouldGenerateAI && topic) {
      handleAIGenerate(topic);
    }
  }, [shouldGenerateAI, topic, handleAIGenerate]);

  const handleElementHover = useCallback((event: Event) => {
    if (!isPreviewHoverEnabled) return;

    const target = (event as MouseEvent).target as HTMLElement;
    const position = target.getAttribute('data-position');
    if (position && editorCodeMirrorRef.current) {
      const pos = position;
      if (pos) {
        try {
          const view = editorCodeMirrorRef.current.editor?.focus();
          const doc = view?.state.doc;

          // 対象の行を取得
          const line = doc?.line(parseInt(pos) + 1);

          // カーソルを行の先頭に移動
          view?.dispatch({
            selection: {
              anchor: line?.from,
              head: line?.from
            }
          });

          // スクロール位置を計算
          const coords = view?.coordsAtPos(line?.from);
          if (coords) {
            const editorRect = view?.dom.getBoundingClientRect();
            const scrollParent = view?.scrollDOM;
            const viewportHeight = scrollParent?.clientHeight;

            const targetY = coords.top - editorRect.top + scrollParent?.scrollTop;
            const scrollTop = targetY - viewportHeight / 3;

            // スムーズにスクロール
            scrollParent?.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: 'smooth'
            });
          }
        } catch (error) {
          console.error('Failed to scroll to position:', error);
        }
      }
    }
  }, [isPreviewHoverEnabled]);

  useEffect(() => {
    const preview = document.querySelector('.marpit');
    if (preview) {
      preview.addEventListener('mouseover', handleElementHover);
      return () => preview.removeEventListener('mouseover', handleElementHover);
    }
  }, [handleElementHover]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <header className="relative border-b border-white/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500"
            >
              NexaPlan
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 min-h-0">
        <div className="h-full flex gap-4">
          <div className="w-1/2 rounded-2xl backdrop-blur-xl bg-gray-900/95 border border-white/10 shadow-2xl flex flex-col min-h-0">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
              <h2 className="text-base font-medium text-gray-300 flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editor
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              {isGenerating ? (
                <div className="w-full h-full p-6 bg-transparent text-gray-200 font-mono text-sm leading-relaxed relative">
                  <div className="absolute inset-6 backdrop-blur-sm bg-gray-900/50 rounded-xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-24 h-24">
                          <div className="absolute w-full h-full rounded-full border-4 border-purple-500/30"></div>
                          <div className="absolute w-full h-full rounded-full border-4 border-purple-500 border-t-transparent animate-[spin_1s_linear_infinite]"></div>
                          <div className="absolute w-full h-full rounded-full border-4 border-purple-500/10 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="text-lg font-medium text-gray-200">スライドを生成中...</div>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-purple-400' : 'text-gray-500'}`}>
                            <svg className={`w-5 h-5 ${generationStep >= 1 ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {generationStep > 1 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                            アイデアを分析中...
                          </div>
                          <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-purple-400' : 'text-gray-500'}`}>
                            <svg className={`w-5 h-5 ${generationStep >= 2 ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {generationStep > 2 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                            スライドを作成中...
                          </div>
                          <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
                            <svg className={`w-5 h-5 ${generationStep >= 3 ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {generationStep >= 3 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                            最終調整中...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <CodeMirror
                  ref={editorCodeMirrorRef}
                  value={markdown}
                  height="100%"
                  onChange={handleChange}
                  style={{
                    fontSize: '16px',
                    color: 'rgb(229, 231, 235)',
                  }}
                  className="h-full [&_.cm-editor]:!bg-transparent [&_.cm-content]:!bg-transparent [&_.cm-gutters]:!bg-transparent [&_.cm-scroller]:!bg-transparent [&_.cm-gutters]:!border-white/10 [&_.cm-gutters]:!text-gray-500 [&_.cm-selectionBackground]:!bg-white/10 [&_.cm-activeLine]:!bg-white/5 [&_.cm-cursor]:!border-l-2 [&_.cm-cursor]:!border-white/70"
                />
              )}
            </div>
          </div>

          <div className="w-1/2 rounded-2xl backdrop-blur-xl bg-gray-900/95 border border-white/10 shadow-2xl flex flex-col min-h-0">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
              <h2 className="text-base font-medium text-gray-300 flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPreviewHoverEnabled(!isPreviewHoverEnabled)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    isPreviewHoverEnabled 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-transparent text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  ホバープレビュー {isPreviewHoverEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg
                            hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                </button>
              </div>
            </div>
            <div 
              ref={fullscreenRef}
              className="flex-1 overflow-y-auto overflow-x-hidden relative"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 transparent'
              }}
            >
              <div 
                className="w-full h-full p-6"
                style={{
                  ['--slide-width' as string]: '100%',
                  ['--slide-height' as string]: 'auto',
                  ['--content-width' as string]: 'min(calc(100% - 48px), 1200px)',
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
