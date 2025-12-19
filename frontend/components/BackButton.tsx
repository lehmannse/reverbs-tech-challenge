'use client';

import { useRouter } from 'next/navigation';

type BackButtonProps = {
  className?: string;
  label?: string;
};

export default function BackButton({
  className,
  label = 'Back',
}: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 ${
        className ?? ''
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}

