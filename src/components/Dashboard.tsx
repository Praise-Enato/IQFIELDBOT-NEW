import React, { useState } from 'react';
import { 
  Brain, 
  Calculator, 
  Code, 
  Languages, 
  Lightbulb, 
  Atom, 
  Globe,
  Trophy,
  Target,
  TrendingUp,
  User,
  LogOut
} from 'lucide-react';
import { User as UserType } from '../types';

interface DashboardProps {
  user: UserType;
  onStartTest: (field: string) => void;
  onLogout: () => void;
}

const fields = [
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500', description: 'Algebra, geometry, calculus problems' },
  { id: 'logic', name: 'Logic & Reasoning', icon: Lightbulb, color: 'bg-yellow-500', description: 'Pattern recognition, logical puzzles' },
  { id: 'programming', name: 'Programming', icon: Code, color: 'bg-green-500', description: 'Algorithms, data structures, coding' },
  { id: 'language', name: 'Language Arts', icon: Languages, color: 'bg-purple-500', description: 'Grammar, vocabulary, comprehension' },
  { id: 'science', name: 'Science', icon: Atom, color: 'bg-red-500', description: 'Physics, chemistry, biology concepts' },
  { id: 'general', name: 'General Knowledge', icon: Globe, color: 'bg-indigo-500', description: 'History, geography, current affairs' },
];

const Dashboard: React.FC<DashboardProps> = ({ user, onStartTest, onLogout }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full shadow-glow">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h1>
              <p className="text-white/80">Ready to challenge your mind?</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="glass-effect rounded-lg p-3 text-white">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Score</p>
                <p className="text-3xl font-bold">{user.totalScore}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tests Completed</p>
                <p className="text-3xl font-bold">{user.testsCompleted}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">
                  {user.testsCompleted > 0 ? Math.round(user.totalScore / user.testsCompleted) : 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Field Selection */}
        <div className="glass-effect rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Your Field</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.id}
                  className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    selectedField === field.id ? 'ring-4 ring-white/50 scale-105' : ''
                  }`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className={`${field.color} p-3 rounded-lg mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{field.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{field.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">60 questions available</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${field.color} text-white`}>
                      Ready
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedField && (
            <div className="mt-8 text-center animate-slide-up">
              <button
                onClick={() => onStartTest(selectedField)}
                className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all transform hover:scale-105 shadow-glow"
              >
                Start IQ Test - {fields.find(f => f.id === selectedField)?.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;