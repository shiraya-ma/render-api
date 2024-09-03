'use strict';

import { MaiLogger } from "@shiraya-ma/mai-logger";

const level: MaiLogger.LogLevel = process.env.NODE_ENV === 'development'? 'TRACE': 'TRACE';

export const log = new MaiLogger({ level });
