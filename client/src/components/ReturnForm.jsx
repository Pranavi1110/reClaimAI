import { useState, useEffect } from "react";
import axios from "axios";
import "./ReturnForm.css";

const ReturnForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    reason: "",
    description: "",
    image: null,
    imagePreview: null,
    purchaseDate: "",
  });

  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [donationStep, setDonationStep] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState("");
  const [base64Payload, setBase64Payload] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedUser = localStorage.getItem("user");
    const userEmail = storedUser ? JSON.parse(storedUser).email : null;
    if (!userEmail) {
      alert("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const base64Image = base64String.split(",")[1];
      const mimeType = base64String.split(";")[0].split(":")[1];

      try {
        const res = await axios.post("http://localhost:5000/api/return/submit", {
          productName: formData.productName,
          reason: formData.reason,
          description: formData.description,
          purchaseDate: formData.purchaseDate,
          imageBase64: base64Image,
          mimeType: mimeType,
          email: userEmail,
        });

        setAiPrediction(res.data.prediction);
        setBase64Payload({
          imageBase64: base64Image,
          mimeType,
          email: userEmail,
        });

        if (res.data.prediction.condition === "good condition") {
          fetchNGOs();
        } else {
          setSubmitted(true);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Error submitting return");
      } finally {
        setLoading(false);
      }
    };

    if (formData.image) reader.readAsDataURL(formData.image);
  };

  const fetchNGOs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/return/partners/ngos");
      setNgos(res.data.ngos);
      setDonationStep(true);
    } catch (err) {
      alert("Failed to fetch NGOs");
    }
  };

  const finalizeReturn = async (donate) => {
    if (!base64Payload) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/return/submit", {
        ...formData,
        ...base64Payload,
        donationOpted: donate,
        ngoId: donate ? selectedNGO : null,
      });

      setSubmitted(true);
      setDonationStep(false);
    } catch (err) {
      alert("Failed to finalize return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="return-form-container">
      <h2>Initiate Product Return</h2>

      {!submitted && !donationStep && (
        <form onSubmit={handleSubmit} className="return-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Return Reason</label>
            <select
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            >
              <option value="">Select a reason</option>
              <option value="damaged">Product Damaged</option>
              <option value="defective">Defective Product</option>
              <option value="wrong_item">Wrong Item Received</option>
              <option value="size_issue">Size Issue</option>
              <option value="quality">Quality Issues</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {formData.imagePreview && (
              <div className="image-preview">
                <img src={formData.imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Analyzing..." : "Submit Return"}
          </button>
        </form>
      )}

      {donationStep && (
        <div className="donation-select">
          <h3>The item is in good condition. Do you want to donate it?</h3>
          <select
            value={selectedNGO}
            onChange={(e) => setSelectedNGO(e.target.value)}
          >
            <option value="">-- Select an NGO --</option>
            {ngos.map((ngo) => (
              <option key={ngo._id} value={ngo._id}>
                {ngo.partnerDetails.ngoInfo.organizationName}
              </option>
            ))}
          </select>

          <button
            onClick={() => finalizeReturn(true)}
            disabled={!selectedNGO}
          >
            Confirm Donation
          </button>
          <button onClick={() => finalizeReturn(false)}>No, Restock Instead</button>
        </div>
      )}

      {aiPrediction && (
        <div className="ai-prediction">
          <h3>AI Sustainability & Condition Report</h3>
          <div className="prediction-card">
            <div style={{ whiteSpace: "pre-wrap", marginTop: "5px", color: "black" }}>
              <strong>Condition:</strong> {aiPrediction.condition}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>AI Insight:</strong>
              <p style={{ whiteSpace: "pre-wrap", marginTop: "5px", color: "black" }}>
                {aiPrediction.summary || "No insight provided by AI."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnForm;