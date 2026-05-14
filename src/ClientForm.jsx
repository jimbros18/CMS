import React, { useState, useEffect } from 'react';
// import {fetchClients} from './ClientTable';
import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import {addClient, getClients, getCoffins} from './API/server_api';
import { Inclussions, PriceBreakdown } from './ViewFormSections';
import {
    Charges,
    ChargeTable,
    ClientInfo,
    Payments,
    PaymentsTable,
    DSWDInfo
} from './formSections';

// ================ CLIENT INFO ===================
function ClientForm({ onFormSubmitted }) {

    const initialClientData = {
        dateServiced: new Date().toISOString().slice(0, 10), // today's date by default
        deceasedFirst: '',
        deceasedMiddle: '',
        deceasedLast: '',
        address: '',
        cellNumber: '',
        facebook: '',
        plan: '',
        coffin: '',
        coffinAmount: 0,
        notes: '',
    };

    const [clientData, setClientData] = useState(initialClientData);

    const [coffins, setCoffins] = useState([]);
    
        useEffect(() => {
            const load = async () => {
                const data = await getCoffins();
                setCoffins(data);
            };
            load();
        }, []);

    const handleClientChange = (e) => {
        const { name, value } = e.target;

        setClientData((prev) => {
            // copy first
            let updated = { ...prev, [name]: value };

            // ONLY override when coffin changes
            if (name === 'coffin') {
                const matching = coffins.find(
                    (c) => c.coffin_name === value
                );

                updated.coffinAmount = matching ? matching.amount : '';
            }

            return updated;
        });
    };
    console.log("render coffinAmount:", clientData.coffinAmount);

    // ==================== DSWD Section ====================
    const [dswd, setDswd] = useState({});

    const handleDswdChange = (e) => {
        const { name, value } = e.target;
        setDswd((prev) => ({ ...prev, [name]: value }));
    };

    // ==================== Other Charges row change ====================
    const [chargeData, setchargeData] = useState([]);
    const [showCharge, setShowCharge] = useState(false);
    const [otherCharges, setOtherCharges] = useState([]);

    const addCharge = () => {
        const hasValidAmount = chargeData.amount !== null && chargeData.amount !== '';
        if (chargeData.item_service?.trim() && hasValidAmount) {
            setOtherCharges((prev) => [
                ...prev,
                { ...chargeData, amount: Number(chargeData.amount) },
            ]);
        }
        setchargeData({ item_service: '', amount: 0, details: '' }); // reset in all cases
        // setOtherCharges((prev) => [...prev, { ...chargeData}]);  
        setShowCharge(false);
    };

    const deleteCharge = (index) => {
        setOtherCharges((prev) => prev.filter((_, i) => i !== index));
    };

    const updateChargeData = (newItems) => {
        setchargeData((prev) => {
            const updated = { ...prev, ...newItems };
            return updated;
        });
    };

    // ====================== Payment row change ========================
    const [payments, setPayments] = useState([]);
    const [tempPaymentData, setTempPaymentData] = useState({
        datePaid: new Date().toISOString().slice(0, 10),
        amountPaid: 0,
        details: '',
    });
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const updateTempPaymentData = (newItems) => {
        setTempPaymentData((prev) => ({ ...prev, ...newItems }));
    };

    const savePayment = () => {
        if (tempPaymentData.datePaid && tempPaymentData.amountPaid) {
            setPayments((prev) => [...prev, { ...tempPaymentData }]);
        }
        setTempPaymentData({
            datePaid: new Date().toISOString().slice(0, 10),
            amountPaid: 0,
            details: '',
        });
        setShowPayment(false);
    };

    const deletePayment = (index) => {
        setPayments((prev) => prev.filter((_, i) => i !== index));
    };

const resetForm = () => {
    setClientData(initialClientData);
    setDswd({});
    setOtherCharges([{ item_service: '', amount: 0, details: '' }]);
    setchargeData({ item_service: '', amount: 0, details: '' });
    setPayments([{ datePaid: '', amountPaid: 0, details: '' }]);
    setTempPaymentData({
      datePaid: new Date().toISOString().slice(0, 10),
      amountPaid: 0,
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

    setSubmitStatus('Saving client data...');
    try {
      console.log(payload);
      await addClient(payload);
      setSubmitStatus('Client data saved.');
      resetForm();
      if (typeof onFormSubmitted === 'function') {
        onFormSubmitted();
      }
    } catch (error) {
      console.error('Save failed:', error);
      setSubmitStatus('Failed to save client data.');
    } finally {
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
       <div className="newform-container flex flex-row px-4 py-6 items-start justify-start">
            <form
                className="flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md w-full"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    clientData={clientData}
                    handleClientChange={handleClientChange}                                     
                />
                <div />

                {submitStatus && (
                    <div className="mb-4 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
                        {submitStatus}
                    </div>
                )}

                <Inclussions  xcoffin ={clientData["coffin"]} />

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
                                paymentData={tempPaymentData}
                                updatepaymentData={updateTempPaymentData}
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

                <PriceBreakdown
                    client={clientData}
                    otherCharges={otherCharges}
                    payments={payments}
                    dswd={dswd}
                />
        </div>
    );
}

export default ClientForm;
