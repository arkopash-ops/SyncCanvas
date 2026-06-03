import type {
    DeleteAvatarResponse,
    UploadAvatarData,
    UploadAvatarResponse,
    User,
} from "../types";
import api from "./api";

const updateStoredUserAvatar = (avatar: string | null) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return;
    }

    const user = JSON.parse(storedUser) as User;
    localStorage.setItem("user", JSON.stringify({ ...user, avatar }));
};

export const userServices = {
    uploadAvatar: async (data: UploadAvatarData): Promise<UploadAvatarResponse> => {
        const formData = new FormData();
        formData.append("avatar", data.avatar);

        const res = await api.post<UploadAvatarResponse>("/user/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        updateStoredUserAvatar(res.data.avatar);

        return res.data;
    },

    deleteAvatar: async (): Promise<DeleteAvatarResponse> => {
        const res = await api.delete<DeleteAvatarResponse>("/user/avatar");

        updateStoredUserAvatar(null);

        return res.data;
    },
};
