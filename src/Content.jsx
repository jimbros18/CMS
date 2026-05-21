import Table from './ClientTable';



export default function Content({ activeKey }) {
    if (activeKey === 'clients') {
        return (       
            <Table/>
        );
    }
        return (
            <h2>Other Page</h2>
        );
}
