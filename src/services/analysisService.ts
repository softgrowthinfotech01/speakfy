import { Feedback, PronunciationFeedback, GrammarFeedback, VocabularyFeedback } from '../types';

// Simulated AI analysis - in production, this would connect to real AI services
export class AnalysisService {
  static analyzePronunciation(transcript: string, originalText?: string): PronunciationFeedback[] {
    if (!transcript || typeof transcript !== 'string') {
      return [];
    }

    const words = transcript.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    const feedback: PronunciationFeedback[] = [];

    // Common pronunciation issues simulation
    const pronunciationRules = [
      { pattern: /th/g, difficulty: 0.7, suggestion: "Focus on tongue placement between teeth for 'th' sounds" },
      { pattern: /r/g, difficulty: 0.8, suggestion: "Curl tongue tip slightly back for clear 'r' sounds" },
      { pattern: /w/g, difficulty: 0.9, suggestion: "Round lips more prominently for 'w' sounds" },
      { pattern: /v/g, difficulty: 0.8, suggestion: "Touch lower lip with upper teeth for 'v' sounds" },
      { pattern: /l/g, difficulty: 0.85, suggestion: "Place tongue tip against roof of mouth for 'l' sounds" },
    ];

    words.forEach(word => {
      if (!word || word.length === 0) return;

      let score = 85 + Math.random() * 10; // Base score 85-95
      let suggestion = "Good pronunciation!";
      let phoneticCorrection: string | undefined;

      pronunciationRules.forEach(rule => {
        if (rule.pattern.test(word)) {
          const difficulty = rule.difficulty;
          score = Math.max(60, score - (Math.random() * 25 * (1 - difficulty)));
          if (score < 80) {
            suggestion = rule.suggestion;
            phoneticCorrection = `/${word.replace(rule.pattern, match => `[${match}]`)}/`;
          }
        }
      });

      feedback.push({
        word: word.trim(),
        score: Math.round(Math.max(0, Math.min(100, score))),
        suggestion,
        phoneticCorrection
      });
    });

    return feedback;
  }

