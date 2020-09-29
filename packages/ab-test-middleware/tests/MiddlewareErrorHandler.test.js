const { middlewareErrorHandler, createMiddlewareErrorHandler } = require("../modules/middleware/MiddlewareErrorHandler");

beforeAll(() => {
    createMiddlewareErrorHandler({ qualifier: 'test' });
})

describe('test middleware error handler', () => {
    test('errors should be logged', () => {
        console.error = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error');
        middlewareErrorHandler(new Error('test error'), {}, {}, () => {});
        expect(consoleSpy).toBeCalledWith({ qualifier: 'test' }, new Error('test error'));
    });
    test('next function should be called after error', () => {
        const next = jest.fn();
        middlewareErrorHandler(new Error('test error'), {}, {}, next);
        expect(next).toBeCalledTimes(1);
    });
    test('next function should be called without error', () => {
        const next = jest.fn();
        middlewareErrorHandler(undefined, {}, {}, next);
        expect(next).toBeCalledTimes(1);
    })
});
