const express = require('express');
const app = express();
const port = 3000;

// Serve images as static resources
app.use('/images', express.static('/Users/iominh/images'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const cors = require('cors');
app.use(cors());
