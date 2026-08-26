// // client/src/pages/credit/CreditPage.jsx
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { CreditCard, Search, DollarSign, Phone, User, CheckCircle2, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';

// export default function CreditPage() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Repayment Modal State
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [amountPaid, setAmountPaid] = useState('');
//   const [notes, setNotes] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchCreditData = async () => {
//     try {
//       const res = await apiClient.get('/credit');
//       setCustomers(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load Yeketena credit records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCreditData();
//   }, []);

//   const handleSettleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedCustomer) return;

//     setIsSubmitting(true);
//     try {
//       await apiClient.post(`/credit/${selectedCustomer.id}/settle`, {
//         amountPaid,
//         notes
//       });
//       toast.success('Credit repayment recorded successfully!');
//       setSelectedCustomer(null);
//       setAmountPaid('');
//       setNotes('');
//       fetchCreditData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to process repayment');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const totalOutstandingCredit = customers.reduce((acc, c) => acc + Number(c.totalCredit || 0), 0);

//   const filteredCustomers = customers.filter(c =>
//     c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     c.phone.includes(searchQuery)
//   );

//   return (
//     <div className="space-y-6">
      
//       {/* Page Header & Overview Banner */}
//       <div className="bg-white rounded-2xl border border-yellow-500/20 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 text-yellow-600 font-bold text-xs uppercase tracking-wider mb-1">
//             <CreditCard className="h-4 w-4" /> Yeketena Customer Credit Tracker
//           </div>
//           <h1 className="text-xl font-extrabold text-[#022036]">Customer Debts & Repayments</h1>
//           <p className="text-xs text-slate-500 mt-0.5">Monitor outstanding credit balances in ETB and record customer debt settlements.</p>
//         </div>

//         <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 flex items-center gap-3">
//           <div className="p-2 rounded-lg bg-yellow-100 text-yellow-800">
//             <ShieldAlert className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Outstanding Debt</p>
//             <p className="text-base font-extrabold text-[#022036] font-mono">{totalOutstandingCredit.toFixed(2)} ETB</p>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//           <Search className="h-4 w-4" />
//         </span>
//         <input
//           type="text"
//           placeholder="Search credit customer by name or phone..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-[#022036] outline-none focus:border-yellow-500 shadow-2xs"
//         />
//       </div>

//       {/* Credit Customers Table Container */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
//           </div>
//         ) : filteredCustomers.length === 0 ? (
//           <div className="text-center py-16 text-slate-400 text-xs font-medium">
//             No credit customers found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
//                   <th className="p-4">Customer Name</th>
//                   <th className="p-4">Phone Number</th>
//                   <th className="p-4">Outstanding Balance (ETB)</th>
//                   <th className="p-4">Credit Status</th>
//                   <th className="p-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
//                 {filteredCustomers.map((c) => {
//                   const debt = Number(c.totalCredit);
//                   const hasDebt = debt > 0;
//                   return (
//                     <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
//                       <td className="p-4 font-bold flex items-center gap-2">
//                         <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[#022036] font-extrabold text-[10px]">
//                           {c.fullName.charAt(0)}
//                         </div>
//                         {c.fullName}
//                       </td>
//                       <td className="p-4 font-mono text-slate-600">
//                         {c.phone}
//                       </td>
//                       <td className="p-4 font-mono font-bold text-red-700 text-sm">
//                         {debt.toFixed(2)} ETB
//                       </td>
//                       <td className="p-4">
//                         {hasDebt ? (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
//                             <AlertCircle className="h-3 w-3" /> Active Debt
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
//                             <CheckCircle2 className="h-3 w-3" /> Fully Settled
//                           </span>
//                         )}
//                       </td>
//                       <td className="p-4 text-right">
//                         {hasDebt && (
//                           <button
//                             onClick={() => setSelectedCustomer(c)}
//                             className="px-3 py-1.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all shadow-sm cursor-pointer border border-yellow-400/30"
//                           >
//                             Record Repayment
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Repayment Settlement Modal */}
//       {selectedCustomer && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/60 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden">
//             <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30">
//               <div>
//                 <h3 className="font-bold text-sm tracking-tight">Settle Credit: {selectedCustomer.fullName}</h3>
//                 <p className="text-[10px] text-yellow-400 font-mono mt-0.5">Outstanding: {Number(selectedCustomer.totalCredit).toFixed(2)} ETB</p>
//               </div>
//               <button onClick={() => setSelectedCustomer(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕ Close</button>
//             </div>

