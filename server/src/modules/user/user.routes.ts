import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import * as userController from './user.controllers';

const router = Router();

router.put(
    '/profile',
    protect,
    userController._updateProfile
);

router.put(
    '/password',
    protect,
    userController._updatePassword
);

router.post(
    '/avatar',
    protect,
    upload.single("avatar"),
    userController._uploadAvatar
);

router.delete(
    '/avatar',
    protect,
    userController._deleteAvatar
);

export default router;
