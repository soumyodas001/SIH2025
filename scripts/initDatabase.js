// Database Initialization Script for IndiCultura
// Run with: node scripts/initDatabase.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB, State, CulturalItem, User, Quiz } from '../database/models.js';

// Sample data based on the existing quiz.js file
const STATE_CULTURAL_DATA = {
  "Kerala": "Kathakali", "Tamil Nadu": "Bharatanatyam", "Andhra Pradesh": "Kuchipudi", 
  "Odisha": "Odissi", "Uttar Pradesh": "Kathak", "Manipur": "Manipuri", "Assam": "Bihu", 
  "Punjab": "Bhangra", "Gujarat": "Garba", "Rajasthan": "Ghoomar", "Maharashtra": "Lavani", 
  "Karnataka": "Yakshagana", "West Bengal": "Durga Puja", "Goa": "Fugdi", "Bihar": "Chhath Puja", 
  "Jharkhand": "Jhumar", "Chhattisgarh": "Panthi", "Himachal Pradesh": "Kinnauri Nati", 
  "Mizoram": "Cheraw", "Nagaland": "Hornbill Festival", "Meghalaya": "Shad Suk Mynsiem", 
  "Tripura": "Hojagiri", "Sikkim": "Losar Festival", "Arunachal Pradesh": "Losar (Tawang)", 
  "Delhi": "Qutub Festival", "Haryana": "Phag Dance", "Madhya Pradesh": "Khajuraho Dance Festival", 
  "Telangana": "Bonalu", "Ladakh": "Hemis Festival", "Jammu & Kashmir": "Rouf Dance"
};

// Region mapping for states
const REGION_MAPPING = {
  "Kerala": "South", "Tamil Nadu": "South", "Andhra Pradesh": "South", "Karnataka": "South", "Telangana": "South",
  "Maharashtra": "West", "Gujarat": "West", "Goa": "West", "Rajasthan": "West",
  "Uttar Pradesh": "North", "Delhi": "North", "Haryana": "North", "Punjab": "North", "Himachal Pradesh": "North",
  "West Bengal": "East", "Odisha": "East", "Bihar": "East", "Jharkhand": "East", "Chhattisgarh": "East",
  "Assam": "Northeast", "Manipur": "Northeast", "Mizoram": "Northeast", "Nagaland": "Northeast", 
  "Meghalaya": "Northeast", "Tripura": "Northeast", "Sikkim": "Northeast", "Arunachal Pradesh": "Northeast",
  "Madhya Pradesh": "Central", "Ladakh": "North", "Jammu & Kashmir": "North"
};

// Capital mapping for states
const CAPITAL_MAPPING = {
  "Kerala": "Thiruvananthapuram", "Tamil Nadu": "Chennai", "Andhra Pradesh": "Amaravati",
  "Karnataka": "Bengaluru", "Telangana": "Hyderabad", "Maharashtra": "Mumbai", "Gujarat": "Gandhinagar",
  "Goa": "Panaji", "Rajasthan": "Jaipur", "Uttar Pradesh": "Lucknow", "Delhi": "New Delhi",
  "Haryana": "Chandigarh", "Punjab": "Chandigarh", "Himachal Pradesh": "Shimla",
  "West Bengal": "Kolkata", "Odisha": "Bhubaneswar", "Bihar": "Patna", "Jharkhand": "Ranchi",
  "Chhattisgarh": "Raipur", "Assam": "Dispur", "Manipur": "Imphal", "Mizoram": "Aizawl",
  "Nagaland": "Kohima", "Meghalaya": "Shillong", "Tripura": "Agartala", "Sikkim": "Gangtok",
  "Arunachal Pradesh": "Itanagar", "Madhya Pradesh": "Bhopal", "Ladakh": "Leh",
  "Jammu & Kashmir": "Srinagar"
};

