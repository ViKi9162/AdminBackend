import userModel from "../Model/userModel.js"; // Corrected import statement
import { comparePassword, hashPassword } from './../helper/authHelper.js';
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validations
        if (!name) {
            return res.send({ error: 'Name is Required' });
        }
        if (!email) {
            return res.send({ error: 'Email is Required' });
        }
        if (!password) {
            return res.send({ error: 'Password is Required' });
        }
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already registered, please login',
            });
        }
        
        // Hash password and register user
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({
            name,
            email,
            password: hashedPassword
        }).save();
        
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Email and Password are invalid'
            });
        }
        
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            });
        }

        // Generate token
        const token = JWT.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '9999d'
        });

        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        });
    }
};

