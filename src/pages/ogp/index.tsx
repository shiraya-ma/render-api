'use strict';
import React from 'react';
import { type DocumentContext } from 'next/document';

import { getOGP } from '@/features/ogp';
import { OGPCard } from '@/components/ogp-card';
import Head from 'next/head';

const Page: React.FC<Page.Props> = (props) => {
    const { ogp } = props;

    if (typeof (ogp as Array<OGP.Props>).length !== 'undefined') {
        const ogps = ogp as Array<OGP.Props>;

        return (
            <div className='flex flex-col gap-4'>
                { ogps.map((ogp, index) => (<OGPCard ogp={ ogp } key={ index }/>)) }
            </div>
        );
    }

    const _ogp = ogp as OGP.Props;

    const data = _ogp.data;

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

            <OGPCard ogp={ ogp as OGP.Props } />
        </>
    );
};

export const getServerSideProps = async (context: DocumentContext) => {
    const { query } = context;

    const url = query.url;

    const ogp: OGP.Props | OGP.Props[] = await (async () => {
        if (typeof url === 'undefined') {
            const ogp: OGP.Props = {
                url: 'no url',
                message: `Need query url. @example /api/ogp?url=https://www.shiraya.ma`
            };

            return ogp;
        }

        else if (typeof url === 'string') {
            try {
                const ogp = await getOGP(url);
    
                return ogp;
            } catch (e) {
                const ogp: OGP.Props = {
                    url,
                    message: `Failed fetch to ${ url }`
                };

                return ogp;
            }
        }

        else {
            const ogps = await Promise.all(url.map(async url => {
                try {
                    const ogp = await getOGP(url);

                    return ogp;
                } catch (e) {
                    const ogp: OGP.Props = {
                        url,
                        message: `Failed fetch to ${ url }`
                    };

                    return ogp
                }
            }));

            return ogps;
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
        ogp: OGP.Props | OGP.Props[];
    };
};

export default Page;
