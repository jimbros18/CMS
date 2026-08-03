import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getCoffins, getPlans, getProvinces, getCities, getBarangays, getLights, getAsstProviders} from './API/server_api';


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
                                <input
                                    type="number"
                                    name="coffinAmount"
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

export function Inclusions({ xcoffin, plan, inclusions, setInclusions }) {
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
                    {(plan !== "" && plan !== "None" ) ? 
                        <p className="pl-5 text-gray-600 text-sm">
                            Inclusions will be provided by {plan}.
                        </p> 
                    : (
                        incs.map((item) => {
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
                            );
                        })
                    )}
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
            <h2 className="text-gray-800 mb-2">Other Charges</h2>
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
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
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
            <h2 className="text-gray-800 mb-2">Payments</h2>
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

export function AssistanceTable({assistance, setAssistance}) {
    const [showAsst, setShowAsst] = useState(false);
    const [tempData, setTempData] = useState({
        provider: '',
        gl_date: new Date().toISOString().slice(0, 10),
        ci_number: '',
        processor: '',
        amount: ''
    })

    const save = () => {

        if (!tempData.provider || !tempData.amount) {
            setShowAsst(false);
            return; // ✅ inside the if block
        }

        const newData = {
            provider: tempData.provider,
            gl_date: tempData.gl_date,
            ci_number: tempData.ci_number,
            processor: tempData.processor,
            amount: tempData.amount
        }
        setAssistance(prev => [...prev, newData]);
        setTempData({
            provider: '',
            gl_date: new Date().toISOString().slice(0, 10),
            ci_number: '',
            processor: '',
            amount: ''
        })
        setShowAsst(false)
        console.log('saving tempData:', tempData);
    };

    const deleteAssistance = (index) => {
        setAssistance((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <div className="w-full overflow-x-auto">
            <h2 className="text-gray-800 mb-2">Assistance</h2>
            <table className="min-w-full max-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1 text-left">Provider</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">GL Date</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">CI Number</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Processor</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Amount</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assistance.length === 0 ? (
                        <tr>
                        <td colSpan="6" className="border border-gray-300 px-2 py-1 text-center text-gray-500">
                            No Payments yet
                        </td>
                    </tr>
                    ): (
                        assistance?.map((v, i) => (
                            <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className='border border-gray-300 px-2 py-1'>{v.provider}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.gl_date}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.ci_number}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.processor}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.amount}</td>
                                <td className='border border-gray-300 px-2 py-1'>
                                    <button 
                                        type="button" 
                                        onClick={() => deleteAssistance(i)}
                                        className='text-red-500 hover:text-red-700'
                                    >
                                        <Trash size={14}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="flex flex-col items-start py-4">
                {showAsst && (
                    <Assistance 
                        tempData = {tempData}
                        setTempData = {setTempData}
                    />
                )}
                <button
                    type = "button"
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    onClick={() => showAsst ? save(): setShowAsst(true)}
                >
                    {showAsst ? <Save size={16}/> : <Plus size={16}/>}
                </button>
            </div>
        </div>
    )


}

export function Assistance({tempData, setTempData}) {
    const [providers, setProviders] = useState();

    useEffect(() => {
        const load = async () => {
            const data = await getAsstProviders();
            setProviders(data);
        };
        load();
    }, []);

    const handleAsstChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-start gap-1">
                    <label>Provider</label>
                    <select 
                        name="provider"
                        value={tempData?.provider || ''}
                        onChange={handleAsstChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        required
                    >
                       <option value="" disabled hidden>Select Provider</option>
                            {providers?.map((p) => (
                                <option key={p.id} value={p.provider}>
                                    {p.provider}
                                </option>
                            ))} 
                    </select>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>GL Date</label>
                    <input
                        type="date"
                        name="gl_date"
                        value={tempData?.gl_date ? new Date(tempData.gl_date).toISOString().split("T")[0] : ""}
                        onChange={handleAsstChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>CI Number</label>
                    <input
                        type="text"
                        name="ci_number"
                        value={tempData?.ci_number || ''}
                        onChange={handleAsstChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>Processor</label>
                    <input
                        type="text"
                        name="processor"
                        value={tempData?.processor || ''}
                        onChange={handleAsstChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={tempData?.amount || ''} 
                        onChange={handleAsstChange}
                        min="0"
                        step="0.01"
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>
        </div>
    );
}

export function Staff({ staff, setStaff}) {        
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaff((prev) => ({ ...prev, [name]: value }));
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
                    value={staff?.embalmer || ''}
                    onChange={handleChange}
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
                    value={staff?.driver || ''}
                    onChange={handleChange}
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
                    value={staff?.helper || ''}
                    onChange={handleChange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>
            <div className='flex justify-between w-full'>
                <label>Plate Number:</label>
                <input
                    type="text"
                    name="plate_num"
                    value={staff?.plate_num || ''}
                    onChange={handleChange}
                    // required
                    className="rounded px-2 bg-gray-700 text-white"
                />
            </div>  
        </div>
    );
}

export function Lights({ lights, setLights, returned, setReturned}) {
    const [allLights, setAllLights] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getLights() || [];
            setAllLights(data);
        };
        load();
    }, []);

    const checked = useMemo(() => {
        return allLights?.reduce((acc, item) => {
            acc[item.id] = lights.includes(item.id); // ✅ lights is array of numbers
            return acc;
        }, {});
    }, [allLights, lights]);

    const handleChange = (e) => {
        const { value, checked } = e.target;
        const id = Number(value);
        setLights((prev) =>
            checked
                ? [...prev, id]
                : prev.filter((l) => l !== id)
        );
        if (!checked) {
            setReturned((prev) => prev.filter((r) => r !== id));
        }
    };

    const handleReturn = (e) => {
        const { value, checked } = e.target;
        const id = Number(value);
        setReturned((prev) =>
            checked
                ? [...prev, id]
                : prev.filter((i) => i !== id)
        );
    }

    return (
        <div className="self-start flex flex-col items-start text-left border border-gray-300 rounded bg-white shadow-md p-6 mt-6 w-full">
            <h2 className="text-gray-800 mb-4 text-left">Lights</h2>
            <div className="flex flex-col text-sm w-full">
                {allLights.length === 0 ? (
                    <p className="text-gray-800 text-center w-full">No lights recorded</p>
                ) : (
                    allLights.map((item) => {
                        const isChecked = lights.includes(item.id);
                        const isReturned = returned.includes(item.id); // ✅ item.id not lights.id
                        return (
                            <div className={`flex flex-row gap-2 mb-2 ${isChecked ? 'bg-blue-50 rounded' : ''}`}> 
                                <label key={item.id}
                                    className={`flex items-center gap-2 py-1 rounded transition-colors w-full ${
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
                                        className={` ml-2 ${isChecked ? "accent-blue-600" : ""}`}
                                    />
                                    {item.item_name}
                                </label>
                                {isChecked && (
                                    <label 
                                    className={`ml-5 flex items-center gap-2 py-1 rounded transition-colors w-8/12 ${
                                            isReturned
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "text-gray-700 cursor-pointer hover:bg-gray-50"
                                        }`}
                                > 
                                    <input
                                        className='ml-5'
                                        name = {item.item_name}
                                        value={item.id}
                                        type="checkbox" 
                                        checked={isReturned}
                                        onChange={handleReturn}
                                    />
                                    returned
                                </label>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}