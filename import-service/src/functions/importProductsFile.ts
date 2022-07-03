import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME } from '../constants';

export default async (event: any) => {
  const { name } = event.queryStringParameters;
  const s3Client = new S3Client({ region: 'eu-west-1' });
  const params = {
    Bucket: BUCKET_NAME,
    Key: `/uploaded/${name}`,
  };
  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command);
    return {
      statusCode: 200,
      body: signedUrl,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message || 'Server error',
    };
  }
};
