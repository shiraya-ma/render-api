import Express, { type NextFunction } from 'express';

declare global {
    export namespace Mai {
        export type Handler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

        export type Request = Express.Request & {
            maiURL: URL;
            maiParams?: Slug;
        };

        export type Response = Express.Response & {};

        export type Route = {
            DELETE  : Handler;
            GET     : Handler;
            HEAD    : Handler;
            OPTION  : Handler;
            PATCH   : Handler;
            POST    : Handler;
            PUT     : Handler;
        };

        export type Slug = {
            [Key in string]: string | string[]
        };
    }
}
