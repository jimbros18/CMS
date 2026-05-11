import React from 'react';
import { ClientView, ChargeTableView, DSWDView, PaymentsView } from './ViewFormSections';
import {PriceBreakdown} from './formSections';

export default function ViewForm({client_data, onClose}) {
    const { client, otherCharges, dswd, payments } = client_data;
    return (
        <div className="viewform-container flex flex-row px-4 py-6 items-start justify-start ">        
            <div className="flex flex-col items-start text-left border border-gray-300 rounded p-6 shadow-md w-full bg-white">
                <ClientView client={client} />
                <ChargeTableView otherCharges={otherCharges} />
                <DSWDView dswd={dswd[0]} />
                <PaymentsView payments={payments} />
            </div>
            <PriceBreakdown client={client} otherCharges={otherCharges} dswd={dswd[0]} payments={payments} />

    </div>
                
    );
}