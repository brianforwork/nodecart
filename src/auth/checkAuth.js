// './auth/checkAuth.js'
'use strict'

import findById from "../services/apikey.service.js"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'Authorization'
}

// CHECK WITH API KEY
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        console.log('[x-api-key]', key);
        console.log('[DB lookup]', await findById(key));
        if (!key) {
            return res.status(403).json({
                messeage: 'Forbidden Error!'
            })
        }

        const objKey = await findById(key) 
        if (!objKey) {
            return res.status(403).json({
                messeage: 'Forbidden Error!!'
            })
        }

        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}

// CHECK WITH PERMISSION
const permission = (permission) => {
    return (req, res, next) => {
      if (!req.objKey.permissions) {
        return res.status(403).json({ message: 'permission denied' });
      }
  
      console.log('permissions::', req.objKey.permissions);
  
      const validPermission = req.objKey.permissions.includes(permission);
      if (!validPermission) {
        return res.status(403).json({ message: 'permission denied' });
      }
  
      return next();
    };
  };


  // HANDLE ASYNC 
const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  } 
}
  
export { apiKey, permission, asyncHandler }