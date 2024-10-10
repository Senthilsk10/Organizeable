const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  summary: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File' , required: true },
  type: { type: String, required: true, enum: ['file', 'folder'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  size: { type: Number },
  
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
