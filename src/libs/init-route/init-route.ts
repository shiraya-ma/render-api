'use strict';

import { Route, type InitilizeRouteOption } from "@/libs";

export function initRoute (option: InitilizeRouteOption): Route {
    return new Route(option);
};
