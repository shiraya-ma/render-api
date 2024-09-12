'use strict';
import { resolve } from 'path';
import express, { type Request as ExRequest } from 'express';
import compression from 'compression';
import helmet from 'helmet';

import { getRoute, log, Route } from '@/libs';
import { atachURL, requestLogger } from '@/middlewares';

const port = Number(String(import.meta.env.PORT ?? 8080));

const app = express();

app
.use(helmet())
.use(compression({ level: 9 }))
.use(atachURL)
.use(requestLogger)
.use((_, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    next();
})
.get('/favicon.ico', (_, res) => {
    res.header('content-type', 'image/x-icon');
    
    res.sendFile(resolve(__dirname, 'favicon.ico'));
    // next();
})
.all('/*', async (req: ExRequest, res, next) => {
    if (req.url === '/favicon.ico') {
        next();
        return;
    }

    const url = new URL(`${ req.protocol }://${ req.get('host')}${ req.originalUrl }`);

    const request = req as Mai.Request;

    const method = request.method as MethodType;

    const getRouteResult = await getRoute(url.pathname, request);

    if (getRouteResult) {
        const { route, request } = getRouteResult;

        await route[method](request, res, next);

        return;
    }

    res.setHeader('Content-Type', 'text/plain');

    res.write('404 Not Found.');

    res.end();
    return;
})
.use((_, res, next) => {
    res.flushHeaders();

    // res.getHeaderNames()
    // .forEach(name => log.debug(`    ${ name }:`, res.getHeader(name)));

    next();
});

app.listen(port, () => {
    log.info(`Server is running on PORT:${ port }.`);
});

type MethodType = keyof Route;
