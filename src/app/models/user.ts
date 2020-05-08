import { Role } from './role';

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    active: boolean;
    role: Role;
    token: string;
}