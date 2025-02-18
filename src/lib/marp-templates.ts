import { Marp } from '@marp-team/marp-core';

interface ElementPosition {
  start: number;
  end: number;
  text: string;
}

class PositionTrackingMarp extends Marp {
  positions: ElementPosition[] = [];

  constructor(opts?: any) {
    super(opts);

    this.markdown.renderer.rules.paragraph_open = (tokens: any[], idx: number) => {
      const token = tokens[idx];
      const position = this.positions.length;
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: tokens[idx + 1]?.content || ''
        });
      }
      return `<p data-position="${position}">`;
    };

    this.markdown.renderer.rules.heading_open = (tokens: any[], idx: number) => {
      const token = tokens[idx];
      const position = this.positions.length;
      
      if (token.map) {
        const [start, end] = token.map;
        this.positions.push({
          start,
          end,
          text: tokens[idx + 1]?.content || ''
        });
      }
      return `<${token.tag} data-position="${position}">`;
    };
  }

  render(markdown: string, env?: any) {
    this.positions = [];
    return super.render(markdown, env);
  }
}

// Marpスライドのテンプレート
const MARP_TEMPLATE = `---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  section {
    width: 1280px;
    height: 720px;
    font-size: 32px;
    padding: 40px;
    background: white;
    box-sizing: border-box;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  h1 {
    font-size: 56px;
    color: #2B3A55;
    margin-bottom: 40px;
    line-height: 1.4;
  }
  h2 {
    font-size: 48px;
    color: #2B3A55;
    margin-bottom: 32px;
    line-height: 1.4;
  }
  ul, ol {
    margin: 0;
    padding-left: 24px;
    line-height: 1.6;
  }
  li {
    margin-bottom: 16px;
  }
  p {
    margin: 0 0 24px 0;
    line-height: 1.6;
    text-align: justify;
  }
---

`;

export const defaultContent = MARP_TEMPLATE;

export interface GenerateSlidesParams {
  markdown: string;
}

export interface GenerateSlidesResult {
  markdown: string;
  html: string;
  positions: ElementPosition[];
}

export interface GenerateAISlidesParams {
  topic: string;
  additionalInstructions?: string;
}

export const generateAISlides = async (params: GenerateAISlidesParams): Promise<GenerateSlidesResult> => {
  try {
    const { generateSlideContent } = await import('./gemini');
    const markdown = await generateSlideContent({
      topic: params.topic,
      additionalInstructions: params.additionalInstructions
    });

    if (!markdown) {
      throw new Error('Failed to generate markdown content');
    }

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
    const marp = new PositionTrackingMarp({
      html: true,
      container: false,
    });

    const { html, css } = marp.render(params.markdown);
    const positions = marp.positions;

    return {
      markdown: params.markdown,
      html: `
        <style>
          .marpit {
            width: var(--content-width);
            margin: 0 auto;
          }
          .marpit section {
            width: 100% !important;
            aspect-ratio: 16/9 !important;
            margin-bottom: 24px !important;
            background: white !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            padding: 48px !important;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
            border-radius: 8px !important;
          }
          .marpit h1 {
            font-size: 2.5em !important;
            line-height: 1.4 !important;
            margin-bottom: 0.8em !important;
            color: #2B3A55 !important;
          }
          .marpit h2 {
            font-size: 2em !important;
            line-height: 1.4 !important;
            margin-bottom: 0.6em !important;
            color: #2B3A55 !important;
          }
          .marpit p, .marpit li {
            font-size: 1.2em !important;
            line-height: 1.6 !important;
            margin-bottom: 0.5em !important;
          }
          .marpit ul, .marpit ol {
            padding-left: 1.5em !important;
            margin-bottom: 1em !important;
          }
          .marpit * {
            box-sizing: border-box !important;
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          ${css}
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
