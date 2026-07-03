import { useState, useEffect, useMemo } from 'react';
import { getAllClientInfos } from './API/server_api';


const columns = {
    "Date": "dateServiced",
    "Name": "clientName",
    "Address": "city",
    "Coffin": "coffin",
    "Plan": "plan",
    "Amount": "coffinAmount",
    "Inclusions": "inclusions",
    "Other Charges": "otherCharges",
};


export default function reportTbl() {
    const [clients, setClients] = useState([]);
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        const load = async () => {
            const clients = await getAllClientInfos();
            setClients(clients || []);
        };
        load();
    }, []);

    console.log('Reports: ', clients)

    const formatDate = (val) => {
        const d = new Date(val);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate();
        const year = String(d.getFullYear()).slice(-2);
        return `${month}-${day}-${year}`;
    };

    return (
        <div className="w-full p-4 border  rounded">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full p-1 mb-4 border rounded text-sm"
          />
          <table className="table-auto w-full border-separate border-spacing-y-1">
            <thead>
                <tr className="bg-slate-900 text-slate-100">
                    {Object.entries(columns).map(([header], index) => (
                        <th key={index} className="px-2 py-1 text-left text-[15px] font-semibold uppercase tracking-[0.35px] whitespace-nowrap">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-lg text-slate-700">
                {clients.map((row, rowIndex) => {
                    const isActive = activeRow === rowIndex;
                    return (
                        <tr
                            key={rowIndex}
                            className={`text-white hover:bg-blue-500 hover:text-blue-100 cursor-pointer ${rowIndex % 2 === 0 ? 'bg-slate-700' : 'bg-gray-800'}`}
                            onClick={() => setActiveRow(rowIndex)}
                        >
                            {Object.entries(columns).map(([header, key], colIndex) => {
                                if (header === 'Date') {
                                    return (
                                        <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[30px]">
                                            {formatDate(row[key])}
                                        </td>
                                    )
                                }
                                if (header === 'Name') {
                                    return (
                                        <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[100px]">
                                            {clients[rowIndex].deceasedFirst} {clients[rowIndex].deceasedLast}
                                        </td>
                                    )
                                }
                                if (header === 'Address') {
                                    return (
                                        <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[100px]">
                                            {clients[rowIndex].city}, {clients[rowIndex].province}
                                        </td>
                                    )
                                }
                                if (header === 'Amount') {
                                    return (
                                        <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[30px]">
                                            {row[key] ? `₱ ${row[key].toLocaleString()}` : '—'}
                                        </td>
                                    )
                                }
                                if (header === 'Inclusions' || header === 'Other Charges') {
                                    return (
                                        <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[50px]">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(row[key]) && row[key].length > 0
                                                    ? row[key].map((item, i) => (
                                                        <span key={i} className="bg-emerald-800 text-blue-100 px-1 py-0.5 rounded text-xs">
                                                            {typeof item === 'object' ? item.item_service || item.item : item}
                                                        </span>
                                                    ))
                                                    : '—'
                                                }
                                            </div>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={colIndex} className="px-2 py-1 align-center text-[13px] text-left truncate max-w-[50px]">
                                        {}
                                        {Array.isArray(row[key])
                                            ? row[key].map(item => typeof item === 'object' ? item.item : item).join(', ')
                                            : row[key] ?? '—'
                                        }
                                    </td>
                                )
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>



        </div>
    );
}