// OGPCard
'use strict';
import React, { MouseEvent } from 'react';
import { Link, useDisclosure } from '@nextui-org/react';

import { Modla } from './modal';

const OGPCard: React.FC<OGPCard.Props> = (props) => {
    const { ogp } = props;

    const {
        image,
        message,
        title,
        url
    } = ogp;    

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const handleClickLink = (ev: MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();

        try {
            new URL(ev.currentTarget.href);
        } catch (e) {
            return;
        }

        onOpen();
    };

    return (
        <>
            <Link
            href={ url ?? '#' }
            target="_blank" 
            rel="noreferrer noopener"
            className="flex w-full h-[128px] border border-gray-500/70 rounded-lg items-center justify-between overflow-hidden break-all [&_*]:not-italic [&_*]:dark:text-white"
            onClick={ handleClickLink }
            isExternal
            color='primary'>
                <i className='flex flex-col grow h-full p-4'>
                    { message?
                        (<>
                            <p>{ message }</p>
                        </>): 
                        (<>
                            <b
                            className='block overflow-hidden line-clamp-2 text-[hsl(var(--nextui-foreground))]'
                            style={{ boxOrient: "vertical"}}>
                                { title }
                            </b>       

                            <small className='block h-fit'>
                                { url ?? '#' }
                            </small>
                        </>)
                    }
                </i>

                { image && (
                    <i className='flex shrink-0 grow-0 border-l-gray-500' style={{ width: 128, height: 128 }}>
                        <img src={ image } className="object-cover"/>
                    </i>
                )}
            </Link>

            <Modla url={ url } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
        </>
    );
};

namespace OGPCard {
    export type Props = {
        ogp: OGPData;
    };
};

export {
    OGPCard
};
