'use strict';
import { log } from '@/libs';

const REG_CONTENT_TYPE = /^image\/.+/;

export async function getImage (url: string): Promise<Image | undefined> {
    log.info('[GET-IMAGE] url:', url);

    try {
        const res = await fetch(url, {
            headers: {
                // TwitterBotのUserAgen設定
                "User-Agent": "Twitterbot/1.0 Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.12.3 Chrome/69.0.3497.128 Safari/537.36"
            }
        });
    
        if (!res.ok) {
            log.error('[GET-IMAGE] Failed fetch to', url);

            return undefined;
        }

        const contentLength = res.headers.get('content-length');

        if (!contentLength) {
            log.error('[GET-IMAGE] Not found content-length');

            return undefined;
        }

        const blob = await res.blob();

        const contentType = res.headers.get('content-type') || blob.type;

        if (!contentType) {
            log.error('[GET-IMAGE] Not found content-type');

            return undefined;
        }

        if (!REG_CONTENT_TYPE.test(contentType)) {
            log.error('[GET-IMAGE] Not match content-type to image', contentType);

            return undefined;
        }

        const buffer = new Uint8Array(await blob.arrayBuffer());

        return {
            contentLength,
            contentType,
            data: buffer
        }
    } catch (e) {
        log.error(e);

        return undefined;
    }
}

type Image = {
    contentType: string;
    contentLength: string;
    data: any
};
