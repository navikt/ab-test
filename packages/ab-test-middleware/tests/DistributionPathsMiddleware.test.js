const { statSync, readdirSync } = require('fs');
const { distributionPathsMiddleware, createDistributionPathsMiddleware } = require("../modules/middleware/DistributionPathsMiddleware");

jest.mock('fs', () => ({
    statSync: jest.fn(),
    readdirSync: jest.fn()
}));

beforeAll(() => {
    statSync.mockImplementation(() => ({ isDirectory: () => true }));
    readdirSync
        .mockReturnValueOnce(['test', 'dist1'])
        .mockReturnValueOnce([])
        .mockReturnValueOnce(['test', 'dist1'])
        .mockReturnValueOnce(['test', 'dist1'])
        .mockReturnValueOnce(['test', 'dist1']);
})

describe('test distribution paths middleware', () => {
    test('path related variables should be added to request', () => {
        let req = {};
        createDistributionPathsMiddleware({ distFolder: 'testFolder', defaultDist: 'test' });
        distributionPathsMiddleware(req, {}, () => {});
        expect(req.locals.defaultDist).toBe('test');
        expect(req.locals.distFolder).toBe('testFolder');
        expect(req.locals.distPath).toBe('./testFolder');
        expect(req.locals.dists.length).toBe(2);
    });
    test('middleware should fail if there are no available distributions', () => {
        createDistributionPathsMiddleware({ distFolder: 'testFolder', defaultDist: 'test' });
        distributionPathsMiddleware({}, {}, async (e) => {
            expect(await e.message).toEqual('At least one distribution is required to run this middleware.')
        });
    });
    test('middleware should fail if defaultDist does not exist', () => {
        createDistributionPathsMiddleware({ distFolder: 'testFolder', defaultDist: 'nonExistingDist' });
        distributionPathsMiddleware({}, {}, async (e) => {
            expect(await e.message).toEqual('Default distribution does not match any available distributions.')
        });
    });
    test('default values should be set when not assigned through parameters', () => {
        let req = {};
        createDistributionPathsMiddleware({});
        distributionPathsMiddleware(req, {}, () => {});
        expect(req.locals.defaultDist).toBe('master');
        expect(req.locals.distFolder).toBe('dist');
        expect(req.locals.distPath).toBe('./dist');
    });
    test('paths should only be set once per instanciated middleware', () => {
        let req1 = {};
        let req2 = {};
        createDistributionPathsMiddleware({});
        distributionPathsMiddleware(req1, {}, () => {});
        expect(req1.locals.dists.length).toBe(2);
        distributionPathsMiddleware(req2, {}, () => {});
        expect(req2.locals.dists).toEqual(req1.locals.dists);
    })
    test('request.locals should not be overwritten', () => {
        let req = { locals: { someValue: 'someValue' } }
        distributionPathsMiddleware(req, {}, () => {});
        expect(req.locals.someValue).toBeTruthy();
    });
    test('middleware should call next with error in parameters on error', () => {
        distributionPathsMiddleware(undefined, {}, async (e) => {
            expect(await e.message).toEqual('Cannot read property \'locals\' of undefined');
        });
    });
});
