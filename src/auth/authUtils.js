'use strict';

import JWT from 'jsonwebtoken';

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Private key is missing or not a string');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Public key is missing or not a string');
    }
    // accessToken: signed with privateKey
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    // refreshToken: also signed with privateKey
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    // verify accessToken using publicKey
    JWT.verify(accessToken, publicKey, { algorithms: ['RS256'] }, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
};