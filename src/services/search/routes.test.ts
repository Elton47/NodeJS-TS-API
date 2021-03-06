import express, { Router } from 'express';
import promiseRequest from 'request-promise';
import request from 'supertest';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import { applyMiddleware, applyRoutes } from '../../utils';
import routes from './routes';

jest.mock('request-promise');
(promiseRequest as any).mockImplementation(() => '{"features": []}');

describe('routes', () => {
  let router: Router;

  beforeEach(() => {
    router = express();
    applyMiddleware(middleware, router);
    applyRoutes(routes, router);
    applyMiddleware(errorHandlers, router);
  });

  test('a valid string query', async () => {
    const response = await request(router).get('/api/v1/search?q=Cham');
    expect(response.status).toEqual(200);
  });

  test('a non-existing api method', async () => {
    const response = await request(router).get('/api/v1/search');
    expect(response.status).toEqual(404);
  });

  test('an empty string', async () => {
    const response = await request(router).get('/api/v1/search?q=');
    expect(response.status).toEqual(400);
  });
});