//             <form onSubmit={handleSettleSubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Repayment Amount (ETB)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="1"
//                   max={selectedCustomer.totalCredit}
//                   required
//                   autoFocus
//                   placeholder="e.g. 500.00"
//                   value={amountPaid}
//                   onChange={(e) => setAmountPaid(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-yellow-500 font-mono font-bold"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes / Payment Reference (Optional)</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Cash payment received by manager"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-yellow-500"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full mt-2 py-3 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all shadow-sm disabled:opacity-50 cursor-pointer border border-yellow-400/40 flex items-center justify-center gap-2"
//               >
//                 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-yellow-400" /> : <DollarSign className="h-4 w-4" />}
//                 Confirm Debt Repayment
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
// client/src/pages/credit/CreditPage.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { CreditCard, Search, DollarSign, Phone, User, CheckCircle2, AlertCircle, Loader2, ShieldAlert, Sparkles } from 'lucide-react';

export default function CreditPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Repayment Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCreditData = async () => {
    try {
      const res = await apiClient.get('/credit');
      setCustomers(res.data.data);
    } catch (err) {
      toast.error('Failed to load Yeketena credit records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setIsSubmitting(true);
    try {
      await apiClient.post(`/credit/${selectedCustomer.id}/settle`, {
        amountPaid,
        notes
      });
      toast.success('Credit repayment recorded successfully!');
      setSelectedCustomer(null);
      setAmountPaid('');
      setNotes('');
      fetchCreditData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process repayment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalOutstandingCredit = customers.reduce((acc, c) => acc + Number(c.totalCredit || 0), 0);

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-10">
      
      {/* Page Header & Overview Banner */}
      <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Yeketena Customer Credit Tracker
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Customer Debts & Repayments</h1>
          <p className="text-xs text-slate-300">Monitor outstanding credit balances in ETB and record customer debt settlements.</p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-yellow-400 text-[#022036] shadow-2xs">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Total Outstanding Debt</p>
            <p className="text-base sm:text-lg font-extrabold text-yellow-400 font-mono tracking-tight">{totalOutstandingCredit.toFixed(2)} ETB</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Search credit customer by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
        />
      </div>

      {/* Credit Customers Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs font-medium">
            No credit customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4.5">Customer Name</th>
                  <th className="p-4.5">Phone Number</th>
                  <th className="p-4.5">Outstanding Balance (ETB)</th>
                  <th className="p-4.5">Credit Status</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
                {filteredCustomers.map((c) => {
                  const debt = Number(c.totalCredit);
                  const hasDebt = debt > 0;
                  return (
                    <tr key={c.id} className="hover:bg-yellow-50/30 transition-colors group">
                      <td className="p-4.5 font-bold flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#022036] font-extrabold text-xs shadow-2xs">
                          {c.fullName.charAt(0)}
                        </div>
                        <span className="group-hover:text-amber-700 transition-colors">{c.fullName}</span>
                      </td>
                      <td className="p-4.5 font-mono text-slate-600">
                        {c.phone}
                      </td>
                      <td className="p-4.5 font-mono font-extrabold text-red-600 text-sm">
                        {debt.toFixed(2)} ETB
                      </td>
                      <td className="p-4.5">
                        {hasDebt ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold shadow-2xs animate-pulse">
                            <AlertCircle className="h-3 w-3" /> Active Debt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shadow-2xs">
                            <CheckCircle2 className="h-3 w-3" /> Fully Settled
                          </span>
                        )}
                      </td>
                      <td className="p-4.5 text-right">
                        {hasDebt && (
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-3.5 py-2 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all shadow-sm cursor-pointer border border-yellow-400/40 transform hover:-translate-y-0.5"
                          >
                            Record Repayment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Repayment Settlement Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Settle Credit: {selectedCustomer.fullName}</h3>
                <p className="text-[10px] text-yellow-400 font-mono mt-0.5">Outstanding: {Number(selectedCustomer.totalCredit).toFixed(2)} ETB</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-yellow-400 text-xs font-bold cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors">✕ Close</button>
            </div>

            <form onSubmit={handleSettleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Repayment Amount (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={selectedCustomer.totalCredit}
                  required
                  autoFocus
                  placeholder="e.g. 500.00"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Notes / Payment Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cash payment received by manager"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md disabled:opacity-50 cursor-pointer border border-yellow-400/40 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-yellow-400" /> : <DollarSign className="h-4 w-4" />}
                Confirm Debt Repayment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}