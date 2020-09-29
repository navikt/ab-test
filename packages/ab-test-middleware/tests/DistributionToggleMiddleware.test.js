const { distributionToggleMiddleware, createDistributionToggleMiddleware} = require('../modules/middleware/DistributionToggleMiddleware');

describe('test distribution toggle middleware', () => {
    test('default values should be set when not assigned through parameters', () => {
        let req = { locals: { dists: ['test', 'dist1', 'master'] } };
        createDistributionToggleMiddleware({ distributionToggleInterpreter: () => true });
        distributionToggleMiddleware(req, {}, () => {});
        expect(req.locals.defaultDist).toBe('master')
        let req2 = {};
        distributionToggleMiddleware(req2, {}, () => {});
        expect(req.locals).toBeTruthy();
    });
    test('defaultDist should always be a truthy toggle', () => {
        let req = { locals: { dists: ['testDist', 'dist', 'master'] } };
        createDistributionToggleMiddleware({
            defaultDist: 'testDist',
            distributionToggleInterpreter: jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
        });
        distributionToggleMiddleware(req, {}, () => {});
        expect(req.locals.distributionToggles['testDist']).toBe(true);
    });
    test('distributions should be assigned correct toggle values', () => {
        let req = { locals: { dists: ['testDist', 'dist', 'master'] } };
        createDistributionToggleMiddleware({
            defaultDist: 'testDist',
            distributionToggleInterpreter: jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
        });
        distributionToggleMiddleware(req, {}, () => {});
        expect(req.locals.distributionToggles['dist']).toBe(true);
        expect(req.locals.distributionToggles['master']).toBe(false);
    });
    test('next should be called with error in parameter when no distributions are enabled', () => {
        let req = { locals: { dists: ['testDist', 'dist'], defaultDist: 'default' } };
        createDistributionToggleMiddleware({
            distributionToggleInterpreter: jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
        });
        distributionToggleMiddleware(req, {}, async (e) => {
            expect(await e.message).toEqual('You must enable at least one distribution to run this middleware.');
        });
    });
});
