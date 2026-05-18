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
        dateServiced: new Date().toISOString().slice(0, 10),
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
    const [dswd, setDswd] = useState({});
    const [otherCharges, setOtherCharges] = useState([]);
    const [submitStatus, setSubmitStatus] = useState('');
    const [payments, setPayments] = useState([]);
    const [showPayment, setShowPayment] = useState(false);

    const resetForm = () => {
        setClientData(initialClientData);
        setDswd({});
        setOtherCharges([{ item_service: '', amount: 0, details: '' }]);
        setPayments([{ date_paid: '', amount_paid:'', details: '' }]);
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

        console.log(payload["payments"]);
        setSubmitStatus('Saving client data...');

        try {
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
                    setClientData={setClientData}                           
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
                        setOtherCharges = {setOtherCharges}
                    />
                </section>

                {/* ================= DSWD SECTION ================= */}
                <section className="section">
                    <h2 className="text-gray-800 mb-2">DSWD Assistance</h2>
                    <DSWDInfo dswd={dswd} />
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
