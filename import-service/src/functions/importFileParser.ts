import * as csvParser from 'csv-parser';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { BUCKET_NAME } from '../constants';
import { Product } from '../models/products';

export default async (event: any) => {
  const s3Client = new S3Client({ region: 'eu-west-1' });

  try {
    for (const record of event.Records) {
      const recordKey = record.s3.object.key;
      const pattern = /^.*\.(csv)$/;

      if (!pattern.test(recordKey)) {
        console.log('error');
        throw new Error('Only .csv extensions allowed!');
      }

      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: recordKey,
      });
      const file = await s3Client.send(getCommand);
      const results: any = [];

      file.Body.pipe(csvParser())
        .on('data', async (parsedRecord: Product) => {
          const client = new SQSClient({ region: 'eu-west-1' });
          const { SQS_URL } = process.env;
          const command = new SendMessageCommand({
            QueueUrl: SQS_URL,
            MessageBody: JSON.stringify(parsedRecord),
          });
          const data = await client.send(command);
          console.log('successfully sent:', data);
        })
        .on('end', async () => {
          console.log('results:', results);

          const copyCommand = new CopyObjectCommand({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${recordKey}`,
            Key: recordKey.replace('uploaded', 'parsed'),
          });

          await s3Client.send(copyCommand);
          console.log('recordKey after copy:', recordKey);
        });

      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: recordKey,
      });
      const data = await s3Client.send(deleteCommand);

      console.log('success:', data);
    }

    return {
      statusCode: 202,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message || 'Server error',
    };
  }
};
