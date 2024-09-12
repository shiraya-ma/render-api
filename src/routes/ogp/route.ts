'use strict';
import { initRoute } from "@/libs";

import { getOGP } from "@/features/ogp";

const GET: Mai.Handler = async (req, res) => {
    const _url = req.maiURL;
    const url = _url.searchParams.get('url');

    if (!url) {
        const ogp: OGP.Props = {
            url: '',
            message: 'Need url. @example https://api.shiraya.ma/ogp?url=https://www.google.com'
        };

        res.status(400);

        res.json(ogp);

        res.end();

        return;
    }

    const ogp = await getOGP(url, _url.origin);

    res.status(ogp.message? 500: 200);

    res.json(ogp);

    res.end();
};

export default initRoute({ GET });
