export interface IUserCursor {
    userId: string;
    name: string;
    avatar:string;
    color: string;
    x: number;
    y: number;
}

export interface IUserSelection {
    userId: string;
    selectedElementIds: string[];
}
