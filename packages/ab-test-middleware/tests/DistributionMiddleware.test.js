const path = require('path');

const { distributionMiddleware, createDistributionMiddleware } = require('../modules/middleware/DistributionMiddleware');

jest.mock('../modules/lib/fileExists');
const fileExists = require('../modules/lib/fileExists');
fileExists.mockImplementation(() => true);

describe('test distribution middleware', () => {
    test('next should be called when no dist is available', () => {
        createDistributionMiddleware({});
        let req = {
            locals: {
                dist: 'dist',
                dists: ['dist'],
                distPath: './dist',
                distFolder: 'dist',
                distributionToggles: [{dist: false}]
            }
        };
        const next = jest.fn();
        distributionMiddleware(req, {}, next);
        expect(req.locals.entryFile).toBe('index.html');
        expect(next).toBeCalledWith();
    });
    test('res.sendFile should be called after finding dist', () => {
        createDistributionMiddleware({});
        let req = {
            locals: {
                dist: 'dist',
                dists: ['dist'],
                distPath: './dist',
                distFolder: 'dist',
                distributionToggles: {dist: true}
            }
        };
        const res = { sendFile: jest.fn() }
        distributionMiddleware(req, res, () => {});
        expect(res.sendFile).toBeCalledTimes(1);
        expect(res.sendFile).toBeCalledWith(path.resolve('dist', 'dist', 'index.html'))
    });
    test('res.sendFile should be called with correct filename', () => {
        createDistributionMiddleware({});
        let req = {
            baseUrl: 'index.js',
            locals: {
                dist: 'dist',
                dists: ['dist'],
                distPath: './dist',
                distFolder: 'dist',
                distributionToggles: {dist: true}
            }
        };
        const res = { sendFile: jest.fn() }
        distributionMiddleware(req, res, () => {});
        expect(res.sendFile).toBeCalledTimes(1);
        expect(res.sendFile).toBeCalledWith(path.join('dist', 'index.js'), { root: './dist', index: false });
    });
    test('middleware should call next with error in parameters on error', () => {
        distributionMiddleware(undefined, {}, async (e) => {
            expect(await e.message).toEqual('Cannot read property \'locals\' of undefined');
        });
    });
});
