import Table from './ClientTable';
import reportTbl from './Reports';

const components = {
    'clients': Table,
    'reports': reportTbl   
}

export default function Content({ activeKey }) {
    const Component = components[activeKey];
    return (
        <div className="main_content w-[85%] min-h-screen p-4 bg-gray-800">
        {Component ? <Component /> : null}
        </div>
    )
}