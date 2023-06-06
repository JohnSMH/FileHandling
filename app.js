const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.use(fileUpload());

// Upload endpoint
app.post('/api/upload', (req, res) => {
  console.log("upload")
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files were uploaded.')
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  // The file will be available in req.files.<input_name>
  console.log(req.files)
  const file = req.files.undefined;

  // Move the file to the desired directory
  const targetDirectory = '/home/osboxes/Documents/';
  const filePath = path.join(targetDirectory+file.name);
  file.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred while uploading the file.' });
    }
    console.log('File uploaded successfully.')
    return res.status(200).json({ message: 'File uploaded successfully.' });
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
    return res.status(200).json({ message: 'File get successful' });
  });
});

app.get('/api/hello', (req, res) => {
  console.log("hello")
  return res.status(200).json({ message: 'Hello' });
})

// Start the server
app.listen(8002, () => {
  console.log('Server is running on port 8002');
});

module.exports = app;
