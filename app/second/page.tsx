"use client";
import { useRouter } from 'next/navigation';

export default function SecondPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#222' }}>
      <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">Other People Distribution (Placeholder)</h1>
      <div className="w-full max-w-2xl rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md text-center">
        Map and list features are not implemented yet.
      </div>
      <div className="flex gap-4 mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-lg"
          onClick={() => router.push('/')}
        >
          Previous Page
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-lg"
          onClick={() => router.push('/third')}
        >
          Next Page
        </button>
      </div>
    </div>
  );
} 