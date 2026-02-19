const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "ต้องล็อกอินก่อนนะจ๊ะ" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; // ในนี้จะมี id และ role
    next();
  } catch (err) {
    res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "หยุด! เฉพาะ Admin เท่านั้นที่มีสิทธิ์" });
  }
};