import express from "express";
import { getEdit, postEdit, remove, logout, see, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController"
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";
const userRouter = express.Router();

// const handleEdit = (req, res) => res.send("Edit User")
// const handleDelete = (req, res) => res.send("Delete User")

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);


export default userRouter;