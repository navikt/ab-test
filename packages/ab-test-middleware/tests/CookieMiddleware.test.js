const { getCookie, cookieMiddleware, createCookieMiddleware } = require('../modules/middleware/CookieMiddleware');

beforeAll(() => {
    createCookieMiddleware({cookieName: 'cookieName'});
})

describe('test cookie middleware', () => {
    test('getCookie function should return empty string when no match is found', () => {
       expect(getCookie({ headers: { cookie: '' } })).toBeFalsy();
    });
    test('distribution should be set based on cookie', () => {
        let req = { headers: { cookie: 'cookieName=dist;' }, locals: { defaultDist: 'default' } };
        cookieMiddleware(req, {}, () => {
            expect(req.locals.dist).toBe('dist');
            expect(req.locals.isInTestGroup).toBe(true);
        });
    });
    test('distribution should be set based on default value', () => {
        let req = { locals: { defaultDist: 'default' } };
        cookieMiddleware(req, {}, () => {
            expect(req.locals.dist).toBe('default');
            expect(req.locals.isInTestGroup).toBe(false);
        });
    });
    test('default values should be set when not assigned through parameters', () => {
        createCookieMiddleware({});
        let req = { locals: { defaultDist: 'default' } };
        cookieMiddleware(req, {},() => {
            expect(req.locals.cookieName).toBe('testGroup');
        });
    });
    test('middleware should call next with error in parameters on error', () => {
        cookieMiddleware(undefined, {}, async (e) => {
            expect(await e.message).toEqual('Cannot read property \'locals\' of undefined');
        });
    });
});
