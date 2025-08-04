import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
  madhab: 'Hanafi' | 'Maliki' | 'Shafi' | 'Hanbali' | 'Mixed';
  region: string;
  currency: string;
  language: string;
  conservativeLevel: 'conservative' | 'moderate' | 'flexible';
  interests: string[];
  hasCompletedOnboarding: boolean;
}

interface PersonalizationContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  getPersonalizedContent: (content: any[]) => any[];
  getPersonalizedRecommendations: () => string[];
}

const defaultPreferences: UserPreferences = {
  madhab: 'Mixed',
  region: 'Global',
  currency: 'USD',
  language: 'English',
  conservativeLevel: 'moderate',
  interests: [],
  hasCompletedOnboarding: false
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('nisab-user-preferences');
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('nisab-user-preferences', JSON.stringify(newPreferences));
  };

  const getPersonalizedContent = (content: any[]) => {
    // Filter and sort content based on user preferences
    return content
      .filter(item => {
        // Filter by madhab if specified
        if (item.madhab && preferences.madhab !== 'Mixed') {
          return item.madhab === preferences.madhab || item.madhab === 'Universal';
        }
        
        // Filter by region
        if (item.region && preferences.region !== 'Global') {
          return item.region === preferences.region || item.region === 'Global';
        }
        
        // Filter by conservative level
        if (item.conservativeLevel) {
          const levels = ['conservative', 'moderate', 'flexible'];
          const userLevelIndex = levels.indexOf(preferences.conservativeLevel);
          const itemLevelIndex = levels.indexOf(item.conservativeLevel);
          return itemLevelIndex <= userLevelIndex;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Prioritize content matching user interests
        const aScore = preferences.interests.reduce((score, interest) => {
          return score + (a.tags?.includes(interest) ? 1 : 0);
        }, 0);
        const bScore = preferences.interests.reduce((score, interest) => {
          return score + (b.tags?.includes(interest) ? 1 : 0);
        }, 0);
        return bScore - aScore;
      });
  };

  const getPersonalizedRecommendations = () => {
    const recommendations: string[] = [];
    
    // Madhab-specific recommendations
    if (preferences.madhab === 'Hanafi') {
      recommendations.push('Learn about Hanafi-specific business partnership rulings');
      recommendations.push('Explore Hanafi perspectives on cryptocurrency');
    } else if (preferences.madhab === 'Shafi') {
      recommendations.push('Understand Shafi views on modern banking');
      recommendations.push('Study Shafi rulings on investment contracts');
    }
    
    // Interest-based recommendations
    if (preferences.interests.includes('investment')) {
      recommendations.push('Check out our halal stock screening tool');
      recommendations.push('Learn about Sukuk (Islamic bonds) investments');
    }
    
    if (preferences.interests.includes('zakat')) {
      recommendations.push('Set up annual Zakat reminders');
      recommendations.push('Learn about Zakat on cryptocurrency');
    }
    
    // Conservative level recommendations
    if (preferences.conservativeLevel === 'conservative') {
      recommendations.push('Explore traditional Islamic finance instruments');
      recommendations.push('Learn about classical fiqh principles');
    } else if (preferences.conservativeLevel === 'flexible') {
      recommendations.push('Discover modern Islamic finance innovations');
      recommendations.push('Learn about contemporary scholar opinions');
    }
    
    // Regional recommendations
    if (preferences.region.includes('Middle East')) {
      recommendations.push('Explore GCC Islamic banking options');
      recommendations.push('Learn about regional Sukuk markets');
    } else if (preferences.region.includes('Southeast Asia')) {
      recommendations.push('Understand Malaysian Islamic finance framework');
      recommendations.push('Explore takaful (Islamic insurance) options');
    }
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  };

  const value = {
    preferences,
    updatePreferences,
    getPersonalizedContent,
    getPersonalizedRecommendations
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}