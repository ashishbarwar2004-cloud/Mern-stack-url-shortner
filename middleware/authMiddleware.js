import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'shortly_dev_jwt_secret_key_12345';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired authentication token' });
  }
};

export const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'shortly_dev_jwt_secret_key_12345';
      req.user = jwt.verify(token, secret);
    } catch {
      req.user = null;
    }
  }
  next();
};

export default protect;
