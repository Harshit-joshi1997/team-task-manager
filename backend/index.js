const express = require('express');
const authMiddleware = require('./middleware/auth'); // 1. Import the middleware

const app = express();
app.use(express.json());

// 🟢 PUBLIC ROUTES (No middleware used)
app.post('/api/login', (req, res) => {
    // Your login logic here...
    // (Verify credentials and send back the JWT token)
});

// 🔴 PROTECTED ROUTES (Middleware used)
// We insert `authMiddleware` as the second argument.
app.post('/api/tasks', authMiddleware, async (req, res) => {
    try {
        // Because the middleware ran first, you now have access to req.user!
        // req.user contains the decoded payload (e.g., the user's ID)
        const userId = req.user.id;

        // Now you can safely create the task in the database for this specific user
        const newTask = await prisma.task.create({
            data: {
                title: req.body.title,
                createdById: userId, // Using the ID from the verified token
                projectId: req.body.projectId
            }
        });

        res.json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
