import express from 'express';
import rootRouter from './src/routes/index.js';

const app = express();
app.use(express.json());

// routes
app.use('/api', rootRouter);

// PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));