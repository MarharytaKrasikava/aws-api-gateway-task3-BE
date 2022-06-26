import { Client } from 'pg';
import dbOptions from './../../dbOptions';

export default async (event: any) => {
  const client = new Client(dbOptions);
  client.connect();

  try {
    const { id } = event.pathParameters;
    const { rows: product } = await client.query(
      `SELECT * FROM products p
       LEFT join stocks s on p.id = s.product_id
       WHERE id = '${id}'`,
    );
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(product),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 404,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  } finally {
    client.end();
  }
};
