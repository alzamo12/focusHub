import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_stripe_public_key);

const Payment = () => {
    return (
        <CheckoutElementsProvider 
        stripe={stripePromise} 
        // options={{ clientSecret: promise }}
        >
            <CheckoutForm />
        </CheckoutElementsProvider>
    );
};

export default Payment;