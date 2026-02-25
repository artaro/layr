import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Layer {
    id: string;
    name: string;
    icon: string;
    color: string;
    progress: number; // 0–100
    order: number;    // stack position (0 = foundation/bottom)
    isFoundation: boolean;
}

// ─── Preset Layers ────────────────────────────────────────────────────────────

export const PRESET_LAYERS: Record<string, Omit<Layer, 'progress'>> = {
    financial: {
        id: 'financial',
        name: 'Financial',
        icon: '💰',
        color: '#6C5CE7',
        order: 0,
        isFoundation: true,
    },
    skill: {
        id: 'skill',
        name: 'Skills & Learning',
        icon: '📚',
        color: '#F59E0B',
        order: 1,
        isFoundation: false,
    },
    health: {
        id: 'health',
        name: 'Health',
        icon: '💪',
        color: '#10B981',
        order: 2,
        isFoundation: false,
    },
};

export const DEFAULT_LAYERS: Layer[] = [
    { ...PRESET_LAYERS.financial, progress: 0 },
    { ...PRESET_LAYERS.skill, progress: 0 },
    { ...PRESET_LAYERS.health, progress: 0 },
];

// ─── State ────────────────────────────────────────────────────────────────────

interface LayerState {
    layers: Layer[];
    hasCompletedSetup: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface LayerActions {
    initLayers: () => void;
    updateProgress: (id: string, progress: number) => void;
    completeSetup: () => void;
    resetLayers: () => void;
}

type LayerStore = LayerState & LayerActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLayerStore = create<LayerStore>()(
    persist(
        (set) => ({
            layers: [],
            hasCompletedSetup: false,

            initLayers: () => {
                set({ layers: [...DEFAULT_LAYERS] });
            },

            updateProgress: (id, progress) =>
                set((state) => ({
                    layers: state.layers.map((l) =>
                        l.id === id ? { ...l, progress: Math.min(100, Math.max(0, progress)) } : l
                    ),
                })),

            completeSetup: () => set({ hasCompletedSetup: true }),

            resetLayers: () =>
                set({
                    layers: [],
                    hasCompletedSetup: false,
                }),
        }),
        { name: 'layr-layers' }
    )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const useLayers = () => useLayerStore((s) => s.layers);
export const useHasCompletedSetup = () => useLayerStore((s) => s.hasCompletedSetup);
