import { Marp } from '@marp-team/marp-core';
import type { RenderResult } from '@marp-team/marpit';

// HTMLAsArrayの型定義を修正
type HTMLAsArray = { htmlAsArray: true };

interface ElementPosition {
  start: number;
  end: number;
  text: string;
}

interface Token {
  map?: [number, number];
  content?: string;
  tag?: string;
  type?: string;
}

interface MarpRule {
  (tokens: Token[], idx: number): void;
}

class PositionTrackingMarp extends Marp {
  private _positions: ElementPosition[] = [];

  constructor(opts?: Record<string, unknown>) {
    // Marpのデフォルト動作を維持しつつ、必要なオプションを設定
    super({ 
      ...opts,
      inlineSVG: true
    });

    // Markdownのレンダラー設定を調整
    this.markdown.set({
      breaks: true,       // 改行をそのまま改行として扱う
      html: true,         // HTMLタグを許可
      linkify: true,      // URLをリンクに自動変換
      typographer: true,  // 引用符などの変換を有効化
    });
    
    // 段落の開始タグにposition属性を追加
    this.markdown.renderer.rules.paragraph_open = (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: tokens[idx + 1]?.content || ''
        });
        
        return `<p data-position="${start}-${end}">`;
      }
      
      return '<p>';
    };

    // リスト項目の開始タグにposition属性を追加
    const originalListItemOpen = this.markdown.renderer.rules.list_item_open || ((tokens: Token[], idx: number) => `<li>`);
    this.markdown.renderer.rules.list_item_open = (tokens: Token[], idx: number): string => {
      const token = tokens[idx];
      
      if (token.map) {
        const [start, end] = token.map;
        // リスト項目のコンテンツを見つける
        let contentIdx = idx + 1;
        while (contentIdx < tokens.length && tokens[contentIdx].type !== 'list_item_close') {
          if (tokens[contentIdx].content !== undefined) {
            this.positions.push({
              start,
              end,
              text: tokens[contentIdx].content || ''
            });
            break;
          }
          contentIdx++;
        }
        
        return `<li data-position="${start}-${end}">`;
      }
      
      return originalListItemOpen(tokens, idx);
    };

    // 見出しの開始タグにposition属性を追加
    this.markdown.renderer.rules.heading_open = (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: tokens[idx + 1]?.content || ''
        });
        
        return `<${token.tag} data-position="${start}-${end}">`;
      }
      
      return `<${token.tag}>`;
    };

    // テーブルセルにposition属性を追加
    this.markdown.renderer.rules.th_open = (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      const contentToken = tokens[idx + 1];
      
      if (token.map) {
        const [start, end] = token.map;
        if (contentToken && contentToken.content !== undefined) {
          this.positions.push({
            start,
            end,
            text: contentToken.content
          });
        }
        return `<th data-position="${start}-${end}">`;
      }
      return '<th>';
    };

    this.markdown.renderer.rules.td_open = (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      const contentToken = tokens[idx + 1];
      
      if (token.map) {
        const [start, end] = token.map;
        if (contentToken && contentToken.content !== undefined) {
          this.positions.push({
            start,
            end,
            text: contentToken.content
          });
        }
        return `<td data-position="${start}-${end}">`;
      }
      return '<td>';
    };

    // コードブロックにposition属性を追加
    this.markdown.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, slf: any) => {
      const token = tokens[idx];
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: token.content || ''
        });
        
        // 元のレンダリング処理を呼び出す
        const originalResult = slf.renderToken(tokens, idx, options);
        
        // data-position属性を追加
        return originalResult.replace('<pre', `<pre data-position="${start}-${end}"`);
      }
      
      return slf.renderToken(tokens, idx, options);
    };

    // 画像にposition属性を追加
    this.markdown.renderer.rules.image = (tokens: Token[], idx: number, options: any, env: any, slf: any) => {
      const token = tokens[idx];
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: token.content || ''
        });
        
        // 元のレンダリング処理を呼び出す
        const originalResult = slf.renderToken(tokens, idx, options);
        
        // data-position属性を追加
        return originalResult.replace('<img', `<img data-position="${start}-${end}"`);
      }
      
      return slf.renderToken(tokens, idx, options);
    };
  }

  get positions(): ElementPosition[] {
    return this._positions;
  }

  set positions(value: ElementPosition[]) {
    this._positions = value;
  }

  render(markdown: string, env: HTMLAsArray): RenderResult<string[]>;
  render(markdown: string, env?: any): RenderResult<string>;
  render(markdown: string, env?: any): RenderResult<any> {
    // 位置情報をリセット
    this.positions = [];
    return super.render(markdown, env);
  }

  private getListItemContent(tokens: Token[], idx: number): string | undefined {
    let contentIdx = idx + 1;
    let content = '';
    
    // リスト項目の終了タグまでの間にあるすべてのコンテンツを結合
    while (contentIdx < tokens.length && tokens[contentIdx].type !== 'list_item_close') {
      if (tokens[contentIdx].type === 'inline' && tokens[contentIdx].content !== undefined) {
        content += tokens[contentIdx].content;
      } else if (tokens[contentIdx].type === 'paragraph_open') {
        // 次のトークンがparagraph_openの場合、その次のトークンがinlineでコンテンツを持っている可能性がある
        const nextIdx = contentIdx + 1;
        if (nextIdx < tokens.length && tokens[nextIdx].type === 'inline' && tokens[nextIdx].content !== undefined) {
          content += tokens[nextIdx].content;
        }
      }
      contentIdx++;
    }
    
    return content || undefined;
  }
}

