import { Request, Response, Router } from "express";
import treeRoutes from "./components/tree/tree.routes";
import formRoutes from "./components/form/form.routes";
import employeeRoutes from "./components/employee/employee.routes";
import authRoutes from "./components/auth/auth.routes";
import formInputTypeRoutes from "./components/form-input-type/form-input-type.routes";
import { isAuthenticated } from "./middleware/is-authenticated";
import { NotFoundException } from "../exceptions/NotFoundException";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/trees", treeRoutes);
router.use("/employees", isAuthenticated, employeeRoutes);
router.use("/forms", formRoutes);
router.use("/form-input-types", formInputTypeRoutes);

/**
 * Default root endpoint
 */
router.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        result: {
            message: "Welcome to the ARAG REST API",
        },
    });
});

/**
 * Not found route: show a 404 error response
 */
router.use("*", (req: Request, res: Response) => {
    throw new NotFoundException("Route not found");
});

export default router;
