import { Request, Response } from 'express';
import { Controller } from './controller';
declare function initController(options: any): Controller;
/**
 * Override a handler for a pre-defined route.
 *
 * @example
 * ```ts
 * setCustomHandler('/get_test', (req, res) => {
 *    res.send('Custom handler for GET test');
 * });
 * ```
 */
declare function setCustomHandler(route: keyof typeof defaultHandlers, handler: (req: Request, res: Response) => Promise<void>): void;
/**
 * Create a route handler middleware that handles common logic for controller methods.
 * @param {Function} callback - The controller method to be executed.
 * @returns {Function} - The middleware function for the specified controller method.
 */
declare const routeHandler: (req: any, res: any, callback: any) => Promise<any>;
/**
 * Default routes used by NEFF projects.
 * It's possible to override these handlers inside the project.
 */
declare const defaultHandlers: {
    [key: string]: (req: Request, res: Response) => Promise<void>;
};
export declare const neffRouter: import("express-serve-static-core").Router;
export { initController, routeHandler, setCustomHandler };
