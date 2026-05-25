import React, { useState, useEffect } from 'react';
import { Save, Trash, Pencil, Plus, X, Circle } from 'lucide-react';
import {updateClient, getClients, getCoffins} from './API/server_api';
import {PriceBreakdown } from './ViewFormSections';

import {
    Charges,
    ChargeTable,
    ClientInfo,
    Payments,
    PaymentsTable,
    DSWDInfo,
    Inclusions
} from './formSections';

// ================ UPDATE CLIENT FORM ===================
function UpdateForm({ data, onFormSubmitted, setUpdateForm, selectedClient }) {
    const [resetKey, setResetKey] = useState(0);
    const [client, setClientData] = useState(data.client || {});
    const [dswd, setDswd] = useState(Array.isArray(data.dswd) ? data.dswd[0] : data.dswd || {});
    const [payments, setPayments] = useState(data.payments || []);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);
    const [showCharge, setShowCharge] = useState(false);
    const [chargeData, setchargeData] = useState({item_service: '', amount: 0, details: ''});
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [inclusions, setInclusions] = useState(data.inclusions || []);
    const [committedCoffin, setCommittedCoffin] = useState(data.client?.coffin || '');

    useEffect(() => {
        const currentCoffin = client["coffin"];
        if (currentCoffin !== committedCoffin) {
            setInclusions([]); // clear draft inclusions on coffin change
        }
    }, [client["coffin"]]);

    // ===================== SUBMIT =======================
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

            const payload = {
            client,
            inclusions,
            otherCharges,
            payments,
            dswd
        };
        console.log(`inc_payload: `, payload.inclusions);

        setSubmitStatus('Updating client data...');
        try {
            await updateClient(client.id, payload);
            setCommittedCoffin(client["coffin"]);
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

    const handleCancel = () => {
        setClientData(data.client || {});
        setDswd(Array.isArray(data.dswd) ? data.dswd[0] : data.dswd || {});
        setPayments(data.payments || []);
        setOtherCharges(data.otherCharges || []);
        setInclusions(data.inclusions || []);
        console.log("Data discarded, form reset to original data.");
    };
    return (
        <div className="updateform-container flex flex-row px-4 py-6 items-start justify-start"
            key={resetKey}
        >
            <form className="flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md w-full"
                onSubmit={handleSubmit}
            >
                <ClientInfo
                    clientData={client}
                    setClientData={setClientData}
                />
                <div />
                <Inclusions 
                    xcoffin = {client["coffin"]}
                    inclusions={inclusions}
                    setInclusions={setInclusions}
                />
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
                <div className="form-actions flex flex-row mt-4">
                    <button
                        type="submit"
                        className="mr-[125px] bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors duration-300"
                        disabled={!client.dateServiced || !client.deceasedFirst || !client.deceasedLast}
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="ml-[130px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
                    >
                        Cancel
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