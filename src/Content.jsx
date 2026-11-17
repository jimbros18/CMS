import Table from './ClientTable';
import reportTbl from './Reports';

const components = {
    'clients': Table,
    'reports': reportTbl
}

export default function Content({ activeKey, userData }) {
    const Component = components[activeKey];
    return (
        <div className="main_content w-full md:w-[85%] min-h-screen p-4 bg-gray-800">
        {Component ? <Component userData={userData} /> : null}
        </div>
    )
}