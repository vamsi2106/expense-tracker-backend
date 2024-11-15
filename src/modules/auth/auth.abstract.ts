export abstract class AbstractAuth{
    abstract getAuthUrl(): Promise<string>;
    abstract exchangeCodeForTokens(code: string);
    abstract getUserDetails(accessToken: string);
}