# 🚀 Team Task Manager

A robust, full-stack task management application with Role-Based Access Control (RBAC), designed for teams to collaborate efficiently.

## ✨ Features
- **Role-Based Access Control (RBAC)**:
  - **Admins**: Full control over projects, tasks, and team members.
  - **Staff**: Can view assigned tasks and update status (Todo, In Progress, Done).
- **Project Management**: Create projects and assign multiple tasks to them.
- **Task Analytics**: Interactive dashboard cards for Todo, In Progress, Done, and Overdue tasks.
- **Real-time Status Updates**: Smooth status transitions with automatic deadline tracking.
- **Modern UI**: Clean, responsive design built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JWT (JSON Web Tokens) with secure role-based middleware.

## 📥 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Harshit-joshi1997/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
PORT=5000
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

## 🚀 Deployment

### Backend (Render / Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Env Vars**: Add `MONGODB_URI` and `JWT_SECRET`.

### Frontend (Netlify / Vercel)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env Vars**: Add `VITE_API_URL` (pointing to your deployed backend API).

## 📄 License
This project is licensed under the ISC License.
