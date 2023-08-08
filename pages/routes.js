const express = require('express');
const router = express.Router();
const { isAuthenticated, isNotAuthenticated } = require('../controllers/auth');
const methodOverride = require('method-override');
const firebase = require('firebase');
const { handleLoginRoute, handleRegisterRoute, handleResetPassword } = require('./post');
const cookie = require('cookie-parser')

router.use(methodOverride('_method'));
router.use(cookie())


//homepage stuff
router.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user,
  });
});





//login stuff
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login',{ 
    user: req.session.user,
  });
});
router.post('/login', handleLoginRoute)



//register stuff
router.get('/register', isNotAuthenticated, (req, res) => {
  const errorMessage = req.flash('error');
  res.render('register', {
    user: req.session.user,
    errorMessage: errorMessage,
  });
});
router.post('/register', handleRegisterRoute)




//about us stuff
router.get('/about-us', (req, res) => {
  res.render('about-us', { 
    user: req.session.user,
  });
});




//logging out stuff
router.delete('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('rememberMe')
  req.session.destroy(err => {
    if (err) {
      console.log('Error : Failed to destroy the session during logout.', err);
    } else {
      firebase.auth().signOut().then(() => {
        res.redirect('/login');
      }).catch((error) => {
        console.log('Error : Failed to logout from Firebase.', error);
      });
    }
  });
});



//reset password stuff
router.get('/reset-password', (req, res) => {
  const message = false
  res.render('reset-password', { message: message })
})
router.post('/reset-password', handleResetPassword)



//contact us stuff
router.get('/contact', (req, res)=>{
  res.render('contact')
})


//services stuff
router.get('/services', (req, res) => {
  res.render('services');
})
router.get('/services-1', (req, res) => {
  res.render('services1');
})
router.get('/services-2', (req, res) => {
  res.render('services2');
})
router.get('/services-3', (req, res) => {
  res.render('services3');
})


module.exports = router;