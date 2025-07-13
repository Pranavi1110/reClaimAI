import React, { useEffect, useState } from 'react';
import './PastCustomerReturns.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PastCustomerReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);
    }
  }, []);

  useEffect(() => {
    const fetchReturns = async () => {
      if (!userEmail) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/return/user-returns?email=${userEmail}`);
        setReturns(res.data.returns);
      } catch (err) {
        console.error('Error fetching returns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [userEmail]);
  const handleCollected = async (returnId) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/mark-collected`, { returnId });
      // setReturns((prev) =>
      //   prev.map((ret) => (ret._id === returnId ? { ...ret, status: 'Collected' } : ret))
      // );
    } catch (err) {
      console.error('Error marking return as collected:', err);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading your returns...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Your Past Returns</h2>

      {returns.length === 0 ? (
        <p className="text-gray-600">No returns found.</p>
      ) : (
        <div className=" gap-6">
          {returns.map((ret) => (
            <div key={ret._id} className="border aa">
              <div class="bb">
              <img
                src={ret.imageUrl}
                alt={ret.productName}
                class="ii"
              /></div>
              <div >
                <h3 className="text-xl font-semibold">{ret.productName}</h3>
                <p className="text-sm text-gray-700 mb-1"><strong>Reason:</strong> {ret.reason}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Condition:</strong> {ret.condition}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Status:</strong> {ret.status}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Purchase Date:</strong> {new Date(ret.purchaseDate).toDateString()}</p>
                {/* {ret.analysisSummary && (
                  <p className="text-sm text-gray-600 mt-1 italic">{ret.analysisSummary}</p>
                )} */}
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PastCustomerReturns;
