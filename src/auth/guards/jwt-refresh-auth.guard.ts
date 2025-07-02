// src/auth/guards/jwt-refresh-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh_token') {}