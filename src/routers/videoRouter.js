import express from "express";
import { upload, watch, getEdit, postEdit, deleteVideo, getUpload, postUpload } from "../controllers/videoController"
const videoRouter = express.Router();

// const handleWatch = (req, res) => res.send("Watch Video")
// const handleEdit = (req, res) => res.send("Edit Video")

// videoRouter.get("/upload", upload)
// videoRouter.get("/:id", watch)
// videoRouter.get("/:id/edit", edit)
// videoRouter.get("/:id/dlelte", deleteVideo)

videoRouter.get("/:id(\\d+)", watch)
// videoRouter.get("/:id(\\d+)/edit", getEdit)
// videoRouter.post("/:id(\\d+)/edit", postEdit)
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); // 주석 처리된 위 get. post를 한번에 할 수 있음
// videoRouter.get("/:id(\\d+)/dlelte", deleteVideo)
// videoRouter.get("/upload", upload)

videoRouter.route("/upload").get(getUpload).post(postUpload); 

export default videoRouter;