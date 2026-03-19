import React, { useState } from 'react';
// import './styles/clientForm.css';
// import './styles/index.css';

const Coffin_info = [
  { Plan: 'OPHIR', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'GOODLIFE', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'BETTERLIFE', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'FREEDOMLIFE', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'SAN ROQUE DAYONG', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'HJV', Coffin: 'Ogoy Plain', Amount: 17000 },
  { Plan: 'None', Coffin: 'Ordinary', Amount: 15000 },
  { Plan: 'None', Coffin: 'Ordinary 3ft', Amount: 15000 },
  { Plan: 'None', Coffin: 'Ordinary 5ft', Amount: 15000 },
  { Plan: 'None', Coffin: 'Urgoy', Amount: 30000 },
  { Plan: 'None', Coffin: 'Urgoy 3ft', Amount: 30000 },
  { Plan: 'None', Coffin: 'Urgoy 5ft', Amount: 30000 },
  { Plan: 'None', Coffin: 'Ogoy Plain', Amount: 40000 },
  { Plan: 'None', Coffin: 'Ogoy Plain 3ft', Amount: 40000 },
  { Plan: 'None', Coffin: 'Ogoy Plain 5ft', Amount: 40000 },
  { Plan: 'None', Coffin: 'Ogoy Stoko', Amount: 42000 },
  { Plan: 'None', Coffin: 'Ogoy Stoko 3ft', Amount: 42000 },
  { Plan: 'None', Coffin: 'Ogoy Stoko 5ft', Amount: 42000 },
  { Plan: 'None', Coffin: 'Metal', Amount: 50000 }
];

