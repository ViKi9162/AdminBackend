import express from 'express';
import { createEmployee, getEmployees } from  '../controllers/employeeController.js';

const router = express.Router();

router.post('/employees', createEmployee);
router.get('/employees', getEmployees);
export default router;
