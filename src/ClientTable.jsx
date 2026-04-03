import { Save, Trash, Pencil, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './styles/client_table.css';
import ClientForm from './ClientForm';
import { getClients, deleteClient } from './API/server_api';

function ClientsTable() {
    const [NewForm, setNewForm] = useState(false); // state to control rendering
    const [allClients, setAllClients] = useState([]);
    const [activeRow, setActiveRow] = useState(null);

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

    const handleDelete = (row) => {
       const name = `${row[2]} ${row[3]} ${row[4]}`;
       deleteClient(row[0]);
       console.log (`Deleting client: ID: ${row[0]}, Name: ${name}`);
        };
    

    const columns = {
  'ID': 0,
  'Date': 1,
  "First": 2,
  "Last": 3,
  "Middle": 4,
  "Address": 5,
  "Plan": 6,
  "Coffin": 7,
  "actions": 8
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
            <div className="table-container flex items-center justify-center w-full h-full ">
                {NewForm && (
                    <ClientForm onFormSubmitted={() => setNewForm(false)} />
                )}
                {!NewForm && (
                    <table
                        className="clients-table gap-4 w-full gap-y-2 text-left "
                        tabIndex={0}
                    >
                        <thead className='text-left align-middle ml-50'>
                            <tr>
                                {Object.keys(columns).map((header, index) => {
                                    if (header === "actions") {
                                    return (
                                        <th 
                                        key={index} 
                                        className="px-4 py-2 font-semibold text-gray-700 text-center"
                                        >
                                        Actions
                                        </th>
                                    );
                                    } 
                                    else {
                                    return (
                                        <th 
                                        key={index} 
                                        className="px-4 py-2 text-left font-semibold text-gray-700"
                                        >
                                        {header}
                                        </th>
                                    );
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody className="odd:bg-white even:bg-gray-200">
                            {allClients.map((row, rowIndex) => (
                                <tr className="group hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:cursor-pointer active:bg-blue-100"
                                    key={rowIndex} onDoubleClick={() => console.log(row)}>
                                        {Object.keys(columns).map((key, colIndex) => {
                                            const value = row[columns[key]];
                                            if (key === "actions") {
                                                return (
                                                    <td key={colIndex} className="flex justify-center items-center gap-5 py-1 px-[10px]">
                                                        <button className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">
                                                            
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                                        onClick={() => handleDelete(row)}>
                                                            <Trash size={16} />
                                                        </button>
                                                    </td>
                                                );
                                            }
                                            return (
                                            <td key={colIndex} className="px-[10px] py-1 text-left">
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
