import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState([0, 0, 0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const newInput = [...input];
    newInput[index] = parseFloat(value) || 0;
    setInput(newInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Currency Converter</h1>
      <form onSubmit={handleSubmit}>
        {['Feature 1', 'Feature 2', 'Feature 3'].map((label, index) => (
          <div key={index}>
            <label>
              {label}:
              <input
                type="number"
                value={input[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="submit">Convert</button>
      </form>
      {result !== null && <h2>Predicted Rate: {result}</h2>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
