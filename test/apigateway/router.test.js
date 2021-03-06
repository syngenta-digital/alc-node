const {assert} = require('chai');
const {Router} = require('../../src').apigateway;
const mockData = require('./mock-data');
const mockPermissions = require('./mock-permissions-middleware');

describe('Test Router', () => {
    describe('test route', () => {
        it('found app route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('found app route; no trailing /', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: '/test/apigateway',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('found public route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('client-'),
                basePath: 'client-unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('did not find route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '-fail'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 404,
                body: '{"errors":[{"key_path":"url","message":"endpoint not found"}]}'
            });
        });
        it('method not allowed', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '', 'GET'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 403,
                body: '{"errors":[{"key_path":"method","message":"method not allowed"}]}'
            });
        });
        it('defaults to index', async () => {
            this.router = new Router({
                event: await mockData.getIndexApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: '/test/apigateway'
            });
            const results = await this.router._getRequiredModule();
            assert.equal(results, '/test/apigateway/index');
        });
        it('ran route without the need of requirements export', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRouteNoRequirements(),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('test permissions fail', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '', 'PATCH'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                beforeAll: mockPermissions.checkPermissions
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"headers","message":"in appropriate api-key"}]}'
            });
        });
        it('test permissions pass', async () => {
            const event = await mockData.getApiGateWayRoute('', '', 'PATCH');
            event.headers['x-api-key'] = 'passing-key';
            this.router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                beforeAll: mockPermissions.checkPermissions
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
    });
});
