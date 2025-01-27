"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkUser_1 = require("../controllers/checkUser");
const route = (0, express_1.Router)();
route.post("/check", checkUser_1.checkUser);
exports.default = route;
