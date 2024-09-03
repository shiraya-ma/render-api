'use strict';

import { initHandler } from "@/libs";

const handler = initHandler({
    GET: (_, res) => {
        const now = new Date();

        console.log(`Recieved ping ${ now.toLocaleString() }`);

        res.status(200).json({});
    }
});

export default handler;
