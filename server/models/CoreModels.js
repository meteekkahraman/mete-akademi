const mongoose = require('mongoose');

// Isı Haritası
const TopicStatusSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, status: { type: Number, default: 0 } });
TopicStatusSchema.index({ username: 1, lesson: 1, topic: 1 }, { unique: true });

// Diğer Şemalar
const TopicLogSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, count: Number, date: String, timestamp: { type: Date, default: Date.now } });
const ProgressSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, isCompleted: { type: Boolean, default: false } });
const StudyLogSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, type: String, duration: Number, date: String, timestamp: { type: Date, default: Date.now } });
const PostSchema = new mongoose.Schema({ username: String, content: String, date: { type: Date, default: Date.now }, isSystem: { type: Boolean, default: false } });
const ExamSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, net: Number, date: String });
const ProgramSchema = new mongoose.Schema({ username: String, day: String, time: String, lesson: String, topic: String });
const QuestionSchema = new mongoose.Schema({ username: String, lesson: String, topic: String, count: Number, date: String, timestamp: { type: Date, default: Date.now } });

module.exports = {
  TopicStatus: mongoose.model('TopicStatus', TopicStatusSchema),
  TopicLog: mongoose.model('TopicLog', TopicLogSchema),
  Progress: mongoose.model('Progress', ProgressSchema),
  StudyLog: mongoose.model('StudyLog', StudyLogSchema),
  Post: mongoose.model('Post', PostSchema),
  Exam: mongoose.model('Exam', ExamSchema),
  Program: mongoose.model('Program', ProgramSchema),
  Question: mongoose.model('Question', QuestionSchema)
};