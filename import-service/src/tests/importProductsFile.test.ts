import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import importProductsFile from '../functions/importProductsFile';

describe('ImportProductsFile', () => {
  const s3Mock = mockClient(S3Client);

  beforeEach(() => {
    beforeEach(() => {
      s3Mock.on(PutObjectCommand).resolves({});
    });
    afterEach(() => {
      s3Mock.reset();
    });
  });

  test('should get signed url if query parameter was passed', async () => {
    const name = 'testName';
    const response = await importProductsFile({
      queryStringParameters: {
        name,
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test('should get 400 response if name parameter is absent', async () => {
    const response = await importProductsFile({
      queryStringParameters: {
        name: '',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Please, provide a query parameter "name"');
  });

  test('should get 500 response if any other server error', async () => {
    const response = await importProductsFile(null);

    expect(response.statusCode).toBe(500);
  });
});
