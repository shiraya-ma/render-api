'use strict';
import type { Request, Response, NextFunction } from 'express';

export function atachURL (req: Request, _: Response, next: NextFunction) {
    const url = new URL(`${ req.protocol }://${ req.get('host')}${ req.originalUrl }`);

    const request = req as Mai.Request;

    request.maiURL = url;

    next();
};
