import React, { useState, useEffect } from 'react';
import { Save, Trash, Pencil, Plus, X, Circle } from 'lucide-react';
import {updateClient, getClients, getCoffins} from './API/server_api';
import { Inclussions, PriceBreakdown } from './ViewFormSections';

import {
    Charges,
    ChargeTable,
    ClientInfo,
    Payments,
    PaymentsTable,
    DSWDInfo
} from './formSections';

// ================ UPDATE CLIENT FORM ===================
function UpdateForm({ data, onFormSubmitted }) {
    const [client, setClient] = useState(data.client || {});
    const [dswd, setDswd] = useState(Array.isArray(data.dswd) ? data.dswd[0] : data.dswd || {});
    const [payments, setPayments] = useState(data.payments || []);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClient((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'coffin') {
                const matching = coffins.find(
                    (info) => info.coffin_name === updated.coffin,
                );
                updated.coffinAmount = matching ? matching.amount : 0;
            }
            return updated;
        });
    };
// ===================== DSWD SECTION CHANGE =======================
    const handleDswdChange = (e) => {
        const { name, value } = e.target;
        setDswd((prev) => ({ ...prev, [name]: value }));
    };

    // ==================== Other Charges row change ====================
    const [showCharge, setShowCharge] = useState(false);
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
    const [tempPaymentData, setTempPaymentData] = useState({
        date_paid: new Date().toISOString().slice(0, 10),
        amount_paid: 0,
        details: '',
    });
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const updateTempPaymentData = (newItems) => {
        setTempPaymentData((prev) => ({ ...prev, ...newItems }));
    };

    const savePayment = () => {
        if (tempPaymentData.date_paid && tempPaymentData.amount_paid) {
            setPayments((prev) => [...prev, { ...tempPaymentData }]);
        }
        setTempPaymentData({
            date_paid: new Date().toISOString().slice(0, 10),
            amount_paid: 0,
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
            client,
            otherCharges,
            payments,
            dswd
        };

        setSubmitStatus('Updating client data...');
        try {
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

        const [coffins, setCoffins] = useState([]);
    
        useEffect(() => {
            const load = async () => {
                const data = await getCoffins();
                setCoffins(data);
            };
            load();
        }, []);

    return (
        <div className="updateform-container flex flex-row px-4 py-6 items-start justify-start">
            <form className="flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md w-full"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    clientData={client}
                    handleClientChange={handleClientChange}
                    coffins={coffins}
                />
                <div />

                {submitStatus && (
                    <div className="mb-4 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
                        {submitStatus}
                    </div>
                )}

                <Inclussions xcoffin = {client["coffin"]}/>

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
            <PriceBreakdown 
                client={client}
                dswd={dswd}
                payments={payments}
                otherCharges={otherCharges}
            />
        </div>

    );
}

export default UpdateForm;