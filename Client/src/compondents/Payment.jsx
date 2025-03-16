import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ bookingId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Get Client Secret from Backend
      const { data } = await axios.post(
        `${API_URL}/request/${bookingId}/create-payment-intent`,
        { amount },
        { withCredentials: true }
      );

      const clientSecret = data.clientSecret;
      if (!clientSecret) {
        setError("Failed to get payment intent.");
        return;
      }

      // Step 2: Confirm the Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Step 3: Confirm Payment in Backend
        try {
          await axios.put(
            `${API_URL}/request/${bookingId}/pay`,
            { paymentId: result.paymentIntent.id },
            { withCredentials: true }
          );

          alert("Payment successful!");
          navigate("/payment-success", { state: { bookingId, amount } });
        } catch (error) {
          setError("Payment succeeded, but confirmation failed.");
        }
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount } = location.state || {};

  useEffect(() => {
    if (!bookingId || !amount) {
      navigate("/bookings");
    }
  }, [bookingId, amount, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p className="text-lg mb-4">Total Amount: <strong>₹{amount}</strong></p>

      <Elements stripe={stripePromise}>
        <PaymentForm bookingId={bookingId} amount={amount} />
      </Elements>
    </div>
  );
};

export default Payment;
