import { Injectable } from '@nestjs/common';
import { AppService } from 'src/modules/app/app.service';
import axios  from 'axios'

import { UsersService } from '../users/users.service';
import { JwtAuthService } from './jwtAuth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly appService:AppService,
    private readonly jwtService: JwtAuthService,
    private readonly userService: UsersService
  ) {
  }

  async getAuthUrl(): Promise<string> {
    try{
      let tentantId = this.appService.getTenantId()
      let client_id = this.appService.getClientId()
      let redirect_uri = this.appService.getRedirectUri()
  
      const authUrl = `https://login.microsoftonline.com/${tentantId}/oauth2/v2.0/authorize?` +
          new URLSearchParams({
              client_id: client_id,
              response_type: 'code',
              redirect_uri: redirect_uri,
              scope: 'openid profile email User.read',
              response_mode: 'query'
          } as Record<string, string>).toString();
  
      return authUrl;
    }catch(e){
      return e
    } 
  }

  async exchangeCodeForTokens(code: string) {
    try {
      let tentantId = this.appService.getTenantId()
      let client_id = this.appService.getClientId()
      let redirect_uri = this.appService.getRedirectUri()
      let client_secret = this.appService.getClientSecret()
        const tokenResponse = await axios.post(
            `https://login.microsoftonline.com/${tentantId}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: client_id,
                client_secret: client_secret,
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        let userDetails = await this.getUserDetails(tokenResponse.data.access_token)
        let tokenAndData = {
            token:tokenResponse.data,
            userDetails:userDetails
        }

        let user = await this.userService.findUserByEmail(userDetails.mail)
          console.log("User", user.dataValues)
        let customToken = await this.jwtService.generateJwt(user.dataValues)
        
        console.log("Custom token", customToken)

        // let customPayload = await this.jwtService.verifyToken(customToken);
        
        // console.log("Custom Payload", customPayload)


        return {token:customToken,username: user.username,profileImage:user.userImageUrl,role:user.role}
    } catch (error) {
        return error
    }
  }

  async getUserDetails(accessToken: string){
    try{
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
 
      const response = await axios.get("https://graph.microsoft.com/v1.0/me", {headers});
      return response.data
 
    }catch(e){
        return e
    }
  }
}
