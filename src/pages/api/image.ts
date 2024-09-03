'use strict';
import { initHandler, log } from "@/libs";

const handler = initHandler({
    GET: async (req, res) => {
        const qUrl = req.query.url;

        if (qUrl === undefined) {
            res.status(400);//.send({ message: `Need query url. @example /api/image?url=<image_url>` });
            return res;
        }

        const url = typeof qUrl === 'string'? qUrl: qUrl.pop()!;
        
        const result = await getImage(url);

        if (result.message) {
            res.status(400).send({ message: result.message });
            return res;
        }

        const image = result.image!;

        res.setHeader('content-type', image.contentType);
        res.setHeader('contnet-size', image.length);

        res.send(image.data);

        return res;
    }
});

export default handler;

async function getImage (url: string): Promise<{ message?: string, image?: Image }> {
    log.info(`[GET-IMAGE] url: ${ url }`);
    try {
        const res = await fetch(url);

        if (!res.ok) {
            return {
                message: `Failed fetch to ${ url }`
            };
        }

        const headers = res.headers;    
        const contentType = headers.get('content-type')!;
        log.debug('content-type:', contentType);

        const IMAGE_TYPES = [
            'image/jpeg'
        ];

        if (!IMAGE_TYPES.some(t => t === contentType)) {
            log.info(`No match content-type [${ contentType }] from [${ url }]`);

            return {
                message: `No match content-type [${ contentType }] from [${ url }]`
            };
        }

        const imageData = Buffer.from(await res.arrayBuffer());

        const length = imageData.length;

        const image: Image = {
            contentType,
            data: imageData,
            length
        };

        return {
            image
        };
    } catch (e) {
        const error = e as Error;
        
        log.error(error.message);

        return {
            message: `Failed fetch to ${ url }`
        };
    }
    
};

type Image = {
    contentType: string;
    data: Buffer;
    length: number;
};
