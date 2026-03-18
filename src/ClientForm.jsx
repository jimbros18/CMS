import React, { useState } from 'react';
// import './styles/clientForm.css';
import './styles/index.css';

function ClientForm() {
  // Main client section
  const [clientData, setClientData] = useState({
    dateServiced: new Date().toISOString().slice(0, 10), // today's date by default
    deceased: '',
    address: '',
    plan: 'Goodlife',
    coffin: 'Ordinary',
    coffinAmount: 0,
    notes: '',
  });

  // Other charges - array of items
  const [otherCharges, setOtherCharges] = useState([
    { item: 'Lapida', details: '', amount: '' },
  ]);

  // DSWD section
  const [dswd, setDswd] = useState({
    glDate: '',
    ciNumber: '',
    processor: '',
    deceased: '',
    deceasedAddress: '',
    amount: '',
    status: 'Pending',
    notes: '',
  });

  // Transactions - payment records
  const [transactions, setTransactions] = useState([
    { datePaid: '', amountPaid: '', details: '' },
  ]);

  // Handlers
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDswdChange = (e) => {
    const { name, value } = e.target;
    setDswd((prev) => ({ ...prev, [name]: value }));
  };

  // Other Charges row change
  const handleChargeChange = (index, field, value) => {
    const newCharges = [...otherCharges];
    newCharges[index][field] = value;
    setOtherCharges(newCharges);
  };

  const addChargeRow = () => {
    setOtherCharges([...otherCharges, { item: 'Lapida', details: '', amount: '' }]);
  };

  // Transaction row change
  const handleTransactionChange = (index, field, value) => {
    const newTrans = [...transactions];
    newTrans[index][field] = value;
    setTransactions(newTrans);
  };

  const addTransactionRow = () => {
    setTransactions([...transactions, { datePaid: '', amountPaid: '', details: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', {
      client: clientData,
      otherCharges,
      dswd,
      transactions,
    });
    // Here you would normally send to backend / save to state / etc.
    alert('Form submitted (check console)');
  };

  return (
    <div className="form-container container:l">
      <h1 className='text-black border-red-500'>Client & Funeral Service Form</h1>

      <form onSubmit={handleSubmit}>
        {/* ================= CLIENT SECTION ================= */}
        <section className="form-section">
          <h2>Client Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Date Serviced</label>
              <input
                type="date"
                name="dateServiced"
                value={clientData.dateServiced}
                onChange={handleClientChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Deceased</label>
              <input
                type="text"
                name="deceased"
                value={clientData.deceased}
                onChange={handleClientChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={clientData.address}
                onChange={handleClientChange}
                placeholder="Purok, Barangay, Municipality"
              />
            </div>

            <div className="form-group">
              <label>Plan</label>
              <select name="plan" value={clientData.plan} onChange={handleClientChange}>
                <option value="Goodlife">Goodlife</option>
                <option value="Betterlife">Betterlife</option>
                <option value="Dreamlife">Dreamlife</option>
                <option value="Ophir">Ophir</option>
                <option value="San Roque Dayong">San Roque Dayong</option>
              </select>
            </div>

            <div className="form-group">
              <label>Coffin</label>
              <select name="coffin" value={clientData.coffin} onChange={handleClientChange}>
                <option value="Ordinary">Ordinary</option>
                <option value="Quadrado">Quadrado</option>
                <option value="Urgoy">Urgoy</option>
                <option value="Ogoy Stoko">Ogoy Stoko</option>
                <option value="Ogoy Plain">Ogoy Plain</option>
                <option value="Metal">Metal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Coffin Amount</label>
              <div className="read-only-field">
                ₱ {Number(clientData.coffinAmount).toLocaleString()}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={clientData.notes}
                onChange={handleClientChange}
                rows={3}
                placeholder="Additional instructions, requests, etc."
              />
            </div>
          </div>
        </section>

        {/* ================= OTHER CHARGES ================= */}
        <section className="form-section">
          <h2>Other Charges</h2>
          <table className="charge-table">
            <thead>
              <tr>
                <th>Item/Service</th>
                <th>Details</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {otherCharges.map((charge, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={charge.item}
                      onChange={(e) => handleChargeChange(index, 'item', e.target.value)}
                    >
                      <option value="Lapida">Lapida</option>
                      <option value="Candle">Candle</option>
                      <option value="Lettering">Lettering</option>
                      <option value="Bulak">Bulak</option>
                      <option value="Tarpaulin">Tarpaulin</option>
                      <option value="Video">Video</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={charge.details}
                      onChange={(e) => handleChargeChange(index, 'details', e.target.value)}
                      placeholder="Description"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={charge.amount}
                      onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-btn" onClick={addChargeRow}>
            + Add Item
          </button>
        </section>

        {/* ================= DSWD SECTION ================= */}
        <section className="form-section">
          <h2>DSWD / Assistance</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>GL Date</label>
              <input type="date" name="glDate" value={dswd.glDate} onChange={handleDswdChange} />
            </div>
            <div className="form-group">
              <label>CI Number</label>
              <input type="text" name="ciNumber" value={dswd.ciNumber} onChange={handleDswdChange} />
            </div>
            <div className="form-group">
              <label>Processor</label>
              <input type="text" name="processor" value={dswd.processor} onChange={handleDswdChange} />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={dswd.amount}
                onChange={handleDswdChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={dswd.status} onChange={handleDswdChange}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Released">Released</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={dswd.notes}
                onChange={handleDswdChange}
                rows={2}
              />
            </div>
          </div>
        </section>

        {/* ================= TRANSACTIONS / PAYMENTS ================= */}
        <section className="form-section">
          <h2>Payments / Transactions</h2>
          <table className="charge-table">
            <thead>
              <tr>
                <th>Date Paid</th>
                <th>Amount Paid</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trans, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={trans.datePaid}
                      onChange={(e) => handleTransactionChange(index, 'datePaid', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={trans.amountPaid}
                      onChange={(e) => handleTransactionChange(index, 'amountPaid', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={trans.details}
                      onChange={(e) => handleTransactionChange(index, 'details', e.target.value)}
                      placeholder="OR#, Check#, Cash, etc."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-btn" onClick={addTransactionRow}>
            + Add Payment
          </button>
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Client Record
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientForm;