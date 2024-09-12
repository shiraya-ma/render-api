'use strict';

export const GET_PARAMS_HANDLER: Mai.Handler = (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    if (!req.maiParams) {
        res.write(`<h1>No Params</h1>`);

        res.end();

        res.status(200);

        return;
    }

    const params = Object.entries(req.maiParams!);

    res.write('<div><h1>Params</h1><ul>');

    params.forEach(param => {
        const [ key, value ] = param;

        if (typeof value === 'string') {
            res.write(`<li><h2>${ key }: ${ value }</h2></li>`);
            return;
        }

        res.write(`<li><h2>${ key }</h2><ul>`);

        value.forEach(value => {
            res.write(`<li><h3>${ value }</h3></li>`);
        });

        res.write('</ul></li>');
    });

    res.write('</ul></div>');

    res.end();

    res.status(200);
};