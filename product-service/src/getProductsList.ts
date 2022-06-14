import productList from '../stubs/productList';

export default async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: await JSON.stringify(productList),
  };
};
