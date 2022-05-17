/**
 * Clientside helper functions
 */

$(document).ready(function() {
  var amounts = document.getElementsByClassName("amount");

  // iterate through all "amount" elements and convert from cents to dollars
  for (var i = 0; i < amounts.length; i++) {
    amount = amounts[i].getAttribute('data-amount') / 100;  
    amounts[i].innerHTML = amount.toFixed(2);
  }
})

// TODO : move this to .env
const stripe = Stripe('pk_test_51L0PKxHYToU9wnfh2xcuLiWVWWajNUeS7aGbY8cWeaZhcnRAsSJxpsSemDkNkTTmAiWQFtBnjqPXJxKZiHdXDpgt00iIoYoHIW');

