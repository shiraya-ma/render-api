'use strict';
import { getOGP } from "@/features/ogp";
import { getOrigin, initHandler, log } from "@/libs";

const handler = initHandler({
    GET: async (req, res) => {
        const origin = getOrigin(req);
        const qURL = req.query.url;

        if (qURL === undefined) {
            const ogp: OGP.Props = {
                url: 'no url',
                message: `Need query url. @example /api/ogp?url=https://www.shiraya.ma`
            };           

            res.status(400).json(ogp);

            return;
        }

        const url = typeof qURL === 'string'? qURL: qURL.pop()!;

        try {
            const ogp = await getOGP(url, origin);

            res.status(200).json(ogp);
        } catch (e) {
            const ogp: OGP.Props = {
                url, message: `Failed fetch to ${ url }`
            };

            res.status(500).json(ogp);
        }
    }
});

export default handler;
