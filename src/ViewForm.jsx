
import { Library } from 'lucide-react';
import { ClientView, ChargeTableView, DSWDView, PaymentsView, Inclusions, PriceBreakdown, Staff, Lights } from './ViewFormSections';

export default function ViewForm({client_data, onClose}) {
    const { client, inclusions, otherCharges, dswd, payments, staff, lights } = client_data;

    const formatDate = (val) => {
        const d = new Date(val);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate();
        const year = String(d.getFullYear()).slice(-2);
        return `${month}-${day}-${year}`;
    };
    const intermentDate = (val) => {
        const d = new Date(val);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate();
        const year = String(d.getFullYear()).slice(-2);
        const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${month}-${day}-${year} ${time}`;
    };

    return (
        <div className="viewform-container inline-flex flex-row border border-black p-6 gap-6 w-8/12">        
            <div className="flex flex-col text-left border border-red-500 rounded shadow-md bg-white p-6 w-[60%]" >
                <ClientView client={client} formatDate={formatDate} intermentDate={intermentDate} />
                <Inclusions xcoffin = {client["coffin"]} inclusions={inclusions}/>
                <ChargeTableView otherCharges={otherCharges} />
                <DSWDView dswd={dswd[0]} />
                <PaymentsView payments={payments} />
            </div>
            <div className="flex flex-col border border-blue-500 rounded shadow-md w-[40%]">
                <PriceBreakdown client={client} otherCharges={otherCharges} dswd={dswd[0]} payments={payments} />
                <Staff staff={staff} />
                <Lights lights={lights} />
            </div>
        </div>
    );
}