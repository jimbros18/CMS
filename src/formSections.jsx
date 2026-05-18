import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCoffins } from './API/server_api';


export function ClientInfo({clientData, setClientData}) { 

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
            let updated = { ...prev, [name]: value };
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

    return (
        <section className="w-full text-gray-800">
            <h2 className="text-gray-800 mb-4 text-left">
                Client Information
            </h2>
            <div className="w-full py-2 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Serviced */}
                    <div className="flex flex-col gap-1 text-left">
                        <label>Date Serviced</label>
                        <input
                            type="date"
                            name="dateServiced"
                            value={clientData.dateServiced || ''}
                            onChange={handleClientChange}
                            required
                            className="rounded px-2 bg-gray-700 text-white"
                        />
                    </div>

                    {/* Deceased - split into 3 inputs */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Deceased</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                                type="text"
                                name="deceasedFirst"
                                value={clientData.deceasedFirst || ''}
                                onChange={handleClientChange}
                                placeholder="First Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="deceasedMiddle"
                                value={clientData.deceasedMiddle || ''}
                                onChange={handleClientChange}
                                placeholder="Middle Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="deceasedLast"
                                value={clientData.deceasedLast || '' }
                                onChange={handleClientChange}
                                placeholder="Last Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={clientData.address || ''}
                            onChange={handleClientChange}
                            placeholder="Purok, Barangay, Municipality"
                            className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            required
                        />
                    </div>
                    {/* Contacts */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Contacts</label>
                        <div className="flex flex-row gap-2 col-span-full text-left">
                            <input
                                type="text"
                                name="cellNumber"
                                value={clientData.cellNumber || ''}
                                onChange={handleClientChange}
                                placeholder="Cellphone Number"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="facebook"
                                value={clientData.facebook || ''}
                                onChange={handleClientChange}
                                placeholder="Facebook"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                        </div>
                    </div>

                    {/* Plan */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Plan</label>
                                <select
                                    name="plan"
                                    value={clientData.plan || 'None'}
                                    onChange={handleClientChange}
                                    className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                >
                                    <option value="None">None</option>
                                    <option value="GOODLIFE">Goodlife</option>
                                    <option value="BETTERLIFE">
                                        Betterlife
                                    </option>
                                    <option value="DREAMLIFE">Dreamlife</option>
                                    <option value="OPHIR">Ophir</option>
                                    <option value="SAN ROQUE DAYONG">
                                        San Roque Dayong
                                    </option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Coffin</label>
                                <select
                                    name="coffin"
                                    value={clientData.coffin || ''}
                                    onChange={handleClientChange}
                                    className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                >
                                    {coffins.map((c, i) => (
                                        <option key={i} value={c.coffin_name}>
                                            {c.coffin_name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Amount</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={clientData.coffinAmount ?? ''}
                                    onChange={handleClientChange}
                                    className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={clientData.notes || ''}
                            onChange={handleClientChange}
                            rows={3}
                            placeholder="Additional instructions, requests, etc."
                            className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ChargeTable({ otherCharges, setOtherCharges}) {
    const [showCharge, setShowCharge] = useState(false);
    const [chargeData, setchargeData] = useState({item_service: '', amount: 0, details: ''});
    const onDeleteCharge = (index) => {setOtherCharges((prev) => prev.filter((_, i) => i !== index));};
    
    const addCharge = () => {
        const hasValidAmount = chargeData.amount !== null && chargeData.amount !== '';
        if (chargeData.item_service?.trim() && hasValidAmount) {
            setOtherCharges((prev) => [
                ...prev,
                { ...chargeData, amount: Number(chargeData.amount) },
            ]);
        }
        setchargeData({ item_service: '', amount: 0, details: '' }); // reset in all cases
        setShowCharge(false);
    };
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full max-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Item/Service
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Amount
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Details
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {otherCharges.length === 0 ? (
                        <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 px-2 py-1 text-center text-gray-500"
                            >
                                No charges added yet
                            </td>
                        </tr>
                    ) : (
                        otherCharges.map((charge, idx) => (
                            <tr
                                key={idx}
                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <td className="border border-gray-300 px-2 py-1">
                                    {charge.item_service || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {charge.amount || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {charge.details || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteCharge && onDeleteCharge(idx)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
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
                        setchargeData={setchargeData}
                    />
                )}
            </div>
        </div>
    );
}

export function Charges({chargeData, setchargeData }) {

    const updateChargeData = (newItems) => {
        setchargeData((prev) => {
            const updated = { ...prev, ...newItems };
            return updated;
        });
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-start gap-1">
                <label>Items/Service</label>
                <input
                    type="text"
                    name="item_service"
                    value={chargeData.item_service || ''}
                    onChange={(e) =>
                        updateChargeData({
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
            <div className="flex flex-col items-start gap-1">
                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={chargeData.amount ?? 0}
                    onChange={(e) =>
                        updateChargeData({
                            [e.target.name]: parseFloat(e.target.value) || 0,
                        })
                    }
                    className="input"
                />
            </div>
            <div className="flex flex-col items-start gap-1">
                <label>Notes</label>
                <input
                    type="text"
                    name="details"
                    value={chargeData.details || ''}
                    onChange={(e) =>
                        updateChargeData({
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
        </div>
    );
}

export function PaymentsTable({ payments = [], setPayments }) {
    const [showPayment, setShowPayment] = useState(false);
    // const [tempPaymentData, setTempPaymentData] = useState({})
    const [tempPaymentData, setTempPaymentData] = useState({
        date_paid: new Date().toISOString().slice(0, 10),
        amount_paid: '',
        details: '',
    });

    const savePayment = () => {
        if (tempPaymentData.datePaid && !isNaN(tempPaymentData.amountPaid !== null)) {
            setPayments((prev) => [...prev, { ...tempPaymentData }]);
            setTempPaymentData({
                date_paid: new Date().toISOString().slice(0, 10),
                amount_paid: '',
                details: '',
            });
        }
        setShowPayment(false);
    }
    const deletePayment = (index) => {
        setPayments((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full max-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Date Paid
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Amount Paid
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Details
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 px-2 py-1 text-center text-gray-500"
                            >
                                No Payments yet
                            </td>
                        </tr>
                    ) : (
                        payments.map((trans, idx) => (
                            <tr
                                key={idx}
                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <td className="border border-gray-300 px-2 py-1">
                                    {trans.datePaid || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {trans.amountPaid || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {trans.details || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            deletePayment &&
                                            deletePayment(idx)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="flex flex-col items-start py-4" >
                {showPayment && (
                    <Payments
                        tempPaymentData={tempPaymentData}
                        setTempPaymentData = {setTempPaymentData}
                    />
                )}
                <button
                    type="button"
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                        showPayment ? savePayment() : setShowPayment(true)
                    }
                >
                    {showPayment ? (<Save size={16} />) : (<Plus size={16} />)}
                </button>
            </div>

        </div>
    );
}

export function Payments({tempPaymentData, setTempPaymentData }) {

    // const updatepaymentData = (newItems) => {
    //     setTempPaymentData((prev) => {
    //         const updated = { ...prev, ...newItems };
    //         return updated
    //     });
    // };

    const updatepaymentData = (newItems) => {
        setTempPaymentData((prev) => ({ ...prev, ...newItems })
        );
    };

    if (!tempPaymentData || !setTempPaymentData) {
        return <div className="text-red-500">Error: Payment data not available</div>;
    }

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
                type="date"
                name="datePaid"
                value={tempPaymentData.date_paid || ''}
                onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                className="input"
            />

            <input
                type="number"
                name="amountPaid"
                value={tempPaymentData.amount_paid || ''}
                onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                className="input"
            />

            <input
                type="text"
                name="details"
                value={tempPaymentData.details || ''}
                onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                className="input"
            />
        </div>
    );
}

export function DSWDInfo({dswd, setDswd}) {

    const handleDswdChange = (e) => {
        const { name, value } = e.target;
        setDswd((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-start gap-1">
                    <label>GL Date</label>
                    <input
                        type="date"
                        name="gl_date"
                        value={dswd?.gl_date ? new Date(dswd.gl_date).toISOString().split("T")[0] : ""}
                        onChange={handleDswdChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>CI Number</label>
                    <input
                        type="text"
                        name="ci_number"
                        value={dswd?.ci_number || ''}
                        onChange={handleDswdChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>Processor</label>
                    <input
                        type="text"
                        name="processor"
                        value={dswd?.processor || ''}
                        onChange={handleDswdChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={dswd?.amount || ''} 
                        onChange={handleDswdChange}
                        min="0"
                        step="0.01"
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>Status</label>
                    <select
                        name="status"
                        value={dswd?.status || 'Pending'}
                        onChange={handleDswdChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Released">Released</option>
                        <option value="Denied">Denied</option>
                    </select>
                </div>

                <div className="flex flex-col items-start gap-1 col-span-full">
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={dswd?.notes || ''}
                        onChange={handleDswdChange}
                        rows={2}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                    />
                </div>
            </div>
        </div>
    );
}