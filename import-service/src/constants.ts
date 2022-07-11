import { ClientConfig } from 'pg';

export const REGION = 'eu-west-1';
export const BUCKET_NAME = 'uploaded-product-files';

export const HEADERS = {
  'Access-Control-Allow-Origin': 'https://dv0irgcfxah3p.cloudfront.net',
  'Access-Control-Allow-Credentials': true,
};

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: parseInt(PG_PORT as string, 10),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
