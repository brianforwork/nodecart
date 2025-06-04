// auth/authUtils.js
'use strict';

import JWT from 'jsonwebtoken';

export const createTokenPair = async (payload, privateKey1, privateKey2) => {
  try {
    // ASYMMETRIC
    // if (!privateKey || typeof privateKey !== 'string') {
    //   throw new Error('Private key is missing or not a string');
    // }
    // if (!publicKey || typeof publicKey !== 'string') {
    //   throw new Error('Public key is missing or not a string');
    // }

    if (!privateKey1 || typeof privateKey1 !== 'string') {
      throw new Error('Private key is missing or not a string');
    }
    if (!privateKey2 || typeof privateKey2 !== 'string') {
      throw new Error('Public key is missing or not a string');
    }
    // accessToken: signed with privateKey
    const accessToken = JWT.sign(payload, privateKey1, {
      // algorithm: 'RS256', ASYSMMETRIC
      expiresIn: '2 days',
    });

    // refreshToken: also signed with privateKey
    const refreshToken = JWT.sign(payload, privateKey2, {
      // algorithm: 'RS256', ASYMMETRIC
      expiresIn: '7 days',
    });

    // verify accessToken using publicKey
    JWT.verify(accessToken, privateKey1, (err, decode) => {
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