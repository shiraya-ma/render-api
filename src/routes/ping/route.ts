'use strict';

import { initRoute } from "@/libs";

const GET: Mai.Handler = (_, res) => {
    res.status(200);

    res.write('ping...');

    res.end();
};

export default initRoute({
    GET
});
