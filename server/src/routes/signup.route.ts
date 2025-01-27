import { Router } from "express";
import { signup } from "../controllers/signup.js";
import { signin } from "../controllers/signin.js";
const route = Router()

 route.post("/signup",signup)

 export default route