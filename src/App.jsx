import { useState } from "react";

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "",
    Credit_History: "",
    Gender: "",
    Married: "",
    Dependents: "",
    Education: "",
    Self_Employed: "",
    Property_Area: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }
  function resetForm() {
  setFormData({
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "",
    Credit_History: "",
    Gender: "",
    Married: "",
    Dependents: "",
    Education: "",
    Self_Employed: "",
    Property_Area: ""
  });

  setResult(null);
  setError("");
}

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    const dataToSend = {
      ...formData,
      ApplicantIncome: Number(formData.ApplicantIncome),
      CoapplicantIncome: Number(formData.CoapplicantIncome),
      LoanAmount: Number(formData.LoanAmount),
      Loan_Amount_Term: Number(formData.Loan_Amount_Term),
      Credit_History: Number(formData.Credit_History)
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const result = await response.json();

      setResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="container">

        <h1>Loan Prediction System</h1>

        <p className="subtitle">
          Enter the applicant details to predict loan approval.
        </p>

        <form onSubmit={handleSubmit}>

          <InputField
            label="Applicant Income"
            name="ApplicantIncome"
            value={formData.ApplicantIncome}
            onChange={handleChange}
            type="number"
          />

          <InputField
            label="Coapplicant Income"
            name="CoapplicantIncome"
            value={formData.CoapplicantIncome}
            onChange={handleChange}
            type="number"
          />

          <InputField
            label="Loan Amount"
            name="LoanAmount"
            value={formData.LoanAmount}
            onChange={handleChange}
            type="number"
          />

          <InputField
            label="Loan Amount Term"
            name="Loan_Amount_Term"
            value={formData.Loan_Amount_Term}
            onChange={handleChange}
            type="number"
          />

          <InputField
            label="Credit History"
            name="Credit_History"
            value={formData.Credit_History}
            onChange={handleChange}
            type="number"
          />

          <SelectField
            label="Gender"
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            options={["Male", "Female"]}
          />

          <SelectField
            label="Married"
            name="Married"
            value={formData.Married}
            onChange={handleChange}
            options={["Yes", "No"]}
          />

          <SelectField
            label="Dependents"
            name="Dependents"
            value={formData.Dependents}
            onChange={handleChange}
            options={["0", "1", "2", "3+"]}
          />

          <SelectField
            label="Education"
            name="Education"
            value={formData.Education}
            onChange={handleChange}
            options={["Graduate", "Not Graduate"]}
          />

          <SelectField
            label="Self Employed"
            name="Self_Employed"
            value={formData.Self_Employed}
            onChange={handleChange}
            options={["Yes", "No"]}
          />

          <SelectField
            label="Property Area"
            name="Property_Area"
            value={formData.Property_Area}
            onChange={handleChange}
            options={["Urban", "Semiurban", "Rural"]}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>

        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      {result && (
 <div
  className={`result-card ${
    result.prediction === "Y" ? "approved" : "rejected"
  }`}
>

    <h2>
      {result.prediction === "Y"
        ? "Loan Approved"
        : "Loan Not Approved"}
    </h2>

    <div className="probability">
      {(result.probability * 100).toFixed(2)}%
    </div>

    <p>Prediction Confidence</p>

    <div className="progress-bar">
      <div
        className="progress"
        style={{
          width: `${result.probability * 100}%`
        }}
      ></div>
    </div>
    <div className="application-summary">
  <h3>Application Summary</h3>

  <p>
    Applicant Income: ₹{formData.ApplicantIncome}
  </p>

  <p>
    Coapplicant Income: ₹{formData.CoapplicantIncome}
  </p>

  <p>
    Loan Amount: ₹{formData.LoanAmount}
  </p>

  <p>
    Credit History:{" "}
    {formData.Credit_History === "1"
      ? "Good"
      : "Not Available"}
  </p>

  <p>
    Property Area: {formData.Property_Area}
  </p>
</div>
<button
  type="button"
  className="reset-button"
  onClick={resetForm}
>
  Try Another Application
</button>
  </div>
)}

      </div>
    </div>
  );
}

export default App;