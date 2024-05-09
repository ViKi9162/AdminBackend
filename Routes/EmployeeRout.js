import express from 'express';
import { createEmployee } from  '../controllers/employeeController.js';

const router = express.Router();

router.post('/employees', createEmployee);

export default router;
