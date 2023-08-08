const bcrypt = require('bcrypt');
const generateUUID = require('../functions/uuid');
const database = require('../controllers/firebase')
const firebase = require('firebase')
const cookie = require('cookie-parser')

async function handleRegisterRoute(req, res) {
  try {
    //for good password practice
    const password = req.body.password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/
    if(!passwordRegex.test(password)){
      req.flash('error', 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.')
      return res.redirect('/register')
    }

    //for hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userUUID = generateUUID();

    const user = {
      id: userUUID + Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      displayName: req.body.name
    };

    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((userCredential) => {
        return userCredential.user.updateProfile({
          displayName: req.body.name
        })
      }).then(()=>{
        database.ref('users/' + user.id).set(user);
        res.redirect('/login');
      })
      .catch((error) => {
        console.error(error);
        res.redirect('/register');
      });
  } catch (e) {
    console.error(e);
    res.redirect('/register');
  }
}

async function handleLoginRoute(req, res, next) {
  const { email, password, remember } = req.body;

  try {
    const maxAge = remember === 'true' ? 30 * 24 * 60 * 60 : 60 * 60

    req.session.cookie.maxAge = maxAge * 1000

    res.cookie('rememberMe', 'true', { 
      maxAge: maxAge,
      httpOnly: true,
      secure: true
    })

    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const usersSnapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
    const users = usersSnapshot.val();

    if (!users || Object.keys(users).length === 0) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    let userFromDb = users[Object.keys(users)[0]];

    res.render('index', { user: userFromDb });
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred during login');
    res.redirect('/login');
  }
}

async function handleResetPassword(req, res) {
  const { email } = req.body;

  try {
    const usersSnapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
    const users = usersSnapshot.val();

    if (!users || Object.keys(users).length === 0) {
      req.flash('error', 'Invalid email. No user found with that email.');
      return res.redirect('/reset-password');
    }

    const actionCodeSettings = {
      url: 'http://localhost:3000/update',
      handleCodeInApp: true,
    };

    await firebase.auth().sendPasswordResetEmail(email, actionCodeSettings)

    res.render('reset-password', { message: true });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    req.flash('error', 'An error occurred while sending the password reset email.');
    res.redirect('/reset-password');
  }
}

module.exports = {
  handleRegisterRoute,
  handleLoginRoute,
  handleResetPassword
};