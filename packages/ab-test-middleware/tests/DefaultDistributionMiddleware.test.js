const path = require('path');
const { defaultDistributionMiddleware, createDefaultDistributionMiddleware } = require("../modules/middleware/DefaultDistributionMiddleware");

jest.mock('../modules/lib/fileExists');
const fileExists = require('../modules/lib/fileExists');
fileExists.mockImplementation(() => true);

describe('test default distribution middleware', () => {
    test('res.sendFile should be called after finding dist', () => {
        createDefaultDistributionMiddleware();
        let req = {
            locals: {
                entryFile: 'index.html',
                defaultDist: 'dist',
                distPath: './dist',
                distFolder: 'dist'
            }
        };
        const res = {sendFile: jest.fn()}
        defaultDistributionMiddleware(req, res, () => {
        });
        expect(res.sendFile).toBeCalledTimes(1);
        expect(res.sendFile).toBeCalledWith(path.resolve('dist', 'dist', 'index.html'))
    });
    test('res.sendFile should be called with correct filename', () => {
        createDefaultDistributionMiddleware();
        let req = {
            baseUrl: 'index.js',
            locals: {
                entryFile: 'index.html',
                defaultDist: 'dist',
                distPath: './dist',
                distFolder: 'dist',
                ingresses: ['/'],
                modifiedBaseUrl: 'index.js'
            }
        };
        const res = {sendFile: jest.fn()}
        defaultDistributionMiddleware(req, res, () => {
        });
        expect(res.sendFile).toBeCalledTimes(1);
        expect(res.sendFile).toBeCalledWith(path.join('dist', 'index.js'), {root: './dist', index: false});
    });
    test('middleware should call next with error in parameters on error', () => {
        defaultDistributionMiddleware(undefined, {}, async (e) => {
            expect(await e.message).toEqual('Cannot read property \'locals\' of undefined');
        });
    });
});
