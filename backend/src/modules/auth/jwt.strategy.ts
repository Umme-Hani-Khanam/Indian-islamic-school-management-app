import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeMeStrongly',
    });
  }

  async validate(payload: { sub: string; role: string; studentId?: string; teacherId?: string }) {
    return {
      id: payload.sub,
      role: payload.role,
      studentId: payload.studentId || null,
      teacherId: payload.teacherId || null,
    };
  }
}
