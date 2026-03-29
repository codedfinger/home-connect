import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import propertiesRouter from "./properties";
import enquiriesRouter from "./enquiries";
import bookmarksRouter from "./bookmarks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(propertiesRouter);
router.use(enquiriesRouter);
router.use(bookmarksRouter);

export default router;
