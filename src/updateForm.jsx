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
    const [client, setClientData] = useState(data.client || {});
    const [dswd, setDswd] = useState(Array.isArray(data.dswd) ? data.dswd[0] : data.dswd || {});
    const [payments, setPayments] = useState(data.payments || []);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);
    const [showCharge, setShowCharge] = useState(false);
    const [chargeData, setchargeData] = useState({item_service: '', amount: 0, details: ''});
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    // const addCharge = () => {
    //     const hasValidAmount = chargeData.amount !== null && chargeData.amount !== '';
    //     if (chargeData.item_service?.trim() && hasValidAmount) {
    //         setOtherCharges((prev) => [
    //             ...prev,
    //             { ...chargeData, amount: Number(chargeData.amount) },
    //         ]);
    //     }
    //     setchargeData({ item_service: '', amount: 0, details: '' });
    //     setShowCharge(false);
    // };




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
    return (
        <div className="updateform-container flex flex-row px-4 py-6 items-start justify-start">
            <form className="flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md w-full"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    clientData={client}
                    setClientData={setClientData}
                />
                <div />
                {/* {submitStatus && (
                    <div className="mb-4 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
                        {submitStatus}
                    </div>
                )} */}

                <Inclussions xcoffin = {client["coffin"]}/>
                <section className="section flex flex-col-reverse items-start">
                    <h2 className="text-gray-800 mb-2">Other Charges</h2>
                    <ChargeTable
                        otherCharges={otherCharges}
                        setOtherCharges={setOtherCharges}
                    />
                </section>

                {/* ================= DSWD SECTION ================= */}
                <section className="section">
                    <h2 className="text-gray-800 mb-2">DSWD Assistance</h2>
                    <DSWDInfo dswd={dswd} setDswd={setDswd} />
                </section>

                {/* ================= PAYMENTS ================= */}
                <section className="section">
                    <h2 className="text-gray-800 mb-2">Payments</h2>
                    <PaymentsTable
                        payments={payments}
                        setPayments={setPayments}
                    />
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