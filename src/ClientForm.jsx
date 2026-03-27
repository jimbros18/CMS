import React, { useState } from 'react';
import ClientsTable from './ClientTable';
import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import {addClient, getClients} from './API/server_api';
import {
    Charges,
    ChargeTable,
    ClientInfo,
    Payments,
    PaymentsTable,
    DSWDInfo,
} from './formSections';

const Coffin_info = [
    { Coffin: 'Ogoy Plain Plan', Amount: 17000 },
    { Coffin: 'Ordinary', Amount: 15000 },
    { Coffin: 'Ordinary 3ft', Amount: 15000 },
    { Coffin: 'Ordinary 5ft', Amount: 15000 },
    { Coffin: 'Quadrado', Amount: 23000 },
    { Coffin: 'Urgoy', Amount: 30000 },
    { Coffin: 'Urgoy 3ft', Amount: 30000 },
    { Coffin: 'Urgoy 5ft', Amount: 30000 },
    { Coffin: 'Ogoy Plain', Amount: 40000 },
    { Coffin: 'Ogoy Plain 3ft', Amount: 40000 },
    { Coffin: 'Ogoy Plain 5ft', Amount: 40000 },
    { Coffin: 'Ogoy Stoko', Amount: 42000 },
    { Coffin: 'Ogoy Stoko 3ft', Amount: 42000 },
    { Coffin: 'Ogoy Stoko 5ft', Amount: 42000 },
    { Coffin: 'Metal', Amount: 50000 },
];

// ================ CLIENT INFO ===================
function ClientForm({ onFormSubmitted }) {
    const initialClientData = {
        dateServiced: new Date().toISOString().slice(0, 10), // today's date by default
        deceasedFirst: '',
        deceasedMiddle: '',
        deceasedLast: '',
        address: '',
        cell_number: '',
        Facebook: '',
        plan: '',
        coffin: '',
        coffinAmount: 0,
        notes: '',
    };

    const [clientData, setClientData] = useState(initialClientData);

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'coffin') {
                const matching = Coffin_info.find(
                    (info) => info.Coffin === updated.coffin,
                );
                updated.coffinAmount = matching ? matching.Amount : 0;
            }
            if (
                ['deceasedFirst', 'deceasedMiddle', 'deceasedLast'].includes(
                    name,
                )
            ) {
                updated.deceased = [
                    updated.deceasedFirst,
                    updated.deceasedMiddle,
                    updated.deceasedLast,
                ]
                    .filter(Boolean)
                    .join(' ');
            }
            return updated;
        });
    };

    // ==================== DSWD Section ====================
const initialDswd = {
    glDate: new Date().toISOString().slice(0, 10),
    ciNumber: '',
    processor: '',
    amount: '',
    status: 'Pending',
    notes: '',
  };

  const [dswd, setDswd] = useState(initialDswd);

    const handleDswdChange = (e) => {
        const { name, value } = e.target;
        setDswd((prev) => ({ ...prev, [name]: value }));
    };

    // ==================== Other Charges row change ====================
    const [showCharge, setShowCharge] = useState(false);
    const [otherCharges, setOtherCharges] = useState([]);

    const addCharge = () => {
        if (chargeData.item && chargeData.amount) {
            setOtherCharges((prev) => [...prev, { ...chargeData }]);
        }
        setchargeData({ item: '', amount: '', notes: '' }); // reset in all cases
        setShowCharge(false);
    };

    const deleteCharge = (index) => {
        setOtherCharges((prev) => prev.filter((_, i) => i !== index));
    };

    const [chargeData, setchargeData] = useState({
        item: '',
        amount: '',
        notes: '',
    });
    const updateChargeData = (newItems) => {
        setchargeData((prev) => {
            const updated = { ...prev, ...newItems };
            console.log(updated);
            return updated;
        });
    };

    // ====================== Payment row change ========================
    const [payments, setPayments] = useState([]);
    const [paymentData, setpaymentData] = useState({
        datePaid: new Date().toISOString().slice(0, 10),
        amountPaid: '',
        details: '',
    });
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const updatepaymentData = (newItems) => {
        setpaymentData((prev) => ({ ...prev, ...newItems }));
    };

    const savePayment = () => {
        if (paymentData.datePaid && paymentData.amountPaid) {
            setPayments((prev) => [...prev, { ...paymentData }]);
        }
        setpaymentData({
            datePaid: new Date().toISOString().slice(0, 10),
            amountPaid: '',
            details: '',
        });
        setShowPayment(false);
    };

    const deletePayment = (index) => {
        setPayments((prev) => prev.filter((_, i) => i !== index));
    };

    {
        /* ================= SUBMIT ================= */
    }
