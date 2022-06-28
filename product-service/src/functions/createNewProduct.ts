import { Client } from 'pg';
import dbOptions from './../../dbOptions';

export default async (event: any) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { title, description, price, count } = JSON.parse(event.body);
    if (!title || !description || !price) {
      return { statusCode: 400, message: 'Some field(s) are missing' };
    }

    client.query('BEGIN');

    await client.query(
      `WITH ins1 as (INSERT INTO products (title, description, price)
        VALUES ('${title}', '${description}', ${price})
        returning id AS new_product_id)
        insert into stocks (product_id, count)
        SELECT new_product_id, ${count} from ins1`,
    );
    const { rows: products } = await client.query(
      `SELECT * FROM products p
        LEFT join stocks s on p.id = s.product_id`,
    );
    await client.query('COMMIT');
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(products),
    };
  } catch (err) {
    client.query('ROLLBACK');

    return { statusCode: 500, message: err?.message || 'Unable to add item' };
  } finally {
    await client.end();
  }
};
