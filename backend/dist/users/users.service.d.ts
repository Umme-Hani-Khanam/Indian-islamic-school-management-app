import { User } from './interfaces/user.interface';
export declare class UsersService {
    private readonly users;
    findOne(username: string): Promise<User | undefined>;
}
