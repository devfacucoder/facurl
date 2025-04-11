import { Router } from "express";

import { login, getUser, createUser, updateUser, deleteUser } from "../controllers/userCtrl.js";
const userRouter = Router();
//TODO agregar el verifytoken para proteger las rutas
userRouter.get("/", getUser);
userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;


