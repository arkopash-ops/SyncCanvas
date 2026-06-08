import type { InvitationResponse, PendingInvitationsResponse } from "../types";
import api from "./api";

export const invitationService = {
    getPendingInvitation: async (): Promise<PendingInvitationsResponse> => {
        const res = await api.get<PendingInvitationsResponse>(
            "/invitation/pending"
        );
        return res.data;
    },

    acceptInvitation: async (invitationId: string): Promise<InvitationResponse> => {
        const res = await api.post<InvitationResponse>(
            `/invitation/${invitationId}/accept`
        );
        return res.data;
    },

    rejectInvitation: async (invitationId: string): Promise<InvitationResponse> => {
        const res = await api.post<InvitationResponse>(
            `/invitation/${invitationId}/reject`
        );
        return res.data;
    },
};
