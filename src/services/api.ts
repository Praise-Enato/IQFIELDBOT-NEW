import { Question, User } from '../types';

// Configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_SECRET = 'demo-secret-key'; // This should match your backend

// Mock question database for offline functionality
const questionBank: Record<string, Question[]> = {
  math: [
    // Easy
    { id: 'math_easy_1', field: 'math', difficulty: 'easy', question: 'What is 15 + 27?', type: 'number', correctAnswer: '42', explanation: 'Simple addition: 15 + 27 = 42' },
    { id: 'math_easy_2', field: 'math', difficulty: 'easy', question: 'What is 8 × 7?', type: 'number', correctAnswer: '56', explanation: 'Multiplication: 8 × 7 = 56' },
    { id: 'math_easy_3', field: 'math', difficulty: 'easy', question: 'What is 100 - 37?', type: 'number', correctAnswer: '63', explanation: 'Subtraction: 100 - 37 = 63' },
    { id: 'math_easy_4', field: 'math', difficulty: 'easy', question: 'What is 12 ÷ 3?', type: 'number', correctAnswer: '4', explanation: 'Division: 12 ÷ 3 = 4' },
    { id: 'math_easy_5', field: 'math', difficulty: 'easy', question: 'What is 9 + 16?', type: 'number', correctAnswer: '25', explanation: 'Addition: 9 + 16 = 25' },
    // Medium
    { id: 'math_medium_1', field: 'math', difficulty: 'medium', question: 'Solve for x: 3x + 7 = 22', type: 'number', correctAnswer: '5', explanation: '3x = 22 - 7 = 15, so x = 15 ÷ 3 = 5' },
    { id: 'math_medium_2', field: 'math', difficulty: 'medium', question: 'What is the square root of 144?', type: 'number', correctAnswer: '12', explanation: '√144 = 12 because 12² = 144' },
    { id: 'math_medium_3', field: 'math', difficulty: 'medium', question: 'What is 15% of 200?', type: 'number', correctAnswer: '30', explanation: '15% of 200 = 0.15 × 200 = 30' },
    // Hard
    { id: 'math_hard_1', field: 'math', difficulty: 'hard', question: 'If f(x) = 2x² - 3x + 1, what is f(3)?', type: 'number', correctAnswer: '10', explanation: 'f(3) = 2(3)² - 3(3) + 1 = 18 - 9 + 1 = 10' },
    { id: 'math_hard_2', field: 'math', difficulty: 'hard', question: 'Solve: 2x² - 8x + 6 = 0', type: 'number', correctAnswer: '3', explanation: 'Using quadratic formula or factoring: x = 1 or x = 3' },
  ],
  logic: [
    // Easy
    { id: 'logic_easy_1', field: 'logic', difficulty: 'easy', question: 'Complete the sequence: 2, 4, 6, 8, ?', type: 'number', correctAnswer: '10', explanation: 'Even numbers sequence: +2 each time' },
    { id: 'logic_easy_2', field: 'logic', difficulty: 'easy', question: 'If all cats are animals and all animals need food, then all cats need food. True or False?', type: 'multiple_choice', options: ['True', 'False'], correctAnswer: 'True', explanation: 'This is a valid logical syllogism' },
    { id: 'logic_easy_3', field: 'logic', difficulty: 'easy', question: 'What comes next: A, B, C, D, ?', type: 'multiple_choice', options: ['E', 'F', 'G', 'H'], correctAnswer: 'E', explanation: 'Alphabetical sequence' },
    // Medium
    { id: 'logic_medium_1', field: 'logic', difficulty: 'medium', question: 'What comes next in the pattern: 1, 4, 9, 16, ?', type: 'number', correctAnswer: '25', explanation: 'Perfect squares: 1², 2², 3², 4², 5² = 25' },
    { id: 'logic_medium_2', field: 'logic', difficulty: 'medium', question: 'If some birds can fly and all eagles are birds, can all eagles fly?', type: 'multiple_choice', options: ['Yes', 'No', 'Cannot be determined'], correctAnswer: 'Cannot be determined', explanation: 'We only know some birds can fly, not all' },
    // Hard
    { id: 'logic_hard_1', field: 'logic', difficulty: 'hard', question: 'In a group of 100 people, 70 like coffee, 60 like tea. What is the minimum number who like both?', type: 'number', correctAnswer: '30', explanation: '70 + 60 - 100 = 30 minimum overlap' },
  ],
  programming: [
    // Easy
    { id: 'prog_easy_1', field: 'programming', difficulty: 'easy', question: 'What does "HTML" stand for?', type: 'multiple_choice', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], correctAnswer: 'HyperText Markup Language', explanation: 'HTML is the standard markup language for web pages' },
    { id: 'prog_easy_2', field: 'programming', difficulty: 'easy', question: 'Which symbol is used for comments in Python?', type: 'multiple_choice', options: ['#', '//', '/*'], correctAnswer: '#', explanation: 'Python uses # for single-line comments' },
    // Medium
    { id: 'prog_medium_1', field: 'programming', difficulty: 'medium', question: 'What is the time complexity of binary search?', type: 'multiple_choice', options: ['O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(log n)', explanation: 'Binary search divides the search space in half each time' },
    // Hard
    { id: 'prog_hard_1', field: 'programming', difficulty: 'hard', question: 'What design pattern ensures a class has only one instance?', type: 'multiple_choice', options: ['Factory', 'Singleton', 'Observer'], correctAnswer: 'Singleton', explanation: 'Singleton pattern restricts instantiation to one object' },
  ],
  language: [
    // Easy
    { id: 'lang_easy_1', field: 'language', difficulty: 'easy', question: 'What is the plural of "child"?', type: 'text', correctAnswer: 'children', explanation: 'Irregular plural form' },
    { id: 'lang_easy_2', field: 'language', difficulty: 'easy', question: 'Which word is a synonym for "happy"?', type: 'multiple_choice', options: ['Sad', 'Joyful', 'Angry'], correctAnswer: 'Joyful', explanation: 'Joyful means the same as happy' },
    // Medium
    { id: 'lang_medium_1', field: 'language', difficulty: 'medium', question: 'What is the past tense of "run"?', type: 'text', correctAnswer: 'ran', explanation: 'Irregular verb conjugation' },
    // Hard
    { id: 'lang_hard_1', field: 'language', difficulty: 'hard', question: 'What literary device is used in "The wind whispered through the trees"?', type: 'multiple_choice', options: ['Metaphor', 'Personification', 'Simile'], correctAnswer: 'Personification', explanation: 'Giving human qualities to non-human things' },
  ],
  science: [
    // Easy
    { id: 'sci_easy_1', field: 'science', difficulty: 'easy', question: 'What is the chemical symbol for water?', type: 'text', correctAnswer: 'H2O', explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom' },
    { id: 'sci_easy_2', field: 'science', difficulty: 'easy', question: 'How many planets are in our solar system?', type: 'number', correctAnswer: '8', explanation: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune' },
    // Medium
    { id: 'sci_medium_1', field: 'science', difficulty: 'medium', question: 'What is the speed of light in vacuum?', type: 'multiple_choice', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s'], correctAnswer: '300,000 km/s', explanation: 'Approximately 299,792,458 meters per second' },
    // Hard
    { id: 'sci_hard_1', field: 'science', difficulty: 'hard', question: 'What is the name of the process by which plants make food?', type: 'text', correctAnswer: 'photosynthesis', explanation: 'Plants convert sunlight, CO2, and water into glucose and oxygen' },
  ],
  general: [
    // Easy
    { id: 'gen_easy_1', field: 'general', difficulty: 'easy', question: 'What is the capital of France?', type: 'text', correctAnswer: 'Paris', explanation: 'Paris is the capital and largest city of France' },
    { id: 'gen_easy_2', field: 'general', difficulty: 'easy', question: 'How many continents are there?', type: 'number', correctAnswer: '7', explanation: 'Africa, Antarctica, Asia, Europe, North America, Australia, South America' },
    // Medium
    { id: 'gen_medium_1', field: 'general', difficulty: 'medium', question: 'Who painted the Mona Lisa?', type: 'text', correctAnswer: 'Leonardo da Vinci', explanation: 'Famous Renaissance artist and inventor' },
    // Hard
    { id: 'gen_hard_1', field: 'general', difficulty: 'hard', question: 'What year did World War II end?', type: 'number', correctAnswer: '1945', explanation: 'WWII ended in 1945 with the surrender of Japan' },
  ],
};

// API functions
export const registerUser = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Using mock registration due to API error:', error);
    // Mock registration for demo
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      preferredFields: [],
      totalScore: 0,
      testsCompleted: 0,
    };
    return { user, token: 'demo-token' };
  }
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Using mock login due to API error:', error);
    // Mock login for demo
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      preferredFields: [],
      totalScore: Math.floor(Math.random() * 500),
      testsCompleted: Math.floor(Math.random() * 10),
    };
    return { user, token: 'demo-token' };
  }
};

