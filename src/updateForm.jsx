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
    Inclusions,
    Lights_Staff
} from './formSections';

// ================ UPDATE CLIENT FORM ===================
export default function UpdateForm({ data, onFormSubmitted, setUpdateForm, selectedClient }) {
    const [resetKey, setResetKey] = useState(0);
    const [client, setClientData] = useState(data.client || {});
    // const [region, setRegion] = useState([]);
    // const [province, setProvince] = useState([]);
    // const [city, setCity] = useState([]);
    // const [brgy, setBrgys] = useState([]);
    // const [purok, setPuroks] = useState([]);
    const [dswd, setDswd] = useState(Array.isArray(data.dswd) ? data.dswd[0] : data.dswd || {});
    const [payments, setPayments] = useState(data.payments || []);
    const [otherCharges, setOtherCharges] = useState(data.otherCharges || []);
    const [showCharge, setShowCharge] = useState(false);
    const [chargeData, setchargeData] = useState({item_service: '', amount: 0, details: ''});
    const [showPayment, setShowPayment] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [inclusions, setInclusions] = useState(data.inclusions || []);
    const [committedCoffin, setCommittedCoffin] = useState(data.client?.coffin || '');
    const [lights_staff, setLightsStaff] = useState(data.lights_staff?.[0] || []);

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
        <div className="updateform-container flex flex-row border-blue-500 border"
            key={resetKey}
        >
            <form className="flex flex-col items-start text-left"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row">
                    <div className="bg-white border-green-500 border rounded-lg p-6">
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
                    </div>
                    <div className="border-red-500 border rounded-lg flex flex-col ml-6">
                        <PriceBreakdown
                            client={client}
                            dswd={dswd}
                            payments={payments}
                            otherCharges={otherCharges}
                        />
                        <Lights_Staff
                            lights_staff={lights_staff}
                            setLightsStaff={setLightsStaff}
                        />
                    </div>
                </div> 
                   <div className="flex flex-row gap-2 items-center justify-items bg-white shadow-lg rounded-lg">
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

// export default UpdateForm;