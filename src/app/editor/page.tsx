'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// PresentationFormを動的にインポート
const PresentationForm = dynamic(
  () => import('@/components/presentation/PresentationForm'),
  {
    loading: () => null,
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
      <Suspense fallback={null}>
        <EditorContent />
      </Suspense>
    </main>
  );
}
