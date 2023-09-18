import { useEffect, useState } from 'react';

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function App() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertCurrency() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          console.log(res.ok);
          if (!res.ok) {
            throw new Error(
              'Something went wrong with fetching currency value'
            );
          }
          const data = await res.json();
          console.log(data);
          setResult(data.rates[toCurrency]);
          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
      if (amount === 0) {
        setResult(0)
        return;
      }
      if (fromCurrency === toCurrency) {
        setResult(amount);
        return;
      }
      convertCurrency();
      return function () {
        controller.abort();
      };
    },
    [amount, fromCurrency, toCurrency]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => {
          if (!isNaN(Number(e.target.value))) {
            setAmount(Number(e.target.value));
          }
        }}
        // disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={isLoading}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={isLoading}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading && <p>Calculating...</p>}
      {!error && !isLoading && (
        <p>
          {result} {toCurrency}
        </p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
