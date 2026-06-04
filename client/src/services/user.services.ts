import type {
    DeleteAvatarResponse,
    UpdatePasswordData,
    UpdatePasswordResponse,
    UpdateProfileData,
    UpdateProfileResponse,
    UploadAvatarData,
    UploadAvatarResponse,
    User,
} from "../types";
import api from "./api";

const USER_CHANGED_EVENT = "sync-canvas-user-changed";

const emitUserChanged = () => {
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
};

export const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

const setStoredUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    emitUserChanged();
};

const updateStoredUser = (data: Partial<User>) => {
    const user = getStoredUser();

    if (!user) {
        return;
    }

    setStoredUser({ ...user, ...data });
};

export const userServices = {
    userChangedEvent: USER_CHANGED_EVENT,

    getStoredUser,

    updateProfile: async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
        const res = await api.put<UpdateProfileResponse>("/user/profile", data);
        setStoredUser(res.data.user);
        return res.data;
    },

    updatePassword: async (
        data: UpdatePasswordData
    ): Promise<UpdatePasswordResponse> => {
        const res = await api.put<UpdatePasswordResponse>("/user/password", data);
        return res.data;
    },

    uploadAvatar: async (data: UploadAvatarData): Promise<UploadAvatarResponse> => {
        const formData = new FormData();
        formData.append("avatar", data.avatar);

        const res = await api.post<UploadAvatarResponse>("/user/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        updateStoredUser({
            avatar: res.data.avatar,
            avatarPublicId: res.data.avatarPublicId ?? null,
        });

        return res.data;
    },

    deleteAvatar: async (): Promise<DeleteAvatarResponse> => {
        const res = await api.delete<DeleteAvatarResponse>("/user/avatar");

        updateStoredUser({ avatar: null, avatarPublicId: null });

        return res.data;
    },
};
