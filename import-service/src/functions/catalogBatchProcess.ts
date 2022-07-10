export default async (event: any) => {
  // receive SQS messages and add to the database
  // send a email through SNS topic "createProductTopic"
  const products = event.Records.map(({ body }: any) => body);
  console.log(products);
};
