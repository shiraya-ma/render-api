'use strict';
import { getOGPData } from "@/features/ogp";
import { initHandler } from "@/libs";

const handler = initHandler({
    GET: async (req, res) => {
        const url = req.query.url;

        if (typeof url === 'undefined') {
            const ogp: OGPData = {
                message: `Need query url. @example /api/ogp?url=https://www.shiraya.ma`
            };

            res.status(400).json(ogp);
        }

        else if (typeof url === 'string') {
            try {
                const ogp = await getOGPData(url);
    
                res.status(200).json(ogp);
            } catch (e) {
                const ogp: OGPData = {
                    message: `Failed fetch to ${ url }`
                };

                res.status(500).json(ogp);
            }
        }

        else {
            const ogps = await Promise.all(url.map(async url => {
                try {
                    const ogp = await getOGPData(url);

                    return ogp;
                } catch (e) {
                    const ogp: OGPData = {
                        message: `Failed fetch to ${ url }`
                    };

                    return ogp
                }
            }));

            res.status(200).json(ogps);
        }
    }
});

export default handler;
