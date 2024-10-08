// Document
'use strict';
import React from 'react';
import { Html, Head, Main, NextScript } from "next/document";

const Document: React.FC<Document.Props> = (props) => {
    const {} = props;
    
    return (
        <Html lang="jp" className='size-full dark:bg-gray-800 dark:text-white'>
            <Head />

            <body>
                <Main />
                
                <NextScript />
            </body>
        </Html>
    );
};

namespace Document {
    export type Props = {};
};

export {
    Document
};

export default Document;


