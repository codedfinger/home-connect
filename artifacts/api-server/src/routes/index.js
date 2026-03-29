import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import propertiesRouter from "./properties";
import enquiriesRouter from "./enquiries";
import bookmarksRouter from "./bookmarks";
const router = Router();
router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(propertiesRouter);
router.use(enquiriesRouter);
router.use(bookmarksRouter);
var stdin_default = router;
export {
  stdin_default as default
};
