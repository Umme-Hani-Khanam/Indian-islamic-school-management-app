import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      username: 'headmaster',
      password: 'password',
      name: 'Ahmed Khan',
      role: 'HEADMASTER',
    },
    {
      id: '2',
      username: 'teacher',
      password: 'password',
      name: 'Fatima Ali',
      role: 'TEACHER',
    },
    {
      id: '3',
      username: 'parent',
      password: 'password',
      name: 'Omar Farooq',
      role: 'PARENT',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
