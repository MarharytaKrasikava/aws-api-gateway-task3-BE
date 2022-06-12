'use strict';

const productList = require('./productList');

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(productList)
  };
};

module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(productList.find(product => product.id === id))
  };
};
