import { useState, useEffect } from 'react';
import { getCoffins } from './API/server_api';

export function ClientView({ client = {} }) {
    const displayValue = (value) => (value || '—');

    return (
        <section className="w-full space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Client Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Date Serviced */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Date Serviced
                        </label>
                        <div className="text-lg text-slate-800">
                            {displayValue(client.dateServiced)}
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
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Address
                        </label>
                        <div className="text-lg text-slate-800">
                            {displayValue(client.address)}
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

export function Inclussions({ xcoffin }) {
    const [coffins, setCoffins] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getCoffins();
            setCoffins(data);
        };
        load();
    }, []);

    const match = coffins.find (
        (c) => c.coffin_name === xcoffin
    );
    
    const inclussions = match ? JSON.parse(match.items || []) : [];

    const [selected, setSelected] = useState([]);
    const handleChange = (e) => {
        const { value, checked } = e.target;
        setSelected((prev) =>
            checked
            ? [...prev, value]              // add
            : prev.filter((item) => item !== value) // remove
        );
    };
    console.log('Selected inclussions:', selected);
    
    return (
        <div className="w-full text-gray-800 py-8">
            <h2 className="text-gray-800 mb-4 text-left">Inclussions</h2>
            <div className="w-full px-4 py-3 rounded">
                <div className="flex flex-col text-sm">
                    {inclussions.map((inc, i) => (
                        <label key={i} className="flex items-center gap-2">
                            <input key={i} name={inc} value={inc} type="checkbox" onChange={handleChange} className="ml-2" />
                            {inc}
                        </label>
                    ))}
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

export function DSWDView({ dswd = {} }) {
    const displayValue = (value) => (value || '—');
    if (Object.keys(dswd).length === 0) {
        return (
            <section className="w-full text-slate-900 my-6">
                <h2 className="text-slate-900 mb-4 text-left text-xl font-semibold">
                    DSWD Assistance
                </h2>
                <div className="w-full border-slate-300 rounded p-4 text-center text-gray-800">
                    No record yet.
                </div>
            </section>
        )
    }
    return (
      <section className="w-full text-slate-900 my-6">
            <h2 className="text-slate-900 mb-4 text-left text-xl font-semibold">
                DSWD Assistance
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        GL Date
                    </label>
                    <div className="text-lg text-slate-800">
                        {dswd?.gl_date ? new Date(dswd.gl_date).toISOString().split('T')[0] : '—'}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        CI Number
                    </label>
                    <div className="text-lg text-slate-800">
                        {displayValue(dswd?.ci_number)}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Processor
                    </label>
                    <div className="text-lg text-slate-800">
                        {displayValue(dswd?.processor)}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Amount
                    </label>
                    <div className="text-lg text-slate-800">
                        ₱ {Number(dswd?.amount || 0).toLocaleString()}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Status
                    </label>
                    <div className="text-lg text-slate-800">
                        {displayValue(dswd?.status)}
                    </div>
                </div>

                <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Notes
                    </label>
                    <div className="min-h-[70px] whitespace-pre-wrap text-lg text-slate-800">
                        {displayValue(dswd?.notes)}
                    </div>
                </div>

            </div>
        </section>
    );
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

export function PriceBreakdown({client, dswd, payments, otherCharges}) {
    return (
    <div className='payment_details self-start flex flex-col items-start text-left border border-gray-300 rounded p-6 bg-white shadow-md ml-6 w-6/12 h-full'>
                <h2 className="text-gray-800 mb-2">Price Breakdown</h2>
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
                <div className='flex justify-between w-full'>
                    <h3 className='text-gray-800 font-bold'>Total:</h3>
                    <h3 className='text-gray-800 font-bold'>{Number(client?.coffinAmount + otherCharges?.reduce((sum, charge) => sum + charge?.amount, 0)).toLocaleString()}</h3>
                </div>
                <div className='flex justify-between w-full'>
                    <h3 className='text-gray-800 font-bold'>DSWD:</h3>
                    <h3 className='text-gray-800 font-bold'>{dswd?.amount ? `${Number(dswd.amount).toLocaleString()}` : 0}</h3>
                </div>
                <div className='flex justify-between w-full'>
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
                            Number(dswd?.amount || 0) -
                            (payments?.reduce((sum, payment) =>
                                sum + Number(payment?.amount_paid || 0), 0
                            ) || 0)
                        ).toLocaleString()}
                    </h3>
                </div>
            </div>
    );
}
