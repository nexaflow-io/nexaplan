'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// PresentationFormを動的にインポート
const PresentationForm = dynamic(
  () => import('@/components/presentation/PresentationForm'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    ),
    ssr: false
  }
);

// SearchParamsを取得するコンポーネント
function EditorContent() {
  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const topic = searchParams.get('topic');

  return <PresentationForm shouldGenerateAI={shouldGenerate} topic={topic} />;
}

export default function EditorPage() {
  return (
    <main className="h-screen w-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      }>
        <EditorContent />
      </Suspense>
    </main>
  );
}
