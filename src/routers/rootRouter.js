import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController"
import { home, search } from "../controllers/videoController"

const rootRouter = express.Router();

// const handleHome = (req, res) => res.send("Home")
// const handleJoin = (req, res) => res.send("Join")
// const handleLogin = (req, res) => res.send("Login")

rootRouter.get("/", home)
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login)
rootRouter.get("/search", search)


export default rootRouter;



