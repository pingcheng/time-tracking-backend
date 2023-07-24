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
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { Principal } from './decorators/principal.decorator';
import { User } from '@prisma/client';

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
  async getProfile(@Principal() user: User) {
    return new UserEntity(user);
  }
}
