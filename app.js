const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.use(fileUpload());

// Upload endpoint
app.post('/api/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  // The file will be available in req.files.<input_name>
  const file = req.files.file;

  // Move the file to the desired directory
  const targetDirectory = '/var/www/uploads';
  const filePath = path.join(targetDirectory, file.name);
  file.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred while uploading the file.' });
    }

    return res.json({ message: 'File uploaded successfully.' });
  });
});

// File retrieval endpoint
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('/var/www/uploads', filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ message: 'File not found.' });
    }
  });
});

// Start the server
app.listen(8001, () => {
  console.log('Server is running on port 8001');
});

module.exports = app;
