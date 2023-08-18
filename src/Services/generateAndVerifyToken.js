import jwt from 'jsonwebtoken';

export const generateToken =(payload,signature,expiresIn)=>{

    const token = jwt.sign(payload,signature,{expiresIn});

    return token;
}

export const verifyToken = (token,signature)=>{

    const decoded = jwt.verify(token,signature);

    return decoded;
}