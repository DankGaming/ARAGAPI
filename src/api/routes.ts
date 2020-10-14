import { Router } from "express";
import nodeRoutes from "./components/node/node.routes";
import treeRoutes from "./components/tree/tree.routes";
import employeeRoutes from "./components/employee/employee.routes";
import authRoutes from "./components/auth/auth.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/nodes", nodeRoutes);
router.use("/trees", treeRoutes);
router.use("/employees", employeeRoutes);

export default router;
