const express = require('express');
const app = express();
const port = 3000;

const args = process.argv.slice(2); // Slice the first two elements
const imagePath = args[0] || '/Users/iominh/images';

console.log('Serving static images from', imagePath);

// Serve images as static resources
app.use('/images', express.static(imagePath));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const cors = require('cors');
app.use(cors());
