const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Create Folder
router.post('/create-folder', controllers.createFolder);

// Upload File
router.post('/upload-file', controllers.uploadFile);

// Get Folder Contents
router.get('/folder/:folderId/contents', controllers.getFolderContents);

// Move File/Folder
router.post('/move-item', controllers.moveItem);

// Delete File/Folder
router.delete('/item/:itemId', controllers.deleteItem);

module.exports = router;