  static analyzeGrammar(transcript: string): GrammarFeedback[] {
    if (!transcript || typeof transcript !== 'string') {
      return [];
    }

    const feedback: GrammarFeedback[] = [];
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim().toLowerCase();
      
      if (!trimmed) return;

      // Basic grammar rule checking
      if (trimmed.includes('i are') || trimmed.includes('you is') || trimmed.includes('we is')) {
        const corrected = trimmed
          .replace(/\bi are\b/g, 'I am')
          .replace(/\byou is\b/g, 'you are')
          .replace(/\bwe is\b/g, 'we are');
        
        feedback.push({
          error: "Subject-verb disagreement",
          correction: corrected,
          explanation: "Make sure the subject and verb agree in number and person",
          position: index
        });
      }

      // Article usage check
      const articlePattern = /\ba\s+[aeiou]/i;
      if (articlePattern.test(trimmed) && !/\ban\s+[aeiou]/i.test(trimmed)) {
        feedback.push({
          error: "Article usage",
          correction: trimmed.replace(/\ba\s+([aeiou])/gi, 'an $1'),
          explanation: "Use 'an' before words that start with vowel sounds",
          position: index
        });
      }

      // Redundant modifiers
      if (trimmed.includes('very unique') || trimmed.includes('more unique')) {
        feedback.push({
          error: "Redundant modifier",
          correction: trimmed.replace(/(very|more)\s+unique/g, 'unique'),
          explanation: "'Unique' is already absolute - avoid modifying it with 'very' or 'more'",
          position: index
        });
      }
    });

    return feedback;
  }

  static analyzeVocabulary(transcript: string): VocabularyFeedback[] {
    if (!transcript || typeof transcript !== 'string') {
      return [];
    }

    const feedback: VocabularyFeedback[] = [];
    const words = transcript.toLowerCase().split(/\W+/).filter(w => w.length > 3);

    // Vocabulary enhancement suggestions
    const vocabularyEnhancements: Record<string, string[]> = {
      'good': ['excellent', 'outstanding', 'remarkable', 'superb'],
      'bad': ['terrible', 'awful', 'dreadful', 'poor'],
      'big': ['enormous', 'massive', 'gigantic', 'substantial'],
      'small': ['tiny', 'minuscule', 'compact', 'petite'],
      'nice': ['pleasant', 'delightful', 'charming', 'lovely'],
      'very': ['extremely', 'incredibly', 'remarkably', 'exceptionally'],
      'said': ['stated', 'mentioned', 'declared', 'expressed'],
      'went': ['traveled', 'journeyed', 'proceeded', 'departed']
    };

    // Track processed words to avoid duplicates
    const processedWords = new Set<string>();

    words.forEach(word => {
      if (!word || processedWords.has(word)) return;
      
      const alternatives = vocabularyEnhancements[word];
      if (alternatives && alternatives.length > 0) {
        processedWords.add(word);
        feedback.push({
          word,
          alternatives,
          context: `Consider using more specific vocabulary instead of "${word}" to make your speech more engaging`
        });
      }
    });

    return feedback;
  }

  static generateOverallFeedback(pronunciationScore: number, grammarScore: number, fluencyScore: number): string {
    // Ensure scores are valid numbers
    const pronScore = Math.max(0, Math.min(100, pronunciationScore || 0));
    const gramScore = Math.max(0, Math.min(100, grammarScore || 0));
    const fluScore = Math.max(0, Math.min(100, fluencyScore || 0));
    
    const overall = (pronScore + gramScore + fluScore) / 3;
    
    if (overall >= 90) {
      return "Excellent work! Your English is very clear and natural. Your pronunciation, grammar, and fluency are all at a high level. Keep practicing to maintain this excellent standard.";
    } else if (overall >= 80) {
      return "Great job! You're communicating effectively with good clarity and structure. Focus on the specific areas highlighted for improvement to reach the next level.";
    } else if (overall >= 70) {
      return "Good progress! You're developing solid English skills. Continue practicing the suggested improvements, particularly in pronunciation and grammar, to enhance your overall fluency.";
    } else if (overall >= 60) {
      return "You're making steady progress! Focus on pronunciation fundamentals and basic grammar structures for clearer communication. Regular practice will help you improve significantly.";
    } else {
      return "Keep practicing! Focus on basic pronunciation patterns and simple sentence structures. Don't get discouraged - consistent practice will lead to noticeable improvements.";
    }
  }

  static analyzeComplete(transcript: string, originalText?: string): Feedback {
    try {
      if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
        return {
          pronunciation: [],
          grammar: [],
          vocabulary: [],
          overall: "No speech detected. Please try speaking again and ensure your microphone is working properly."
        };
      }

      const pronunciation = this.analyzePronunciation(transcript, originalText);
      const grammar = this.analyzeGrammar(transcript);
      const vocabulary = this.analyzeVocabulary(transcript);

      // Calculate scores with proper error handling
      const pronunciationScore = pronunciation.length > 0 
        ? pronunciation.reduce((sum, p) => sum + (p.score || 0), 0) / pronunciation.length
        : 85; // Default score if no pronunciation data

      const grammarScore = Math.max(50, 95 - (grammar.length * 10)); // Deduct points for errors
      
      // Fluency score based on speech length and complexity
      const wordCount = transcript.trim().split(/\s+/).length;
      const fluencyScore = Math.min(95, Math.max(60, 
        100 - (wordCount < 10 ? 20 : 0) - (wordCount > 100 ? 10 : 0)
      ));

      const overall = this.generateOverallFeedback(pronunciationScore, grammarScore, fluencyScore);

      return {
        pronunciation,
        grammar,
        vocabulary,
        overall
      };
    } catch (error) {
      console.error('Error in analysis service:', error);
      return {
        pronunciation: [],
        grammar: [],
        vocabulary: [],
        overall: "An error occurred during analysis. Please try again."
      };
    }
  }
}