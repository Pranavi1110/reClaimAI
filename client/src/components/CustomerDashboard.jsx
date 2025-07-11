import React from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/return');
  };

  const handleViewReturnsClick = () => {
    navigate('/past');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Welcome to reClaimAI</h1>

      <p className="text-lg text-gray-700 text-justify mb-6">
        reClaimAI is an AI-powered product return and sustainability platform. When you return a product,
        our system uses intelligent image analysis to assess the condition of the item — whether it's damaged,
        repairable, or in good shape. This not only speeds up your return experience but also helps make decisions
        that are better for the environment.If your returned item is repairable, we refurbish it and make it available for resale or donation.
        This helps reduce landfill waste and supports a more circular economy. For items that are too damaged
        to fix, we ensure they are recycled responsibly in partnership with certified recyclers.
      </p>
<div className="flex gap-5 ">
<img
        src="https://tse2.mm.bing.net/th/id/OIP.5dx7nTfsJLmahfwrfXG0KwHaE8?pid=Api&P=0&h=180"
        alt="AI Product Scanning"
        className="rounded-lg shadow-md w-full h-64 object-cover mb-6 gap-7 mr-20"
      />
      <img
        src="https://tse1.mm.bing.net/th/id/OIP.t3uC9jrC-3cmVVGThXQuVwHaFj?pid=Api&P=0&h=180"
        alt="Recycling Center"
        className="rounded-lg shadow-md w-full h-64 object-cover mb-6"
      />
</div>
      

      
      

      <p className="text-lg text-gray-700 text-justify mb-6">
        Our system also gives customers the option to donate usable returned items to non-profits and NGOs.
        You’ll receive updates and even proof of donation or recycling, making your returns more impactful
        and transparent.
      </p>


      <p className="text-lg text-gray-700 text-justify mb-8">
        We believe technology should not only make shopping easier but also create a better future. Every item
        you return through EcoReturns helps reduce waste, supports local communities, and promotes a greener lifestyle.
      </p>

      <div className="flex justify-center space-x-6">
        <button
          onClick={handleReturnClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Return an Item
        </button>

        <button
          onClick={handleViewReturnsClick}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          View Past Returns
        </button>
      </div>
    </div>
  );
}

export default CustomerDashboard;
