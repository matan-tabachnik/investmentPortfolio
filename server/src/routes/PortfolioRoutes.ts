
import { Router } from 'express';
import { quotePortfolio} from '../controllers/PortfolioController.js';

const router = Router();

router.post('/quote', quotePortfolio);

export default router;