// Marpスライドのテンプレート
const MARP_TEMPLATE = `---
marp: true
theme: default
paginate: true
backgroundColor: "#ffffff"
size: 16:9
color: "#333333"
style: |
  section {
    font-family: 'Arial', 'Helvetica', sans-serif;
    padding: 40px;
    font-size: 28px;
  }
  h1 {
    color: #2c3e50;
    font-size: 2.5em;
  }
  h2 {
    color: #34495e;
    font-size: 2.0em;
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
---

# タイトルを入力

---

## スライドの内容

- 箇条書き1
- 箇条書き2
- 箇条書き3

`;

interface GenerateSlidesParams {
  markdown: string;
}

interface GenerateSlidesResult {
  markdown: string;
  html: string;
  positions: ElementPosition[];
}

interface GenerateAISlidesParams {
  topic: string;
  additionalInstructions?: string;
}

export const generateAISlides = async (params: GenerateAISlidesParams): Promise<GenerateSlidesResult> => {
  try {
    // ここでAIを使ってマークダウンを生成する処理
    // 実際のAI生成ロジックは省略し、テンプレートを返す
    const markdown = MARP_TEMPLATE.replace('タイトルを入力', params.topic);

    // 生成されたマークダウンの内容をログ出力
    console.log('Generated markdown:', markdown);

    const result = await generateSlides({ markdown });
    
    // 生成結果をログ出力
    console.log('Generated slides result:', result);

    return result;
  } catch (error) {
    console.error('Error in generateAISlides:', error);
    throw error;
  }
};

export const generateSlides = async (params: GenerateSlidesParams): Promise<GenerateSlidesResult> => {
  try {
    // マークダウンの前処理：箇条書きの修正
    const preprocessedMarkdown = preprocessMarkdown(params.markdown);
    
    const marp = new PositionTrackingMarp({
      html: true,
      container: false,
      math: true,
      minifyCSS: false,
      looseList: true, // 緩いリスト解析を有効化
      breaks: true     // 改行をそのまま改行として扱う
    });

    const { html, css } = marp.render(preprocessedMarkdown);
    const positions = marp.positions;

    return {
      markdown: params.markdown,
      html: `
        <style>
          /* まず基本的なレイアウトスタイルを定義 */
          .marpit {
            width: var(--content-width);
            margin: 0 auto;
          }
          
          /* Marpのデフォルトスタイルを適用 */
          ${css}
          
          /* カスタムスタイルで上書き - 最も優先度が高い */
          .marpit section {
            width: 100%;
            aspect-ratio: 16/9;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 8px;
            transform: none !important;
            transition: none !important;
            overflow: visible;
            position: relative;
          }
          
          /* ホバー効果の無効化 - より具体的なセレクタを使用 */
          .marpit section *:hover {
            transform: none !important;
            transition: none !important;
            box-shadow: inherit;
            border: inherit;
            outline: none;
            filter: none;
            scale: 1;
          }
          
          /* スライドのホバー効果を無効化 */
          .marpit section:hover {
            transform: none !important;
            scale: 1 !important;
            z-index: auto;
          }
          
          /* リスト項目のスタイル調整 */
          .marpit section ul {
            padding-left: 1.5em;
          }
          
          .marpit section ul li {
            margin-bottom: 0.75em;
            list-style-type: disc;
          }
          
          .marpit section ul li p {
            margin: 0;
          }
        </style>
        <div class="marpit">
          ${html}
        </div>
      `,
      positions,
    };
  } catch (error) {
    console.error('Error generating slides:', error);
    throw error;
  }
};

// マークダウンの前処理関数
const preprocessMarkdown = (markdown: string): string => {
  // 箇条書きの問題を解決するために、マークダウンを完全に書き換える
  
  // 行ごとに分割
  const lines = markdown.split('\n');
  const result = [];
  
  let inList = false;
  let listIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 箇条書きの開始を検出
    if (line.match(/^[*\-+]\s/) || line.match(/^\d+\.\s/)) {
      // 箇条書きの開始
      if (!inList) {
        inList = true;
        // 箇条書きの前に空行を挿入（前の行が空行でない場合）
        if (i > 0 && lines[i-1].trim() !== '') {
          result.push('');
        }
      }
      
      // 現在の行を追加
      result.push(lines[i]);
      
      // 次の行がある場合
      if (i < lines.length - 1) {
        const nextLine = lines[i+1].trim();
        
        // 次の行が箇条書きでない場合、または空行の場合
        if (!nextLine.match(/^[*\-+]\s/) && !nextLine.match(/^\d+\.\s/) || nextLine === '') {
          // 何もしない
        } else {
          // 次の行も箇条書きの場合、空行を挿入
          result.push('');
        }
      }
    } else {
      // 箇条書き以外の行
      if (inList && line === '') {
        // 箇条書きの終了
        inList = false;
      }
      
      // 現在の行を追加
      result.push(lines[i]);
    }
  }
  
  return result.join('\n');
};
