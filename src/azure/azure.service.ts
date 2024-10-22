import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AzureService {
  constructor(private configService: ConfigService) {}

  private async getAccessToken() {
    const clientId = this.configService.get<string>('AZURE_AD_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'AZURE_AD_CLIENT_SECRET',
    );
    const tenantId = this.configService.get<string>('AZURE_AD_TENANT_ID');

    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    try {
      const response = await axios.post(url, params);
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new HttpException(
        'Could not fetch access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async validateEmail(email: string) {
    const accessToken = await this.getAccessToken();

    const url = `https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq '${email}'`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.value.length > 0) {
        return { exists: true }; // Email exists in Azure AD
      } else {
        return { exists: false }; // Email does not exist
      }
    } catch (error) {
      console.error('Error validating email:', error);
      throw new HttpException(
        'Could not validate email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
