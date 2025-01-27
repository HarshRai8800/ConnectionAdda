import { Router } from "express";
import { getChannelMessages, getMessages, uploadImage } from "../controllers/messages.js";
import { verify } from "../middlewares/verify.js";
import { upload } from "../helpers/multer.js";
const route = Router();
route.post("/getMessages", getMessages);
route.post("/getChannelMessages", getChannelMessages);
route.post("/uploadImage", verify, upload.single("file"), uploadImage);
export default route;
