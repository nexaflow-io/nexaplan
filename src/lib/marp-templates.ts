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

// カスタムテーマの定義
export const CUSTOM_THEME = `/* @theme custom */
@import "default";
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap");

section {
  color: #656d76;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 20px;
  line-height: 1.7;
  padding-bottom: 1em;
}

section.title {
  background-color: #5e80ad;
  color: white;
}

section.title h1,
section.title h3,
section.title h6 {
  color: white;
}

section.title footer {
  color: #5e80ad;
}

section.title strong {
  color: white;
}
  
strong {
  color: #4488cc;
}

em {
  font-style: normal;
  font-weight: bold;
  background-color: #4488cc25;
}

h1,
h2 {
  color: #224466;
}

section mjx-container {
  color: #5e80ad;
}

section table {
  margin: 10px auto;
}

section table td {
  text-align: center;
}

section table td img {
  display: block;
  margin: 0 auto;
}

section table th {
  background-color: var(--background-theme);
}

header {
  width: 100%;
  padding: 10px;
  font-size: 1.5em;
  font-weight: bold;
  border-bottom: 2px solid #5e80ad; /* 下線を追加 */
}`;

// Marpスライドのテンプレート
const MARP_TEMPLATE_DEFAULT = `---
marp: true
theme: custom
paginate: true
---

<!-- _class: title -->

# プロフェッショナルなプレゼンテーション

あなたの名前 | 2025年2月26日

---

## アジェンダ

<div class="box">
このプレゼンテーションでは、以下のトピックについて説明します：
</div>

1. 主要なポイント
2. データ分析結果
3. 今後の展望と提案

---

## 主要なポイント

<div class="columns">
<div>

### 重要な発見

- 市場シェアが<strong>25%</strong>増加
- 顧客満足度が向上
- 新規ユーザー獲得コストが減少

</div>
<div>

### 課題

<div class="note">
解決すべき課題がいくつか残っています
</div>

- 競合他社の新製品
- 技術的な負債
- 人材確保の難しさ

</div>
</div>

---

## データ分析結果

| 指標 | Q1 | Q2 | Q3 | Q4 |
|------|-----|-----|-----|-----|
| 売上 | 120 | 150 | 180 | 210 |
| コスト | 80 | 90 | 100 | 110 |
| 利益 | 40 | 60 | 80 | 100 |

<p class="caption">2024年度四半期データ（単位：百万円）</p>

---

## コード例

\`\`\`javascript
// 効率的なデータ処理関数
function processData(data) {
  return data
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      processed: true,
      score: calculateScore(item)
    }))
    .sort((a, b) => b.score - a.score);
}
\`\`\`

---

## 今後の展望

<div class="highlight">
2025年度は新たな成長機会に焦点を当てます
</div>

- 新市場への参入
- 製品ラインの拡大
- 顧客体験の向上

<div class="warning">
競合他社の動向に注意が必要です
</div>

---

## 提案

1. <strong>戦略的投資</strong>：研究開発予算を20%増加
2. <strong>人材育成</strong>：専門スキル向上のためのトレーニングプログラム
3. <strong>プロセス改善</strong>：効率化によるコスト削減

<div class="success">
これらの施策により、来年度は30%の成長が見込まれます
</div>

---

<!-- _class: title -->

# ご清聴ありがとうございました

質問やフィードバックをお待ちしています

<div class="footer">
連絡先: email@example.com | 会社名
</div>
`;

// グラデーションテンプレート（使用しないが、互換性のために残す）
export const MARP_TEMPLATE_GRADIENT = MARP_TEMPLATE_DEFAULT;

// ミニマルテンプレート（使用しないが、互換性のために残す）
export const MARP_TEMPLATE_MINIMAL = MARP_TEMPLATE_DEFAULT;

// ダークテンプレート（使用しないが、互換性のために残す）
export const MARP_TEMPLATE_DARK = MARP_TEMPLATE_DEFAULT;

// テンプレートの種類を定義
export enum MarpTemplateType {
  DEFAULT = 'default',
  GRADIENT = 'gradient',
  MINIMAL = 'minimal',
  DARK = 'dark',
}

