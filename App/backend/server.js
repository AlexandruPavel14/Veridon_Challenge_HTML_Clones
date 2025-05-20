const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
let BASE_DIR = null; // Set after running Python script
let BASE_PARENT_FOLDER = null;

// ✅ Hardcoded absolute path to your Python clustering script
const scriptPath = "/Users/daniel/Downloads/veridion/github/Veridon_Challenge_HTML_Clones/App/backend/algorithm.py";
const pythonExecutable = "/Users/daniel/Downloads/veridion/github/Veridon_Challenge_HTML_Clones/venv/bin/python";

app.post('/set-path', (req, res) => {
  const userPath = req.body.path;

  if (!userPath || typeof userPath !== 'string') {
    return res.status(400).json({ error: 'Invalid path input' });
  }

  if (!fs.existsSync(userPath)) {
    return res.status(404).json({ error: 'Directory does not exist' });
  }

  BASE_PARENT_FOLDER = userPath; // <-- Set this before running the script

  console.log(`🟡 Running Python script on: ${userPath}`);

  exec(`${pythonExecutable} "${scriptPath}" "${BASE_PARENT_FOLDER}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python script error:", err.message);
      console.error("📄 STDERR:", stderr);
      return res.status(500).json({ error: 'Python script execution failed.' });
    }

    console.log("✅ Python script completed.");
    console.log(stdout);

    const outputFolders = fs.readdirSync(userPath)
      .filter(f => f.endsWith('_grouped_output'))
      .map(folder => ({
        name: folder,
        fullPath: path.join(userPath, folder)
      }));

    if (outputFolders.length === 0) {
      return res.status(400).json({ error: 'No grouped output folders were created.' });
    }

    res.json({
      message: 'Clustering complete.',
      outputs: outputFolders
    });
  });
});


// ✅ API: Set path and trigger clustering
// app.post('/set-path', (req, res) => {
//   const userPath = req.body.path;

//   if (!userPath || typeof userPath !== 'string') {
//     return res.status(400).json({ error: 'Invalid path input' });
//   }

//   if (!fs.existsSync(userPath)) {
//     return res.status(404).json({ error: 'Directory does not exist' });
//   }

//   console.log(`🟡 Running Python script on: ${userPath}`);

// exec(`${pythonExecutable} "${scriptPath}" "${BASE_PARENT_FOLDER}" "${outputDir}"`, (err, stdout, stderr) => {
//     if (error) {
//       console.error("❌ Python script error:", error.message);
//       console.error("📄 STDERR:", stderr);
//       return res.status(500).json({ error: 'Python script execution failed.' });
//     }

//     console.log("✅ Python script completed.");
//     console.log(stdout);

//     // Find all *_grouped_output folders in the input path
//     const outputFolders = fs.readdirSync(userPath)
//       .filter(f => f.endsWith('_grouped_output'))
//       .map(folder => ({
//         name: folder,
//         fullPath: path.join(userPath, folder)
//       }));

//     if (outputFolders.length === 0) {
//       return res.status(400).json({ error: 'No grouped output folders were created.' });
//     }

//     res.json({
//       message: 'Clustering complete.',
//       outputs: outputFolders
//     });
//   });
// });

// ✅ API: Get group folders
app.get('/groups', (req, res) => {
  if (!BASE_DIR) return res.status(400).json({ error: 'Path not set yet' });
  const groups = fs.readdirSync(BASE_DIR).filter(f => f.startsWith('group_'));
  res.json(groups);
});

// ✅ API: Get files in a group
app.get('/groups/:group/files', (req, res) => {
  if (!BASE_DIR) return res.status(400).json({ error: 'Path not set yet' });

  const groupPath = path.join(BASE_DIR, req.params.group);
  if (!fs.existsSync(groupPath)) return res.status(404).send('Group not found');

  const files = fs.readdirSync(groupPath).filter(f => f.endsWith('.html'));
  res.json(files);
});

// ✅ API: Get file content
app.get('/groups/:group/file/:filename', (req, res) => {
  if (!BASE_DIR) return res.status(400).json({ error: 'Path not set yet' });

  const filePath = path.join(BASE_DIR, req.params.group, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  res.send(content);
});

app.post('/select-output', (req, res) => {
  const selectedPath = req.body.selectedPath;
  if (!selectedPath || !fs.existsSync(selectedPath)) {
    return res.status(400).json({ error: 'Invalid grouped output path' });
  }

  BASE_DIR = selectedPath;
  res.json({ message: 'Selected output path updated' });
});


app.get('/outputs', (req, res) => {
  if (!BASE_DIR) return res.status(400).json({ error: 'Path not set yet' });

  const parentDir = path.dirname(BASE_DIR);
  const outputs = fs.readdirSync(parentDir)
    .filter(name => name.endsWith('_grouped_output'))
    .map(name => ({
      name,
      fullPath: path.join(parentDir, name)
    }));

  res.json({ outputs, current: path.basename(BASE_DIR) });
});


app.post('/set-base-folder', (req, res) => {
  const userPath = req.body.path;
  if (!fs.existsSync(userPath)) {
    return res.status(404).json({ error: 'Directory does not exist' });
  }
  BASE_PARENT_FOLDER = userPath;
  res.json({ message: 'Base folder set for metrics.' });
});

// Serve V1 metric chart
app.get('/metrics/v1', (req, res) => {
  if (!BASE_PARENT_FOLDER) {
    return res.status(400).json({ error: 'Base folder not set. Please POST to /set-base-folder first.' });
  }

  const scriptPath = path.join(__dirname, 'metrics', 'v1.py');
  const outputDir = "/Users/daniel/Downloads/veridion/github/Veridon_Challenge_HTML_Clones";
  const imgPath = path.join(outputDir, "v1_html_file_count.png");

  // ✅ Run with both input and output directory
  exec(`${pythonExecutable} "${scriptPath}" "${BASE_PARENT_FOLDER}" "${outputDir}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Python error:', err.message);
      console.error(stderr);
      return res.status(500).json({ error: 'Failed to run V1 metric script' });
    }

    console.log(stdout); // Useful to confirm path printed by Python
    if (!fs.existsSync(imgPath)) {
      return res.status(500).json({ error: 'Image not generated' });
    }

    res.sendFile(imgPath);
  });
});



// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
