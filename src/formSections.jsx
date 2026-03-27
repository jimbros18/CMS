import { Save, Trash, Pencil, Plus, XCircle } from 'lucide-react';

export function ClientInfo({ clientData, handleClientChange }) {
    return (
        <section className="w-full text-gray-800">
            <h2 className="text-gray-800 mb-4 text-left">
                New Client Information
            </h2>
            <div className="w-full px-4 py-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Serviced */}
                    <div className="flex flex-col gap-1 text-left">
                        <label>Date Serviced</label>
                        <input
                            type="date"
                            name="dateServiced"
                            value={clientData.dateServiced}
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
                                value={clientData.deceasedFirst}
                                onChange={handleClientChange}
                                placeholder="First Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="deceasedMiddle"
                                value={clientData.deceasedMiddle}
                                onChange={handleClientChange}
                                placeholder="Middle Name"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="deceasedLast"
                                value={clientData.deceasedLast}
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
                            value={clientData.address}
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
                                name="cell_number"
                                value={clientData.cell_number}
                                onChange={handleClientChange}
                                placeholder="Cellphone Number"
                                className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="Facebook"
                                value={clientData.Facebook}
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
                                    value={clientData.plan}
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
                                    value={clientData.coffin}
                                    onChange={handleClientChange}
                                    className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                                >
                                    <option value="Ordinary">Ordinary</option>
                                    <option value="Ordinary 3ft">
                                        Ordinary 3ft
                                    </option>
                                    <option value="Ordinary 5ft">
                                        Ordinary 5ft
                                    </option>
                                    <option value="Quadrado">Quadrado</option>
                                    <option value="Urgoy">Urgoy</option>
                                    <option value="Urgoy 3ft">Urgoy 3ft</option>
                                    <option value="Urgoy 5ft">Urgoy 5ft</option>
                                    <option value="Ogoy Stoko">
                                        Ogoy Stoko
                                    </option>
                                    <option value="Ogoy Plain">
                                        Ogoy Plain
                                    </option>
                                    <option value="Ogoy Plain Plan">
                                        Ogoy Plain Plan
                                    </option>
                                    <option value="Ogoy Plain 3ft">
                                        Ogoy Plain 3ft
                                    </option>
                                    <option value="Ogoy Plain 5ft">
                                        Ogoy Plain 5ft
                                    </option>
                                    <option value="Metal">Metal</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Amount</label>
                                <div className="w-full rounded px-2 py-1 bg-gray-700 text-white">
                                    ₱{' '}
                                    {Number(
                                        clientData.coffinAmount,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1 col-span-full text-left">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={clientData.notes}
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

export function ChargeTable({ otherCharges = [], onDeleteCharge }) {
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
                            Notes
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
                                    {charge.item || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {charge.amount || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {charge.notes || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteCharge &&
                                            onDeleteCharge(idx)
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
        </div>
    );
}

export function Charges({
    chargeData = { item: '', amount: '', notes: '' },
    updateChargeData,
}) {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-start gap-1">
                <label>Items/Service</label>
                <input
                    type="text"
                    name="item"
                    value={chargeData.item || ''}
                    onChange={(e) =>
                        updateChargeData({
                            ...chargeData,
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
                    value={chargeData.amount || ''}
                    onChange={(e) =>
                        updateChargeData({
                            ...chargeData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
            <div className="flex flex-col items-start gap-1">
                <label>Notes</label>
                <input
                    type="text"
                    name="notes"
                    value={chargeData.notes || ''}
                    onChange={(e) =>
                        updateChargeData({
                            ...chargeData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
        </div>
    );
}

export function PaymentsTable({ payments = [], onDeletePayment }) {
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
                                            onDeletePayment &&
                                            onDeletePayment(idx)
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
        </div>
    );
}

export function Payments({
    paymentData = { datePaid: '', amountPaid: '', details: '' },
    updatepaymentData,
}) {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-start gap-1">
                <label>Date Paid</label>
                <input
                    type="date"
                    name="datePaid"
                    value={paymentData.datePaid || ''}
                    onChange={(e) =>
                        updatepaymentData({
                            ...paymentData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
            <div className="flex flex-col items-start gap-1">
                <label>Amount Paid</label>
                <input
                    type="number"
                    name="amountPaid"
                    value={paymentData.amountPaid || ''}
                    onChange={(e) =>
                        updatepaymentData({
                            ...paymentData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
            <div className="flex flex-col items-start gap-1">
                <label>Details</label>
                <input
                    type="text"
                    name="details"
                    value={paymentData.details || ''}
                    onChange={(e) =>
                        updatepaymentData({
                            ...paymentData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="input"
                />
            </div>
        </div>
    );
}

export function DSWDInfo({
    dswd = {
        glDate: '',
        ciNumber: '',
        processor: '',
        amount: '',
        status: 'Pending',
    },
    handleDswdChange,
}) {
    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-start gap-1">
                    <label>GL Date</label>
                    <input
                        type="date"
                        name="glDate"
                        value={dswd.glDate}
                        onChange={handleDswdChange}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                        // required
                    />
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label>CI Number</label>
                    <input
                        type="text"
                        name="ciNumber"
                        value={dswd.ciNumber}
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
                        value={dswd.processor}
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
                        value={dswd.amount}
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
                        value={dswd.status}
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
                        value={dswd.notes}
                        onChange={handleDswdChange}
                        rows={2}
                        className="w-full rounded px-2 py-1 bg-gray-700 text-white"
                    />
                </div>
            </div>
        </div>
    );
}
