'use strict';
import { NextApiHandler } from 'next';

export function initHandler (option: InitHandlerOption) {
    const defaultHandler: NextApiHandler = (req, res) => {
        res.status(400).send(`
            <h1>Bad Request</h1>

            <p>Not support method [${ req.method }] on ${ req.url }</p>
        `);
    };

    const handler: NextApiHandler = (req, res) => {
        const _h: NextApiHandler = (option as any)[req.method!] ?? defaultHandler;

        return _h(req, res);
    };

    return handler;
};

export type InitHandlerOption = {
    DELETE?:    NextApiHandler;
    GET?:       NextApiHandler;
    PATCH?:     NextApiHandler;
    POST?:      NextApiHandler;
    PUT?:       NextApiHandler;
};
