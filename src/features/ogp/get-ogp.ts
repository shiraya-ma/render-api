'use strict';
import { type HTMLMetaElement, Window } from 'happy-dom';

export async function getOGP (url: string): Promise<OGP.Props> {
    const window = new Window({ url });

    const res = await fetch(url, {
        headers: {
            // TwitterBotのUserAgentを設定
            "User-Agent": "Twitterbot/1.0 Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.12.3 Chrome/69.0.3497.128 Safari/537.36"
        }
    });

    if (!res.ok) {
        return { url, message: `failed to fetch '${ url }'` };
    }

    const text = await res.text();
    const document = window.document;
    document.documentElement.outerHTML = text;

    const head = document.head;
    const metas = Array.from(head.querySelectorAll('meta'));
    const title = head.querySelector('title')?.innerHTML;
    const description = metas
    .filter(meta => meta.getAttribute('name') === 'description')
    .pop()?.getAttribute('content');

    const getContents = ((metas: HTMLMetaElement[]) => <T extends OGP.Common>(prefix: string): T => {
        let data = {};

        const reg = new RegExp(`^${ prefix }:`);

        if (prefix === 'twitter') {
            metas.forEach(meta => console.debug(meta.outerHTML));
        }

        metas.filter(meta =>reg.test(getKey(meta)))
        .forEach(meta => {
            const key = getKey(meta)
            .replace(reg, '')
            .replace(/\_(.)/g, (_, p1) => p1.toUpperCase());

            const value = meta.getAttribute('content');

            (data as any)[key] = value;
        });

        return data as T;
    })(metas);

    const ogp: OGP.Props = {
        url,
        data: {
            title,
            description,
            fb: getContents<OGP.FaceBook>('fb'),
            og: getContents<OGP.Common>('og'),
            twitter: getContents<OGP.Twitter>('twitter')
        }
    };

    return ogp;
};

function getKey (meta: HTMLMetaElement) {
    return meta.getAttribute('property') || meta.getAttribute('name');
};
