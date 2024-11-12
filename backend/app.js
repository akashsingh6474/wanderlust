import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { FRONTEND_URL } from './config/utils.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import userRouter from './routes/user.js';
import errorMiddleware from './middlewares/error-middleware.js';

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// API routes
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Yay!! Backend of wanderlust app is now accessible');
});

// Catch-all route for 404
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: '!Oops page not found',
  });
});

// Error middleware
app.use(errorMiddleware);

export default app;
