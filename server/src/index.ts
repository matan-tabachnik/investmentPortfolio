
import express from 'express';
import cors from 'cors';
import { config } from './config/Env.js';
import portfolioRoutes from './routes/PortfolioRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/portfolio', portfolioRoutes);


// if route doenst exist
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});


// for any other error
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[GLOBAL ERROR]', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});