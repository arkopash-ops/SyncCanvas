import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import * as userController from './user.controllers';

const router = Router();

router.post(
    '/avatar',
    protect,
    upload.single("avatar"),
    userController._uploadAvatar
);

router.delete(
    '/avatar',
    protect,
    upload.single("avatar"),
    userController._deleteAvatar
);

export default router;
