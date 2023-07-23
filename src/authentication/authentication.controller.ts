import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authenticationService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
