'use client';

import React from 'react';
import type { LayerTemplate } from '@/features/portal/stores/useLayerStore';
import { STARTER_TEMPLATE_LAYERS, CUSTOM_TEMPLATE_LAYERS } from '@/features/portal/stores/useLayerStore';
import { useTranslation } from '@/shared/lib/i18n';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: LayerTemplate | null;
  onSelect: (template: LayerTemplate) => void;
}

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation();

  const templates: { key: LayerTemplate; layers: typeof STARTER_TEMPLATE_LAYERS; badge?: string }[] = [
    {
      key: 'starter',
      layers: STARTER_TEMPLATE_LAYERS,
      badge: t('portal.recommended'),
    },
    {
      key: 'custom',
      layers: CUSTOM_TEMPLATE_LAYERS,
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-center text-lg sm:text-xl font-bold text-gray-800 mb-6">
        {t('portal.selectTemplate')}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {templates.map(({ key, layers, badge }) => {
          const isSelected = selected === key;

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`
                relative flex flex-col items-center p-4 sm:p-6 rounded-2xl border-[3px] transition-all duration-300
                cursor-pointer group
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 shadow-lg shadow-indigo-100 scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-md'
                }
              `}
            >
              {/* Badge */}
              {badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-0.5 rounded-full whitespace-nowrap">
                  {badge}
                </span>
              )}

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Mini layer preview */}
              <div className="flex flex-col-reverse items-center gap-1.5 mb-4">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ borderColor: layer.color, backgroundColor: `${layer.color}10` }}
                  >
                    <span className="text-lg sm:text-xl">{layer.icon}</span>
                  </div>
                ))}
                {/* Show "+" placeholder for custom template */}
                {key === 'custom' && (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-xl text-gray-400">+</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <h3 className={`text-sm sm:text-base font-bold ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                {key === 'starter' ? t('portal.starterKit') : t('portal.custom')}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 text-center leading-tight">
                {key === 'starter' ? t('portal.starterKitDesc') : t('portal.customDesc')}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
