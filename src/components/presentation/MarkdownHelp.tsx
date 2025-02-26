import React from 'react';

interface MarkdownHelpProps {
  isVisible: boolean;
}

const MarkdownHelp: React.FC<MarkdownHelpProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mt-4">
      <p className="font-medium">Markdownの書き方ヒント</p>
      <div className="mt-2 text-sm">
        <p className="font-medium">箇条書きの書き方：</p>
        <pre className="bg-white p-2 rounded mt-1 text-gray-700 overflow-x-auto">
{`* 項目1

* 項目2

* 項目3`}
        </pre>
        <p className="mt-2">各項目の間に空行を入れると正しく表示されます。</p>
        
        <p className="font-medium mt-3">太字と斜体：</p>
        <pre className="bg-white p-2 rounded mt-1 text-gray-700 overflow-x-auto">
{`**太字のテキスト**

*斜体のテキスト*`}
        </pre>
        
        <p className="font-medium mt-3">見出し：</p>
        <pre className="bg-white p-2 rounded mt-1 text-gray-700 overflow-x-auto">
{`# 見出し1

## 見出し2

### 見出し3`}
        </pre>
      </div>
    </div>
  );
};

export default MarkdownHelp;
