import { AuthMethods } from "../util/authMethods"
import { NextFunction, Request, Response } from "express"




export function authMiddleware(req: Partial<Request>, res: Partial<Response>, next: NextFunction): void {
    const token = req.headers?.['x-access-token'];
    try {
        const decoder = AuthMethods.decoderToken(token as string);
        req.decoded = decoder;
      next();
    } catch (err) {
        if (err instanceof Error) {
            res.status?.(401).send({ code: 401, error: err.message });
        } else {
            res.status?.(401).send({ code: 401, error: 'Unknown auth error' });
        }
    }
}

