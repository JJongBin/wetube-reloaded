import express from "express";
import { edit, remove, logout, see, startGithubLogin, finishGithubLogin } from "../controllers/userController"

const userRouter = express.Router();

// const handleEdit = (req, res) => res.send("Edit User")
// const handleDelete = (req, res) => res.send("Delete User")

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);


export default userRouter;