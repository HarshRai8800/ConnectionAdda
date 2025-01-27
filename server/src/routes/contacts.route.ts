import { Router } from "express";

import {searchContacts,addContact,findAllContacts,getContactsForChannel} from "../controllers/contacts.js"
// import { verify } from "../middlewares/verify";
const route = Router()

 route.post("/seacrhContacts",searchContacts)
route.post("/addContact",addContact)
route.post("/findAllContact",findAllContacts)
route.post("/channelContacts",getContactsForChannel)
 export default route