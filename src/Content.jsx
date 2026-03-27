// import './styles/content.css';
import ClientsTable from './ClientTable';

function Content({ activeKey }) {
    if (activeKey === 'clients') {
        return <ClientsTable />;
    }

    return <h2>Other Page</h2>;
}

export default Content;
