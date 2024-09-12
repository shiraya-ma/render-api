'use strict';
import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

import { log, Route } from '@/libs';

import { __routesDir } from './_routes-dir';
import { type GetRouteFunction } from "./get-route";

const REG_SLUG_NAME = /[^\.|\[|\]]+/;

const REG_DYNAMIC = /^\[[^\.]+]$/;

const REG_CATCH_SEGMENT = /^\[{1,2}\.{3}[^\.|\]]+]{1,2}$/;

const REG_OPTIONAL_CATCH_SEGMENT = /^\[{2}\.{3}[^\.|\]]+]{2}$/;

/**
 * DynamicRoutingを含むハンドラーを取得する関数 
 * 
 * @param pathes 
 * @param request 
 * @returns 
 */
export const getDynamicRoute: GetRouteFunction = async (pathes, request) => {
    const currentPathes: string[] = [];
    const params: Mai.Slug = {};

    let isCatchSegment = false;
    let catchSegmentSlugName = '';

    for (let path of pathes) {
        // Catch Segment以外の処理
        if (!isCatchSegment) {
            /** 現在のディレクトリ */
            const currentDir = resolve(__routesDir, ...currentPathes, path);
            /** 現在のディレクトリが存在するか */
            const existsCurrentDir = existsSync(currentDir);

            // console.debug('currentDir:', currentDir, '\n    exists:', existsCurrentDir);

            if (existsCurrentDir) {
                currentPathes.push(path);
                continue;
            }

            /** 同じ階層のディレクトリを読み取り */
            const readdirs = readdirSync(resolve(__routesDir, ...currentPathes));

            // console.debug('   ', readdirs);

            /** Dynamic Routing用ディレクトリの配列 */
            const dynamicDirs = readdirs.filter(dir => REG_DYNAMIC.test(dir));

            if (dynamicDirs.length > 1) {
                log.error('Duplicated dynamic routing directories.');
                log.error(dynamicDirs);
                return undefined;
            }

            /** Dynami Routing用ディレクトリ */
            const dynamicDir = dynamicDirs[0];
            
            if (dynamicDir !== undefined) {
                const slugName = dynamicDir.replace(/^\[{1,2}(.*)\]{1,2}$/, '$1');
                const slugValue = path;

                if (params[slugName] !== undefined) {
                    log.error(`Duplicated slug name [${ slugName }].`);
                    return undefined;
                }

                params[slugName] = slugValue;

                // console.debug('    params:', JSON.stringify(params));

                currentPathes.push(dynamicDir);

                continue;
            }

            /** Catch Segment用ディレクトリの配列 */
            const catchSegmentDirs = readdirs.filter(dir => REG_CATCH_SEGMENT.test(dir));

            if (catchSegmentDirs.length > 1) {
                log.error('Duplicated catch segment directories.');
                log.error(catchSegmentDirs);
                return undefined;
            }

            /** Dynami Routing用ディレクトリ */
            const catchSegmentDir = catchSegmentDirs[0];

            if (catchSegmentDir !== undefined) {
                const slugName = catchSegmentDir.match(REG_SLUG_NAME)![0];
                const slugValue = path;

                if (params[slugName] !== undefined) {
                    log.error(`Duplicated slug name [${ slugName }].`);
                    return undefined;
                }

                catchSegmentSlugName = slugName;

                params[slugName] = [ slugValue ];

                // console.debug('    params:', JSON.stringify(params));

                currentPathes.push(catchSegmentDir);

                isCatchSegment = true;

                continue;
            }
        }

        else if (isCatchSegment) {
            (params[catchSegmentSlugName] as Array<string>).push(path);

            // console.debug('    params:', JSON.stringify(params));
        }
    }

    const routeDir = resolve(__routesDir, ...currentPathes, 'route.ts');
    const existsRoute = existsSync(routeDir);
    // console.debug('routeDir:', routeDir, '\n    exists:', existsRoute);

    if (!existsRoute) {
        const parentDir = resolve(routeDir, '..');

        // console.debug('parentDir:', parentDir);        

        const dirs = readdirSync(parentDir);

        const optionalCatchSegmentDirs = dirs.filter(dir => REG_OPTIONAL_CATCH_SEGMENT.test(dir));

        if (optionalCatchSegmentDirs.length > 1) {
            log.error('Duplicated optional catch segment directories.');
            log.error(optionalCatchSegmentDirs);
            return undefined;
        }

        const optionalCatchSegmentDir = optionalCatchSegmentDirs[0];

        if (optionalCatchSegmentDir !== undefined) {
            const slugName = optionalCatchSegmentDir.match(REG_SLUG_NAME)![0];

            if (params[slugName] !== undefined) {
                log.error(`Duplicated slug name [${ slugName }].`);
                return undefined;
            }

            params[slugName] = [];

            const optionalCatchSegmentRouteDir = resolve(routeDir, '..', optionalCatchSegmentDir, 'route.ts');

            const route: Route | undefined = (await import(optionalCatchSegmentRouteDir)).default;

            if (route === undefined || !(route instanceof Route)) {
                return undefined;
            }
    
            request.maiParams = params;    
            
            return { route, request };
        }

        return undefined;
    }

    const route: Route | undefined = (await import(routeDir)).default;

    if (route === undefined || !(route instanceof Route)) {
        return undefined;
    }

    request.maiParams = params;    
    
    return { route, request };
};
