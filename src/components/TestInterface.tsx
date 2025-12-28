import React, { useState, useEffect } from 'react';
import { Clock, Brain, Trophy, ArrowRight, CheckCircle, XCircle, Home } from 'lucide-react';
import { TestSession, Question } from '../types';
import { getQuestion, submitAnswer } from '../services/api';

interface TestInterfaceProps {
  session: TestSession;
  onUpdateSession: (session: TestSession) => void;
  onEndTest: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ session, onUpdateSession, onEndTest }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNextQuestion();
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadNextQuestion = async () => {
    setLoading(true);
    try {
      console.log('Loading question for:', session.field, session.currentDifficulty);
      const question = await getQuestion(session.field, session.currentDifficulty);
      console.log('Loaded question:', question);
      setCurrentQuestion(question);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
      setCorrectAnswer('');
      setExplanation('');
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      console.log('Submitting answer:', userAnswer, 'for question:', currentQuestion.id);
      const result = await submitAnswer(currentQuestion.id, userAnswer);
      console.log('Answer result:', result);
      
      setIsCorrect(result.isCorrect);
      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation || '');
      setShowResult(true);

      // Update session
      const updatedSession = {
        ...session,
        questionsAnswered: session.questionsAnswered + 1,
        correctAnswers: result.isCorrect ? session.correctAnswers + 1 : session.correctAnswers,
        consecutiveCorrect: result.isCorrect ? session.consecutiveCorrect + 1 : 0,
        score: session.score + (result.isCorrect ? getDifficultyPoints(session.currentDifficulty) : 0),
      };

      // Check if difficulty should increase
      if (result.isCorrect && updatedSession.consecutiveCorrect >= 2) {
        if (session.currentDifficulty === 'easy') {
          updatedSession.currentDifficulty = 'medium';
        } else if (session.currentDifficulty === 'medium') {
          updatedSession.currentDifficulty = 'hard';
        }
        updatedSession.consecutiveCorrect = 0;
      }

      onUpdateSession(updatedSession);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (session.questionsAnswered >= 10) {
      onEndTest();
    } else {
      loadNextQuestion();
    }
  };

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Failed to load question</p>
          <button
            onClick={onEndTest}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white capitalize">{session.field} Test</h1>
                <p className="text-white/80">Question {session.questionsAnswered + 1} of 10</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{session.score}</span>
              </div>
              <button
                onClick={onEndTest}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
                title="Return to Dashboard"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-white/80 text-sm mb-2">
              <span>Progress</span>
              <span>{session.questionsAnswered}/10</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(session.questionsAnswered / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="glass-effect rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getDifficultyColor(session.currentDifficulty)}`}>
              {session.currentDifficulty.toUpperCase()}
            </div>
            <div className="text-white/60 text-sm">
              {session.correctAnswers}/{session.questionsAnswered} correct
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-8">{currentQuestion.question}</h2>

          {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswer === option
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/30 text-white/80 hover:border-white/50 hover:bg-white/5'
                  }`}
                  disabled={showResult}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-8">
              <input
                type={currentQuestion.type === 'number' ? 'number' : 'text'}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="w-full p-4 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                disabled={showResult}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !showResult && userAnswer.trim()) {
                    handleSubmitAnswer();
                  }
                }}
              />
            </div>
          )}

          {showResult && (
            <div className={`p-6 rounded-lg mb-6 ${isCorrect ? 'bg-green-500/20 border-2 border-green-500/50' : 'bg-red-500/20 border-2 border-red-500/50'}`}>
              <div className="flex items-center mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 mr-3" />
                )}
                <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                <span className="ml-auto text-white/80">
                  +{isCorrect ? getDifficultyPoints(session.currentDifficulty) : 0} points
                </span>
              </div>
              {!isCorrect && (
                <p className="text-white/90 mb-2">
                  <strong>Correct answer:</strong> {correctAnswer}
                </p>
              )}
              {explanation && (
                <p className="text-white/80 text-sm">
                  <strong>Explanation:</strong> {explanation}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={onEndTest}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              End Test
            </button>
            
            {showResult ? (
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-white/90 transition-all"
              >
                <span>{session.questionsAnswered >= 10 ? 'Finish Test' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isSubmitting}
                className="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;