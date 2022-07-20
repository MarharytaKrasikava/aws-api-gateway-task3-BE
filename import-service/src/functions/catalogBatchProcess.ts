import { Client } from 'pg';
import { dbOptions, HEADERS, REGION } from './../constants';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export default async (event: any) => {
  // receive SQS messages and add to the database
  // send a email through SNS topic "createProductTopic"
  const pgClient = new Client(dbOptions);
  const snsClient = new SNSClient({ region: REGION });
  await pgClient.connect();
  console.log(event.Records);

  try {
    for (const record of event.Records) {
      const { title, description, price, count } = JSON.parse(record.body);

      console.log(title, description, price, count);

      pgClient.query('BEGIN');

      await pgClient.query(
        `WITH ins1 as (INSERT INTO products (title, description, price)
            VALUES ('${title}', '${description}', ${price})
            returning id AS new_product_id)
            insert into stocks (product_id, count)
            SELECT new_product_id, ${count} from ins1`
      );

      console.log('inserted');

      await pgClient.query('COMMIT');
    }

    // send a email through SNS topic "createProductTopic"
    await snsClient.send(
      new PublishCommand({
        TopicArn: process.env.SNS_ARN,
        Message: `New ${event.Records.length} products added to the products table`
      })
    );

    return {
      statusCode: 200,
      headers: HEADERS
    };
  } catch (err) {
    pgClient.query('ROLLBACK');

    return {
      statusCode: 500,
      message: err?.message || 'Unable to add a batch'
    };
  } finally {
    await pgClient.end();
  }
};