function ClientForm() {
  // Main client section
  const [clientData, setClientData] = useState({
    dateServiced: new Date().toISOString().slice(0, 10), // today's date by default
    deceased: '',
    address: '',
    plan: '',
    coffin: '',
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
    <div className='form-container w-full'>
      <form className='w-full flex flex-col items-start text-left;' onSubmit={handleSubmit}>

      {/* ================= CLIENT SECTION ================= */}
      <section className="w-full text-gray-800">
        <h2 className="text-gray-800 mb-4 text-left">New Client Information</h2>

        <div className="w-full px-4 py-3 rounded">
          {/* Grid: 2 columns on medium+ screens, 1 column on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Date Serviced */}
            <div className="flex flex-col gap-1 text-left">
              <label>Date Serviced</label>
              <input
                type="date"
                name="dateServiced"
                value={clientData.dateServiced}
                onChange={handleClientChange}
                required
                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              />
            </div>

            {/* Deceased - split into 3 inputs */}
            <div className="flex flex-col gap-1 col-span-full text-left">
              <label>Deceased</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  name="deceasedFirst"
                  value={clientData.deceasedFirst}
                  onChange={handleClientChange}
                  placeholder="First Name"
                  className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                  required
                />
                <input
                  type="text"
                  name="deceasedMiddle"
                  value={clientData.deceasedMiddle}
                  onChange={handleClientChange}
                  placeholder="Middle Name"
                  className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                />
                <input
                  type="text"
                  name="deceasedLast"
                  value={clientData.deceasedLast}
                  onChange={handleClientChange}
                  placeholder="Last Name"
                  className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 col-span-full text-left">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={clientData.address}
                onChange={handleClientChange}
                placeholder="Purok, Barangay, Municipality"
                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              />
            </div>

            {/* Plan */}
            <div className="flex flex-col gap-1 text-left">
              <label>Plan</label>
              <select
                name="plan"
                value={clientData.plan}
                onChange={handleClientChange}
                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              >
                <option value='null'>None</option>
                <option value="Goodlife">Goodlife</option>
                <option value="Betterlife">Betterlife</option>
                <option value="Dreamlife">Dreamlife</option>
                <option value="Ophir">Ophir</option>
                <option value="San Roque Dayong">San Roque Dayong</option>
              </select>
            </div>

            {/* Coffin */}
            <div className="flex flex-col gap-1 text-left">
              <label>Coffin</label>
              <select
                name="coffin"
                value={clientData.coffin}
                onChange={handleClientChange}
                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              >
                <option value="Ordinary">Ordinary</option>
                <option value="Ordinary">Ordinary 3ft</option>
                <option value="Quadrado">Quadrado</option>
                <option value="Urgoy">Urgoy</option>
                <option value="Urgoy">Urgoy 3ft</option>
                <option value="Urgoy">Urgoy 5ft</option>
                <option value="Ogoy Stoko">Ogoy Stoko</option>
                <option value="Ogoy Plain">Ogoy Plain</option>
                <option value="Ogoy Plain">Ogoy Plain 3ft</option>
                <option value="Ogoy Plain">Ogoy Plain 5ft</option>
                <option value="Metal">Metal</option>
              </select>
            </div>

            {/* Coffin Amount */}
            <div className="flex flex-col gap-1 text-left">
              <label>Coffin Amount</label>
              <div className="w-full rounded px-2 py-1 bg-gray-700 text-white">
                ₱ {Number(clientData.coffinAmount).toLocaleString()}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1 col-span-full text-left">
              <label>Notes</label>
              <textarea
                name="notes"
                value={clientData.notes}
                onChange={handleClientChange}
                rows={3}
                placeholder="Additional instructions, requests, etc."
                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              />
            </div>

          </div>
        </div>
      </section>
{/* ================= OTHER CHARGES ================= */} 
<section className="form-section w-full flex flex-col items-start text-gray-800 gap-1 mb-10 mt-10 border-t border-gray-300 pt-4">
  <h2 className="text-gray-800 mb-2">Other Charges</h2>

  <table className="w-full border-collapse">
    <thead>
      <tr >
        <th className="text-left px-2 py-1">Item/Service</th>
        <th className="text-left px-2 py-1">Details</th>
        <th className="text-left px-2 py-1">Amount</th>
      </tr>
    </thead>
    <tbody>
      {otherCharges.map((charge, index) => (
        <tr key={index} className=" border-gray-300">
          <td className="px-2 py-1">
            <select
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
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
          <td className="px-2 py-1">
            <input
              type="text"
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
              value={charge.details}
              onChange={(e) => handleChargeChange(index, 'details', e.target.value)}
              placeholder="Description"
            />
          </td>
          <td className="px-2 py-1">
            <input
              type="number"
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
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

  <button
    type="button"
    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
    onClick={addChargeRow}
  >
    + Add Item
  </button>
</section>

        {/* ================= DSWD SECTION ================= */}
      <section className="form-section w-full flex flex-col items-start gap-2 mb-10 mt-10 border-t border-gray-300 pt-4">
        <h2 className="text-gray-800 mb-2">DSWD / Assistance</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-start gap-1">
            <label>GL Date</label>
            <input
              type="date"
              name="glDate"
              value={dswd.glDate}
              onChange={handleDswdChange}
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label>CI Number</label>
            <input
              type="text"
              name="ciNumber"
              value={dswd.ciNumber}
              onChange={handleDswdChange}
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label>Processor</label>
            <input
              type="text"
              name="processor"
              value={dswd.processor}
              onChange={handleDswdChange}
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={dswd.amount}
              onChange={handleDswdChange}
              min="0"
              step="0.01"
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label>Status</label>
            <select
              name="status"
              value={dswd.status}
              onChange={handleDswdChange}
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Released">Released</option>
              <option value="Denied">Denied</option>
            </select>
          </div>

          <div className="flex flex-col items-start gap-1 col-span-full">
            <label>Notes</label>
            <textarea
              name="notes"
              value={dswd.notes}
              onChange={handleDswdChange}
              rows={2}
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </div>
        </div>
      </section>

        {/* ================= TRANSACTIONS / PAYMENTS ================= */}
 <section className="form-section w-full flex flex-col items-start gap-2 mb-10 mt-10 border-t border-gray-300 pt-2">
  <h2 className="text-gray-800 mb-2">Payments / Transactions</h2>
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-200">
        <th className="text-left px-2 py-1">Date Paid</th>
        <th className="text-left px-2 py-1">Amount Paid</th>
        <th className="text-left px-2 py-1">Details</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((trans, index) => (
        <tr key={index} className="border-b border-gray-300">
          <td className="px-2 py-1">
            <input
              type="date"
              value={trans.datePaid}
              onChange={(e) =>
                handleTransactionChange(index, 'datePaid', e.target.value)
              }
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </td>
          <td className="px-2 py-1">
            <input
              type="number"
              value={trans.amountPaid}
              onChange={(e) =>
                handleTransactionChange(index, 'amountPaid', e.target.value)
              }
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </td>
          <td className="px-2 py-1">
            <input
              type="text"
              value={trans.details}
              onChange={(e) =>
                handleTransactionChange(index, 'details', e.target.value)
              }
              placeholder="OR#, Check#, Cash, etc."
              className="w-full rounded px-2 py-1 bg-gray-700 text-white"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <button
    type="button"
    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
    onClick={addTransactionRow}
  >
    + Add Payment
  </button>
</section>

{/* ================= FORM ACTIONS ================= */}
    <div className="form-actions mt-4">
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300"
      >
        Save Client Record
      </button>
    </div>
      </form>
    </div>
  );
}

export default ClientForm;