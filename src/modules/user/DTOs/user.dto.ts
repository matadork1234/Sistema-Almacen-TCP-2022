export class UserDTO {
    id: number;
    username: string;
    email?: string;
    isLocked?: boolean;
    emailConfirmation?: boolean;
    role: string;
    isActive: boolean;
}