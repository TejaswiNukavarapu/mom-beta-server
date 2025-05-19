// const jwt = require('jsonwebtoken');

// const userAuth = (req, res, next) => {
//     const authorization = req.headers['Authorization'] || req.headers['authorization']; 
//     console.log(authorization) // Extract the token from the Authorization header
//     const token = authorization.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }
//         req.userId = decoded.userId;
//         next();
//     });
// }

// module.exports = userAuth;
const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers['authorization'] || req.headers['Authorization']; 

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or malformed' });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.userId = decoded.userId; // make sure `userId` exists in the token payload
        next();
    });
};

module.exports = userAuth;
