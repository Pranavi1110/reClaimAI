import { useState } from "react";
import "./ReturnForm.css";

const ReturnForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    reason: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

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

    // Simulate AI prediction
    setTimeout(() => {
      setAiPrediction({
        condition: "damaged",
        confidence: 0.85,
        recommendation:
          "This item appears to be damaged and may need repair or recycling.",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="return-form-container">
      <h2>Initiate Product Return</h2>
      <form onSubmit={handleSubmit} className="return-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, productName: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Return Reason</label>
          <select
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            required
          >
            <option value="">Select a reason</option>
            <option value="damaged">Product Damaged</option>
            <option value="defective">Defective Product</option>
            <option value="wrong_item">Wrong Item Received</option>
            <option value="size_issue">Size/Size Issue</option>
            <option value="quality">Quality Issues</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Please describe the issue in detail..."
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

      {aiPrediction && (
        <div className="ai-prediction">
          <h3>AI Analysis Result</h3>
          <div className="prediction-card">
            <div className="prediction-item">
              <strong>Condition:</strong> {aiPrediction.condition}
            </div>
            <div className="prediction-item">
              <strong>Confidence:</strong>{" "}
              {(aiPrediction.confidence * 100).toFixed(1)}%
            </div>
            <div className="prediction-item">
              <strong>Recommendation:</strong> {aiPrediction.recommendation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnForm;
