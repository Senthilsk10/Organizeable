const File = require('./models');
const axios = require('axios');

// GitHub credentials
const GITHUB_USERNAME = 'Senthilsk10';
const GITHUB_TOKEN = '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';
const REPO_NAME = 'Organizeable';

// Helper function to interact with GitHub API
const githubApi = axios.create({
  baseURL: `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`
  }
});

// Create Folder
exports.createFolder = async (req, res) => {
  const { path, summary, parent } = req.body;

  // Create folder metadata in MongoDB
  const newFolder = new File({
    path,
    summary,
    parent,
    type: 'folder',
  });

  try {
    await newFolder.save();
    res.status(201).json({ message: 'Folder created successfully', folderId: newFolder._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload File
exports.uploadFile = async (req, res) => {
  const { path, summary, parent, fileContent } = req.body;

  try {
    // Upload file to GitHub
    await githubApi.put(path, {
      message: `Upload file: ${path}`,
      content: Buffer.from(fileContent).toString('base64')
    });

    // Save metadata to MongoDB
    const newFile = new File({
      path,
      summary,
      parent,
      type: 'file',
      owner: 'user_id_123',
      size: Buffer.byteLength(fileContent),
    });

    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Folder Contents
exports.getFolderContents = async (req, res) => {
  const { folderId } = req.params;

  try {
    const contents = await File.find({ parent: folderId });
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Move File/Folder
exports.moveItem = async (req, res) => {
  const { itemId, newParent } = req.body;

  try {
    const item = await File.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.parent = newParent;
    item.updatedAt = new Date();
    await item.save();

    res.status(200).json({ message: 'Item moved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete File/Folder
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await File.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Remove from GitHub (only if it's a file)
    if (item.type === 'file') {
      await githubApi.delete(item.path, {
        message: `Delete file: ${item.path}`
      });
    }

    // Delete from MongoDB
    await item.remove();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
