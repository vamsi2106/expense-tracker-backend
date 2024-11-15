import { Global, Module } from "@nestjs/common";
import { exportProviders, getProviders, importProviders } from "./providers";
let data = getProviders();
@Global()
@Module({
    providers: [...getProviders()],
    imports : [...importProviders()],
    exports : [...exportProviders()]
})
export class CoreModule{}