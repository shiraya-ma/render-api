'use strict';
import { getImage } from "@/features/imge";
import { initRoute, log } from "@/libs";

const GET: Mai.Handler = async (req, res) => {
    const _url = req.maiURL;
    const url = _url.searchParams.get('url');

    if (!url) {
        res.status(400);

        res.end();

        return;
    }

    const resultGetImage = await getImage(url);

    if (!resultGetImage) {
        res.status(500);

        res.end();

        return;
    }

    const { contentLength, contentType, data } = resultGetImage;

    res.setHeader('Content-Length', contentLength);
    res.setHeader('Content-Type', contentType);

    res.write(data);

    res.end();

    return;
};

export default initRoute({
    GET
});
