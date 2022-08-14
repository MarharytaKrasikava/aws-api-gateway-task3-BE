import dotenv from 'dotenv';

const port = process.env.PORT || 8080;

export const config = {
  server: {
    port
  }
};
