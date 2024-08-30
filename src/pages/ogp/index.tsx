'use strict';
import React from 'react';
import { type DocumentContext } from 'next/document';

import { getOGPData } from '@/features/ogp';
import { OGPCard } from './_ogp-card';

const Page: React.FC<Page.Props> = (props) => {
    const { ogp } = props;

    if (typeof (ogp as Array<OGPData>).length !== 'undefined') {
        const ogps = ogp as Array<OGPData>;

        return (
            <div className='flex flex-col gap-4'>
                { ogps.map((ogp, index) => (<OGPCard ogp={ ogp } key={ index }/>)) }
            </div>
        );
    }
    
    return (
        <OGPCard ogp={ ogp as OGPData } />
    );
};

export const getServerSideProps = async (context: DocumentContext) => {
    const { query } = context;

    const url = query.url;

    const ogp: OGPData | OGPData[] = await (async () => {
        if (typeof url === 'undefined') {
            const ogp: OGPData = {
                message: `Need query url. @example /api/ogp?url=https://www.shiraya.ma`
            };

            return ogp;
        }

        else if (typeof url === 'string') {
            try {
                const ogp = await getOGPData(url);
    
                return ogp;
            } catch (e) {
                const ogp: OGPData = {
                    message: `Failed fetch to ${ url }`
                };

                return ogp;
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
        ogp: OGPData | OGPData[];
    };
};

export default Page;
