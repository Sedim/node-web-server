const express = require('express');

const hbs = require('hbs');

const fs = require('fs');



var app = express();

//Handle Bars Partials enable partial templates// see header.hbs
hbs.registerPartials(__dirname+ '/views/partials');

//Below is the mechanism t
app.set('view engine', 'hbs');


//****************Middleware section***********
//*********Important: The order of the declerations matters
//When adding our own middleware we need to invoke next becuse otherwise
//the server will stop responding for other requests
//in this case we are going to add our own middleware code:
app.use((req, res, next) => {
  var now = new Date().toString();// current date and formatted human readable toString

  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });

  next();
});

//Maintenance mode, NOT: we did not include the next();
//This will stop execution of anything past this page
//*******Middle ware example
//app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//});

//Below is a middleware app to exress. It enables specifying static pages
// in the public directory such as *.html
// express.use is used to register the middleware
// in this case the middleware is built in express()
app.use(express.static(__dirname + '/public'));



//Below is the helper that enables us to NOT repeat code for each page
hbs.registerHelper('getCurrentYear', () =>{
  return new Date().getFullYear()
});


//New helper that converts text to uppercase
// See usage in home.hbs screamIt
hbs.registerHelper('screamIt', (text) =>{
  return text.toUpperCase();
});

// Here is the home page using template variables template
app.get('/', (req, res) => {
  // res.send('<h1>About Page</h1>');
  res.render('home.hbs', {// See handlebar usage in home.hbs
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
    // currentYear: new Date().getFullYear()// Replaced by helper above
  });
});

//Simple web page
app.get('/about', (req, res) => {
  // res.send('<h1>About Page</h1>');
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear()
  });
});







// /bad - send back json with errorMessage Localhost:3000/bad
// This is an example of  simple page using express without anything else
// i.e. no middleware no helpers no HBS no static pages
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//Server running on port 3000 i.e loclhost:3000
app.listen(3000, () => {
  console.log('Server is up on port 3000')
});



// Below is a simple root page for localhost:
// app.get('/', (req, res) => {
//   // res.send('<h1>Hello Express!</h1>');
//   res.send({
//     name: 'Andrew',
//     likes: [
//       'Biking',
//       'Cities'
//     ]
//   });
// });
