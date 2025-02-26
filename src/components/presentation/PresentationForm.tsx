'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateSlides, generateAISlides } from '@/lib/marp-templates';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';

interface PresentationFormProps {
  shouldGenerateAI?: boolean;
  topic?: string | null;
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
    font-size: 16px; /* フォントサイズをもう一回小さく */
  }
  h1 {
    color: #2c3e50;
    font-size: 2.5em; /* h1をもう少し小さく */
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 10px;
  }
  h2 {
    color: #34495e;
    font-size: 2.0em; /* h2を少し小さく */
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    padding-bottom: 5px;
    border-bottom: 1px solid #34495e;
  }
  h3 {
    color: #7f8c8d;
    font-size: 1.8em; /* h3を少し小さく */
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
---

# タイトルを入力

---

## スライドの内容

- 箇条書き1
- 箇条書き2
- 箇条書き3

`;

export default function PresentationForm({ shouldGenerateAI = false, topic = null }: PresentationFormProps) {
  const [markdown, setMarkdown] = useState(defaultContent);
  const [html, setHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const editorCodeMirrorRef = useRef<ReactCodeMirrorRef>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const handleChange = useCallback(async (content: string) => {
    // 箇条書きを自動修正
    const fixedContent = fixMarkdownLists(content);
    setMarkdown(fixedContent);
  }, []);

  // 箇条書きを自動修正する関数
  const fixMarkdownLists = (content: string): string => {
    const lines = content.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      result.push(line);
      
      // 現在の行が箇条書きで、次の行も箇条書きの場合、空行を挿入
      if (i < lines.length - 1) {
        const currentLine = line.trim();
        const nextLine = lines[i + 1].trim();
        
        if ((currentLine.startsWith('* ') || currentLine.startsWith('- ') || currentLine.match(/^\d+\.\s/)) &&
            (nextLine.startsWith('* ') || nextLine.startsWith('- ') || nextLine.match(/^\d+\.\s/)) &&
            nextLine !== '') {
          result.push('');
        }
      }
    }
    
    return result.join('\n');
  };

  useEffect(() => {
    const updatePreview = async () => {
      try {
        setError(null); // エラー状態をリセット
        const { html } = await generateSlides({ markdown });
        if (html) {
          setHtml(html);
        }
      } catch (error) {
        console.error('Error updating preview:', error);
        setError(error instanceof Error ? error.message : String(error));
      }
    };
    
    updatePreview();
  }, [markdown]);

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
          setError(error instanceof Error ? error.message : String(error));
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
      setError(error instanceof Error ? error.message : String(error));
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
    const target = (event as MouseEvent).target as HTMLElement;
    
    // data-position属性を持つ最も近い親要素を探す
    let currentElement: HTMLElement | null = target;
    let position: string | null = null;
    
    while (currentElement && !position) {
      position = currentElement.getAttribute('data-position');
      if (!position) {
        currentElement = currentElement.parentElement;
      }
    }
    
    // デバッグ情報
    console.log('Hover event:', {
      target: target.tagName,
      position,
      currentElement: currentElement?.tagName,
      elementHTML: currentElement?.outerHTML?.substring(0, 100)
    });

    if (position && editorCodeMirrorRef.current) {
      try {
        const view = editorCodeMirrorRef.current?.view;
        if (!view) {
          console.warn('CodeMirror view not available');
          return;
        }

        const doc = view.state.doc;
        const lineNumber = parseInt(position);
        
        console.log('Document info:', {
          docLines: doc.lines,
          lineNumber: lineNumber,
          docText: doc.sliceString(0, 100)
        });

        // 対象の行を取得（マークダウンの行番号は1ベース）
        try {
          const line = doc.line(lineNumber + 1);
          console.log('Found line:', {
            lineNumber: lineNumber + 1,
            from: line.from,
            to: line.to,
            text: line.text
          });

          // カーソルを行の先頭に移動
          view.dispatch({
            selection: {
              anchor: line.from,
              head: line.from
            },
            scrollIntoView: true
          });
        } catch (e) {
          console.error('Line not found, trying alternative approach');
          // 行が見つからない場合は、直接行番号を使用
          for (let i = 1; i <= doc.lines; i++) {
            const line = doc.line(i);
            console.log(`Line ${i}:`, line.text);
            if (i === lineNumber + 1) {
              view.dispatch({
                selection: {
                  anchor: line.from,
                  head: line.from
                },
                scrollIntoView: true
              });
              break;
            }
          }
        }
      } catch (error) {
        console.error('Failed to scroll to position:', error);
      }
    }
  }, []);

  useEffect(() => {
    // プレビュー要素を取得
    const preview = document.querySelector('.marpit');
    
    if (preview) {
      console.log('Preview element found, attaching event listeners');
      
      // イベントリスナーを追加
      preview.addEventListener('mouseover', handleElementHover);
      
      // クリーンアップ関数
      return () => {
        console.log('Removing event listeners');
        preview.removeEventListener('mouseover', handleElementHover);
      };
    } else {
      console.warn('Preview element not found');
    }
  }, [handleElementHover, html]);

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
                  extensions={[
                    // シンタックスハイライトを無効化
                    // markdownLanguage({ codeLanguages: languages }),
                  ]}
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
              >
                <div 
                  className="preview-container"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  dangerouslySetInnerHTML={{ __html: html }} 
                />
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
                    <p className="font-medium">エラーが発生しました</p>
                    <p className="text-sm">{error}</p>
                    <div className="mt-2">
                      <p className="font-medium text-sm">箇条書きの書き方に関する注意点：</p>
                      <p className="text-sm">箇条書きの各項目の間には空行が必要です。以下のように記述してください：</p>
                      <pre className="bg-white p-2 rounded mt-1 text-gray-700 text-xs">
{`* 項目1

* 項目2

* 項目3`}
                      </pre>
                      <p className="text-sm mt-2">
                        ※ エディタでは自動的に修正を試みていますが、複雑な構造の場合は手動で修正が必要な場合があります。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
