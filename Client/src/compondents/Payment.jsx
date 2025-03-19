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
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
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

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: cardholderName },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        try {
          await axios.put(
            `${API_URL}/request/${bookingId}/pay`,
            { paymentId: result.paymentIntent.id },
            { withCredentials: true }
          );
          alert("Payment successful!");
          navigate("/", { state: { bookingId, amount } });
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <input
        type="text"
        placeholder="Cardholder Name"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <CardElement className="border p-2 rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
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
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: `url("https://res.cloudinary.com/dandjcp0x/image/upload/v1742313363/nathan-dumlao-lvWw_G8tKsk-unsplash_tb5qko.jpg")`,
    }}
  >
  
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
        <p className="text-lg mb-4 text-center">Total Amount: <strong>₹{amount}</strong></p>
        <Elements stripe={stripePromise}>
          <PaymentForm bookingId={bookingId} amount={amount} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;