'use client';

import React from 'react';
import { useSpaceStore, useProcessingSelector, useCameraTargetSelector, useChatSelector } from '@/store/spaceStore';

export default React.memo(function StatusBar() {
  const isProcessing = useProcessingSelector();
  const currentTarget = useCameraTargetSelector();
  const chatHistory = useChatSelector();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-gray-300 text-sm">
            {isProcessing ? 'Processing' : 'Agentic AI: Online'}
          </span>
        </div>
        
        <div className="text-gray-500 text-sm">
          <span className="text-gray-400">Target:</span>{' '}
          <span className="text-blue-400 font-medium">{currentTarget}</span>
        </div>
        
        <div className="text-gray-500 text-sm">
          <span className="text-gray-400">Messages:</span>{' '}
          <span className="text-gray-300">{chatHistory.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-500 text-xs">
          <span className="text-gray-400">Latency:</span>{' '}
          <span className="text-green-400">{isProcessing ? '~' : '45ms'}</span>
        </div>
        
        <div className="text-gray-500 text-xs">
          <span className="text-gray-400">v3.0</span>
        </div>
      </div>
    </div>
  );
});