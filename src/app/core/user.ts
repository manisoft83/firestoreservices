import { Roles } from '../core/roles'

export interface User {
    uid: string;
    email: string;
    roles: Roles;
}
