import { GoogleGenerativeAI } from '@google/generative-ai';

// Geminiクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Gemini Flash 2.0モデルの設定
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Marpスライドのテンプレート
const MARP_TEMPLATE = `---
marp: true
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
