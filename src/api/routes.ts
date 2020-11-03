import { Router } from "express";
import nodeRoutes from "./components/node/node.routes";
import treeRoutes from "./components/tree/tree.routes";
import employeeRoutes from "./components/employee/employee.routes";
import authRoutes from "./components/auth/auth.routes";
import { isAuthenticated } from "./middleware/is-authenticated";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/trees", treeRoutes);
router.use("/employees", isAuthenticated, employeeRoutes);

export default router;
