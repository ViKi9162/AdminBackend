import express from 'express';
import { loginController, registerController } from '../controllers/authControler.js';

// Create a router object
const router = express.Router();

// Routing
// REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN
router.post('/login', loginController);



export default router;
