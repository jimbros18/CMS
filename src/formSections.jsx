import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getCoffins, getPlans, getProvinces, getCities, getBarangays, getLights} from './API/server_api';


export function ClientInfo({clientData, setClientData}) { 

    const [coffins, setCoffins] = useState([]);
    const [plans, setPlans] = useState([]);
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getCoffins();
            const plans = await getPlans();
            const provinces = await getProvinces();
            setCoffins(data);
            setPlans(plans);
            setProvinces(provinces);
        };
        load();
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            if (!clientData.province) {
                setCities([]);
                return;
            }

            const provObj = provinces.find(p => p.name === clientData.province);
            if (!provObj?.code) 
            {setCities([]);
                return;
            }

            const cityList = await getCities(provObj.code);
            setCities(cityList || []);
        };
        loadCities();
    }, [clientData.province, provinces]);

    // Load barangays when city changes
    useEffect(() => {
        const loadBarangays = async () => {
            if (!clientData.city) {
                setBarangays([]);
                return;
            }

            const cityObj = cities.find(c => c.name === clientData.city);
            if (!cityObj?.code) 
            {setBarangays([]);
                return;
            }

            const bgyList = await getBarangays(cityObj.code);
            setBarangays(bgyList || []);
        };
        loadBarangays();
    }, [clientData.city, cities]);

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientData((prev) => {
            let updated = { ...prev, [name]: value };

            if (name === 'coffin') {
                const matching = coffins.find(c => c.coffin_name === value);
                updated.coffinAmount = matching ? matching.amount : '';
            }

            if (name === 'plan') {
                if (value && value !== 'None') {
                    updated.coffin = 'Ogoy Plain';
                    updated.coffinAmount = Number(17000);
                } else {
                    updated.coffin = '';
                    updated.coffinAmount = '';
                }
            }

            return updated;
        });
    };

    const normalizeDatetimeLocal = (value) => {
        if (!value && value === null) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return `${value}T00:00`;
        }
        return value;
    };

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
                    <div className="flex flex-col gap-1 text-left">
                        <label>Interment Date & Time</label>
                        <input
                            type="datetime-local"
                            name="interment_datetime"
                            value={normalizeDatetimeLocal(clientData.interment_datetime)}
                            onChange={handleClientChange}
                            className="rounded px-2 py-[0.10rem] bg-gray-700 text-white text-sm"
                        />
                    </div>

                    {/* Deceased - split into 3 inputs */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Deceased</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                                type="text"
                                pattern="[A-Za-z ]+"
                                name="deceasedFirst"
                                value={clientData.deceasedFirst || ''}
                                onChange={handleClientChange}
                                placeholder="First Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                pattern="[A-Za-z ]+"
                                name="deceasedMiddle"
                                value={clientData.deceasedMiddle || ''}
                                onChange={handleClientChange}
                                placeholder="Middle Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                pattern="[A-Za-z ]+"
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
                        <select
                                name="province"
                                value={clientData.province || ''}
                                onChange={handleClientChange}
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            >
                                <option value="" disabled hidden>Select Province</option>
                                {provinces.map((p) => (
                                    <option key={p.code} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <select
                                name="city"
                                value={clientData.city || ''}
                                onChange={handleClientChange}
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            >
                                <option value="" disabled hidden>Select City/Municipality</option>
                                {cities.map(c => (
                                    <option key={c.code} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {/* 🔥 UPDATED BARANGAY SELECT */}
                            <select
                                name="barangay"
                                value={clientData.barangay || ''}
                                onChange={handleClientChange}
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required

                            >
                                <option value="" disabled hidden>Select Barangay</option>
                                    {barangays
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(b => (
                                            <option key={b.code} value={b.name}>
                                                {b.name}
                                            </option>
                                        ))
                                    }
                            </select>                      
                        </div>
                            <textarea
                                type="text"
                                name="purok"
                                value={clientData.purok || ''}
                                onChange={handleClientChange}
                                placeholder="Purok / Street"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white mt-1"
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
                                    {plans.map((p, i) => (
                                        <option key={i} value={p.company}>
                                            {p.company}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Coffin</label>
                                {clientData.plan && clientData.plan !== 'None' ? (
                                    <label  className="w-full rounded px-2 py-1 bg-gray-700 text-white">
                                        Ogoy Plain
                                    </label>
                                ):(
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
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Amount</label>
                                {clientData.plan && clientData.plan !== 'None' ? (
                                    <label className="w-full rounded px-2 py-1 bg-gray-700 text-white">
                                       {Number(17000).toLocaleString()}
                                    </label>
                                ) : (
                                <input
                                    type="text"
                                    name="amount"
                                    value={Number(clientData.coffinAmount).toLocaleString() ?? ''}
                                    onChange={handleClientChange}
                                    className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                />
                                )}
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

export function Inclusions({ xcoffin, inclusions, setInclusions }) {
    const [coffins, setCoffins] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getCoffins();
            setCoffins(data);
        };
        load();
    }, []);

    const match = coffins.find((c) => c.coffin_name === xcoffin);
    const incs = match ? JSON.parse(match.items || "[]") : [];

    const checked = useMemo(() => {
        return incs.reduce((acc, item) => {
            acc[item] = inclusions.includes(item);
            return acc;
        }, {});
    }, [incs, inclusions]);

    const handleChange = (e) => {
        const { value, checked } = e.target;
        setInclusions((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value));
    };

    return (
        <div className="w-full text-gray-800 py-6">
            <h2 className="text-gray-800 mb-4 text-left">Inclusions</h2>
            <div className="py-3 rounded">
                <div className="flex flex-col text-sm">
                    {incs.map((item) => {
                        const isChecked = checked[item] ?? false;
                        return (
                            <label key={item} 
                                className={`flex items-center gap-2 py-1 rounded transition-colors ${
                                    isChecked
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 cursor-pointer hover:bg-gray-50"
                                }`}
                            >
                                <input 
                                    name={item}
                                    value={item} 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={handleChange} 
                                    className={`${isChecked ? "accent-blue-600" : ""}`} 
                                />
                            {item}
                        </label>
                        )
                    })}
                </div>
            </div>
        </div>
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
    const [tempPaymentData, setTempPaymentData] = useState({
        date_paid: new Date().toISOString().slice(0, 10),
        amount_paid: '',
        details: '',
    });

    const savePayment = () => {
        if (!tempPaymentData.date_paid || !tempPaymentData.amount_paid) return;
        const newPayment = {
            date_paid: tempPaymentData.date_paid,
            amount_paid: Number(tempPaymentData.amount_paid),
            details: tempPaymentData.details || ''
        };
        setPayments(prev => [...prev, newPayment]);
        setTempPaymentData({
            date_paid: new Date().toISOString().slice(0, 10),
            amount_paid: '',
            details: '',
        });
        setShowPayment(false);
    };

    const deletePayment = (index) => {
        setPayments((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full max-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1 text-left">Date Paid</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Amount Paid</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Details</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="border border-gray-300 px-2 py-1 text-center text-gray-500">
                                No Payments yet
                            </td>
                        </tr>
                    ) : (
                        payments.map((trans, idx) => (
                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="border border-gray-300 px-2 py-1">{trans.date_paid || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{trans.amount_paid || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{trans.details || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">
                                    <button 
                                        type="button" 
                                        onClick={() => deletePayment(idx)}
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

            <div className="flex flex-col items-start py-4">
                {showPayment && (
                    <Payments
                        tempPaymentData={tempPaymentData}
                        setTempPaymentData={setTempPaymentData}
                    />
                )}

                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => showPayment ? savePayment() : setShowPayment(true)}
                >
                    {showPayment ? <Save size={16} /> : <Plus size={16} />}
                </button>
            </div>
        </div>
    );
}

export function Payments({ tempPaymentData, setTempPaymentData }) {

    const updatepaymentData = (newItems) => {
        setTempPaymentData(prev => ({ ...prev, ...newItems }));
    };

    if (!tempPaymentData || !setTempPaymentData) {
        return <div className="text-red-500 p-2">Error: Payment data not available</div>;
    }

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label>Date</label>
                <input
                    type="date"
                    name="date_paid"
                    value={tempPaymentData.date_paid || ''}
                    onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                    className="input"
                />
            </div>
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    name="amount_paid"
                    value={tempPaymentData.amount_paid || ''}
                    onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                    className="input"
                    min="0"
                    step="0.01"
                />
            </div>
            <div>
                <label>Details</label>
                <input
                    type="text"
                    name="details"
                    value={tempPaymentData.details || ''}
                    onChange={(e) => updatepaymentData({ [e.target.name]: e.target.value })}
                    className="input"
                />
            </div>
            
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

export function Staff({ staff, setStaff}) {
    const s = staff?.[0]; // ← get first row
    
    const handleLSchange = (e) => {
        const { name, value } = e.target;
        setStaff([{ ...s, [name]: value }]);
    };


    return (
        <div className='lights_services flex flex-col text-left border border-gray-300 rounded p-6 bg-white shadow-md mt-6 gap-1'>
            <h2 className="text-gray-800 mb-2">Lights and Services</h2>
            <div className='flex justify-between w-full'>
                <label>Embalmer:</label>
                <input
                    type="text"
                    pattern="[A-Za-z ]+"
                    name="embalmer"
                    value={s?.embalmer || ''}
                    onChange={handleLSchange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>
            <div className='flex justify-between w-full'    >
                <label>Driver:</label>
                <input
                    type="text"
                    pattern="[A-Za-z ]+"
                    name="driver"
                    value={s?.driver || ''}
                    onChange={handleLSchange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>
            <div className='flex justify-between w-full'>
                <label>Helper:</label>
                <input
                    type="text"
                    pattern="[A-Za-z ]+"
                    name="helper"
                    value={s?.helper || ''}
                    onChange={handleLSchange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>
            <div className='flex justify-between w-full'>
                <label>Plate Number:</label>
                <input
                    type="text"
                    name="plate_num"
                    value={s?.plate_num || ''}
                    onChange={handleLSchange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>
        </div>
    );
}

export function Lights({ lights, setLights }) {
    const [allLights, setAllLights] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getLights() || [];
            setAllLights(data);
        };
        load();
    }, []);

    const checked = useMemo(() => {
        return allLights.reduce((acc, item) => {
            acc[item.id] = lights.some(l => l.id === item.id);
            return acc;
        }, {});
    }, [allLights, lights]);

    const handleChange = (e) => {
        const { value, checked } = e.target;
        const id = Number(value);
        const item = allLights.find(l => l.id === id); // ✅ get full object
        setLights((prev) =>
            checked
                ? [...prev, item]
                : prev.filter((l) => Number(l.id) !== id)
        );
    };

    // const handleChange = (e) => {
    //     const { value, checked } = e.target;
    //     const id = Number(value);
    //     setLights((prev) =>
    //         checked
    //             ? [...prev, { id }]
    //             : prev.filter((l) => Number(l.id) !== id)
    //     );
    // };

    return (
        <div className="self-start flex flex-col items-start text-left border border-gray-300 rounded bg-white shadow-md p-6 mt-6 w-full">
            <h2 className="text-gray-800 mb-4 text-left">Lights</h2>
            <div className="flex flex-col text-sm w-full">
                {allLights.length === 0 ? (
                    <p className="text-gray-800 text-center w-full">No lights recorded</p>
                ) : (
                    allLights.map((item) => {
                        const isChecked = checked[item.id] ?? false;
                        return (
                            <label key={item.id}
                                className={`flex items-center gap-2 py-1 rounded transition-colors ${
                                    isChecked
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 cursor-pointer hover:bg-gray-50"
                                }`}
                            >
                                <input
                                    name={item.item_name}
                                    value={item.id}
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleChange}
                                    className={`${isChecked ? "accent-blue-600" : ""}`}
                                />
                                {item.item_name}
                            </label>
                        );
                    })
                )}
            </div>
        </div>
    );
}