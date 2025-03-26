import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bugRoutes from "./routes/bug.routes.js";
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Default Route
app.get('/', (req, res) => {
    res.send('Bug Tracker API is running');
});

app.use('/api/bugs', bugRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
