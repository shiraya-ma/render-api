'use strict';
import { type HTMLHeadElement, type HTMLMetaElement, Window } from 'happy-dom';

export async function getOGPData (url: string) {    
    const window = new Window({ url });

    const res = await fetch(url, {
        headers: {
            // TwitterBotのUserAgentを設定
            "User-Agent": "Twitterbot/1.0 Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.12.3 Chrome/69.0.3497.128 Safari/537.36"
        }
    });

    if (!res.ok) {
        throw new Error(`failed to fetch '${ url }'`);
    }

    const text = await res.text();

    const document = window.document;

    document.documentElement.outerHTML = text;

    const head = document.head;

    const metas = Array.from(head.querySelectorAll('meta'))
    .filter(meta => {
        const property = meta.getAttribute('property');

        if (property === undefined || property === null) {
            return false;
        }

        return /(og|twitter):/.test(property);
    });

    // Array.from(head.querySelectorAll('meta'))
    // metas.forEach(meta => console.debug(meta.outerHTML));

    const title = getContent(metas, 'title') ?? getTitle(head);

    const image = getContent(metas, 'image');

    const ogpData: OGPData = {
        image,
        title,
        url
    };

    return ogpData;
};

function getContent (metas: HTMLMetaElement[], property: string) {
    const target = metas.find(meta => meta.getAttribute('property')?.match(property));

    const content = target?.getAttribute('content');

    return content;
};

function getTitle (head: HTMLHeadElement): string | undefined {
    const title = head.querySelector('title');

    return title?.textContent ?? undefined;
};
