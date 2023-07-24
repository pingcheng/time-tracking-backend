import * as process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: parseInt(process.env.JWT_EXPIRE ?? '3600', 10) || 3600,
  },
}));
