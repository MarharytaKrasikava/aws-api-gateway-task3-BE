const productList = require('./productList');

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