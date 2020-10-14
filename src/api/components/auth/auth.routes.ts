import * as authController from "./auth.controller";
import { Router, Request, Response, NextFunction } from "express";
import { LoginDTO } from "./dto/login.dto";
import { LoginInfo } from "./login-info.model";
import { parseBody } from "../../../utils/validator/validator";

const router: Router = Router();

router.post(
    "/login",
    [parseBody(LoginDTO)],
    async (req: Request, res: Response) => {
        const loginDTO = req.body;

        const loginInfo: LoginInfo = await authController.login(loginDTO);

        res.json({
            success: true,
            result: loginInfo,
        });
    }
);

export default router;
