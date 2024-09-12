'use strict';
import { parse, type HTMLElement } from 'node-html-parser';

import { log } from '@/libs';

export async function getOGP (url: string, origin: string): Promise<OGP.Props> {
    log.info('[GET-OGP] url:', url);

    try {
        const res = await fetch(url, {
            headers: {
                // TwitterBotのUserAgen設定
                "User-Agent": "Twitterbot/1.0 Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.12.3 Chrome/69.0.3497.128 Safari/537.36"
            }
        });
    
        if (!res.ok) {
            return { url, message: `failed to fetch '${ url }'` };
        }

        const text = await res.text();

        const document = parse(text);    
        const head = document.querySelector('head')!;
        const metas = Array.from(head.querySelectorAll('meta'));
        const title = head.querySelector('title')?.innerHTML || null;
        const description = metas
        .filter(meta => meta.getAttribute('name') === 'description')
        .pop()?.getAttribute('content') || null;
    
        // metas.forEach(meta => log.debug(meta.outerHTML));
    
        const getContents = ((metas: HTMLElement[]) => <T extends OGP.Common>(prefix: string): T => {
            let data = {};
    
            const reg = new RegExp(`^${ prefix }:`);
    
            metas.filter(meta =>reg.test(getKey(meta) ?? ''))
            .forEach(meta => {
                const key = getKey(meta)!
                .replace(reg, '');
    
                const Key = key.replace(/\_(.)/g, (_, p1) => p1.toUpperCase());
    
                const value = meta.getAttribute('content');
    
                // if (/image$/.test(key)) {
                //     log.warn('key  :', key);
                //     log.warn('value:', value);
                // }
    
                (data as any)[Key] = /image$/.test(key)? `${ origin }/api/image?url=${ encodeURIComponent(value!) }`: value;
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
    
        log.trace(`ogp:\n\t${ JSON.stringify(ogp, null, 2).replace(/\n/g, '\n\t') }`);
    
        return ogp;

        // return {
        //     url,
        //     message: 'temp'
        // }
    } catch (e) {
        log.error(e);

        if (e instanceof Error) {
            return {
                url,
                message: e.message
            };
        }

        else {
            return {
                url,
                message: 'Internal Server Error.'
            }
        }
    }    
};

function getKey (meta: HTMLElement) {
    return meta.getAttribute('property') || meta.getAttribute('name');
};
