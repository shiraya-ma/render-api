'use strict';
import { NextApiRequest } from "next";

export function getOrigin (req: NextApiRequest) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || 'localhost:8080';

    const origin = `${ protocol }://${ host }`;

    return origin;
};
