const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(cors({ 
  origin: true,
  credentials: false,
 }))
app.use(express.json());

const PROJECTS_FILE = path.join(__dirname, 'projects.json');

// Initialize empty projects file if none
async function initProjects() {
  try {
    await fs.access(PROJECTS_FILE);
  } catch {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify([]));
  }
}
initProjects();

// AI Draft Suggestions (Fake data)
app.post('/api/ai-suggest-draft', (req, res) => {
  res.json({
    suggestions: [
      { label: 'Living Room 5x4m', x: 80, y: 80, width: 250, height: 200 },
      { label: 'Kitchen 3.5x3m', x: 380, y: 80, width: 175, height: 150 },
      { label: 'Master Bedroom', x: 80, y: 320, width: 200, height: 180 },
      { label: 'Bathroom 2x2m', x: 320, y: 320, width: 100, height: 100 },
    ],
  });
});

// Simple Demo Login
app.post('/api/auth/demo-login', (req, res) => {
  res.json({ user: { id: 'demo', username: 'demo' }, token: 'demo-token' });
});

// Save project
app.post('/api/projects', async (req, res) => {
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf8'));
  const newProject = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  res.json(newProject);
});

// Get projects for user
app.get('/api/projects/:userId', async (req, res) => {
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf8'));
  const userProjects = projects.filter((p) => p.userId === req.params.userId);
  res.json(userProjects);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});


