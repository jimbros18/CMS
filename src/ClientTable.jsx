import { Trash, Pencil, Plus, X, View } from 'lucide-react';
import { useState, useEffect } from 'react';
import ClientForm from './ClientForm';
import UpdateForm from './updateForm';
import ViewForm from './ViewForm';
import {getClients, deleteClient, getClient } from './API/server_api';
import {SignOutAPI} from './API/server_api';
import Swal from 'sweetalert2';
import {deleted, confirmDelete, noPermission} from "./utils/actions";

export default function Table() {
    const [viewForm, setViewForm] = useState(false);
    const [NewForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    
const columns = [
    { header: 'ID',          width: 'w-[10px]',  value: (row) => row[0] },
    { header: 'Date',        width: 'w-[40px]',  value: (row) => formatDate(row[1]) },
    { header: 'Name',        width: 'w-[50px]', value: (row) => `${row[2]} ${row[3]}` },
    { header: 'Address',     width: 'w-[80px]', value: (row) => `${row[4] || ''}, ${row[5] || ''}, ${row[6] || ''}` },
    { header: 'Plan',        width: 'w-[50px]', value: (row) => row[7] },
    { header: 'Coffin',      width: 'w-[50px]', value: (row) => row[8] },
    { header: 'Embalmer',    width: 'w-[40px]', value: (row) => row[9] },
    { header: 'Amount',      width: 'w-[40px]', value: (row) => {const total = Number(row[11]) + Number(row[12]); return total ? total : '';} },
    { header: 'Burial Date', width: 'w-[50px]',  value: (row) => formatDate(row[10]) },
    { header: 'Status',      width: 'w-[40px]',  value: (row) => row[0] },
    { header: 'Actions',     width: 'w-[40px]',  value: (row) => row[0] },
];


    const fetchClients = async () => {
        const clients = await getClients();
        setAllClients(clients);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleRowClick = (row ) => {
        setActiveRow(row === activeRow ? null : row); // toggle active row
        console.log(row);
    }

    const handleDelete = async (row) => {
        const name = `${row[2]} ${row[3]}`;
    try {
        if (!(await confirmDelete(name))) return;
        const res = await deleteClient(row[0]);
        if (!res) return;
        deleted(name)
        fetchClients();
    } catch (error) {
        noPermission()    
    }
};


    const getDaysLeft = (dateStr) => {
        if (!dateStr) return null;
        const start = new Date(dateStr);
        const ninth = new Date(start);
        ninth.setDate(start.getDate() + 9);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        ninth.setHours(0, 0, 0, 0);
        const diff = Math.ceil((ninth - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const formatDate = (val) => {
        const d = new Date(val);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate();
        const year = String(d.getFullYear()).slice(-2);
        return `${month}-${day}-${year}`;
    };

    allClients.forEach(row => {
        const date = new Date(row[1]);
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
    });

    const months = [...new Set(allClients.map(row => new Date(row[1]).toLocaleString('en-US', { month: 'long' })))];
    const years = [...new Set(allClients.map(row => new Date(row[1]).getFullYear()))];

    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const filteredClients = allClients.filter(row => {
        const date = new Date(row[1]);
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const matchMonth = selectedMonth ? month === selectedMonth : true;
        const matchYear = selectedYear ? year === Number(selectedYear) : true;
        return matchMonth && matchYear;
    });

    return (
        <div className="flex flex-col w-full py-2 rounded-lg border">
            <div className="flex w-full items-center justify-between gap-2 py-2 px-4">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="rounded px-2 py-1 bg-slate-600 text-white"
                    >
                        <option value="">All Months</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded px-2 py-1 bg-slate-600 text-white"
                    >
                        <option value="">All Years</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                    <label className="text-md text-gray-800">
                        {filteredClients.length} Records
                    </label>
                </div>
                <button
                    className="mr-2 inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                    onClick={() => {
                        setNewForm((prev) => {
                            const nextForm = !prev;
                            if (prev) {
                                fetchClients();
                            }
                            return nextForm;
                        });
                    }}
                >
                    {NewForm ? (
                        <X size={16} />
                    ) : (
                        <Plus size={16} />
                    )}
                </button>
            </div>
            {NewForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md overflow-y-auto scrollbar-hide p-12 border border-red-500">
                            <button
                                onClick={() =>  setNewForm(false)}
                                className="
                                    absolute top-4 right-4
                                    flex items-center justify-center
                                    w-8 h-8
                                    rounded-full
                                    bg-slate-100 text-slate-500
                                    hover:bg-red-500 hover:text-white
                                    transition-all duration-200
                                    shadow-sm hover:shadow-md"
                                    >                                               
                                    <X size={16} />
                            </button>
                            <ClientForm
                                onFormSubmitted={() => {
                                    setNewForm(false);
                                    fetchClients();
                                }}
                            />                         
                    </div>
            )}
            {updateForm && selectedClient && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md  overflow-y-auto scrollbar-hide p-12">
                        <button
                            onClick={() => setUpdateForm(false)}
                            className="
                                absolute top-4 right-4
                                flex items-center justify-center
                                w-8 h-8
                                rounded-full
                                bg-slate-100 text-slate-500
                                hover:bg-red-500 hover:text-white
                                transition-all duration-200
                                shadow-sm hover:shadow-md
                            "
                        >                                               
                            <X size={16} />
                        </button> 
                        <UpdateForm
                            setUpdateForm={setUpdateForm}
                            setViewForm = {setViewForm}
                            selectedClient={selectedClient}
                            data={selectedClient}
                            onFormSubmitted={ async () => {                              
                                setUpdateForm(false);
                                const updatedClient = await getClient(selectedClient.client.id);
                                if (updatedClient) {
                                    setSelectedClient(updatedClient);
                                    setViewForm(true);
                                }
                                fetchClients();
                            }}
                        />
                </div>
            )}
            {viewForm && selectedClient != null && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md overflow-y-auto scrollbar-hide p-12">
                                    <button  className="
                                            absolute top-4 left-4
                                            flex items-center justify-center
                                            w-8 h-8
                                            rounded-full
                                            bg-slate-100 text-slate-500
                                            hover:bg-green-500 hover:text-white
                                            transition-all duration-200
                                            shadow-sm hover:shadow-md"
                                            onClick={() => {setUpdateForm(true), setViewForm(false)}}
                                        >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewForm(false)}
                                        className="
                                            absolute top-4 right-4
                                            flex items-center justify-center
                                            w-8 h-8
                                            rounded-full
                                            bg-slate-100 text-slate-500
                                            hover:bg-red-500 hover:text-white
                                            transition-all duration-200
                                            shadow-sm hover:shadow-md
                                        "
                                    >                                               
                                        <X size={16} />
                                    </button>
                        <ViewForm client_data={selectedClient} onClose={() => setViewForm(false)}/>
                  </div>
                
            )}
            <div className="table-container w-full overflow-x-auto rounded px-4 py-2">
                <table className="table-fixed w-full border-separate border-spacing-y-1 text-xs min-w-[1200px]">
                    <thead>
                        <tr className="bg-slate-900 text-slate-100">
                            {columns.map((col, i) => {
                                return (
                                    <th
                                        key={i}
                                        className={`px-2 py-2 text-left text-[15px] font-semibold uppercase tracking-[0.35px] ${col.width} ${col.header === 'Amount' ? 'text-center' : 'text-left'}`}
                                    >
                                        {col.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-white">
                        {filteredClients.map((row, rowIndex) => {
                            const isActive = activeRow === rowIndex;
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`hover:bg-blue-500 cursor-pointer ${isActive ? 'bg-blue-300' : rowIndex % 2 === 0 ? 'bg-slate-700' : 'bg-gray-800'}`}
                                    onDoubleClick={async (e) => {
                                            e.stopPropagation();                                                                    
                                            const clientId = row[0];           
                                            if (!clientId) return;
                                            try {
                                                const data = await getClient(clientId);
                                                if (data) {
                                                    setSelectedClient(data);
                                                    setViewForm(true);
                                                    console.log("clicked row:", data);
                                                }
                                            } catch (error) {
                                                console.error("Failed to fetch client:", error);
                                            }
                                    }}
                                >
                                    {columns.map((col, i) => {
                                        const alignmentClass = col.header === 'Amount' ? 'text-right px-5' : 'text-left';
                                        const value = col.value(row);
                                        if (col.header === 'ID') {
                                            return (
                                                <td
                                                    key={i}
                                                    className={`px-2 py-3 ${col.width} ${alignmentClass} truncate`}
                                                >
                                                    {value}
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Date') {
                                            return (
                                                <td className={`truncate  ${col.width} ${alignmentClass} `} key={i}>
                                                    {value ? formatDate(value) : ''}
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Name') {
                                            return (
                                                <td className={`trunc ${col.width} ${alignmentClass}`} key={i}>
                                                   {value}
                                                </td>
                                            )
                                        }
                                        if (col.header === 'Address') {
                                            return (
                                                <td className={`truncate ${col.width} ${alignmentClass}`} key={i}>
                                                    {value}
                                                </td>
                                            )
                                        }
                                        if (col.header === 'Plan') {
                                            return (
                                                <td
                                                    key={i}
                                                    className={`truncate text-left ${col.width} ${alignmentClass}}`}
                                                >
                                                    {value !== "None" && value !== '' ? (
                                                        <span className="inline-flex items-center justify-center bg-orange-400 text-white px-1 py-0.5 rounded text-xs text-left">
                                                            {value}
                                                        </span>
                                                    ) : null}
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Burial Date') {
                                            return (
                                                <td key={i} className={`truncate px-5 text-left ${col.width} ${alignmentClass} }`}>
                                                    {value ? (formatDate(value)) : null}
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Status') {
                                            const days = getDaysLeft(row[1]);
                                            const balance = row[11]; // adjust index to your total_paid column
                                            return (
                                                <td key={i} className={` ${col.width} ${alignmentClass} truncate px-2 text-left`}>
                                                    {balance > 0 && days < 0 ? (
                                                        <span className="inline-block text-center bg-red-200 text-red-700 px-1 py-0.5 rounded text-xs font-medium">
                                                            {`-₱ ${balance.toLocaleString()}`}
                                                        </span>
                                                    ) : days === null ? null : days < 0 ? (
                                                        <span className="inline-block text-center bg-emerald-600 text-white px-1 py-0.5 rounded text-xs">
                                                            Done
                                                        </span>
                                                    ) : days === 0 ? (
                                                        <span className="inline-block text-center bg-red-200 text-red-800 px-1 py-0.5 rounded text-xs font-medium">
                                                            Today
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-block text-center px-1 py-0.5 rounded text-xs font-medium ${
                                                            days <= 1
                                                                    ? 'bg-orange-200 text-orange-800' 
                                                                : days <= 2
                                                                    ? 'bg-yellow-200 text-yellow-800'
                                                                : days <= 5
                                                                    ? 'bg-blue-200 text-gray-800'
                                                                    : 'bg-green-200 text-green-800'
                                                        }`}>
                                                            {days}d left
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Actions') {
                                            return (
                                                <td
                                                    key={i}
                                                    className={`${col.width} py-1 align-middle`}
                                                >
                                                    <div className="flex px-2 gap-2">
                                                        <button
                                                            className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-500 text-white transition hover:bg-emerald-600"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const data = await getClient(row[0]);
                                                                if (data) { setSelectedClient(data); setUpdateForm(true); }
                                                            }}
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            className="inline-flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-white transition hover:bg-rose-600"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        if (col.header === 'Amount') {
                                            const amount = Number(value);
                                            return (
                                                <td key={i} className={`${col.width} align-middle`}>
                                                    {value && value !== '0' ? `₱ ${value.toLocaleString()}` : ''}
                                                </td>
                                            );
                                        }
                                        return (
                                            <td
                                                key={i}
                                                className={`truncate ${col.width} ${alignmentClass}`}
                                            >
                                                {(value != null ? value.toLocaleString(): null)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

