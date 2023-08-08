const firebase = require('firebase');
require('firebase/auth');

const waitForUser = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user);
    }, reject);
  });
};

// firebaseAuthMiddleware
const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const user = await waitForUser();

    if (user) {
      req.session.user = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
      };
    } else {
      delete req.session.user
    }
    next();
  } catch (error) {
    console.error('Error occurred during authentication:', error);
    delete req.session.user
    next();
  }
};

const isAuthenticated = (req, res, next) => {
  const user = req.session.user;

  if (user !== null && user !== undefined) {
    next();
  } else {
    res.redirect('/login');
  }
};

const isNotAuthenticated = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    next();
  } else {
    return res.redirect('/');
  }
}

module.exports = {
  firebaseAuthMiddleware,
  isAuthenticated,
  isNotAuthenticated
};