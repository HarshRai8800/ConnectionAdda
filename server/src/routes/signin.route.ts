import { Router } from "express";

import { signin,GoogleGitSigIn } from "../controllers/signin.js";
// import { verify } from "../middlewares/verify";
const route = Router()

 route.post("/signin",signin)
 route.post("/googlegitsignin",GoogleGitSigIn)
 export default route