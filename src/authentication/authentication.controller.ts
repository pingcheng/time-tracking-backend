import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';
import { Auth } from './decorators/auth.decorator';
import { JwtAuthPayload } from './authentication.type';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authenticationService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @Get('profile')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@Auth() auth: JwtAuthPayload) {
    const user = await this.userService.findOne(auth.username);

    if (!user) {
      throw new NotFoundException();
    }

    return new UserEntity(user);
  }
}
