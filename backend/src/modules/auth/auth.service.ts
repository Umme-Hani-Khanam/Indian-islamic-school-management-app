import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.usersService.findByLogin(identifier);
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      role: user.role,
      studentId: user.studentId || null,
      teacherId: user.teacherId || null,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        studentId: user.studentId || null,
        teacherId: user.teacherId || null,
      },
    };
  }
}
