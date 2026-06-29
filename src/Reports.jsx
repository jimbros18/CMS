import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useState, useEffect, useMemo } from 'react';
import { getAllClientInfos } from './API/server_api';

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
        accessorFn: row => `${row[2]} ${row[3]}`, // deceasedFirst + deceasedLast
    },
    {
        accessorKey: 'dateServiced',
        header: 'Date Serviced',
        accessorFn: row => row[1],
    },
    {
        accessorKey: 'city',
        header: 'City',
        accessorFn: row => row[4],
    },
    {
        accessorKey: 'coffin',
        header: 'Coffin',
        accessorFn: row => row[6],
    },
    {
        accessorKey: 'plan',
        header: 'Plan',
        accessorFn: row => row[5],
    },
];


export default function Reports() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        const load = async () => {
            const clients = await getAllClientInfos();
            setData(clients || []);
        };
        load();
    }, []);

    console.log(data)

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 20 } },
    });

    return (
        <div className="w-full p-4 border  rounded">
            {/* Search */}
            <input
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="mb-4 px-3 py-2 border border-gray-300 rounded text-sm w-full"
            />
            {/* Table */}
            <table className="w-full border-collapse text-sm bg-gray-800">
                <thead>
                    {table.getHeaderGroups().map(hg => (
                        <>
                            <tr key={hg.id} className="border">
                                {hg.headers.map(header => (
                                    <th key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="px-3 py-2 text-left font-medium text-white uppercase border-b border-gray-300 cursor-pointer select-none"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                                    </th>
                                ))}
                            </tr>
                            {/* Filter row */}
                            <tr key="filters" className="border">
                                {hg.headers.map(header => (
                                    <th key={header.id} className="px-2 py-1 border-b border-gray-300">
                                        {header.column.getCanFilter() && (
                                            <input
                                                value={header.column.getFilterValue() ?? ''}
                                                onChange={e => header.column.setFilterValue(e.target.value)}
                                                placeholder={`Filter...`}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded font-normal"
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={`group cursor-pointer ${row.index % 2 === 0 ? '' : 'bg-gray-700'}`}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-3 py-2 text-white text-left">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded disabled:opacity-40">←</button>
                <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded disabled:opacity-40">→</button>
            </div>
        </div>
    );
}