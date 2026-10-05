import Stripe from "stripe";
import config from "../config/env.js";

const stripe = new Stripe(config.stripe_secret_key);

export default stripe;