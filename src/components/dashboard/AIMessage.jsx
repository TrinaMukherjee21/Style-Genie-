import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, Sparkles } from 'lucide-react';
import { getRandomAIMessage } from '../../utils/helpers';

const AIMessage = ({ message, timestamp, type = 'recommendation' }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayedMessage, setDisplayedMessage] = useState('');

  useEffect(() => {
    if (!message) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [message]);

  const getMessageStyle = (type) => {
    switch (type) {
      case 'recommendation':
        return 'from-[#d4af37]/10 to-[#120D20] border-purple-500/30';
      case 'warning':
        return 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30';
      case 'success':
        return 'from-[#d4af37]/20 border border-[#d4af37]/20/20 to-[#d4af37]/5/20 border-green-500/30';
      case 'info':
        return 'from-[#c0a0e6]/20 border border-[#c0a0e6]/20/20 to-[#c0a0e6]/5/20 border-cyan-500/30';
      default:
        return 'from-gray-600/20 to-gray-700/20 border-gray-500/30';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'warning':
        return <MessageCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bot className="w-4 h-4 text-brand-gold opacity-50" />;
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getMessageStyle(type)} rounded-xl p-4 border backdrop-blur-sm`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-white">StyleGenie AI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full "></div>
            {timestamp && (
              <span className="text-xs text-gray-400">
                {new Date(timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <p className="text-white text-sm leading-relaxed">
            {displayedMessage}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-purple-400 ml-1 ">|</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;