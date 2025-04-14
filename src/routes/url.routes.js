import { Router } from "express";
import { createUrl, getUrls,deletedUrl,updateUrl,createURLTemp } from "../controllers/urls.ctrl.js";
import verifyToken from "../validators/verifyToken.js";

const urlRouter = Router();
urlRouter.post("/url",[verifyToken], createUrl);
urlRouter.post("/urlTemp",createURLTemp)
urlRouter.get("/:idUrl", getUrls);
urlRouter.put("/:ide",[verifyToken], updateUrl);
urlRouter.delete("/:ide",[verifyToken], deletedUrl);



export default urlRouter;