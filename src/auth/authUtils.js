// auth/authUtils.js
'use strict';

import JWT from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { AuthFailureError, NotFoundError } from '../core/error.response.js';
import { KeyTokenModel } from '../models/keytoken.model.js';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

export const createTokenPair = async (payload) => {
  try {
    const accessToken = JWT.sign(payload, process.env.JWT_SECRET_ACCESS, {
      expiresIn: '2d',
    });

    const refreshToken = JWT.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
};

export const authentication = asyncHandler((async (req, res, next) => {
  // Check userId
  const userId = req.headers[HEADER.CLIENT_ID]  
  if (!userId) throw new AuthFailureError('Invalid Request!')
  // Get Access Token
  const keyStore = await KeyTokenModel.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not Found KeyStore!')
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  console.log(accessToken)
  if (!accessToken) throw new AuthFailureError('Invalid Access Token!')
  
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.privateKey1) 
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId') 
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
}))