import { CommonOptions } from 'child_process';
import { StringifyOptions } from 'querystring';
import type {} from 'react';

declare global {
    export namespace OGP {
        export type Props = {
            url: string;
            message?: string;

            data?: {
                title: string | null;
                description: string | null;

                fb: FaceBook;

                og: Common;

                twitter: Twitter
            }
        };

        export type Common = {
            description: string;
            image?: string;
            siteName: string
            title?: string;
            type: string;
            url: string;
        };
        
        export type FaceBook = Common & {
            admins?: string;
            appId: string;
        };

        export type Twitter = Common & {
            card? : string;
            site?: string;
        };
    };
}
