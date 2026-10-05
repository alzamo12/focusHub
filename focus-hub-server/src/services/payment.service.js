import stripe from "../config/stripe.js";

const calculateTotalOrderAmount = (amount) => {
    return amount * 100; // Convert to cents
};
const createPaymentIntentIntoDB = async (pricing_plan) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateTotalOrderAmount(pricing_plan.amount),
        currency: "usd",
        description: "FocusHub Payment",
        automatic_payment_methods: { enabled: true }
    });
    // console.log(paymentIntent)

    return paymentIntent.client_secret
}

export const paymentServices = {
    createPaymentIntentIntoDB
};