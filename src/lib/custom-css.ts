import fs from 'fs';
import path from 'path';

// カスタムCSSファイルを読み込む関数
export const loadCustomCSS = (): string => {
  try {
    const cssPath = path.join(process.cwd(), 'src', 'styles', 'marp-custom.css');
    return fs.readFileSync(cssPath, 'utf8');
  } catch (error) {
    console.error('Error loading custom CSS:', error);
    return ''; // エラーが発生した場合は空文字列を返す
  }
};