export const getQuestion = async (field: string, difficulty: string): Promise<Question> => {
  try {
    const response = await fetch(`${API_BASE}/api/questions/${field}/${difficulty}`, {
      headers: {
        'Authorization': `Bearer ${API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch question');
    }

    const question = await response.json();
    return question;
  } catch (error) {
    console.log('Using mock question due to API error:', error);
    // Use mock questions
    const fieldQuestions = questionBank[field] || questionBank['math'];
    const difficultyQuestions = fieldQuestions.filter(q => q.difficulty === difficulty);
    
    if (difficultyQuestions.length === 0) {
      // Return a generated question if no templates available
      return generateMockQuestion(field, difficulty);
    }
    
    // Return random question from template
    const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
    return difficultyQuestions[randomIndex];
  }
};

export const submitAnswer = async (questionId: string, answer: string): Promise<{ isCorrect: boolean; correctAnswer: string; explanation?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/questions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify({ question_id: questionId, answer }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log('Using mock answer evaluation due to API error:', error);
    // Find question and check answer locally
    const allQuestions = Object.values(questionBank).flat();
    const question = allQuestions.find(q => q.id === questionId);
    
    if (!question) {
      return {
        isCorrect: false,
        correctAnswer: 'Unknown',
        explanation: 'Question not found',
      };
    }
    
    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = question.correctAnswer.toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer;
    
    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }
};

const generateMockQuestion = (field: string, difficulty: string): Question => {
  const templates = {
    math: {
      easy: () => {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        return {
          question: `What is ${a} + ${b}?`,
          correctAnswer: (a + b).toString(),
          explanation: `${a} + ${b} = ${a + b}`,
        };
      },
      medium: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const c = a * Math.floor(Math.random() * 10) + b;
        return {
          question: `Solve for x: ${a}x + ${b} = ${c}`,
          correctAnswer: ((c - b) / a).toString(),
          explanation: `${a}x = ${c} - ${b} = ${c - b}, so x = ${(c - b) / a}`,
        };
      },
      hard: () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const x = Math.floor(Math.random() * 5) + 1;
        const result = a * x * x + b * x + c;
        return {
          question: `If f(x) = ${a}x² + ${b}x + ${c}, what is f(${x})?`,
          correctAnswer: result.toString(),
          explanation: `f(${x}) = ${a}(${x})² + ${b}(${x}) + ${c} = ${result}`,
        };
      },
    },
  };

  const template = templates[field as keyof typeof templates]?.[difficulty as keyof typeof templates.math] || templates.math.easy;
  const generated = template();

  return {
    id: `generated_${Date.now()}_${Math.random()}`,
    field,
    difficulty: difficulty as 'easy' | 'medium' | 'hard',
    question: generated.question,
    type: 'number',
    correctAnswer: generated.correctAnswer,
    explanation: generated.explanation,
  };
};