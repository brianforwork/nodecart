//routes/access/access.service.js
'use strict'
import { ShopModel } from "../models/shop.model.js"
import bcrypt from "bcrypt"
import { createTokenPair } from "../auth/authUtils.js"
import getInfoData from "../utils/index.js"
import { AuthFailureError, BadRequestError } from "../core/error.response.js"

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static logOut = async () => {
        // No key store anymore — just let frontend delete token or expire it
        return { message: 'Logout logic handled on frontend (stateless JWT).' };
    };

    static logIn = async ({ email, password }) => {
        const foundShop = await ShopModel.findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop is not registered!');

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Your credentials are wrong!');

        const tokens = await createTokenPair(
            { userId: foundShop._id, email: foundShop.email }
        );

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        };
    };

    static signUp = async ({ name, email, password }) => {
        const existingShop = await ShopModel.findByEmail({ email });
        if (existingShop) throw new BadRequestError('Error: Shop is already registered!');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.insertOne({
            name,
            email,
            password: hashedPassword,
            roles: [roleShop.SHOP]
        });

        if (!newShop) throw new BadRequestError('Shop creation failed');

        const tokens = await createTokenPair({
            userId: newShop._id,
            email: newShop.email
        });

        return {
            code: 201,
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }
        };
    };

}

export default AccessService