// Initialize database with sample data
async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await State.deleteMany({});
    await CulturalItem.deleteMany({});
    await User.deleteMany({});
    await Quiz.deleteMany({});
    
    console.log('📍 Creating states and cultural items...');
    
    const stateIds = new Map();
    const culturalItemIds = new Map();
    
    // Create states and cultural items
    for (const [stateName, culturalName] of Object.entries(STATE_CULTURAL_DATA)) {
      // Determine cultural item type
      const culturalType = ['puja', 'festival', 'mela', 'utsav', 'pooram', 'carnival'].some(word => 
        culturalName.toLowerCase().includes(word)) ? 'festival' : 'dance';
      
      // Create state
      const state = new State({
        name: stateName,
        type: ['Delhi', 'Ladakh'].includes(stateName) ? 'union_territory' : 'state',
        region: REGION_MAPPING[stateName] || 'Other',
        capital: CAPITAL_MAPPING[stateName],
        languages: getLanguagesForState(stateName)
      });
      
      const savedState = await state.save();
      stateIds.set(stateName, savedState._id);
      
      // Create cultural item
      const culturalItem = new CulturalItem({
        name: culturalName,
        type: culturalType,
        state_id: savedState._id,
        state_name: stateName,
        description: `${culturalName} is a traditional ${culturalType} from ${stateName}, representing the rich cultural heritage of the region.`,
        popularity_score: Math.floor(Math.random() * 25) + 75, // 75-99
        quiz_difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        tags: ['traditional', 'cultural', culturalType, stateName.toLowerCase().replace(/\s+/g, '-')]
      });
      
      const savedCulturalItem = await culturalItem.save();
      culturalItemIds.set(culturalName, savedCulturalItem._id);
      
      // Update state with cultural item reference
      await State.findByIdAndUpdate(savedState._id, {
        $push: { cultural_items: savedCulturalItem._id }
      });
    }
    
    console.log('👥 Creating sample users...');
    
    // Create sample users
    const sampleUsers = [
      {
        name: 'Demo User',
        email: 'demo@indicultura.com',
        password: 'demo123'
      },
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: 'student123'
      },
      {
        name: 'Admin User',
        email: 'admin@indicultura.com',
        password: 'admin123'
      }
    ];
    
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.email} (password: ${userData.password})`);
    }
    
    console.log('🧩 Creating sample quiz...');
    
    // Create a sample quiz using the cultural data
    const quizQuestions = [];
    const states = Object.keys(STATE_CULTURAL_DATA);
    const selectedStates = states.sort(() => Math.random() - 0.5).slice(0, 10);
    
    for (const stateName of selectedStates) {
      const correctAnswer = STATE_CULTURAL_DATA[stateName];
      const otherStates = states.filter(s => s !== stateName);
      const wrongAnswers = otherStates
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => STATE_CULTURAL_DATA[s]);
      
      const options = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
      
      quizQuestions.push({
        question_text: `What is the famous cultural dance/festival associated with ${stateName}?`,
        state_id: stateIds.get(stateName),
        state_name: stateName,
        options: options,
        correct_answer: correctAnswer,
        explanation: `${correctAnswer} is the traditional cultural element from ${stateName}.`,
        points: 1
      });
    }
    
    const sampleQuiz = new Quiz({
      title: 'Indian Cultural Heritage Quiz',
      description: 'Test your knowledge of Indian cultural dances and festivals',
      category: 'general',
      difficulty: 'medium',
      questions: quizQuestions,
      created_by: createdUsers[2]._id, // Admin user
      time_limit: 600 // 10 minutes
    });
    
    await sampleQuiz.save();
    
    // Create indexes
    console.log('📊 Creating database indexes...');
    await createIndexes();
    
    console.log('✨ Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- States created: ${Object.keys(STATE_CULTURAL_DATA).length}`);
    console.log(`- Cultural items created: ${Object.keys(STATE_CULTURAL_DATA).length}`);
    console.log(`- Users created: ${sampleUsers.length}`);
    console.log(`- Quiz questions created: ${quizQuestions.length}`);
    console.log('\n🔐 Login credentials:');
    sampleUsers.forEach(user => {
      console.log(`- ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Helper function to get languages for a state
function getLanguagesForState(stateName) {
  const languageMapping = {
    "Kerala": ["Malayalam", "English"],
    "Tamil Nadu": ["Tamil", "English"],
    "Andhra Pradesh": ["Telugu", "English"],
    "Karnataka": ["Kannada", "English"],
    "Maharashtra": ["Marathi", "Hindi", "English"],
    "Gujarat": ["Gujarati", "Hindi", "English"],
    "West Bengal": ["Bengali", "Hindi", "English"],
    "Punjab": ["Punjabi", "Hindi", "English"],
    "Rajasthan": ["Hindi", "Rajasthani", "English"],
    "Uttar Pradesh": ["Hindi", "Urdu", "English"],
    "Bihar": ["Hindi", "Bhojpuri", "English"],
    "Assam": ["Assamese", "Bengali", "English"],
    "Odisha": ["Odia", "Hindi", "English"]
  };
  
  return languageMapping[stateName] || ["Hindi", "English"];
}

// Create database indexes for performance
async function createIndexes() {
  try {
    // State indexes
    await State.collection.createIndex({ name: 1 }, { unique: true });
    await State.collection.createIndex({ region: 1 });
    
    // Cultural Item indexes
    await CulturalItem.collection.createIndex({ state_id: 1 });
    await CulturalItem.collection.createIndex({ type: 1 });
    await CulturalItem.collection.createIndex({ name: "text", description: "text" });
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ created_at: -1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

// Run the initialization
initializeDatabase();
