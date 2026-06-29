import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo} from 'react';
import { getCoffins, getLights } from './API/server_api';

export function ClientView({ client = {}, formatDate, intermentDate }) {
    const displayValue = (value) => (value || '—');

    return (
        <section className="w-full">
                <h2 className="text-xl font-semibold text-slate-900">
                    Client Information
                </h2>
                <div className="grid grid-cols-1 gap-6 ">
                    <div className="flex flex-col md:flex-row items-start justify-start gap-6">  
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Date Serviced
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(formatDate(client.dateServiced))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Interment
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(intermentDate(client.interment_datetime))}
                            </div>
                        </div>
                     </div>
                    {/* Deceased */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Deceased
                        </label>
                        <div className="text-lg text-slate-800">
                            {[
                                displayValue(client.deceasedFirst),
                                displayValue(client.deceasedMiddle),
                                displayValue(client.deceasedLast)
                            ].join(' ')}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1 w-full md:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Address
                        </label>  
                            <div className="text-lg text-slate-800 break-words">
                                {displayValue(client.purok)}, {displayValue(client.barangay)}, {displayValue(client.city)}, {displayValue(client.province)}
                            </div>
                    </div>
                    {/* Contacts */}
                    <div className="flex flex-col md:flex-row gap-8 md:col-span-2">

                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Contacts
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(client.cellNumber)}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Facebook
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(client.facebook)}
                            </div>
                        </div>

                    </div>

                    {/* Plan / Coffin / Amount */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:col-span-2">

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Plan
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(client.plan)}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Coffin
                            </label>
                            <div className="text-lg text-slate-800">
                                {displayValue(client.coffin)}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Amount
                            </label>
                            <div className="text-lg text-slate-800">
                                ₱ {Number(client.coffinAmount || 0).toLocaleString()}
                            </div>
                        </div>

                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Notes
                        </label>
                        <div className="min-h-[80px] whitespace-pre-wrap text-lg text-slate-400 italic">
                            {displayValue(client.notes)}
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

    return (
        <div className="w-full text-gray-800 py-8">
            <h2 className="text-gray-800 mb-4 text-left">Inclusions</h2>
            <div className="w-full px-4 py-3 rounded">
                <div className="flex flex-col text-sm">
                    {incs.map((item) => {
                        const disabled = inclusions.includes(item);
                        return (
                        <>
                        <ul key={item} 
                                className='flex items-center gap-2 px-2 py-1 rounded bg-blue-50 mb-1 gap-2'>
                            <li className="ml-2 text-blue-700 font-medium" >
                                {item}
                            </li>
                        </ul>
                        {/* <label key={item} 
                                className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                                    disabled
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 cursor-pointer hover:bg-gray-50"
                                }`}
                        >
                            <input 
                                key={item} 
                                name={item}
                                value={item} 
                                type="checkbox" 
                                checked={checked[item] ?? false}
                                disabled={disabled}
                                onChange={() => {}}
                                className="ml-2 bg-gray-200 accent-blue-600" 
                            />
                            {item}
                        </label> */}
                        </>
                        )
                    })}
                </div>
            </div>
        </div>
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