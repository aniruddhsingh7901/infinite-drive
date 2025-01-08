
import jwt from 'jsonwebtoken';



export const generateDownloadToken = (orderId: string): string => {

    return jwt.sign(

        { orderId },

        process.env.JWT_SECRET || 'your-default-secret',

        { expiresIn: '24h' }

    );

};