const resetForm = () => {
    setClientData(initialClientData);
    setDswd(initialDswd);
    setOtherCharges([]);
    setchargeData({ item: '', amount: '', notes: '' });
    setPayments([]);
    setpaymentData({
      datePaid: new Date().toISOString().slice(0, 10),
      amountPaid: '',
      details: '',
    });
    setShowCharge(false);
    setShowPayment(false);
  };
 // ===================== SUBMIT =======================
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const payload = {
      client: clientData,
      otherCharges,
      dswd,
      payments,
    };

//     const client = {
//     first: clientData.deceasedFirst,
//     middle: clientData.deceasedMiddle,
//     last: clientData.deceasedLast,
//     address: clientData.address,
// };

    setSubmitStatus('Saving client data...');
    console.log(payload);
    addClient(clientData);
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  return (
        <div className="form-container w-3/5 items-center justify-center">
            <form
                className="w-full flex flex-col items-start text-left;"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    clientData={clientData}
                    handleClientChange={handleClientChange}
                    coffinInfo={Coffin_info}
                />
                <div />

                {submitStatus && (
                    <div className="mb-4 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
                        {submitStatus}
                    </div>
                )}

                {/* ================= OTHER CHARGES ================= */}
                <section className="section flex flex-col-reverse items-start">
                    <h2 className="text-gray-800 mb-2">Other Charges</h2>
                    <ChargeTable
                        otherCharges={otherCharges}
                        onDeleteCharge={deleteCharge}
                    />
                    <div className="flex flex-col-reverse items-start">
                        <button
                            type="button"
                            className="ml-5 mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
                            onClick={() =>
                                showCharge ? addCharge() : setShowCharge(true)
                            }
                        >
                            {showCharge ? (
                                <Save size={16} />
                            ) : (
                                <Plus size={16} />
                            )}
                        </button>
                        {showCharge && (
                            <Charges
                                chargeData={chargeData}
                                updateChargeData={updateChargeData}
                            />
                        )}
                    </div>
                </section>

                {/* ================= DSWD SECTION ================= */}
                <section className="section">
                    <h2 className="text-gray-800 mb-2">DSWD Assistance</h2>
                    <DSWDInfo dswd={dswd} handleDswdChange={handleDswdChange} />
                </section>

                {/* ================= PAYMENTS ================= */}
                <section className="section">
                    <h2 className="text-gray-800 mb-2">Payments</h2>

                    <PaymentsTable
                        payments={payments}
                        onDeletePayment={deletePayment}
                    />

                    <div className="flex flex-col-reverse items-start">
                        <button
                            type="button"
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
                            onClick={() =>
                                showPayment
                                    ? savePayment()
                                    : setShowPayment(true)
                            }
                        >
                            {showPayment ? (
                                <Save size={16} />
                            ) : (
                                <Plus size={16} />
                            )}
                        </button>
                        {showPayment && (
                            <Payments
                                paymentData={paymentData}
                                updatepaymentData={updatepaymentData}
                            />
                        )}
                    </div>
                </section>

                {/* ================= FORM ACTIONS ================= */}
                <div className="form-actions mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors duration-300"
                        disabled={!clientData.dateServiced || !clientData.deceasedFirst || !clientData.deceasedLast}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ClientForm;
