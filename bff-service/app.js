const express = require('express');
const axios = require('axios');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.all('/*', async (request, response) => {
  console.log('original url:', request.originalUrl);
  console.log('method:', request.method);
  console.log('body:', request.body);

  const recipientPostfixStartIndex = request.originalUrl.lastIndexOf('/') + 1;
  const recipientWithQuery = request.originalUrl.substring(
    recipientPostfixStartIndex
  );
  const recipient = recipientWithQuery.split('?')[0];
  console.log('recipient:', recipient);

  const recipientUrl = process.env[recipient];
  console.log('recipient Url:', recipientUrl);

  if (recipientUrl) {
    const { authorization } = request.headers;
    const axiosConfig = {
      method: request.method,
      url:
        recipient === 'cart'
          ? recipientUrl
          : `${recipientUrl}${request.originalUrl}`,
      ...(authorization && {
        headers: { authorization }
      }),
      ...(Object.keys(request.body || {}).length && { data: request.body })
    };
    console.log('axiosConfig:', axiosConfig);

    try {
      const recipientResponse = await axios(axiosConfig);
      console.log('recipient response', recipientResponse);
      response.json(recipientResponse.data);
    } catch (error) {
      console.log('recipient request error:', JSON.stringify(error));

      if (error.response) {
        const { status, data } = error.response;
        response.status(status).json(data);
      }
    }
  } else {
    response.status(502).json({ error: 'Cannot proceed request' });
  }
});

app.listen(PORT, () => {
  console.log(`BFF app listening at http://localhost:${PORT}`);
});
