  
  
// function Charges() {   
//     return (
//     <table className="w-full border-collapse">
//         <thead>
//         <tr >
//             <th className="text-left px-2 py-1">Item/Service</th>
//             <th className="text-left px-2 py-1">Details</th>
//             <th className="text-left px-2 py-1">Amount</th>
//         </tr>
//         </thead>
//         <tbody>
//         {otherCharges.map((charge, index) => (
//             <tr key={index} className=" border-gray-300">
//             <td className="px-2 py-1">
//                 <select
//                 className="w-full rounded px-2 py-1 bg-gray-700 text-white"
//                 value={charge.item}
//                 onChange={(e) => handleChargeChange(index, 'item', e.target.value)}
//                 >
//                 <option value="Lapida">Lapida</option>
//                 <option value="Candle">Candle</option>
//                 <option value="Lettering">Lettering</option>
//                 <option value="Bulak">Bulak</option>
//                 <option value="Tarpaulin">Tarpaulin</option>
//                 <option value="Video">Video</option>
//                 </select>
//             </td>
//             <td className="px-2 py-1">
//                 <input
//                 type="text"
//                 className="w-full rounded px-2 py-1 bg-gray-700 text-white"
//                 value={charge.details}
//                 onChange={(e) => handleChargeChange(index, 'details', e.target.value)}
//                 placeholder="Description"
//                 />
//             </td>
//             <td className="px-2 py-1">
//                 <input
//                 type="number"
//                 className="w-full rounded px-2 py-1 bg-gray-700 text-white"
//                 value={charge.amount}
//                 onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 />
//             </td>
//             </tr>
//         ))}
//         </tbody>
//     </table>
//     )
// }

function Charges() {

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-start gap-1">
            <label>Items/Service</label>
            <input
              type="text"
              name="glDate"
              value=""
              onChange=""
              className="input"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label>Amount</label>
            <input
              type="text"
              name="glDate"
              value=""
              onChange=""
              className="input"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label>GL Date</label>
            <input
              type="date"
              name="glDate"
              value=""
              onChange=""
              className="input"
            />
          </div>
    </div>
  );
}

export default Charges;