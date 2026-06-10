export interface IUserCursor {
    userId: string;
    name: string;
    color: string;
    x: number;
    y: number;
}

export interface IUserSelection {
    userId: string;
    selectedElementIds: string[];
}
