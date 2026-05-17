import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  quiz?: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  };
  answered?: boolean;
  selectedAnswer?: string;
}

interface SpaceState {
  chatHistory: ChatMessage[];
  currentCameraTarget: string;
  isAiProcessing: boolean;
  lastCameraAction: { target: string; action: string } | null;
  showInfoPanel: boolean;

  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  setCameraTarget: (target: string, action?: string) => void;
  setProcessing: (processing: boolean) => void;
  clearChat: () => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  closeInfoPanel: () => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  chatHistory: [],
  currentCameraTarget: 'Earth',
  isAiProcessing: false,
  lastCameraAction: null,
  showInfoPanel: false,

  addChatMessage: (role, content) =>
    set((state) => ({
      chatHistory: [
        ...state.chatHistory,
        {
          id: `msg_${Date.now()}`,
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),

  setCameraTarget: (target, action = 'focus') =>
    set({
      currentCameraTarget: target,
      lastCameraAction: { target, action },
      // Auto-open the info panel whenever the AI zooms to a planet
      showInfoPanel: action === 'zoom',
    }),

  setProcessing: (processing) =>
    set({ isAiProcessing: processing }),

  clearChat: () =>
    set({ chatHistory: [] }),

  closeInfoPanel: () =>
    set({ showInfoPanel: false }),
  
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) =>
    set((state) => ({
      chatHistory: state.chatHistory.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    })),
}));

export const useChatSelector = () => useSpaceStore((state) => state.chatHistory);
export const useCameraTargetSelector = () => useSpaceStore((state) => state.currentCameraTarget);
export const useProcessingSelector = () => useSpaceStore((state) => state.isAiProcessing);
export const useInfoPanelSelector = () => useSpaceStore((state) => state.showInfoPanel);