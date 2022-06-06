const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));
app.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', async function(req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }

  // create payment intent here
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    automatic_payment_methods: {enabled: true},
  });
  const returnUrl = getReturnUrl(req);
  // handle errors from payment intent creation
  res.render('checkout', {
    title: title,
    amount: amount,
    error: error,
    client_secret: paymentIntent.client_secret,
    returnUrl: returnUrl
  });
});

/**
 * Success route
 */
app.get('/success', function(req, res) {
  const amount = req.query.amount;
  const payment_intent_id = req.query.id;
  res.render('success', {
    amount: amount,
    payment_intent_id: payment_intent_id
  });
});

app.get('/payments', async function(req ,res) {
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100
  });
  const filteredPayments = paymentIntents.data.filter(f => f.status === 'succeeded');
  const wateredDownPayments = filteredPayments.map(f => ({
    id: f.id,
    amount: f.amount/100,
    date: f.created,
    currency: f.currency,
    status: f.status
  }));
  res.render('paymentIntents', {
    data: wateredDownPayments,
    errorMessage: errorMessage
  });
});
/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});


function getReturnUrl(req) {
  let protocol = req.get('X-Forwarded-Proto') || req.protocol;
  let host = req.get('X-Forwarded-Host') || req.get('Host');
  let port = req.get('X-Forwarded-Port') || req.get('Server-Port');
  let url = `${protocol}://${host}`;
  if (port) {
    url += `:${port}`;
  }
  return `${url}/success`;
}