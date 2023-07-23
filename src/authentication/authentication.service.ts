import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  private logger: Logger;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthenticationService.name);
  }

  async signIn(username: string, pass: string): Promise<any> {
    this.logger.log(`Try to login for username "${username}"`);

    const user = await this.usersService.findOne(username);

    if (!user) {
      this.logger.warn(`Username "${username}" did not found`);
      throw new UnauthorizedException();
    }

    if (!(await this.verifyPassword(pass, user.password))) {
      this.logger.warn(`Password for username "${username}" failed to match`);
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    this.logger.log(
      `Username "${username}" password matched successfully, generating jwt token`,
    );

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10); // 10 as salt rounds
  }

  async verifyPassword(password, hash): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
