import type { ReactNode } from 'react';
import PokeballIcon from './icons/PokeballIcon';

type Props = {
  children: ReactNode;
  /** Optional background layer rendered inside the <main> (behind content). */
  background?: ReactNode;
  /** Toggle the translucent Pokeball watermark. */
  showWatermark?: boolean;
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
  background,
  showWatermark = true,
  className = '',
  containerClassName = '',
  watermarkSize = 420,
  watermarkColorClassName = 'text-slate-900',
  watermarkOpacityClassName = 'opacity-[0.06]',
}: Props) {
  return (
    <main
      className={`relative min-h-dvh overflow-hidden bg-slate-50/80 ${className}`}
    >
      {showWatermark ? (
        <div
          aria-hidden
          className={`pointer-events-none absolute -left-28 -top-28 ${watermarkOpacityClassName}`}
        >
          <PokeballIcon
            size={watermarkSize}
            strokeWidth={1.5}
            className={watermarkColorClassName}
          />
        </div>
      ) : null}

      {background}

      <div className={`page-container relative ${containerClassName}`}>
        {children}
      </div>
    </main>
  );
}
