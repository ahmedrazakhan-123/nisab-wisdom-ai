import React, { useEffect, useState } from "react";

interface ZakatCalculation {
  wealth: number;
  liabilities: number;
  zakatDue: number;
}

const ZakatData: React.FC = () => {
  const [data, setData] = useState<ZakatCalculation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/zakat")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading zakat data...</div>;
  if (!data) return <div>No zakat data found.</div>;

  return (
    <div>
      <h2>Zakat Calculation</h2>
      <p>Wealth: {data.wealth}</p>
      <p>Liabilities: {data.liabilities}</p>
      <p>Zakat Due: {data.zakatDue}</p>
    </div>
  );
};

export default ZakatData;
