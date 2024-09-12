'use strict';

export class Route implements Mai.Route {

    private static _DEFAULT: Mai.Handler = (_, res) => {
        res.status(405);
        res.write('405 Method Not Allowed');
        res.end();
    }

    public DELETE   = Route._DEFAULT;
    public GET      = Route._DEFAULT;
    public HEAD     = Route._DEFAULT;
    public OPTION   = Route._DEFAULT;
    public PATCH    = Route._DEFAULT;
    public POST     = Route._DEFAULT;
    public PUT      = Route._DEFAULT;

    constructor (option: InitilizeRouteOption) {
        const handlers = Object.entries(option) as [ Method, Mai.Handler ][];

        for (let handler of handlers) {
            const [ method, _handler ] = handler;

            this[method] = _handler;
        }
    };
};

export type InitilizeRouteOption = {
    DELETE?:    Mai.Handler;
    GET?:       Mai.Handler;
    HEAD?:      Mai.Handler;
    OPTION?:    Mai.Handler;
    PATCH?:     Mai.Handler;
    POST?:      Mai.Handler;
    PUT?:       Mai.Handler;
};

type Method = keyof Mai.Route;
