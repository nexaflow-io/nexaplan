import { GoogleGenerativeAI } from '@google/generative-ai';

// Geminiクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Gemini Flash 2.0モデルの設定
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
---

`;

// スライド生成用のプロンプト
const SLIDE_GENERATION_PROMPT = `
与えられたトピックについて、プレゼンテーションスライドを作成してください。
以下の点に注意してください：

1. 各スライドは "---" で区切ってください
2. 最初のスライドはタイトルスライドにしてください
3. 目次や概要を含めてください
4. 内容は簡潔で分かりやすくしてください
5. 箇条書きを効果的に使用してください
6. 必要に応じて表を使用してください
7. 最後にまとめのスライドを入れてください

トピック：{topic}
追加指示：{additionalInstructions}
`;

export interface GenerateSlideContentParams {
  topic: string;
  additionalInstructions?: string;
}

export const generateSlideContent = async (params: GenerateSlideContentParams): Promise<string> => {
  try {
    // プロンプトの準備
    const prompt = SLIDE_GENERATION_PROMPT
      .replace('{topic}', params.topic)
      .replace('{additionalInstructions}', params.additionalInstructions || '特になし');

    // Geminiでコンテンツを生成
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Marpテンプレートと生成されたコンテンツを結合
    return `${MARP_TEMPLATE}\n\n${text}`;
  } catch (error) {
    console.error('Error generating slide content:', error);
    throw error;
  }
};
