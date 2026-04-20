import express from 'express';
import rootRouter from './src/routes/index.js';
import { globalErrorHandler } from './src/middlewares/errorMiddleware.js';
import cors from 'cors'; 
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true 
}));

app.use(express.json());

// routes
app.use('/api', rootRouter);


app.use(globalErrorHandler);
// PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));