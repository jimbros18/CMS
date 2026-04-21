import React, { useState, useEffect } from 'react';
// import {fetchClients} from './ClientTable';
import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import {updateClient, getClients} from './API/server_api';
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

// ================ UPDATE CLIENT FORM ===================
function UpdateForm({ data, onFormSubmitted }) {
    const [client, setClient] = useState(data.client || {});
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
// ===================== DSWD SECTION CHANGE =======================
    const [dswd, setDswd] = useState(data.dswd || {});
    const handleDswdChange = (e) => {
        const { name, value } = e.target;
        setDswd((prev) => ({ ...prev, [name]: value }));
    };

    // ==================== Other Charges row change ====================
    const [showCharge, setShowCharge] = useState(false);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);
    const [chargeData, setchargeData] = useState({
        item_service: '',
        amount: 0,
        details: '',
    });

    const addCharge = () => {
        const hasValidAmount = chargeData.amount !== null && chargeData.amount !== '';
        if (chargeData.item_service?.trim() && hasValidAmount) {
            setOtherCharges((prev) => [
                ...prev,
                { ...chargeData, amount: Number(chargeData.amount) },
            ]);
        }
        setchargeData({ item_service: '', amount: 0, details: '' });
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
    const [payments, setPayments] = useState(data.payments || []);
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

    // ===================== SUBMIT =======================
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const payload = {
            client: (({ id, ...rest }) => rest)(client),
            otherCharges: otherCharges.map(({ id, ...rest }) => rest),
            payments: payments.map(({ id, ...rest }) => rest),
            dswd: dswd
        };

        setSubmitStatus('Updating client data...');
        try {
            console.log(payload);
            await updateClient(client.id, payload);
            setSubmitStatus('Client data updated.');
            if (typeof onFormSubmitted === 'function') {
                onFormSubmitted();
            }
        } catch (error) {
            console.error('Update failed:', error);
            setSubmitStatus('Failed to update client data.');
        } finally {
            setTimeout(() => setSubmitStatus(''), 3000);
        }
    };

    return (
        <div className="form-container w-3/5 items-center justify-center">
            <form
                className="w-full flex flex-col items-start text-left;"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    const 
                    clientData={client}
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
                        disabled={!client.dateServiced || !client.deceasedFirst || !client.deceasedLast}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateForm;