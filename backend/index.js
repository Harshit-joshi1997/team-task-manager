require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes      = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
// const projectRoutes = require('./routes/projects');
// const taskRoutes    = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 Public routes
app.use('/api', authRoutes);

// 🔴 Protected routes (auth is handled inside each router)
app.use('/api', dashboardRoutes);
// app.use('/api', projectRoutes);
// app.use('/api', taskRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
