const productList = require('./productList');

module.exports.getProductsList = async (event) => {
  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: await JSON.stringify(productList)
  };
}
