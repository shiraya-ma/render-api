'use strict';
import { initRoute } from "@/libs";

const GET: Mai.Handler = (_, res, next) => {
    res.write('{ "text": "hello express!." }');

    res.end();

    next();
};

export default initRoute({
    GET
});
