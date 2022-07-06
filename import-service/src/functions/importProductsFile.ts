import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, HEADERS, REGION } from '../constants';

export default async (event: any) => {
  if (!event.queryStringParameters?.name) {
    throw Error('Please, provide a query parameter "name"');
  }
  const { name } = event.queryStringParameters;
  const s3Client = new S3Client({ region: REGION });
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
  };
  try {
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command);
    return {
      statusCode: 200,
      body: signedUrl,
      headers: HEADERS,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: err.message || 'Server error',
    };
  }
};
