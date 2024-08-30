// Modla
'use strict';
import React from 'react';
import {
    Button,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Modal as NextModal
} from '@nextui-org/react';

const Modla: React.FC<Modla.Props> = (props) => {
    const { url, isOpen, onOpenChange } = props;

    const handlePressCancelBtn = () => {
        onOpenChange(false);
    };

    const handlePressOKBtn = () => {
        onOpenChange(false);

        window.open(url);
    };
    
    return (
        <>
            { url && (
                <NextModal isOpen={ isOpen } onOpenChange={ onOpenChange }>
                    <ModalContent>
                        <ModalHeader>外部のURLを開きます</ModalHeader>

                        <ModalBody>
                            <p className='overflow-hidden break-words'>{ url }</p>
                        </ModalBody>

                        <ModalFooter className='flex gap-4 justify-end'>
                            <Button
                            variant="bordered"
                            onPress={ handlePressCancelBtn }>閉じる</Button>

                            <Button
                            color='primary'
                            variant='solid'
                            onPress={ handlePressOKBtn }>開く</Button>
                        </ModalFooter>
                    </ModalContent>
                </NextModal>
            )}
        </>
    );
};

namespace Modla {
    export type Props = {
        url?: string;
        isOpen: boolean;
        onOpenChange: (isOpen: boolean) => void;
    };
};

export {
    Modla
};
