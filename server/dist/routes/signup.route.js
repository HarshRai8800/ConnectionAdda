import { Router } from "express";
import { signup } from "../controllers/signup.js";
const route = Router();
route.post("/signup", signup);
export default route;
