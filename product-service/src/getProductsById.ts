import productList from '../stubs/productList';

export default async (event: any) => {
  const { id } = event.pathParameters;
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: await JSON.stringify(
      productList.find((product) => product.id === id),
    ),
  };
};
