
import express from 'express'

import { getLogin, getRegister } from '../controllers/AuthController.js'
export const authRouter = express.Router()

authRouter.get('/', getRegister)
authRouter.get('/login', getLogin)