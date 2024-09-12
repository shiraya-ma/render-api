'use strict';

import { getStaticRoute } from "./_get-static-route";
import { getDynamicRoute } from "./_get-dynamic-route";

/**
 * リクエストされたパスネームに一致するRoute Handlerを取得する関数
 * 
 * @param pathname 
 * @param request 
 * @returns 
 */
export async function getRoute(pathname: string, request: Mai.Request): Promise<GetRouteResult | undefined> {
    const pathes = pathname.split('/').filter(p => p !== '');
    
    const getRouteResult =
    (await getStaticRoute(pathes, request)) ??
    (await getDynamicRoute(pathes, request));

    return getRouteResult;
};

export type GetRouteFunction = (pathes: string[], request: Mai.Request) => Promise<GetRouteResult | undefined>;

export type GetRouteResult = { route: Mai.Route, request: Mai.Request };
