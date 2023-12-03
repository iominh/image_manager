const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const args = process.argv.slice(2); // Slice the first two elements
const imagePath = args[0] || '/Users/iominh/images';

// Function to copy multiple files
async function copyFiles(fileList) {
    try {
        for (const file of fileList) {
            await fs.copyFile(file.source, file.destination, (result) => {
                console.log('copyFile result' + result);
            });
        }
        return true;
    } catch (err) {
        console.error('Error copying files:', err);
        return false;
    }
}

console.log('Serving static images from', imagePath);

const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

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

app.post('/create-dirs', (req, res) => {
    const dirs = ['best', 'fix', 'saved'];
    Promise.all(dirs.map(dirPath => {
        const fullPath = path.join(imagePath, dirPath); // Construct full path
        return fs.promises.mkdir(fullPath, { recursive: true });
    })).then(() => {
        res.send({ message: 'Directories created successfully' });
    }).catch(err => {
        res.status(500).send({ message: 'Error creating directories', error: err });
    });
});

  // API endpoint to copy multiple files
app.post('/copy-files', async (req, res) => {
    let fileList = req.body; // Expecting an array of { source, destination }

    fileList = fileList.map(file => {
        const split = file.source.split('/');
        const fileName = split[split.length - 1];
        return {
            source: `${imagePath}/${fileName}`,
            destination: `${imagePath}/${file.destination}/${fileName}`
        }
    });

    console.log('Copying files', fileList);
    if (await copyFiles(fileList)) {
        res.status(200).send('Files copied successfully.');
    } else {
        res.status(500).send('Failed to copy files.');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

