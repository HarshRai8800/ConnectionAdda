import { Router } from "express";
import { createChannel ,getAllChannels
} from "../controllers/channel.js";

const route = Router()

route.post("/createChannel",createChannel)
route.post("/getChannels",getAllChannels)

export default route