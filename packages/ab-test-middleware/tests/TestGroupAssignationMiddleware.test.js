const {testGroupAssignationMiddleware, createTestGroupAssignationMiddleware} = require('../modules/middleware/TestGroupAssignationMiddleware')
describe('test test group assignation middleware', () => {
    test('requests already in enabled test groups should be ignored', () => {
        let req = {
            locals: {
                dist: 'dist',
                defaultDist: 'dist',
                distributionToggles: { dist: true },
                isInTestGroup: true,
                cookieName: 'cookieName'
            }
        };
        const next = jest.fn();
        testGroupAssignationMiddleware(req, {}, next);
        expect(next).toBeCalledWith();
    });
    test('request should be assigned a valid distribution', () => {
        let req = {
            locals: {
                dist: undefined,
                defaultDist: 'dist',
                distributionToggles: { test: true, test2: true },
                isInTestGroup: true,
                cookieName: 'cookieName'
            }
        };
        const opts = {
            testGroupToggleInterpreter: jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
        }
        const res = { cookie: jest.fn() };
        const next = jest.fn();
        createTestGroupAssignationMiddleware(opts);
        testGroupAssignationMiddleware(req, res, next);
        expect(req.locals.isInTestGroup).toBeTruthy();
        expect(res.cookie).toBeCalledWith('cookieName', 'test2', { maxAge: 604800000 * 2 });
        expect(next).toBeCalledWith();
    });
    test('distributions should be randomized when setting options.randomizeTestGroupDistribution to true', () => {
        let req = {
            locals: {
                dist: undefined,
                defaultDist: 'dist',
                distributionToggles: { test: true, test2: true },
                isInTestGroup: true,
                cookieName: 'cookieName'
            }
        };
        const opts = {
            randomizeTestGroupDistribution: true,
            testGroupToggleInterpreter: jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
        }
        const mathSpy = jest.spyOn(Math, 'random');
        createTestGroupAssignationMiddleware(opts);
        testGroupAssignationMiddleware(req, {}, () => {});
        expect(mathSpy).toBeCalledTimes(1);
    });
    test('request should default to default distribution', () => {
        let req = {
            locals: {
                dist: 'dist',
                defaultDist: 'dist',
                distributionToggles: {},
                cookieName: 'cookieName'
            }
        };
        const res = { cookie: jest.fn() };
        const next = jest.fn();
        testGroupAssignationMiddleware(req, res, next);
        expect(req.locals.isInTestGroup).toBeTruthy();
        expect(res.cookie).toBeCalledWith('cookieName', 'dist', { maxAge: 604800000 * 2 });
        expect(next).toBeCalledWith();
    });
    test('middleware should call next with error in parameters on error', () => {
        testGroupAssignationMiddleware(undefined, {}, async (e) => {
            expect(await e.message).toEqual('Cannot read property \'locals\' of undefined');
        });
    });
})
;
