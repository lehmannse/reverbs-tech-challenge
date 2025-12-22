import type { ReactNode } from 'react';
import PokeballIcon from './icons/PokeballIcon';

type Props = {
  children: ReactNode;
  /** Extra classes for the outer <main> wrapper */
  className?: string;
  /** Extra classes for the inner container (uses .page-container by default) */
  containerClassName?: string;
  /** Customize the watermark size if needed */
  watermarkSize?: number;
  /** Customize watermark color via Tailwind text-* class */
  watermarkColorClassName?: string;
  /** Customize watermark opacity */
  watermarkOpacityClassName?: string;
};

export default function WatermarkedPage({
  children,
  className = '',
  containerClassName = '',
  watermarkSize = 380,
  watermarkColorClassName = 'text-slate-900',
  watermarkOpacityClassName = 'opacity-[0.06]',
}: Props) {
  return (
    <main
      className={`relative min-h-dvh overflow-hidden bg-slate-50/80 ${className}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -left-24 -top-24 ${watermarkOpacityClassName}`}
      >
        <PokeballIcon
          size={watermarkSize}
          strokeWidth={1.25}
          className={watermarkColorClassName}
        />
      </div>

      <div className={`page-container relative ${containerClassName}`}>
        {children}
      </div>
    </main>
  );
}


