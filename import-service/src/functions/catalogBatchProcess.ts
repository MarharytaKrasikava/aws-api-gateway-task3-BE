import { Client } from 'pg';
import { dbOptions, HEADERS } from './../constants';

export default async (event: any) => {
  // receive SQS messages and add to the database
  // send a email through SNS topic "createProductTopic"
  const client = new Client(dbOptions);
  await client.connect();
  console.log(event.Records);

  try {
    for (const record of event.Records) {
      const { title, description, price, count } = JSON.parse(record.body);

      console.log(title, description, price, count);

      client.query('BEGIN');

      await client.query(
        `WITH ins1 as (INSERT INTO products (title, description, price)
            VALUES ('${title}', '${description}', ${price})
            returning id AS new_product_id)
            insert into stocks (product_id, count)
            SELECT new_product_id, ${count} from ins1`
      );

      console.log('inserted');

      await client.query('COMMIT');
      // send a email through SNS topic "createProductTopic"
    }

    return {
      statusCode: 201,
      headers: HEADERS,
    };
  } catch (err) {
    client.query('ROLLBACK');

    return {
      statusCode: 500,
      message: err?.message || 'Unable to add a batch',
    };
  } finally {
    await client.end();
  }
};
