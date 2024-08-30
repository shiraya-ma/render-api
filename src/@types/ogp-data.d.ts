import type {} from 'react';

declare global {
    export type OGPData = {
        image?: string;
        title?: string;
        url?: string;

        message?: string;
    };
}
