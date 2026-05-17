// Session-based authentication middleware

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(410).json({ error: 'Session expired or not logged in. Please log in again.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(410).json({ error: 'Session expired. Please log in again.' });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
  }
  next();
};

const requirePoliceOrAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(410).json({ error: 'Session expired. Please log in again.' });
  }
  const role = req.session.user.role;
  if (role !== 'police' && role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Police/Admin privileges required.' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requirePoliceOrAdmin
};
