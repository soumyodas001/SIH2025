// API Routes for IndiCultura MongoDB Integration
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { State, CulturalItem, User, Quiz, QuizResult } from '../database/models.js';

const router = express.Router();

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const user = new User({
      name,
      email,
      password_hash
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Update last login
    user.last_login = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        quiz_stats: user.quiz_stats
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// States Routes
router.get('/states', async (req, res) => {
  try {
    const { region, populate } = req.query;
    
    let query = State.find();
    
    if (region) {
      query = query.where('region').equals(region);
    }
    
    if (populate === 'true') {
      query = query.populate('cultural_items');
    }
    
    const states = await query.sort('name');
    
    res.json({
      success: true,
      count: states.length,
      data: states
    });
    
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

router.get('/states/:id', async (req, res) => {
  try {
    const state = await State.findById(req.params.id).populate('cultural_items');
    
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }
    
    res.json({
      success: true,
      data: state
    });
    
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: 'Failed to fetch state' });
  }
});

// Cultural Items Routes
router.get('/cultural-items', async (req, res) => {
  try {
    const { type, state, search, limit = 50 } = req.query;
    
    let query = CulturalItem.find();
    
    if (type) {
      query = query.where('type').equals(type);
    }
    
    if (state) {
      query = query.where('state_name').equals(state);
    }
    
    if (search) {
      query = query.where({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }
    
    const culturalItems = await query
      .limit(parseInt(limit))
      .sort({ popularity_score: -1, name: 1 });
    
    res.json({
      success: true,
      count: culturalItems.length,
      data: culturalItems
    });
    
  } catch (error) {
    console.error('Error fetching cultural items:', error);
    res.status(500).json({ error: 'Failed to fetch cultural items' });
  }
});

// Quiz Routes
router.get('/quizzes', async (req, res) => {
  try {
    const { difficulty, category, active = true } = req.query;
    
    let query = Quiz.find({ is_active: active === 'true' });
    
    if (difficulty) {
      query = query.where('difficulty').equals(difficulty);
    }
    
    if (category) {
      query = query.where('category').equals(category);
    }
    
    const quizzes = await query
      .select('-questions') // Don't include questions in list view
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
    
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Shuffle questions and options for this session
    const shuffledQuestions = quiz.questions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10) // Take only 10 questions
      .map(question => ({
        ...question.toObject(),
        options: question.options.sort(() => Math.random() - 0.5)
      }));
    
    res.json({
      success: true,
      data: {
        ...quiz.toObject(),
        questions: shuffledQuestions
      }
    });
    
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

router.post('/quizzes/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, time_taken } = req.body;
    const quizId = req.params.id;
    const userId = req.user.userId;
    
    // Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    let score = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      const question = quiz.questions.find(q => q._id.toString() === answer.question_id);
      if (question) {
        const isCorrect = question.correct_answer === answer.selected_answer;
        if (isCorrect) {
          correctAnswers++;
          score += question.points;
        }
        
        processedAnswers.push({
          question_id: answer.question_id,
          selected_answer: answer.selected_answer,
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          points_earned: isCorrect ? question.points : 0
        });
      }
    }
    
    // Save quiz result
    const quizResult = new QuizResult({
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: answers.length,
      correct_answers: correctAnswers,
      time_taken,
      answers: processedAnswers
    });
    
    await quizResult.save();
    
    // Update user quiz statistics
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'quiz_stats.total_quizzes': 1,
        [`quiz_stats.medals.${quizResult.medal_earned}`]: quizResult.medal_earned !== 'none' ? 1 : 0
      },
      $max: { 'quiz_stats.best_score': score }
    });
    
    // Calculate new average score
    const userResults = await QuizResult.find({ user_id: userId });
    const averageScore = userResults.reduce((sum, result) => sum + result.score, 0) / userResults.length;
    
    await User.findByIdAndUpdate(userId, {
      'quiz_stats.average_score': Math.round(averageScore * 100) / 100
    });
    
    res.json({
      success: true,
      data: {
        score,
        total_questions: answers.length,
        correct_answers: correctAnswers,
        percentage: Math.round((correctAnswers / answers.length) * 100),
        medal: quizResult.medal_earned,
        time_taken
      }
    });
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// User Profile Routes
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password_hash')
      .populate('preferences.favorite_states');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get recent quiz results
    const recentResults = await QuizResult.find({ user_id: user._id })
      .populate('quiz_id', 'title difficulty')
      .sort({ completed_at: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        user,
        recent_results: recentResults
      }
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Statistics Routes
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Promise.all([
      State.countDocuments(),
      CulturalItem.countDocuments(),
      User.countDocuments(),
      Quiz.countDocuments({ is_active: true }),
      QuizResult.countDocuments()
    ]);
    
    const [stateCount, culturalItemCount, userCount, activeQuizCount, quizResultCount] = stats;
    
    res.json({
      success: true,
      data: {
        states: stateCount,
        cultural_items: culturalItemCount,
        users: userCount,
        active_quizzes: activeQuizCount,
        quiz_attempts: quizResultCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Quiz Routes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ is_active: true });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch quizzes' });
  }
});

router.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch quiz' });
  }
});

router.post('/quizzes/:id/submit', async (req, res) => {
  try {
    const { answers, score, medal_earned, time_taken } = req.body;
    const quiz_id = req.params.id;
    const user_id = req.user ? req.user.id : null;

    const result = new QuizResult({
      quiz_id,
      user_id,
      answers,
      score,
      medal_earned,
      time_taken
    });

    await result.save();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to submit quiz results' });
  }
});

export default router;
