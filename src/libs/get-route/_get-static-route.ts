'use strict';
import { existsSync } from 'fs';
import { resolve } from 'path';

import { Route } from '@/libs';

import { __routesDir } from './_routes-dir';
import { type GetRouteFunction } from "./get-route";

/**
 * DynamicRoutingを含まないHandlerを取得する関数
 * 
 * @param pathes 
 * @param request 
 * @returns 
 */
export const getStaticRoute: GetRouteFunction = async (pathes, request) => {
    /** 完全一致するハンドラーのパス */
    const routeDir = resolve(__routesDir, ...pathes, 'route.ts');

    /** ハンドラーのファイルが存在するか */
    const existsRoute = existsSync(routeDir);

    if (!existsRoute) {
        return undefined;
    }

    const route: Route | undefined = (await import(routeDir)).default;

    if (route === undefined || !(route instanceof Route)) {
        return undefined;
    }
    
    return { route, request };
};
