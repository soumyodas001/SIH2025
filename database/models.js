// MongoDB Connection and Models for IndiCultura Website
// This file provides Mongoose schemas and connection setup

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/indicultura');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// State Schema
const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['state', 'union_territory', 'city'],
    default: 'state'
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Northeast', 'Central'],
    required: true
  },
  capital: String,
  languages: [String],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  cultural_items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CulturalItem'
  }]
}, {
  timestamps: true
});

// Cultural Item Schema
const culturalItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['dance', 'festival', 'craft', 'music', 'art', 'cuisine'],
    required: true
  },
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  },
  state_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  videos: [String],
  origin_period: {
    type: String,
    enum: ['Ancient', 'Medieval', 'Modern', 'Contemporary']
  },
  popularity_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  quiz_difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String]
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password_hash: {
    type: String,
    required: true
  },
  quiz_stats: {
    total_quizzes: {
      type: Number,
      default: 0
    },
    best_score: {
      type: Number,
      default: 0
    },
    average_score: {
      type: Number,
      default: 0
    },
    medals: {
      gold: {
        type: Number,
        default: 0
      },
      silver: {
        type: Number,
        default: 0
      },
      bronze: {
        type: Number,
        default: 0
      }
    }
  },
  preferences: {
    favorite_states: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State'
    }],
    difficulty_preference: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: Date
}, {
  timestamps: true
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['general', 'dance', 'festival', 'craft', 'music'],
    default: 'general'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [{
    question_text: {
      type: String,
      required: true
    },
    state_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State'
    },
    state_name: String,
    options: {
      type: [String],
      validate: [arrayLimit, '{PATH} must have exactly 4 options']
    },
    correct_answer: {
      type: String,
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  total_questions: Number,
  max_score: Number,
  time_limit: {
    type: Number,
    default: 600 // 10 minutes in seconds
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Quiz Result Schema
const quizResultSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total_questions: {
    type: Number,
    required: true
  },
  correct_answers: {
    type: Number,
    required: true
  },
  time_taken: Number, // in seconds
  answers: [{
    question_id: String,
    selected_answer: String,
    correct_answer: String,
    is_correct: Boolean,
    points_earned: Number
  }],
  medal_earned: {
    type: String,
    enum: ['gold', 'silver', 'bronze', 'none'],
    default: 'none'
  },
  completed_at: {
    type: Date,
    default: Date.now
  }
});

// User Session Schema
const userSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session_token: {
    type: String,
    required: true,
    unique: true
  },
  ip_address: String,
  user_agent: String,
  expires_at: {
    type: Date,
    required: true,
    expires: 0 // TTL index - automatically delete expired sessions
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validation functions
function arrayLimit(val) {
  return val.length === 4;
}

// Pre-save middleware to calculate derived fields
quizSchema.pre('save', function(next) {
  this.total_questions = this.questions.length;
  this.max_score = this.questions.reduce((total, q) => total + q.points, 0);
  next();
});

// Calculate medal based on score percentage
quizResultSchema.pre('save', function(next) {
  const scorePercentage = (this.score / (this.total_questions * 1)) * 100;
  
  if (scorePercentage === 100) {
    this.medal_earned = 'gold';
  } else if (scorePercentage >= 90) {
    this.medal_earned = 'silver';
  } else if (scorePercentage >= 80) {
    this.medal_earned = 'bronze';
  } else {
    this.medal_earned = 'none';
  }
  next();
});

// Create indexes
stateSchema.index({ region: 1 });
culturalItemSchema.index({ state_id: 1 });
culturalItemSchema.index({ type: 1 });
culturalItemSchema.index({ name: 'text', description: 'text' });
quizResultSchema.index({ user_id: 1, completed_at: -1 });

// Create models
const State = mongoose.model('State', stateSchema);
const CulturalItem = mongoose.model('CulturalItem', culturalItemSchema);
const User = mongoose.model('User', userSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);
const UserSession = mongoose.model('UserSession', userSessionSchema);

// Export connection function and models
export {
  connectDB,
  State,
  CulturalItem,
  User,
  Quiz,
  QuizResult,
  UserSession
};
