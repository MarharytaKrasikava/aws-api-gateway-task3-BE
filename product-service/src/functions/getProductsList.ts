import { Client } from 'pg';
import dbOptions from './../../dbOptions';

export default async () => {
  const client = new Client(dbOptions);
  client.connect();
  try {
    const { rows: productItems } = await client.query(
      `SELECT * FROM products
       LEFT JOIN stocks
       ON products.id = stocks.product_id`,
    );
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(productItems),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  } finally {
    client.end();
  }
};
