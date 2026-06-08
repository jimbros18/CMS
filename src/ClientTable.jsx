import { Trash, Pencil, Plus, X, View } from 'lucide-react';
import { useState, useEffect } from 'react';
import ClientForm from './ClientForm';
import UpdateForm from './updateForm';
import ViewForm from './ViewForm';
import {getClients, deleteClient, getClient } from './API/server_api';

export default function Table() {
    const [viewForm, setViewForm] = useState(false);
    const [NewForm, setNewForm] = useState(false); // state to control rendering
    const [updateForm, setUpdateForm] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const columns = {
        'ID': 0,
        'Date': 1,
        "First": 2,
        "Last": 3,
        "Middle": 4,
        "Address": 5,
        "Plan": 6,
        "Coffin": 7,
        "Burial Date": 8,
        "Status" : 9,
        "Actions": 10
    };

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
       const name = `${row[2]} ${row[3]} ${row[4]}`;
       await deleteClient(row[0]);
       await fetchClients();
       console.log (`Deleting client: ID: ${row[0]}, Name: ${name}`);
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
        <div className="flex flex-col w-[calc(100%-18rem)] ml-72 py-3 px-3 bg-slate-50 mt-1 rounded">
            <div className="flex w-full items-center justify-between gap-2 mb-3 ml-1">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="rounded px-2 py-1 bg-slate-800 text-white"
                    >
                        <option value="">All Months</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded px-2 py-1 bg-slate-800 text-white"
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
                    className="mr-2 inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
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
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md px-4 py-6 overflow-y-auto scrollbar-hide">
                    <div className="w-full max-w-3xl rounded-2xl p-5 ">
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
                </div>
            )}
            {updateForm && selectedClient && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md p-12 overflow-y-auto scrollbar-hide border border-red-500">
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
                    {/* <div className="border border-yellow-300 rounded p-12"> 
                        <div className='flex flex-row'> */}
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
                            {/* </div> */}
                        <ViewForm client_data={selectedClient} onClose={() => setViewForm(false)} />
                //     </div>
                // </div>
                
            )}
            <div className="table-container w-full overflow-x-auto rounded bg-white p-1">
                <table className="table-auto w-full border-separate border-spacing-y-1">
                    <thead>
                        <tr className="bg-slate-900 text-slate-100 text-[11px]">
                            {Object.keys(columns).map((header, index) => {
                                if (header === 'actions') {
                                    return (
                                        <th
                                            key={index}
                                            className="px-2 py-1 text-center text-[15px] font-semibold uppercase tracking-[0.35px] whitespace-nowrap"
                                        >
                                            Actions
                                        </th>
                                    );
                                }
                                if (header === 'Burial Date'){
                                    return (
                                        <th
                                            key={index}
                                            className="text-left text-[15px] font-semibold uppercase tracking-[0.35px]"
                                        >
                                            Burial Date
                                        </th>
                                    );
                                }
                                return (
                                    <th
                                        key={index}
                                        className="px-2 py-1 text-left text-[15px] font-semibold uppercase tracking-[0.35px]"
                                    >
                                        {header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-lg text-slate-700">
                        {filteredClients.map((row, rowIndex) => {
                            const isActive = activeRow === rowIndex;
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`border border-slate-200  ${isActive ? 'bg-blue-300' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-100'} hover:bg-slate-50 cursor-pointer`}
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
                                    {Object.keys(columns).map((key, colIndex) => {
                                        const alignmentClass = key === 'Amount' ? 'text-right' : 'text-left';
                                        const value = row[columns[key]];
                                        if (key === 'Date') {
                                            return (
                                                <td className={`max-w-[50px] truncate px-2 align-top text-[13px] ${alignmentClass}`} key={colIndex}>
                                                    {value ? formatDate(value) : ''}
                                                </td>
                                            );
                                        }
                                        if (key === 'Actions') {
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="flex items-center justify-center gap-2 px-2 whitespace-nowrap"
                                                >
                                                    <button
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-500 text-white transition hover:bg-emerald-600"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const data = await getClient(row[0]);
                                                            if (data) {
                                                                setSelectedClient(data);
                                                                setUpdateForm(true);
                                                            }
                                                        }}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-white transition hover:bg-rose-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(row);
                                                        }}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            );
                                        }
                                        if (key === 'Plan') {
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="max-w-[50px] truncate px-2 align-top text-[13px] text-left"
                                                >
                                                    {value !== 'None' && value !== '' ? (
                                                        <span className="inline-flex items-center justify-center bg-orange-400 text-white px-1 py-0.5 rounded text-xs text-left">
                                                            {value}
                                                        </span>
                                                    ) : null}
                                                </td>
                                            );
                                        }
                                        if (key === 'Burial Date') {
                                            return (
                                                <td key={colIndex} className="max-w-[50px] truncate px-2 align-top text-[13px] text-left">
                                                    {value ? (formatDate(value)) : null}
                                                </td>
                                            );
                                        }
                                        if (key === 'Status') {
                                            const days = getDaysLeft(row[1]);
                                            const balance = row[9]; // adjust index to your total_paid column
                                            return (
                                                <td key={colIndex} className="px-2 align-top text-[13px] text-left">
                                                    {balance > 0 && days < 0 ? (
                                                        <span className="inline-block text-center bg-red-200 text-red-700 px-1 py-0.5 rounded text-xs font-medium">
                                                            {balance.toLocaleString()}
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
                                        return (
                                            <td
                                                key={colIndex}
                                                className={`max-w-[60px] truncate px-2 align-top text-[13px] ${alignmentClass}`}
                                            >
                                                {key === 'Amount' ? (value != null ? value.toLocaleString(): 0) :(value || '')}
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

