// Profile generator for quiz results
export const generateProfile = (quizResults) => {
  // Default return for any invalid input
  const defaultProfile = {
    personalityType: 'Style Enthusiast',
    primaryAesthetic: 'minimalist',
    secondaryAesthetics: [],
    aesthetics: { minimalist: 1 },
    confidence: 0.85,
    cloutScore: 850,
    styleStreak: 15
  };
  
  // Safety check for undefined quizResults
  if (!quizResults || !Array.isArray(quizResults) || quizResults.length === 0) {
    return defaultProfile;
  }
  
  const aestheticScores = {};
  
  // Calculate aesthetic scores from quiz results with maximum safety
  try {
    quizResults.forEach(result => {
      if (!result || typeof result !== 'object') return;
      
      const selectedOption = result.selectedOption;
      if (!selectedOption) return;
      
      // Handle both array and single object cases
      const options = Array.isArray(selectedOption) ? selectedOption : [selectedOption];
      
      options.forEach(option => {
        if (option && typeof option === 'object' && option.aesthetic) {
          if (!aestheticScores[option.aesthetic]) {
            aestheticScores[option.aesthetic] = 0;
          }
          aestheticScores[option.aesthetic] += option.weight || 1;
        }
      });
    });
  } catch (error) {
    console.error('Error processing quiz results:', error);
    return defaultProfile;
  }
  
  // If no valid aesthetics found, return default
  if (Object.keys(aestheticScores).length === 0) {
    return defaultProfile;
  }
  
  // Find dominant aesthetic
  const sortedAesthetics = Object.entries(aestheticScores)
    .sort(([,a], [,b]) => b - a);
  
  const primaryAesthetic = sortedAesthetics[0]?.[0] || 'minimalist';
  const secondaryAesthetics = sortedAesthetics.slice(1, 3).map(([aesthetic]) => aesthetic);
  
  // Generate personality type based on aesthetic combination
  const personalityTypes = {
    minimalist: 'Clean & Conscious',
    vintage: 'Nostalgic Curator', 
    streetwear: 'Urban Explorer',
    boho: 'Free Spirit',
    preppy: 'Classic Sophisticate',
    gothic: 'Dark Romantic'
  };
  
  return {
    personalityType: personalityTypes[primaryAesthetic] || 'Style Enthusiast',
    primaryAesthetic,
    secondaryAesthetics,
    aesthetics: aestheticScores,
    confidence: 0.85,
    cloutScore: Math.floor(Math.random() * 200) + 800,
    styleStreak: Math.floor(Math.random() * 30) + 1
  };
};