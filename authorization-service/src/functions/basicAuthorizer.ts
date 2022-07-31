import { generatePolicy } from '../utils';
import { ERROR_403_MESSAGE } from '../constants';

export default async (event: any, ctx: any, callBack: any) => {
  if (event.type !== 'REQUEST') {
    callBack(ERROR_403_MESSAGE);
  }

  try {
    const { authorization: token } = event.headers;
    const encodedCreds = token.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const login = plainCreds[0];
    const password = plainCreds[1];

    console.log(`login: ${login}, pass: ${password}`);

    const correctPassword = process.env[login];
    const effect = password && password === correctPassword ? 'Allow' : 'Deny';

    const policy = generatePolicy(encodedCreds, event.routeArn, effect);

    callBack(null, policy);
  } catch (err) {
    callBack(`${ERROR_403_MESSAGE}: ${err.message}`);
  }
};
