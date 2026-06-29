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
    AssistanceTable,
    Inclusions,
    Staff,
    Lights
} from './formSections';



// ================ UPDATE CLIENT FORM ===================
export default function UpdateForm({ data, onFormSubmitted, setUpdateForm, selectedClient }) {
    const [resetKey, setResetKey] = useState(0);
    const [client, setClientData] = useState(data.client || {});
    const [assistance, setAssistance] = useState(Array.isArray(data.assistance) ? data.assistance : []);
    const [payments, setPayments] = useState(data.payments || []);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);
    const [showCharge, setShowCharge] = useState(false);
    const [chargeData, setchargeData] = useState({item_service: '', amount: 0, details: ''});
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [inclusions, setInclusions] = useState(data.inclusions || []);
    const [committedCoffin, setCommittedCoffin] = useState(data.client?.coffin || '');
    const [staff, setStaff] = useState(data.staff?.[0] || {});
    const [lights, setLights] = useState((data.lights || []).map(l => typeof l === 'object' ? l.id : l));
    const [returned, setReturned] = useState(data.returned || []);

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
            assistance,
            staff: [staff],
            lights,
            returned
        };

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
        setAssistance(Array.isArray(data.assistance) ? data.assistance : [])
        setPayments(data.payments || []);
        setOtherCharges(data.otherCharges || []);
        setInclusions(data.inclusions || []);
        console.log("Data discarded, form reset to original data.");
    };

    return (
        <div className="updateform-container flex flex-row gap-6 p-6 w-8/12"
            key={resetKey}
        >
            <form className="flex inline-flex flex-col items-start text-left"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row">
                    <div className="bg-white rounded-lg px-6 w-[60%]">
                            <div className="mt-6">
                                <ClientInfo
                                    clientData={client}
                                    setClientData={setClientData}
                                />
                            </div>
                            <section className="section flex flex-col-reverse items-start">
                                <Inclusions 
                                    xcoffin = {client["coffin"]}
                                    inclusions={inclusions}
                                    setInclusions={setInclusions}
                                />
                                </section>
                            <section className="section flex flex-col-reverse items-start">
                                <ChargeTable
                                    otherCharges={otherCharges}
                                    setOtherCharges={setOtherCharges}
                                />
                            </section>

                            {/* ================= DSWD SECTION ================= */}
                            <section className="section">
                                <AssistanceTable 
                                    assistance={assistance}
                                    setAssistance={setAssistance} />
                            </section>

                            {/* ================= PAYMENTS ================= */}
                            <section className="section">
                                <PaymentsTable
                                    payments={payments}
                                    setPayments={setPayments}
                                />
                            </section>
                    </div>
                    <div className="rounded-lg flex  inline-flex flex-col ml-6 w-[40%]">
                        <PriceBreakdown
                            client={client}
                            assistance={assistance}
                            payments={payments}
                            otherCharges={otherCharges}
                        />
                        <Staff
                            staff={staff}
                            setStaff={setStaff}
                        />
                        <Lights
                            lights={lights}
                            setLights={setLights}
                            returned = {returned}
                            setReturned = {setReturned}
                        />
                    </div>
                </div> 
                   <div className="flex flex-row gap-2 items-center justify-items bg-white shadow-lg rounded-lg mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors duration-300"
                        disabled={!client.dateServiced || !client.deceasedFirst || !client.deceasedLast}
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    );
}
