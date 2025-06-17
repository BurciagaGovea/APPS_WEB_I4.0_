import express, { Router } from "express";
import { saveRol } from "../controllers/auth.controller";

const router = Router();

router.post('/rol', saveRol);

export default router;