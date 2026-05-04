require('dotenv').config();
const express = require('express');
const cors = require('cors');

const dashboardRoutes = require('./routes/dashboard');
// Add more routes here as you build them:
// const authRoutes    = require('./routes/auth');
// const projectRoutes = require('./routes/projects');
// const taskRoutes    = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 Public routes
// app.use('/api', authRoutes);

// 🔴 Protected routes (auth is handled inside each router)
app.use('/api', dashboardRoutes);
// app.use('/api', projectRoutes);
// app.use('/api', taskRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
