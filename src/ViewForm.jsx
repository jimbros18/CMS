
import { Library } from 'lucide-react';
import { ClientView, ChargeTableView, AssistanceTableView, PaymentsView, Inclusions, PriceBreakdown, Staff, Lights } from './ViewFormSections';

export default function ViewForm({client_data, onClose}) {
    const { client, inclusions, otherCharges, assistance, payments, staff, lights, returned } = client_data;

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

    // console.log('ViewForm-assistance: ', assistance)

    return (
        <div className="viewform-container inline-flex flex-row p-6 gap-6 w-8/12">        
            <div className="flex flex-col border border-gray-300 text-left rounded shadow-lg bg-white p-6 w-[60%]" >
                <ClientView client={client} formatDate={formatDate} intermentDate={intermentDate} />
                <Inclusions xcoffin = {client["coffin"]} inclusions={inclusions}/>
                <ChargeTableView otherCharges={otherCharges} />
                <AssistanceTableView assistance={assistance} />
                <PaymentsView payments={payments} />
            </div>
            <div className="flex flex-col rounded w-[40%]">
                <PriceBreakdown client={client} otherCharges={otherCharges} assistance={assistance} payments={payments} />
                <Staff staff={staff} />
                <Lights lights={lights} returned={returned} />
            </div>
        </div>
    );
}