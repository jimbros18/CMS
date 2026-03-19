import React from 'react';
import { useState } from "react";
import './styles/client_table.css';
import ClientForm from './ClientForm';

const clients = [
  { Date_Serviced: "1/5/2026", Deceased: "Juan Dela Cruz", Address: "Purok 1 Compostela", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 45000, Notes: "Complete service" },
  { Date_Serviced: "1/7/2026", Deceased: "Maria Santos", Address: "Purok 3 Nabunturan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 25000, Notes: "No embalming" },
  { Date_Serviced: "1/10/2026", Deceased: "Pedro Reyes", Address: "Purok 5 Monkayo", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 75000, Notes: "With flowers" },
  { Date_Serviced: "1/12/2026", Deceased: "Ana Lopez", Address: "Purok 2 Mawab", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 46000, Notes: "Evening viewing" },
  { Date_Serviced: "1/15/2026", Deceased: "Carlos Mendoza", Address: "Purok 7 New Bataan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 23000, Notes: "Family request simple" },
  { Date_Serviced: "1/18/2026", Deceased: "Jose Garcia", Address: "Purok 4 Compostela", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 80000, Notes: "With hearse" },
  { Date_Serviced: "1/20/2026", Deceased: "Linda Ramos", Address: "Purok 6 Nabunturan", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 47000, Notes: "Extended wake" },
  { Date_Serviced: "1/22/2026", Deceased: "Ramon Torres", Address: "Purok 9 Monkayo", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 24000, Notes: "None" },
  { Date_Serviced: "1/25/2026", Deceased: "Gloria Flores", Address: "Purok 8 Mawab", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 78000, Notes: "With chapel service" },
  { Date_Serviced: "1/28/2026", Deceased: "Daniel Cruz", Address: "Purok 3 New Bataan", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 45500, Notes: "Special request lighting" },
  { Date_Serviced: "2/1/2026", Deceased: "Elena Navarro", Address: "Purok 2 Compostela", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 26000, Notes: "Minimal setup" },
  { Date_Serviced: "2/3/2026", Deceased: "Victor Bautista", Address: "Purok 5 Nabunturan", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 82000, Notes: "Full package" },
  { Date_Serviced: "2/5/2026", Deceased: "Susan Villanueva", Address: "Purok 7 Monkayo", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 46500, Notes: "With choir" },
  { Date_Serviced: "2/8/2026", Deceased: "Antonio Perez", Address: "Purok 1 Mawab", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 23500, Notes: "Short wake" },
  { Date_Serviced: "2/10/2026", Deceased: "Patricia Gomez", Address: "Purok 6 New Bataan", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 79000, Notes: "With catering" },
  { Date_Serviced: "2/13/2026", Deceased: "Roberto Aquino", Address: "Purok 4 Compostela", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 48000, Notes: "Additional flowers" },
  { Date_Serviced: "2/16/2026", Deceased: "Carmen Herrera", Address: "Purok 9 Nabunturan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 25500, Notes: "Simple service" },
  { Date_Serviced: "2/18/2026", Deceased: "Francisco Castillo", Address: "Purok 8 Monkayo", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 81000, Notes: "With band" },
  { Date_Serviced: "2/20/2026", Deceased: "Teresita Morales", Address: "Purok 2 Mawab", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 47000, Notes: "Extended viewing" },
  { Date_Serviced: "2/23/2026", Deceased: "Andres Delgado", Address: "Purok 5 New Bataan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 24500, Notes: "Family only" },
  { Date_Serviced: "1/5/2026", Deceased: "Juan Dela Cruz", Address: "Purok 1 Compostela", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 45000, Notes: "Complete service" },
  { Date_Serviced: "1/7/2026", Deceased: "Maria Santos", Address: "Purok 3 Nabunturan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 25000, Notes: "No embalming" },
  { Date_Serviced: "1/10/2026", Deceased: "Pedro Reyes", Address: "Purok 5 Monkayo", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 75000, Notes: "With flowers" },
  { Date_Serviced: "1/12/2026", Deceased: "Ana Lopez", Address: "Purok 2 Mawab", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 46000, Notes: "Evening viewing" },
  { Date_Serviced: "1/15/2026", Deceased: "Carlos Mendoza", Address: "Purok 7 New Bataan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 23000, Notes: "Family request simple" },
  { Date_Serviced: "1/18/2026", Deceased: "Jose Garcia", Address: "Purok 4 Compostela", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 80000, Notes: "With hearse" },
  { Date_Serviced: "1/20/2026", Deceased: "Linda Ramos", Address: "Purok 6 Nabunturan", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 47000, Notes: "Extended wake" },
  { Date_Serviced: "1/22/2026", Deceased: "Ramon Torres", Address: "Purok 9 Monkayo", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 24000, Notes: "None" },
  { Date_Serviced: "1/25/2026", Deceased: "Gloria Flores", Address: "Purok 8 Mawab", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 78000, Notes: "With chapel service" },
  { Date_Serviced: "1/28/2026", Deceased: "Daniel Cruz", Address: "Purok 3 New Bataan", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 45500, Notes: "Special request lighting" },
  { Date_Serviced: "2/1/2026", Deceased: "Elena Navarro", Address: "Purok 2 Compostela", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 26000, Notes: "Minimal setup" },
  { Date_Serviced: "2/3/2026", Deceased: "Victor Bautista", Address: "Purok 5 Nabunturan", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 82000, Notes: "Full package" },
  { Date_Serviced: "2/5/2026", Deceased: "Susan Villanueva", Address: "Purok 7 Monkayo", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 46500, Notes: "With choir" },
  { Date_Serviced: "2/8/2026", Deceased: "Antonio Perez", Address: "Purok 1 Mawab", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 23500, Notes: "Short wake" },
  { Date_Serviced: "2/10/2026", Deceased: "Patricia Gomez", Address: "Purok 6 New Bataan", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 79000, Notes: "With catering" },
  { Date_Serviced: "2/13/2026", Deceased: "Roberto Aquino", Address: "Purok 4 Compostela", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 48000, Notes: "Additional flowers" },
  { Date_Serviced: "2/16/2026", Deceased: "Carmen Herrera", Address: "Purok 9 Nabunturan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 25500, Notes: "Simple service" },
  { Date_Serviced: "2/18/2026", Deceased: "Francisco Castillo", Address: "Purok 8 Monkayo", Plan: "Premium", Coffin: "Imported Casket", Coffin_Amount: 81000, Notes: "With band" },
  { Date_Serviced: "2/20/2026", Deceased: "Teresita Morales", Address: "Purok 2 Mawab", Plan: "Standard", Coffin: "Metal Casket", Coffin_Amount: 47000, Notes: "Extended viewing" },
  { Date_Serviced: "2/23/2026", Deceased: "Andres Delgado", Address: "Purok 5 New Bataan", Plan: "Basic", Coffin: "Wood Casket", Coffin_Amount: 24500, Notes: "Family only" }
];

function ClientsTable() {
    const [NewForm, setNewForm] = useState(false); // state to control rendering

  return (
   <div className="client-container flex flex-col items-start py-4 px-4 bg-gray-50 mt-4 rounded">
        <div className='btn_container'>
            <button className="add_client text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded" onClick={() => setNewForm(prev => !prev)}>
                {NewForm ? "Close" : "Add Client"}
            </button>
        </div>
            <div className="table-container">
                {NewForm && <ClientForm />}
                {!NewForm && (
                <table className="clients-table">
                    <thead>
                    <tr>
                        <th>Date Serviced</th>
                        <th>Deceased</th>
                        <th>Address</th>
                        <th>Plan</th>
                        <th>Coffin</th>
                        <th>Coffin Amount</th>
                        <th>Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((client, index) => (
                        <tr key={index}>
                        <td>{client.Date_Serviced}</td>
                        <td>{client.Deceased}</td>
                        <td>{client.Address}</td>
                        <td>{client.Plan}</td>
                        <td>{client.Coffin}</td>
                        <td className="amount">{client.Coffin_Amount.toLocaleString()}</td>
                        <td>{client.Notes}</td>
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