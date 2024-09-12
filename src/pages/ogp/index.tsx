'use strict';
import React from 'react';
import Head from 'next/head';
import { type DocumentContext } from 'next/document';

import { getOGP } from '@/features/ogp';
import { OGPCard } from '@/components';
import { log } from '@/libs';

const Page: React.FC<Page.Props> = (props) => {
    const { ogp } = props;

    const data = ogp.data;

    const title = data?.title;

    const desc = data?.description;

    const og = data?.og;

    const fb = data?.fb;

    const twitter = data?.twitter;
    
    return (
        <>
            <Head>
                { title && <title>{ title }</title> }

                { desc && <meta property='description' content={ desc } />}

                { og && Object.entries(og).map(([property, content]) => (
                    <meta property={`og:${ property }`} content={ content } key={`og:${ property }`} />
                ))}

                { fb && Object.entries(fb).map(([property, content]) => (
                    <meta property={`fb:${ property }`} content={ content } key={`fb:${ property }`} />
                ))}

                { twitter && Object.entries(twitter).map(([name, content]) => (
                    <meta name={`twitter:${ name }`} content={ content } key={`twitter:${ name }`} />
                ))}
            </Head>

            <OGPCard ogp={ ogp } />
        </>
    );
};

export const getServerSideProps = async (context: DocumentContext) => {
    const { query } = context;

    const qURL = query.url;

    log.info(`[PAGE] /ogp?url=${ qURL }`);

    const ogp: OGP.Props = await (async () => {
        if (qURL === undefined) {
            const ogp: OGP.Props = {
                url: 'no url',
                message: `Need query url. @example /api/ogp?url=https://www.shiraya.ma`
            };

            return ogp;
        }

        const url = typeof qURL === 'string'? qURL: qURL.pop()!;

        try {
            const ogp = await getOGP(url, '');

            return ogp;
        } catch (e) {
            const err = e as Error;

            log.error(err.message);
            // console.error(err);

            const ogp: OGP.Props = {
                url,
                message: `Failed fetch to ${ url }`
            };

            return ogp;
        }
    })();

    return {
        props: {
            ogp
        },
    };
};

namespace Page {
    export type Props = {
        ogp: OGP.Props;
    };
};

export default Page;
