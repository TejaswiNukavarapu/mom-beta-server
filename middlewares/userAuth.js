// // // const jwt = require('jsonwebtoken');

// // // const userAuth = (req, res, next) => {
// // //     const authorization = req.headers['Authorization'] || req.headers['authorization']; 
// // //     console.log(authorization) // Extract the token from the Authorization header
// // //     const token = authorization.split(' ')[1];
// // //     if (!token) {
// // //         return res.status(401).json({ message: 'Unauthorized' });
// // //     }

// // //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// // //         if (err) {
// // //             return res.status(403).json({ message: 'Forbidden' });
// // //         }
// // //         req.userId = decoded.userId;
// // //         next();
// // //     });
// // // }

// // // module.exports = userAuth;
// // const jwt = require('jsonwebtoken');

// // const userAuth = (req, res, next) => {
// //     const authorization = req.headers['authorization'] || req.headers['Authorization']; 

// //     if (!authorization || !authorization.startsWith('Bearer ')) {
// //         return res.status(401).json({ message: 'Unauthorized: No token provided or malformed' });
// //     }

// //     const token = authorization.split(' ')[1];

// //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //         if (err) {
// //             return res.status(403).json({ message: 'Forbidden: Invalid token' });
// //         }

// //         req.userId = decoded.userId; // make sure `userId` exists in the token payload
// //         next();
// //     });
// // };

// // module.exports = userAuth;
// const jwt = require('jsonwebtoken');

// const userAuth = (req, res, next) => {
//     const authorization = req.headers['authorization'] || req.headers['Authorization'];

//     if (!authorization || !authorization.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized: No token provided or malformed' });
//     }

//     const token = authorization.split(' ')[1];

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error('JWT verification error:', err.message);  // <-- Log error for debugging
//             return res.status(403).json({ message: 'Forbidden: Invalid token' });
//         }

//         if (!decoded.userId) {
//             return res.status(403).json({ message: 'Forbidden: Invalid token payload' });
//         }

//         req.userId = decoded.userId;
//         next();
//     });
// };

// module.exports = userAuth;
const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers['authorization'] || req.headers['Authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or malformed' });
    }

    const token = authorization.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not defined in environment variables!');
        return res.status(500).json({ message: 'Server misconfiguration: JWT secret is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('❌ JWT verification error:', err.message); // Log full error for debugging
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        if (!decoded.userId) {
            console.error('❌ Token payload missing userId:', decoded);
            return res.status(403).json({ message: 'Forbidden: Token payload invalid' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = userAuth;