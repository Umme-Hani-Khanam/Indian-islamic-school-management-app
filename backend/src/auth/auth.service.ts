import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    console.log('LOGIN ATTEMPT', username);
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      console.log('INVALID LOGIN');
      throw new UnauthorizedException();
    }
    console.log('LOGIN SUCCESS');
    const { password, ...result } = user;
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: result
    };
  }
}
