const stripe = Stripe(stripePublicKey);


$("#checkout").click(purchaseClicked);


// const stripeHandler = StripeCheckout.configure({
//     key: stripePublicKey,
//     locale: 'en',
//     token: function(token) {
//         console.log(token);
//     }
// })


function purchaseClicked() {
    let priceElement = $("tr.cartTotal > td > strong")[0];
    let totalPrice = parseFloat(priceElement.innerText.replace("$","")) * 100;

    //Create an array of item IDs and quantities to purchase
    let purchaseItems = [...document.querySelectorAll("tr.cartItem > td.item")];
    let purchaseItemIds = purchaseItems.map(item => item.dataset.itemId);
    let purchaseItemQuantities = purchaseItems.map(item => item.querySelector(".quantity").innerText);

    let purchaseData = purchaseItemIds.map( (val, i) => {
        return {
            id: val,
            quantity: purchaseItemQuantities[i]
        }
    });

    //Create a new Checkout Session using the server-side endpoint
    fetch('/cart/create-checkout-session', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "purchaseData": purchaseData
        })
    })
        .then( res => {
            return res.json();
        })
        .then ( session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then( result => {
            //If 'redirectToCheckout' fails, display the localized error message using 'error.message'
            if(result.error) {
                alert(result.error.message);
            }
        })
        .catch( err => {
            console.error('Error:', err);
        });
}


function setDeleteActions() {
    $("span.deleteButton").click((event) => {
        // $.post("/cart/remove", {
        //     "_method": "PUT",
        //     "id":"123"
        // }, (result) => {
        //     console.log("finished");
        // });
        // console.log(event.target);
        // console.log($( this ).attr('data'));
    });
}
setDeleteActions();
