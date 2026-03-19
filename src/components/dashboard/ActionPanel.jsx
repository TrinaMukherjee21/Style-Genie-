import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search, Settings, Share2, Gift } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useUserContext } from '../../context/UserContext';

const ActionPanel = () => {
  const navigate = useNavigate();
  const { resetQuiz } = useAppContext();
  const { userProfile } = useUserContext();

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/quiz');
  };

  const actions = [
    {
      label: 'Retake Quiz',
      icon: RotateCcw,
      onClick: handleRetakeQuiz,
      className: 'bg-purple-600 hover:bg-purple-700 text-white',
      description: 'Update your style profile'
    },
    {
      label: 'Browse All',
      icon: Search,
      onClick: () => {
        // Mock function - could navigate to a browse page
        console.log('Browse all recommendations');
      },
      className: 'bg-gray-700 hover:bg-gray-600 text-white',
      description: 'See all recommendations'
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/profile'),
      className: 'bg-gray-700 hover:bg-gray-600 text-white',
      description: 'Customize preferences'
    },
    {
      label: 'Share Profile',
      icon: Share2,
      onClick: () => {
        // Mock share functionality
        if (userProfile) {
          const shareText = `I'm a ${userProfile.personalityType}! Check out my StyleGenie profile with a clout score of ${userProfile.cloutScore}!`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText + ` ${window.location.origin}`);
            alert('Share link copied!');
          } else {
            alert('Share: ' + shareText);
          }
        }
      },
      className: 'bg-gray-700 hover:bg-gray-600 text-white',
      description: 'Show off your style DNA'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center space-x-3 ${action.className} hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
        <div className="flex items-center mb-3">
          <Gift className="w-6 h-6 text-yellow-400 mr-2" />
          <h3 className="text-lg font-bold text-white">Daily Challenge</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Try something outside your comfort zone today! Your AI agent found a "guilty pleasure" item that's 76% different from your usual style.
        </p>
        <button 
          onClick={() => {
            // Mock challenge acceptance
            alert('Challenge accepted! Check your inbox for a surprise recommendation.');
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
        >
          Accept Challenge
        </button>
      </div>

      {/* Style Tip */}
      <div className="bg-gradient-to-r from-[#c0a0e6]/20 border border-[#c0a0e6]/20/20 to-[#c0a0e6]/5/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
        <h4 className="text-white font-bold mb-2 text-sm">💡 Style Tip</h4>
        <p className="text-gray-300 text-xs">
          Your aesthetic twin from Tokyo just bought vintage boots. Consider exploring Japanese minimalist brands for your next find!
        </p>
      </div>
    </div>
  );
};

export default ActionPanel;