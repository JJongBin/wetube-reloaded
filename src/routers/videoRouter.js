import express from "express";
import { watch, getEdit, postEdit, deleteVideo, getUpload, postUpload,  } from "../controllers/videoController"
import { protectorMiddleware, videoUpload } from "../middlewares";
const videoRouter = express.Router();

// const handleWatch = (req, res) => res.send("Watch Video")
// const handleEdit = (req, res) => res.send("Edit Video")

// videoRouter.get("/upload", upload)
// videoRouter.get("/:id", watch)
// videoRouter.get("/:id/edit", edit)
// videoRouter.get("/:id/dlelte", deleteVideo)

videoRouter.get("/:id([0-9a-f]{24})", watch)
// videoRouter.get("/:id(\\d+)/edit", getEdit)
// videoRouter.post("/:id(\\d+)/edit", postEdit)
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit); // 주석 처리된 위 get. post를 한번에 할 수 있음
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo)
// videoRouter.get("/:id(\\d+)/dlelte", deleteVideo)
// videoRouter.get("/upload", upload)
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(
    videoUpload.fields([
        { name: "video", maxCount:1 },
        { name: "thumb", maxCount:1 },
    ]), postUpload); 


export default videoRouter;