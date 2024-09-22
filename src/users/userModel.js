const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  // birthDate: Date,
  // height: Number,
  // weight: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // phoneNumber: String,
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  firstLoginQuestions: {
    personalData: {
      birthDate: { type: Date, default: null },
      height: { type: Number, default: null },
      weight: { type: Number, default: null },
    },
    physiologicalPathological: {
      fitnessStatus: { type: String, default: '' },
      currentDiseases: { type: String, default: '' },
      medication: { type: String, default: '' },
      pastDiseases: { type: String, default: '' },
      allergies: { type: String, default: '' },
      operations: { type: String, default: '' },
      regularPain: { type: String, default: '' },
      lastAnalytics: { type: String, default: '' },
      clinicalAlteration: { type: String, default: '' },
    },
    habits: {
      mealSchedule: { type: String, default: '' },
      favoriteFoods: { type: String, default: '' },
      dietDetails: { type: String, default: '' },
      weekDescription: { type: String, default: '' },
      cheatMeals: { type: String, default: '' },
      dietCommitment: { type: Number, default: 0 },
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      sleepHours: { type: Number, default: 0 },
      currentSupplements: { type: String, default: '' },
      pastSupplements: { type: String, default: '' },
    },
    generalQuestions: {
      pastDiets: String,
      mediumLongTermGoals: String,
      pastChemicalUse: String,
    },

    foodPreferences: {
      favoriteMeals: String,
      hungerTimes: String,
      weighsFood: Boolean,
      dislikedFoods: String,
      favoriteFitFoods: String,
      favoriteFatFoods: String,
    },

    training: {
      trainingDays: Number,
      trainingDuration: Number,
      trainingStructure: String,
      trainingTime: String,
      enjoysTraining: Boolean,
      favoriteExercises: String,
      dislikedExercises: String,
    },

    caseDescription: {
      currentMood: Number,
      selfEsteem: Number,
      bodyImage: Number,
      mainMotivationForChange: String,
    },

    additionalInfo: String,
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
