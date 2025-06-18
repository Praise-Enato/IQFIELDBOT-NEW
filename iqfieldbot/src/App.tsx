import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import TestInterface from './components/TestInterface';
import { User, TestSession } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'dashboard' | 'test'>('auth');
  const [testSession, setTestSession] = useState<TestSession | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleStartTest = (field: string) => {
    const session: TestSession = {
      id: Date.now().toString(),
      userId: user?.id || '',
      field,
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentDifficulty: 'easy',
      consecutiveCorrect: 0,
      startTime: new Date(),
    };
    setTestSession(session);
    setCurrentScreen('test');
  };

  const handleEndTest = () => {
    setTestSession(null);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      {currentScreen === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onStartTest={handleStartTest}
          onLogout={() => {
            setUser(null);
            setCurrentScreen('auth');
          }}
        />
      )}
      {currentScreen === 'test' && testSession && (
        <TestInterface 
          session={testSession}
          onUpdateSession={setTestSession}
          onEndTest={handleEndTest}
        />
      )}
    </div>
  );
}

export default App;