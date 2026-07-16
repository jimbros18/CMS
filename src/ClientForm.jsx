import React, { useState, useEffect } from 'react';
// import {fetchClients} from './ClientTable';
import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import {addClient, getClients, getCoffins} from './API/server_api';
import { PriceBreakdown } from './ViewFormSections';
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

// ================ CLIENT INFO ===================
function ClientForm({ onFormSubmitted }) {

    const initialClientData = {
        dateServiced: new Date().toISOString().slice(0, 10),
        deceasedFirst: '',
        deceasedMiddle: '',
        deceasedLast: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        purok: '',
        cellNumber: '',
        facebook: '',
        plan: '',
        coffin: '',
        coffinAmount: 0,
        notes: '',
    };
    const [clientData, setClientData] = useState(initialClientData);
    const [assistance, setAssistance] = useState([]);
    const [otherCharges, setOtherCharges] = useState([]);
    const [submitStatus, setSubmitStatus] = useState('');
    const [payments, setPayments] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const [inclusions, setInclusions] = useState([]);
    const [staff, setStaff] = useState([]);
    const [lights, setLights] = useState([]);
    const [returned, setReturned] = useState([]);


    const resetForm = () => {
        setClientData(initialClientData);
        setAssistance([{gl_date: "", ci_number: "", provider:"", processor: "", amount: 0}]);
        setOtherCharges([{ item_service: '', amount: 0, details: '' }]);
        setPayments([{ date_paid: '', amount_paid:'', details: '' }]);
        setInclusions([]);
    };
    // ===================== SUBMIT =======================
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const payload = {
            client: clientData,
            inclusions,
            otherCharges,
            assistance,
            payments
        };

        console.log(payload);
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
        <div className="updateform-container flex  flex-row border-blue-500 border gap-6 p-6 w-8/12">   
            <form className="flex inline-flex flex-col items-start text-left"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row">
                    <div className = "flex flex-col text-left border border-red-500 rounded shadow-md bg-white p-6 w-[60%]">
                        <ClientInfo clientData={clientData} setClientData={setClientData}  />
                        {submitStatus && ( 
                            <div className="mb-4 w-full rounded border border-green-300 bg-green-50 px-3 py-2 text-green-700">
                                {submitStatus}
                            </div>
                        )}
                        <Inclusions  
                            xcoffin ={clientData["coffin"]}
                            plan={clientData["plan"]}
                            inclusions={inclusions}
                            setInclusions={setInclusions}
                        />
                        {/* ================= OTHER CHARGES ================= */}
                        <section className="section flex flex-col-reverse items-start">
                            <ChargeTable otherCharges={otherCharges} setOtherCharges = {setOtherCharges} />
                        </section>
                        {/* ================= DSWD SECTION ================= */}
                        <section className="section">
                            <AssistanceTable assistance={assistance} setAssistance={setAssistance} />
                        </section>

                        {/* ================= PAYMENTS ================= */}
                        <section className="section">
                            <PaymentsTable payments={payments} setPayments={setPayments} />
                        </section>
                    </div>
                    <div className="border-red-500 border rounded-lg flex  inline-flex flex-col ml-6 w-[40%]">
                        <PriceBreakdown
                            client={clientData}
                            otherCharges={otherCharges}
                            payments={payments}
                            assistance={assistance}
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
                {/* ================= FORM ACTIONS ================= */}
                <div className="flex flex-row gap-2 items-center justify-items bg-white shadow-lg rounded-lg mt-4">
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
