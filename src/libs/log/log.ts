'use strict';

import { MaiLogger } from "@shiraya-ma/mai-logger";

const level = process.env.NODE_ENV === 'development'? 'TRACE': 'INFO';

export const log = new MaiLogger({ level });
