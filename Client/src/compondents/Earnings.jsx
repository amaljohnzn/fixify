import { useEffect, useState } from "react";
import axios from "axios";

const Earnings = () => {
    const [earnings, setEarnings] = useState({
        totalEarnings: 0,
        balance: 0,
        earningsPerService: [],
    });
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const SERVER_URI = import.meta.env.VITE_SERVER_URI;

    // Fetch provider earnings
    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const { data } = await axios.get(`${SERVER_URI}/provider/earnings`, { withCredentials: true });
                setEarnings(data);
            } catch (err) {
                console.error("Error fetching earnings:", err);
                setError("Failed to load earnings.");
            }
        };
        fetchEarnings();
    }, []);

    // Handle withdrawal
    const handleWithdraw = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError("Enter a valid withdrawal amount.");
            return;
        }

        try {
            const { data } = await axios.post(
                `${SERVER_URI}/provider/withdraw`,
                { amount: parseFloat(withdrawAmount) },
                { withCredentials: true }
            );

            setMessage(data.message);
            setEarnings((prev) => ({
                ...prev,
                balance: prev.balance - withdrawAmount,
            }));
            setWithdrawAmount("");
        } catch (err) {
            setError(err.response?.data?.message || "Withdrawal failed.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Earnings Dashboard</h2>

            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            <div className="mb-4">
                <p className="text-lg"><strong>Total Earnings:</strong> ₹{earnings.totalEarnings}</p>
                <p className="text-lg"><strong>Available Balance:</strong> ₹{earnings.balance}</p>
            </div>

            <h3 className="text-xl font-semibold mt-4 mb-2">Earnings Per Service</h3>
            <ul className="list-disc pl-6 mb-4">
                {earnings.earningsPerService.length > 0 ? (
                    earnings.earningsPerService.map((service, index) => (
                        <li key={index}>
                            {service.serviceName}: ₹{service.earnings}
                        </li>
                    ))
                ) : (
                    <p>No earnings yet.</p>
                )}
            </ul>

            <form onSubmit={handleWithdraw} className="mt-6">
                <label className="block text-lg font-medium mb-1">Withdraw Amount (₹):</label>
                <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Withdraw
                </button>
            </form>
        </div>
    );
};

export default Earnings;
