// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/modules/app/app.service';
import axios from 'axios';

import { UsersService } from '../users/users.service';
import { JwtAuthService } from './jwtAuth.service';
import { AbstractAuth } from './auth.abstract';
import { AbstractUser } from '../users/user.abstract';
import { AppConfigService } from 'src/config/appConfig.services';

@Injectable()
export class AuthService implements AbstractAuth {
  private readonly oAuthServices: any;
  constructor(
    //private readonly appService: AppService,
    private readonly jwtService: JwtAuthService,
    private readonly userService: AbstractUser,
    private readonly appService: AppConfigService
  ) {
    this.oAuthServices = this.appService.get('oAuth');
  }

  async getAuthUrl(): Promise<string> {
    try {
      const tenantId = this.oAuthServices.tenantId;

      const clientId = this.oAuthServices.clientId;
      const redirectUri = this.oAuthServices.redirectUri;

      const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
        new URLSearchParams({
          client_id: clientId,
          response_type: 'code',
          redirect_uri: redirectUri,
          scope: 'openid profile email User.read',
          response_mode: 'query',
        }).toString();

      return authUrl;
    } catch (e) {
      return e;
    }
  }

  async exchangeCodeForTokens(code: string) {
    try {
      const tenantId = this.oAuthServices.tenentId;
      const clientId = this.oAuthServices.clientId;
      const redirectUri = this.oAuthServices.redirectUri;
      const clientSecret = this.oAuthServices.clientSecret;

      // Using the request body instead of URL parameters for the token exchange
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const userDetails = await this.getUserDetails(tokenResponse.data.access_token);
      const user = await this.userService.findUserByEmail(userDetails.mail);
       if (!user) {
        // User not found, return an error message to the frontend
        return { error: 'User not found', redirect: true };
      }

      const customToken = await this.jwtService.generateJwt(user.dataValues);

      return {
        token: customToken,
        userid: user.userId,
        username: user.username,
        userImageUrl: user.userImageUrl,
        role: user.role,
        userEmail: user.email,
      };
    } catch (error) {
      return error;
    }
  }

  async getUserDetails(accessToken: string) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers,
      });
      return response.data;
    } catch (e) {
      return e;
    }
  }
}

