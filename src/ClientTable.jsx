import { Save, Trash, Pencil, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './styles/client_table.css';
import ClientForm from './ClientForm';
import { getClients } from './API/server_api';

function ClientsTable() {
    const [NewForm, setNewForm] = useState(false); // state to control rendering
    const [allClients, setAllClients] = useState([]);

    const fetchClients = async () => {
        const clients = await getClients();
        setAllClients(clients);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const columns = {
  'ID': 0,
  'Date': 1,
  "First": 2,
  "Last": 3,
  "Middle": 4,
  "Cell Number": 5,
  "Facebook": 6,
  "Address": 7,
  "Plan": 8,
  "Coffin": 9,
  "Amount": 10,
  "Notes": 11
};

    return (
        <div className="client-container w-[84%] flex flex-col items-start ml-[300px] py-4 px-4 bg-gray-50 mt-1 rounded">
            <div className="btn_container">
                <button
                    className="add_client text-white bg-blue-500 hover:bg-blue-700 py-2 px-6 rounded"
                    onClick={() => {
                        setNewForm((prev) => {
                            const nextForm = !prev;
                            if (prev) {
                                // was open and now closing (X clicked)
                                fetchClients();
                            }
                            return nextForm;
                        });
                    }}
                >
                    {NewForm ? (
                        <X className="hover:bg-red-700" size={16} />
                    ) : (
                        <Plus size={16} />
                    )}
                </button>
            </div>
            <div className="table-container flex items-center justify-center">
                {NewForm && (
                    <ClientForm onFormSubmitted={() => setNewForm(false)} />
                )}
                {!NewForm && (
                    <table
                        className="clients-table"
                        tabIndex={0}
                        onFocus={fetchClients}
                    >
                        <thead>
                            <tr>
                                {Object.keys(columns).map((header, index) => (
                                <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allClients.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                {Object.keys(columns).map((key, colIndex) => {
                                    const value = row[columns[key]]; // use index from columns
                                    return (
                                    <td key={colIndex}>
                                        {key === "Amount"
                                        ? value != null
                                            ? value.toLocaleString()
                                            : 0
                                        : value || ""}
                                    </td>
                                    );
                                })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ClientsTable;
