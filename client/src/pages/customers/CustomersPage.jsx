
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { Users, Award, Phone, CreditCard, Search, Loader2, Eye } from 'lucide-react';
// import CustomerDetailModal from '../../components/customers/CustomerDetailModal';

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [customerDetail, setCustomerDetail] = useState(null);
//   const [fetchingDetail, setFetchingDetail] = useState(false);

//   const fetchCustomers = async () => {
//     try {
//       const res = await apiClient.get('/customers');
//       setCustomers(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load customers list');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   // Fetch full details and sales history when a customer row is clicked
//   const handleOpenCustomerDetail = async (id) => {
//     setFetchingDetail(true);
//     try {
//       const res = await apiClient.get(`/customers/${id}`);
//       setCustomerDetail(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load customer details');
//     } finally {
//       setFetchingDetail(false);
//     }
//   };

//   // 👈 Refresh both the main table list and keep the open modal's data synced
//   const handleCustomerUpdated = async () => {
//     await fetchCustomers();
//     if (customerDetail) {
//       const res = await apiClient.get(`/customers/${customerDetail.id}`);
//       setCustomerDetail(res.data.data);
//     }
//   };

//   const filteredCustomers = customers.filter(c =>
//     c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     c.phone.includes(searchQuery)
//   );

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto">
      
//       {/* Page Header */}
//       <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 shadow-md text-white flex items-center justify-between">
//         <div>
//           <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//             <Users className="h-4 w-4" /> Client Database & Loyalty CRM
//           </div>
//           <h1 className="text-xl font-extrabold text-white">Customer Directory</h1>
//           <p className="text-xs text-slate-300 mt-0.5">Track phone records, Yeketena credits, earned loyalty points, and past invoices.</p>
//         </div>
//         <div className="px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-xs">
//           Total Registered: {customers.length}
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white p-4 rounded-2xl border border-yellow-500/20 shadow-sm flex items-center gap-3">
//         <div className="relative flex-1">
//           <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//             <Search className="h-4 w-4" />
//           </span>
//           <input
//             type="text"
//             placeholder="Search customer by name or phone number..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-[#022036] outline-none focus:border-yellow-500"
//           />
//         </div>
//       </div>

//       {/* Customer Table List */}
//       <div className="bg-white rounded-2xl border border-yellow-500/20 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
//           </div>
//         ) : filteredCustomers.length === 0 ? (
//           <div className="text-center py-20 text-slate-400 text-xs">No registered customers found.</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse text-xs">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200 text-[#022036] font-bold uppercase tracking-wider">
//                   <th className="p-4">Customer Name</th>
//                   <th className="p-4">Phone Number</th>
//                   <th className="p-4">Loyalty Points</th>
//                   <th className="p-4">Yeketena Credit Owed</th>
//                   <th className="p-4">Joined Date</th>
//                   <th className="p-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredCustomers.map(c => (
//                   <tr key={c.id} className="hover:bg-slate-50/80 transition-all">
//                     <td className="p-4 font-bold text-[#022036]">{c.fullName}</td>
//                     <td className="p-4 font-mono text-slate-600 flex items-center gap-1.5">
//                       <Phone className="h-3.5 w-3.5 text-slate-400" /> {c.phone}
//                     </td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold font-mono ${
//                         c.loyaltyPoints >= 100 
//                           ? 'bg-amber-100 text-amber-800 border border-amber-300' 
//                           : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
//                       }`}>
//                         <Award className="h-3 w-3" /> {c.loyaltyPoints} pts
//                       </span>
//                     </td>
//                     <td className="p-4 font-mono font-bold text-slate-700">
//                       {Number(c.totalCredit).toFixed(2)} ETB
//                     </td>
//                     <td className="p-4 text-slate-400 text-[11px]">
//                       {new Date(c.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-4 text-right">
//                       <button
//                         onClick={() => handleOpenCustomerDetail(c.id)}
//                         disabled={fetchingDetail}
//                         className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#022036] text-yellow-400 hover:bg-[#032a45] font-bold text-[10px] transition-all cursor-pointer shadow-2xs"
//                       >
//                         <Eye className="h-3 w-3" /> View History
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Customer Detail & Transaction History Modal */}
//       {customerDetail && (
//         <CustomerDetailModal
//           customer={customerDetail}
//           onClose={() => setCustomerDetail(null)}
//           onUpdate={handleCustomerUpdated} // 👈 Passes the refresh trigger down
//         />
//       )}

//     </div>
//   );
// }
// client/src/pages/customers/CustomersPage.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Users, Award, Phone, CreditCard, Search, Loader2, Eye, Sparkles } from 'lucide-react';
import CustomerDetailModal from '../../components/customers/CustomerDetailModal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerDetail, setCustomerDetail] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await apiClient.get('/customers');
      setCustomers(res.data.data);
    } catch (err) {
      toast.error('Failed to load customers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch full details and sales history when a customer row is clicked
  const handleOpenCustomerDetail = async (id) => {
    setFetchingDetail(true);
    try {
      const res = await apiClient.get(`/customers/${id}`);
      setCustomerDetail(res.data.data);
    } catch (err) {
      toast.error('Failed to load customer details');
    } finally {
      setFetchingDetail(false);
    }
  };

  // Refresh both the main table list and keep the open modal's data synced
  const handleCustomerUpdated = async () => {
    await fetchCustomers();
    if (customerDetail) {
      const res = await apiClient.get(`/customers/${customerDetail.id}`);
      setCustomerDetail(res.data.data);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Client Database & Loyalty CRM
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-300">Track phone records, Yeketena credits, earned loyalty points, and past invoices.</p>
        </div>

        <div className="relative z-10 px-4 py-2 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 font-extrabold text-xs shadow-sm">
          Total Registered: {customers.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search customer by name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Customer Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs font-medium">No registered customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="p-4.5">Customer Name</th>
                  <th className="p-4.5">Phone Number</th>
                  <th className="p-4.5">Loyalty Points</th>
                  <th className="p-4.5">Yeketena Credit Owed</th>
                  <th className="p-4.5">Joined Date</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#022036]">
                {filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-yellow-50/30 transition-all group">
                    <td className="p-4.5 font-bold group-hover:text-amber-700 transition-colors">{c.fullName}</td>
                    <td className="p-4.5 font-mono text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> {c.phone}
                    </td>
                    <td className="p-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold font-mono text-[11px] shadow-2xs ${
                        c.loyaltyPoints >= 100 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        <Award className="h-3.5 w-3.5" /> {c.loyaltyPoints} pts
                      </span>
                    </td>
                    <td className="p-4.5 font-mono font-extrabold text-slate-700">
                      {Number(c.totalCredit).toFixed(2)} ETB
                    </td>
                    <td className="p-4.5 text-slate-400 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4.5 text-right">
                      <button
                        onClick={() => handleOpenCustomerDetail(c.id)}
                        disabled={fetchingDetail}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#022036] text-yellow-400 hover:bg-[#032a45] font-bold text-xs transition-all cursor-pointer shadow-sm transform hover:-translate-y-0.5"
                      >
                        <Eye className="h-3.5 w-3.5" /> View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Transaction History Modal */}
      {customerDetail && (
        <CustomerDetailModal
          customer={customerDetail}
          onClose={() => setCustomerDetail(null)}
          onUpdate={handleCustomerUpdated}
        />
      )}

    </div>
  );
}