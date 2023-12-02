const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const args = process.argv.slice(2); // Slice the first two elements
const imagePath = args[0] || '/Users/iominh/images';

console.log('Serving static images from', imagePath);

const cors = require('cors');
app.use(cors());

// Serve images as static resources
app.use('/images', express.static(imagePath));

app.get('/list-files', (req, res) => {
    fs.readdir(imagePath, (err, files) => {
      if (err) {
        res.status(500).send('Error reading directory');
        return;
      }
  
      // Filter out directories and only keep files
      let fileList = files.filter(file => {
        return fs.statSync(path.join(imagePath, file)).isFile();
      });
  
      res.json(fileList);
    });
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

