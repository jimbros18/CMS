import { Save, Trash, Pencil, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './styles/client_table.css';
import ClientForm from './ClientForm';
import { getClients } from './API/server_api';

function ClientsTable() {
    const [NewForm, setNewForm] = useState(false); // state to control rendering
    const [allClients, setAllClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const clients = await getClients();
            setAllClients(clients);
        };
        fetchClients();
    }, []);
    // console.log(allClients);
    const columns = [
    "id",
    "dateServiced",
    "deceasedFirst",
    "deceasedLast",
    "deceasedMiddle",
    "cellNumber",
    "facebook",
    "address",
    "plan",
    "coffin",
    "coffinAmount",
    "notes"
]

    return (
        <div className="client-container flex flex-col items-start py-4 px-4 bg-gray-50 mt-4 rounded">
            <div className="btn_container">
                <button
                    className="add_client text-white bg-blue-500 hover:bg-blue-700 py-2 px-6 rounded"
                    onClick={() => setNewForm((prev) => !prev)}
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
                    <table className="clients-table">
                        <thead>
                            <tr>
                                {columns.map((key, index) => (
                                    <th key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allClients.map((client, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((key, colIndex) => (
                                    <td key={colIndex}>
                                        {key === 'coffinAmount'
                                        ? (client[key] != null ? client[key].toLocaleString() : 0)
                                        : client[key] || ""}
                                    </td>
                                    ))}
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
