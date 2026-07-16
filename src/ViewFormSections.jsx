import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo} from 'react';
import { getCoffins, getLights } from './API/server_api';

export function ClientView({ client = {}, formatDate, intermentDate }) {
    const displayValue = (value) => (value || '—');

    return (
        <section className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-slate-900">
                    Client Information
                </h2>
                <p className="text-sm text-slate-500">
                    Overview of service and client details
                </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase">Date Serviced</p>
                    <p className="text-base font-medium text-slate-800">
                        {displayValue(formatDate(client.dateServiced))}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 uppercase">Interment</p>
                    <p className="text-base font-medium text-slate-800">
                        {displayValue(intermentDate(client.interment_datetime))}
                    </p>
                </div>
            </div>

            {/* Deceased */}
            <div className="border-t pt-4">
                <p className="text-xs text-slate-500 uppercase">Deceased</p>
                <p className="text-lg font-semibold text-slate-900">
                    {[client.deceasedFirst, client.deceasedMiddle, client.deceasedLast]
                        .filter(Boolean)
                        .join(' ') || '—'}
                </p>
            </div>

            {/* Address */}
            <div className="border-t pt-4">
                <p className="text-xs text-slate-500 uppercase">Address</p>
                <p className="text-base text-slate-800">
                    {displayValue(client.purok)}, {displayValue(client.barangay)}, {displayValue(client.city)}, {displayValue(client.province)}
                </p>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase">Contact</p>
                    <p className="text-base text-slate-800">{displayValue(client.cellNumber)}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 uppercase">Facebook</p>
                    <p className="text-base text-slate-800">{displayValue(client.facebook)}</p>
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                
                <div className="bg-slate-50 rounded-lg p-4 border">
                    <p className="text-xs text-slate-500 uppercase">Plan</p>
                    <p className="text-base font-medium text-slate-900">
                        {displayValue(client.plan)}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border">
                    <p className="text-xs text-slate-500 uppercase">Coffin</p>
                    <p className="text-base font-medium text-slate-900">
                        {displayValue(client.coffin)}
                    </p>
                </div>

                <div className="bg-slate-900 text-white rounded-lg p-4">
                    <p className="text-xs uppercase opacity-70">Amount</p>
                    <p className="text-lg font-semibold">
                        ₱ {Number(client.coffinAmount || 0).toLocaleString()}
                    </p>
                </div>

            </div>

            {/* Notes */}
            <div className="border-t pt-4">
                <p className="text-xs text-slate-500 uppercase">Notes</p>
                <p className="min-h-[80px] whitespace-pre-wrap text-sm text-slate-500 italic">
                    {displayValue(client.notes)}
                </p>
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

    const toggleItem = (item) => {
        if (inclusions.includes(item)) return;
        setInclusions([...inclusions, item]);
    };

    return (
        <section className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Inclusions
                </h2>
                <p className="text-sm text-slate-500">
                    Items included with selected coffin
                </p>
            </div>

            {/* Content */}
            <div className="flex flex-wrap gap-2">
                {incs.length === 0 && (
                    <p className="text-sm text-slate-400 italic">
                        No inclusions available
                    </p>
                )}

                {incs.map((item) => {
                    const isIncluded = inclusions.includes(item);

                    return (
                        <button
                            key={item}
                            onClick={() => toggleItem(item)}
                            disabled={isIncluded}
                            className={`
                                px-3 py-1.5 rounded-full text-sm transition-all border
                                ${isIncluded
                                    ? "bg-blue-100 text-blue-700 border-blue-200 font-medium cursor-default"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }
                            `}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

        </section>
    );
}

export function ChargeTableView({ otherCharges = [] }) {
    return (
        <div className="w-full overflow-x-auto my-6">
            <h2 className="text-slate-900 mb-4 text-left text-xl font-semibold">
                Other Charges
            </h2>
            <table className="min-w-full border-collapse text-sm text-slate-800">
                <thead>
                    <tr className="bg-slate-900 text-slate-100">
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Item / Service
                        </th>
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Amount
                        </th>
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Details
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {otherCharges.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="border border-slate-300 px-2 py-2 text-center text-gray-800">
                                No charges available
                            </td>
                        </tr>
                    ) : (
                        otherCharges.map((charge, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="border border-slate-300 text-slate-800 px-2 py-1">
                                    {charge.item_service || '—'}
                                </td>
                                <td className="border border-slate-300 text-slate-800 px-2 py-1">
                                    {charge.amount != null ? `₱ ${Number(charge.amount).toLocaleString()}` : '—'}
                                </td>
                                <td className="border border-slate-300 text-slate-800 px-2 py-1 italic">
                                    {charge.details || '—'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function AssistanceTableView({assistance = []}) {
    return (
        <div className="w-full overflow-x-auto">
            <h2 className="text-gray-800 mb-2">Assistance</h2>
            <table className="min-w-full max-w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs">PROVIDER</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs">GL DATE</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs">CI NUMBER</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs">PROCESSOR</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs">AMOUNT</th>
                    </tr>
                </thead>
                <tbody className='text-black'>
                    {assistance.length === 0 ? (
                        <tr>
                        <td colSpan="6" className="border border-gray-300 px-2 py-1 text-center text-gray-500">
                            No Assistance recorded.
                        </td>
                    </tr>
                    ): (
                        assistance.map((v, i) => (
                            <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className='border border-gray-300 px-2 py-1'>{v.provider}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.gl_date}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.ci_number}</td>
                                <td className='border border-gray-300 px-2 py-1'>{v.processor}</td>
                                <td className='border border-gray-300 px-2 py-1'>₱ {Number(v.amount).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )


}

export function PaymentsView({ payments = [] }) {
    return (
        <div className="w-full overflow-x-auto my-6">
            <h2 className="text-slate-900 mb-3 text-left text-lg font-semibold">
                Payments
            </h2>
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-900 text-slate-100">
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Date Paid
                        </th>
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Amount Paid
                        </th>
                        <th className="border border-slate-300 px-2 py-2 text-left text-xs uppercase tracking-[0.18em]">
                            Details
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="border border-slate-300 px-2 py-1 text-center text-gray-800">
                                No payments available
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="border border-slate-300 px-2 py-1 text-slate-800">
                                    {payment.date_paid || '—'}
                                </td>
                                <td className="border border-slate-300 px-2 py-1 text-slate-800">
                                    {payment.amount_paid != null ? `₱ ${Number(payment.amount_paid).toLocaleString()}` : '—'}
                                </td>
                                <td className="border border-slate-300 px-2 py-1 text-slate-800 italic">
                                    {payment.details || '—'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function PriceBreakdown({client, assistance, payments, otherCharges}) {  
    const totalAss = assistance.reduce((sum, ass) => sum + Number(ass.amount || 0), 0);
    // const totalAss = Array.isArray(assistance) ? assistance.reduce((sum, ass) => sum + Number(ass.amount || 0), 0) : 0;
    
    return (
    <div className='payment_details self-start flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md w-full'>
                <h2 className="text-gray-800 mb-2">Price Breakdown</h2>
                <div className='flex flex-col justify-between w-full border-b border-gray-800 text-gray-700'>
                    <div className='flex justify-between w-full'>
                        <p>Coffin:</p>
                        <p>{client?.coffinAmount ? Number(client.coffinAmount || 0).toLocaleString() : '0'}</p>
                    </div>
                    {otherCharges.map((charge, index) => (
                        <div className='flex justify-between w-full' key={index}>
                            <p className="capitalize">{charge.item_service}:</p>
                            <p> { charge?.amount? Number(charge.amount || 0).toLocaleString() : '0'}</p>
                        </div>                 
                    ))}
                </div>
                <div className='flex justify-between w-full mb-3'>
                    <h3 className='text-gray-800 font-bold'>Total:</h3>
                    <h3 className='text-gray-800 font-bold'>{Number(client?.coffinAmount + otherCharges?.reduce((sum, charge) => sum + charge?.amount, 0)).toLocaleString()}</h3>
                </div>
                {assistance.map((ass) => {
                    return (
                        <div className='flex justify-between w-full'>
                            <h3 className='text-gray-800 font-bold'>{ass.provider}:</h3>
                            <h3 className='text-gray-800 font-bold'>{ass?.amount ? `${Number(ass.amount).toLocaleString()}` : 0}</h3>
                        </div>
                    )
                })}
                
                <div className='flex justify-between w-full border-b border-gray-800'>
                    <h3 className='text-gray-800 font-bold'>Amount Paid:</h3>
                    <h3 className='text-gray-800 font-bold'> {Number(payments?.reduce((sum, payment) => sum + Number(payment.amount_paid || 0),0)).toLocaleString()}</h3>
                </div>

                <div className='flex justify-between w-full'>
                    <h3 className='text-gray-800 font-bold'>Balance:</h3>
                    <h3 className='text-gray-800 font-bold'>
                        {(
                            Number(client?.coffinAmount || 0) +
                            (otherCharges?.reduce((sum, charge) =>
                                sum + Number(charge?.amount || 0), 0
                            ) || 0) -
                            totalAss -
                            (payments?.reduce((sum, payment) =>
                                sum + Number(payment?.amount_paid || 0), 0
                            ) || 0)
                        ).toLocaleString()}
                    </h3>
                </div>
            </div>
    );
}

export function Staff({ staff }) {
    const ls = staff?.[0];
    
    return (
        <div className='staff self-start flex flex-col items-start text-left border border-gray-300 rounded bg-white shadow-md p-6 mt-6 w-full'>
            <h2 className="text-gray-800 mb-2">Staff</h2>
            <div className='flex justify-between w-full'>
                <label>Embalmer:</label>
                <label className="text-right text-gray-800">{ls?.embalmer || ''}</label>
            </div>
            <div className='flex justify-between w-full'    >
                <label>Driver:</label>
                <label className="text-right text-gray-800">{ls?.driver || ''}</label>
            </div>
            <div className='flex justify-between w-full'>
                <label>Helper:</label>
                <label className="text-right text-gray-800">{ls?.helper || ''}</label>
            </div>
            <div className='flex justify-between w-full'>
                <label>Plate Number:</label>
                <label className="text-right text-gray-800">{ls?.plate_num || ''}</label>
            </div>
        </div>
    );
}

export function Lights({ lights, returned }) {
    const [allLights, setAllLights] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getLights() || [];
            setAllLights(data);
        };
        load();
    }, []);

    return (
        <div className="self-start flex flex-col items-start text-left border border-gray-300 rounded bg-white shadow-md p-6 mt-6 w-full">
            <h2 className="text-gray-800 mb-4 text-left">Lights</h2>
            <div className="flex flex-col text-sm w-full">
                {lights.length === 0 ? (
                    <p className="text-gray-800 text-center w-full">No lights recorded</p>
                ) : (
                    allLights
                        .filter(item => lights.includes(item.id))
                        .map((item) => {
                            const isReturned = returned.includes(item.id);
                            return (
                                <div key={item.id} className="flex flex-row gap-2 mb-1">
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium w-full">
                                        {item.item_name}
                                    </span>
                                    {isReturned && (
                                        <span className="px-2 py-1 rounded bg-green-50 text-green-700 font-medium w-4/12">
                                            returned
                                        </span>
                                    )}
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
}