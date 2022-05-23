# HOWTO/APIs?
On the server side, on initiating a checkout, the included Stripe SDK creates a payment intent via the [Payment Intent API](https://stripe.com/docs/api/payment_intents/create). The server then passes along an identifier (payment intent client secret) to the client, the browser.

This solution relies on the Stripe JS library fetched from Stripe (CDN?) to initiate the stripe SDK on the client side. This library is used to embed the payment options element into the checkout page. When the customer finishes the payment flow by entering their payment details and clicking on "Pay Now" button, the client side SDK uses the customer entered payment information and the client secret to [complete the payment](https://stripe.com/docs/api/payment_intents/confirm) on Stripe via the SDK.

As part of the checkout flow, the server side provides a redirect URL - this URL is used by the SDK to navigate the user to a payment status page. The status page fetches the payment status from the [API](https://stripe.com/docs/api/payment_intents/retrieve) and shows a rudimentary status and identifier.


# Documentation/Challenges
For the actual code, I started with the [Quick Start](https://stripe.com/docs/payments/quickstart). This was a great starting point for quickly putting together an elementary checkout flow. For the setup of the account, [Accept a payment](https://stripe.com/docs/payments/accept-a-payment) and [API Keys](https://stripe.com/docs/keys) were consulted get started.

The major challenges in completing the setup was more from a coding perspective:
1. The docs are good for a quick start but could possibly be extended with good practices built in.
2. Secondly, (just a nit) it is hard to find examples outside of React framework for frontend build for the checkout flow. Maybe add examples for more frameworks like Angular/Vue?

# How to extend?
Currently the application happens to serve both static and dynamic content. There is no clear separation between the two. What this does is it ties the client to the server i.e. the server can currently serve only browsers.

To overcome this limitation, a better way is to separate the API and the static content. This enables separation of concerns and allows for client development (like mobile etc) separate to the API development. This also allows the API and static content serving to be scaled and deployed differently.

Other regular considerations like authentication, allowing users to add multiple items to a cart and purchasing all at once, etc. could be added to the API.