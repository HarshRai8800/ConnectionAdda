import { Router } from "express";

import {checkUser,setUserInfo ,getUserInfo,setDeletImage ,setUserImage,deleteSession,userTersting} from "../controllers/user.js";
const route = Router()
import { upload } from "../helpers/multer.js";
import { verify } from "../middlewares/verify.js";


 route.post("/check",checkUser)
route.post("/setInfo",verify,setUserInfo)  
route.post("/getInfo",verify,getUserInfo)
route.post("/addProfileImage",upload.single("file"),verify,setUserImage)
route.post("/removeImage",verify,setDeletImage)
route.post("/logout",deleteSession)
route.post("/testing",verify,upload.single("file"),userTersting)
 export default route