// テンプレートのマッピング
const MARP_TEMPLATES: Record<MarpTemplateType, string> = {
  [MarpTemplateType.DEFAULT]: MARP_TEMPLATE_DEFAULT,
  [MarpTemplateType.GRADIENT]: MARP_TEMPLATE_GRADIENT,
  [MarpTemplateType.MINIMAL]: MARP_TEMPLATE_MINIMAL,
  [MarpTemplateType.DARK]: MARP_TEMPLATE_DARK,
};

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
  templateType?: MarpTemplateType;
}

export const getCustomTheme = (): string => {
  return CUSTOM_THEME;
};

export const getTemplateTypes = (): MarpTemplateType[] => {
  return Object.values(MarpTemplateType);
};

export const getTemplateByType = (type: MarpTemplateType = MarpTemplateType.DEFAULT): string => {
  return MARP_TEMPLATES[type] || MARP_TEMPLATES[MarpTemplateType.DEFAULT];
};

export const generateAISlides = async (params: GenerateAISlidesParams): Promise<GenerateSlidesResult> => {
  const { topic, additionalInstructions, templateType = MarpTemplateType.DEFAULT } = params;
  
  // AIに指示を送信
  const prompt = `
    Marpでプレゼンテーションスライドを作成してください。トピックは「${topic}」です。
    ${additionalInstructions ? `追加の指示: ${additionalInstructions}` : ''}
    
    以下のテンプレートを基にして、内容を置き換えてください。テンプレートのフォーマットとスタイル指定は維持してください。
    
    ${getTemplateByType(templateType)}
  `;
  
  // AIからの応答を取得（実際の実装はここで行う）
  // ここではダミーとして元のテンプレートを返す
  const markdown = getTemplateByType(templateType);
  
  return generateSlides({ markdown });
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

    // カスタムテーマを登録
    marp.themeSet.add(CUSTOM_THEME);

    const { html, css } = marp.render(preprocessedMarkdown);
    const positions = marp.positions;

    // スタイリッシュなスライドのための追加CSS
    const enhancedCSS = `
      /* スタイリッシュなスライドのための追加スタイル */
      .marpit {
        font-family: 'Inter', 'Noto Sans JP', sans-serif;
      }
      
      .marpit section {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }
      
      /* コードブロックのスタイル強化 */
      .marpit section pre {
        background-color: #282c34;
        border-radius: 8px;
        padding: 1em;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .marpit section pre code {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 0.9em;
      }
      
      /* 表のスタイル強化 */
      .marpit section table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
      }
      
      .marpit section th {
        background-color: #4f46e5;
        color: white;
        font-weight: 600;
        text-align: left;
        padding: 0.8em 1em;
      }
      
      .marpit section td {
        padding: 0.8em 1em;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      
      .marpit section tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      /* 画像のスタイル強化 */
      .marpit section img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
    `;

    return {
      markdown: params.markdown,
      html: `
        <style>
          /* まず基本的なレイアウトスタイルを定義 */
          .marpit {
            width: var(--content-width);
            margin: 0 auto;
            display: block; /* ブロック表示に設定 */
            position: relative; /* 相対位置に設定 */
            height: auto; /* 自動高さに設定 */
            overflow: visible; /* オーバーフローを visible に設定 */
          }
          
          /* Marpのデフォルトスタイルを適用 */
          ${css}
          ${CUSTOM_THEME}
          
          /* スタイリッシュなスライドのための追加スタイル */
          ${enhancedCSS}
          
          /* カスタムスタイルで上書き - 最も優先度が高い */
          .marpit section {
            width: 100%;
            height: auto !important; /* 固定アスペクト比ではなく自動高さに変更 */
            min-height: 400px; /* 最小高さを設定 */
            margin-bottom: 60px !important; /* スライド間のマージンをさらに増やす */
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 8px;
            transform: none !important;
            transition: none !important;
            overflow: visible; /* オーバーフローを visible に設定 */
            position: relative;
            padding: 2.5rem !important;
            display: block; /* ブロック表示に設定 */
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
            padding-left: 2em;
            list-style-position: outside;
          }
          
          .marpit section ul li {
            margin-bottom: 0.75em;
            list-style-type: disc !important;
            display: list-item !important;
          }
          
          .marpit section ul li p {
            margin: 0;
            display: inline;
          }
          
          /* 最後のスライドの後に余白を追加 */
          .marpit section:last-of-type {
            margin-bottom: 100px !important;
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
