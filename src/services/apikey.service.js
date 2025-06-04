// services/apiKey.service.js
'use strict'

import { ApiKeyModel } from "../models/apikey.model.js"

export default async function findById(key) {
    const objKey = await ApiKeyModel.findByIdApiKey({ key: key, status: true });
    return objKey;
} 