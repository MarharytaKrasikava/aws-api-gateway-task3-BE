import * as parseCSV from 'csv-parser';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { BUCKET_NAME } from '../constants';

export default async (event: any) => {
  const s3Client = new S3Client({ region: 'eu-west-1' });

  try {
    event.records.forEach(async (record: any) => {
      const recordKey = record.s3.object.key;

      if (!recordKey.endsWith('.csv')) {
        throw Error('Only .csv extensions allowed!');
      }

      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: recordKey,
      });
      const results = [];
      const file = await s3Client.send(getCommand);

      file.Body.pipe(parseCSV())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
          const copyCommand = new CopyObjectCommand({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${recordKey}`,
            Key: recordKey.replace('uploaded', 'parsed'),
          });
          await s3Client.send(copyCommand);

          const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: recordKey,
          });
          await s3Client.send(deleteCommand);
        });
    });

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
