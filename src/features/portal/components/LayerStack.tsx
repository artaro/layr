'use client';

import React from 'react';
import type { Layer } from '@/features/portal/stores/useLayerStore';
import { useTranslation } from '@/shared/lib/i18n';

interface LayerStackProps {
  layers: Layer[];
  animate?: boolean;
}

export default function LayerStack({ layers, animate = true }: LayerStackProps) {
  const { t } = useTranslation();
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col-reverse items-center gap-3 sm:gap-4">
      {sortedLayers.map((layer, index) => (
        <div
          key={layer.id}
          className="relative group"
          style={{
            animationDelay: animate ? `${index * 150}ms` : '0ms',
            animation: animate ? 'layerSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            opacity: animate ? 0 : 1,
          }}
        >
          {/* Square frame */}
          <div
            className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 border-2 bg-[var(--color-surface)] shadow-[4px_4px_0px_0px_var(--color-border)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_var(--color-border)] cursor-default"
            style={{ borderColor: layer.color }}
          >
            {/* Progress fill from bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out border-t-2 border-dashed"
              style={{
                height: `${layer.progress}%`,
                backgroundColor: layer.color,
                opacity: 0.18,
                borderColor: layer.color,
              }}
            />

            {/* Gradient accent at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: layer.color }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-3 text-center">
              <span className="text-3xl sm:text-4xl mb-2">{layer.icon}</span>
              <span
                className="text-sm sm:text-base font-bold tracking-tight"
                style={{ color: layer.color }}
              >
                {layer.name}
              </span>
              {layer.isFoundation && (
                <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-[var(--color-surface)] px-2 py-0.5 uppercase tracking-widest border-2"
                  style={{ backgroundColor: layer.color, borderColor: layer.color }}
                >
                  {t('portal.foundation')}
                </span>
              )}
              {layer.progress > 0 && (
                <span className="mt-1 text-[10px] text-[var(--color-text-secondary)] font-bold tracking-wider">
                  {layer.progress}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* CSS animation keyframe */}
      <style jsx>{`
        @keyframes layerSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
