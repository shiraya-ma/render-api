'use strict';
import type { Request, Response, NextFunction } from 'express';

import { log } from '@/libs';

export function requestLogger (req: Request, _: Response, next: NextFunction) {
    const { maiURL: url, method} = req as Mai.Request;

    // const black   = '\u001b[30m';
    const red     = '\u001b[31m';
    const green   = '\u001b[32m';
    // const yellow  = '\u001b[33m';
    const blue    = '\u001b[34m';
    // const magenta = '\u001b[35m';
    // const cyan    = '\u001b[36m';
    // const white   = '\u001b[37m';
    
    const reset   = '\u001b[0m';

    let tagColor = reset;

    switch (method) {
        case 'DELETE': {
            tagColor = red;
            break;
        }
        case 'GET': {
            tagColor = green;
            break;
        }
        case 'POST': {
            tagColor = blue;
            break;
        }
    }

    const tag = `${ tagColor }[${ method }]${ reset }`;

    log.info(tag, `${ url.pathname }${ url.search || '' }`);
    
    next();
};
