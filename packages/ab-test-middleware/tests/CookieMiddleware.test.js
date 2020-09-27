const { cookieMiddleware, createCookieMiddleware } = require('../modules/middleware/CookieMiddleware')

beforeAll(() => {
    createCookieMiddleware({cookieName: 'cookieName'});
})

describe('test cookie middleware', () => {
    test('expect distribution to be set based on cookie', () => {
        let req = { headers: { cookie: 'cookieName=dist;' }, locals: { defaultDist: 'default' } };
        cookieMiddleware(req, {}, () => {
            expect(req.locals.dist).toBe('dist');
            expect(req.locals.isInTestGroup).toBe(true);
        });
    });
    test('expect distribution to be set based on default value', () => {
        let req = { locals: { defaultDist: 'default' } };
        cookieMiddleware(req, {}, () => {
            expect(req.locals.dist).toBe('default');
            expect(req.locals.isInTestGroup).toBe(false);
        });
    });
});
