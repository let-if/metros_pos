
// // import { useState, useEffect } from 'react';
// // import { apiClient } from '../../api/axiosConfig';
// // import { toast } from 'sonner';
// // import { ArrowRightLeft, Warehouse, Store, Send, Loader2, ClipboardList, Plus, Building2 } from 'lucide-react';

// // export default function TransfersPage() {
// //   const [branches, setBranches] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [transfers, setTransfers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [showBranchModal, setShowBranchModal] = useState(false);

// //   const [form, setForm] = useState({
// //     sourceId: '',
// //     destId: '',
// //     productId: '',
// //     quantity: '',
// //     notes: ''
// //   });

// //   const [branchForm, setBranchForm] = useState({
// //     name: '',
// //     location: '',
// //     isWarehouse: false
// //   });

// //   const fetchData = async () => {
// //     try {
// //       const [branchRes, prodRes, transferRes] = await Promise.all([
// //         apiClient.get('/branches').catch(() => ({ data: { data: [] } })),
// //         apiClient.get('/products').catch(() => ({ data: { data: [] } })),
// //         apiClient.get('/transfers').catch(() => ({ data: { data: [] } }))
// //       ]);
// //       setBranches(branchRes.data.data || []);
// //       setProducts(prodRes.data.data || []);
// //       setTransfers(transferRes.data.data || []);
// //     } catch (err) {
// //       toast.error('Failed to load transfer data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const handleTransfer = async (e) => {
// //     e.preventDefault();
// //     if (!form.sourceId || !form.destId || !form.productId || !form.quantity) {
// //       toast.error('Please fill out all required fields');
// //       return;
// //     }

// //     if (form.sourceId === form.destId) {
// //       toast.error('Source and destination cannot be the same branch.');
// //       return;
// //     }

// //     try {
// //       setSubmitting(true);
// //       await apiClient.post('/transfers', {
// //         ...form,
// //         quantity: Number(form.quantity)
// //       });
// //       toast.success('Stock transfer completed successfully!');
// //       setForm({ sourceId: '', destId: '', productId: '', quantity: '', notes: '' });
// //       fetchData();
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Transfer failed');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleCreateBranch = async (e) => {
// //     e.preventDefault();
// //     if (!branchForm.name) {
// //       toast.error('Branch name is required');
// //       return;
// //     }

// //     try {
// //       await apiClient.post('/branches', branchForm);
// //       toast.success('New branch registered successfully!');
// //       setBranchForm({ name: '', location: '', isWarehouse: false });
// //       setShowBranchModal(false);
// //       fetchData();
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to create branch');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
// //         <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6 pb-10">
// //       {/* Header Banner with Add Branch Action */}
// //       <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />
// //         <div>
// //           <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Multi-Branch Stock Transfers</h1>
// //           <p className="text-xs text-slate-300 mt-1">Move inventory quantities seamlessly between warehouses and store locations in Addis Ababa.</p>
// //         </div>
// //         <button
// //           onClick={() => setShowBranchModal(true)}
// //           className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-md shrink-0 relative z-10"
// //         >
// //           <Plus className="h-4 w-4" /> Add New Branch
// //         </button>
// //       </div>

// //       {/* Transfer Form Grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <form onSubmit={handleTransfer} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 lg:col-span-1">
// //           <h2 className="font-extrabold text-sm text-[#022036] uppercase tracking-wider flex items-center gap-2">
// //             <ArrowRightLeft className="h-4 w-4 text-yellow-600" /> New Stock Movement
// //           </h2>

// //           <div className="space-y-1">
// //             <label className="text-xs font-bold text-slate-600">Source Location (Warehouse/Store)</label>
// //             <select
// //               value={form.sourceId}
// //               onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
// //               className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
// //               required
// //             >
// //               <option value="">Select Source...</option>
// //               {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.isWarehouse ? 'Warehouse' : 'Store'})</option>)}
// //             </select>
// //           </div>

// //           <div className="space-y-1">
// //             <label className="text-xs font-bold text-slate-600">Destination Location</label>
// //             <select
// //               value={form.destId}
// //               onChange={(e) => setForm({ ...form, destId: e.target.value })}
// //               className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
// //               required
// //             >
// //               <option value="">Select Destination...</option>
// //               {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.isWarehouse ? 'Warehouse' : 'Store'})</option>)}
// //             </select>
// //           </div>

// //           <div className="space-y-1">
// //             <label className="text-xs font-bold text-slate-600">Product Item</label>
// //             <select
// //               value={form.productId}
// //               onChange={(e) => setForm({ ...form, productId: e.target.value })}
// //               className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
// //               required
// //             >
// //               <option value="">Select Product...</option>
// //               {products.map(p => <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>)}
// //             </select>
// //           </div>

// //           <div className="space-y-1">
// //             <label className="text-xs font-bold text-slate-600">Quantity to Transfer</label>
// //             <input
// //               type="number"
// //               min="1"
// //               placeholder="e.g., 50"
// //               value={form.quantity}
// //               onChange={(e) => setForm({ ...form, quantity: e.target.value })}
// //               className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none font-mono"
// //               required
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={submitting}
// //             className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
// //           >
// //             {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
// //             Execute Transfer
// //           </button>
// //         </form>

// //         {/* Audit Log Table */}
// //         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
// //           <div className="p-4.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
// //             <h3 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-2">
// //               <ClipboardList className="h-4 w-4 text-yellow-600" /> Transfer Audit History
// //             </h3>
// //             <span className="text-[10px] text-slate-400 font-mono">{transfers.length} Total Logs</span>
// //           </div>

// //           <div className="overflow-x-auto flex-1">
// //             <table className="w-full text-left border-collapse">
// //               <thead>
// //                 <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
// //                   <th className="p-3.5">Product</th>
// //                   <th className="p-3.5">From</th>
// //                   <th className="p-3.5">To</th>
// //                   <th className="p-3.5 font-mono">Qty</th>
// //                   <th className="p-3.5">Date</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
// //                 {transfers.length === 0 ? (
// //                   <tr><td colSpan="5" className="text-center py-12 text-slate-400">No stock transfers recorded yet.</td></tr>
// //                 ) : (
// //                   transfers.map(t => (
// //                     <tr key={t.id} className="hover:bg-yellow-50/20 transition-colors">
// //                       <td className="p-3.5 font-bold">{t.product?.name}</td>
// //                       <td className="p-3.5 text-slate-600">{t.sourceBranch?.name}</td>
// //                       <td className="p-3.5 text-slate-600">{t.destBranch?.name}</td>
// //                       <td className="p-3.5 font-mono font-extrabold text-emerald-700">+{t.quantity}</td>
// //                       <td className="p-3.5 text-slate-400 text-[10px] font-mono">{new Date(t.createdAt).toLocaleString()}</td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Add Branch Modal */}
// //       {showBranchModal && (
// //         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
// //             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
// //               <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-2">
// //                 <Building2 className="h-4 w-4 text-yellow-600" /> Register New Branch / Warehouse
// //               </h3>
// //               <button 
// //                 onClick={() => setShowBranchModal(false)}
// //                 className="text-slate-400 hover:text-black font-bold text-sm cursor-pointer"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleCreateBranch} className="space-y-4">
// //               <div className="space-y-1">
// //                 <label className="text-xs font-bold text-slate-600">Branch Name</label>
// //                 <input
// //                   type="text"
// //                   placeholder="e.g., Piassa Branch or Warehouse B"
// //                   value={branchForm.name}
// //                   onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
// //                   className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
// //                   required
// //                 />
// //               </div>

// //               <div className="space-y-1">
// //                 <label className="text-xs font-bold text-slate-600">Location / Address</label>
// //                 <input
// //                   type="text"
// //                   placeholder="e.g., Piassa, Arada, Addis Ababa"
// //                   value={branchForm.location}
// //                   onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
// //                   className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
// //                 />
// //               </div>

// //               <div className="flex items-center gap-2 pt-2">
// //                 <input
// //                   type="checkbox"
// //                   id="isWarehouse"
// //                   checked={branchForm.isWarehouse}
// //                   onChange={(e) => setBranchForm({ ...branchForm, isWarehouse: e.target.checked })}
// //                   className="h-4 w-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-400 cursor-pointer"
// //                 />
// //                 <label htmlFor="isWarehouse" className="text-xs font-bold text-slate-700 cursor-pointer">
// //                   Is this a Central Storage Warehouse? (Instead of Retail Store)
// //                 </label>
// //               </div>

// //               <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowBranchModal(false)}
// //                   className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] text-xs font-extrabold shadow-sm cursor-pointer"
// //                 >
// //                   Save Branch
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { 
//   ArrowRightLeft, 
//   Warehouse, 
//   Store, 
//   Send, 
//   Loader2, 
//   ClipboardList, 
//   Plus, 
//   Building2, 
//   Eye, 
//   PackageCheck, 
//   Calendar, 
//   FileText, 
//   CheckCircle2, 
//   ArrowRight 
// } from 'lucide-react';

// export default function TransfersPage() {
//   const [branches, setBranches] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [transfers, setTransfers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [showBranchModal, setShowBranchModal] = useState(false);
//   const [selectedTransfer, setSelectedTransfer] = useState(null); // 👈 For the Detail Modal

//   const [form, setForm] = useState({
//     sourceId: '',
//     destId: '',
//     productId: '',
//     quantity: '',
//     notes: ''
//   });

//   const [branchForm, setBranchForm] = useState({
//     name: '',
//     location: '',
//     isWarehouse: false
//   });

//   const fetchData = async () => {
//     try {
//       const [branchRes, prodRes, transferRes] = await Promise.all([
//         apiClient.get('/branches').catch(() => ({ data: { data: [] } })),
//         apiClient.get('/products').catch(() => ({ data: { data: [] } })),
//         apiClient.get('/transfers').catch(() => ({ data: { data: [] } }))
//       ]);
//       setBranches(branchRes.data.data || []);
//       setProducts(prodRes.data.data || []);
//       setTransfers(transferRes.data.data || []);
//     } catch (err) {
//       toast.error('Failed to load transfer data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleTransfer = async (e) => {
//     e.preventDefault();
//     if (!form.sourceId || !form.destId || !form.productId || !form.quantity) {
//       toast.error('Please fill out all required fields');
//       return;
//     }

//     if (form.sourceId === form.destId) {
//       toast.error('Source and destination cannot be the same branch.');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await apiClient.post('/transfers', {
//         ...form,
//         quantity: Number(form.quantity)
//       });
//       toast.success('Stock transfer completed successfully!');
//       setForm({ sourceId: '', destId: '', productId: '', quantity: '', notes: '' });
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Transfer failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCreateBranch = async (e) => {
//     e.preventDefault();
//     if (!branchForm.name) {
//       toast.error('Branch name is required');
//       return;
//     }

//     try {
//       await apiClient.post('/branches', branchForm);
//       toast.success('New branch registered successfully!');
//       setBranchForm({ name: '', location: '', isWarehouse: false });
//       setShowBranchModal(false);
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create branch');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
//         <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-12">
//       {/* Header Banner with Add Branch Action */}
//       <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2">
//             <Warehouse className="h-3.5 w-3.5" /> Multi-Branch Logistics
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Stock Movement & Transfers</h1>
//           <p className="text-xs text-slate-300 mt-1">Seamlessly distribute items from Central Warehouse or stores to any active branch in Addis Ababa.</p>
//         </div>
//         <button
//           onClick={() => setShowBranchModal(true)}
//           className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.3)] shrink-0 relative z-10"
//         >
//           <Plus className="h-4 w-4" /> Register New Branch
//         </button>
//       </div>

//       {/* Transfer Form Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Transfer Submission Form */}
//         <form onSubmit={handleTransfer} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 lg:col-span-1">
//           <h2 className="font-extrabold text-sm text-[#022036] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
//             <ArrowRightLeft className="h-4 w-4 text-yellow-600" /> New Stock Movement
//           </h2>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-600">Source Location</label>
//             <select
//               value={form.sourceId}
//               onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
//               className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
//               required
//             >
//               <option value="">Select Source...</option>
//               {branches.map(b => (
//                 <option key={b.id} value={b.id}>
//                   {b.name} {b.isWarehouse ? '📦 [Central Warehouse]' : '🏪 [Retail Store]'}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-600">Destination Location</label>
//             <select
//               value={form.destId}
//               onChange={(e) => setForm({ ...form, destId: e.target.value })}
//               className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
//               required
//             >
//               <option value="">Select Destination...</option>
//               {branches.map(b => (
//                 <option key={b.id} value={b.id}>
//                   {b.name} {b.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-600">Product Item</label>
//             <select
//               value={form.productId}
//               onChange={(e) => setForm({ ...form, productId: e.target.value })}
//               className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
//               required
//             >
//               <option value="">Select Product...</option>
//               {products.map(p => (
//                 <option key={p.id} value={p.id}>
//                   {p.name} (SKU: {p.sku}) — Available: {p.stockQty}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-600">Quantity to Transfer</label>
//             <input
//               type="number"
//               min="1"
//               placeholder="e.g., 25"
//               value={form.quantity}
//               onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//               className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none font-mono bg-slate-50/50"
//               required
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-600">Transfer Notes / Reason (Optional)</label>
//             <input
//               type="text"
//               placeholder="e.g., Weekly restock for Bole branch"
//               value={form.notes}
//               onChange={(e) => setForm({ ...form, notes: e.target.value })}
//               className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
//           >
//             {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//             Execute Stock Transfer
//           </button>
//         </form>

//         {/* Audit Log Table */}
//         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
//           <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
//             <div>
//               <h3 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-2">
//                 <ClipboardList className="h-4 w-4 text-yellow-600" /> Transfer Audit History
//               </h3>
//               <p className="text-[10px] text-slate-500 mt-0.5">Immutable record of all inventory movements across system nodes.</p>
//             </div>
//             <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-mono text-xs font-bold">
//               {transfers.length} Transfers
//             </span>
//           </div>

//           <div className="overflow-x-auto flex-1">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/45 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
//                   <th className="p-4">Product Item</th>
//                   <th className="p-4">Route</th>
//                   <th className="p-4 font-mono">Moved Qty</th>
//                   <th className="p-4">Date & Time</th>
//                   <th className="p-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
//                 {transfers.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-16 text-slate-400 font-medium">
//                       No stock transfers recorded yet. Execute your first movement above.
//                     </td>
//                   </tr>
//                 ) : (
//                   transfers.map(t => (
//                     <tr key={t.id} className="hover:bg-yellow-50/20 transition-colors">
//                       <td className="p-4">
//                         <span className="font-bold block text-[#022036]">{t.product?.name}</span>
//                         <span className="text-[10px] font-mono text-slate-400">SKU: {t.product?.sku}</span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-1.5 text-xs">
//                           <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
//                             {t.sourceBranch?.name}
//                           </span>
//                           <ArrowRight className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
//                           <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
//                             {t.destBranch?.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-4 font-mono font-extrabold text-emerald-700 text-sm">
//                         +{t.quantity}
//                       </td>
//                       <td className="p-4 text-slate-500 text-[11px] font-mono">
//                         {new Date(t.createdAt).toLocaleString()}
//                       </td>
//                       <td className="p-4 text-center">
//                         <button
//                           onClick={() => setSelectedTransfer(t)}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-yellow-400 hover:text-[#022036] text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
//                         >
//                           <Eye className="h-3.5 w-3.5" /> View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Detail View Modal */}
//       {selectedTransfer && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fadeIn">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-600 font-bold">
//                   <PackageCheck className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-extrabold text-sm text-[#022036]">Transfer Manifest & Audit Details</h3>
//                   <p className="text-[10px] text-slate-400 font-mono">ID: {selectedTransfer.id}</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setSelectedTransfer(null)}
//                 className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               {/* Route Summary Box */}
//               <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
//                 <div>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">From Source</span>
//                   <span className="text-xs font-extrabold text-slate-800">{selectedTransfer.sourceBranch?.name}</span>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-yellow-400 text-[#022036] flex items-center justify-center shadow-sm shrink-0">
//                   <ArrowRightLeft className="h-4 w-4" />
//                 </div>
//                 <div className="text-right">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">To Destination</span>
//                   <span className="text-xs font-extrabold text-emerald-700">{selectedTransfer.destBranch?.name}</span>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Product Item</span>
//                   <span className="text-xs font-extrabold text-[#022036] mt-0.5 block">{selectedTransfer.product?.name}</span>
//                   <span className="text-[10px] text-slate-500 font-mono">SKU: {selectedTransfer.product?.sku}</span>
//                 </div>

//                 <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
//                   <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono block">Transferred Quantity</span>
//                   <span className="text-base font-mono font-extrabold text-emerald-800 mt-0.5 block">+{selectedTransfer.quantity} Units</span>
//                 </div>
//               </div>

//               {/* Timestamp & Notes */}
//               <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
//                 <div className="flex items-center justify-between text-slate-600">
//                   <span className="flex items-center gap-1.5 font-semibold"><Calendar className="h-4 w-4 text-slate-400" /> Executed At:</span>
//                   <span className="font-mono">{new Date(selectedTransfer.createdAt).toLocaleString()}</span>
//                 </div>

//                 <div className="flex items-start justify-between text-slate-600 pt-1">
//                   <span className="flex items-center gap-1.5 font-semibold shrink-0"><FileText className="h-4 w-4 text-slate-400" /> Notes:</span>
//                   <span className="text-right font-medium text-slate-800 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 max-w-[260px] truncate">
//                     {selectedTransfer.notes || 'No custom notes provided.'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-4 border-t border-slate-100 flex justify-end">
//               <button
//                 onClick={() => setSelectedTransfer(null)}
//                 className="px-5 py-2.5 rounded-xl bg-[#022036] hover:bg-[#021827] text-white text-xs font-extrabold shadow-md cursor-pointer"
//               >
//                 Close Manifest
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Branch Modal */}
//       {showBranchModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-2">
//                 <Building2 className="h-4 w-4 text-yellow-600" /> Register New Branch / Warehouse
//               </h3>
//               <button 
//                 onClick={() => setShowBranchModal(false)}
//                 className="text-slate-400 hover:text-black font-bold text-sm cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleCreateBranch} className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-600">Branch Name</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Piassa Branch or Warehouse B"
//                   value={branchForm.name}
//                   onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
//                   className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
//                   required
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-600">Location / Address</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Piassa, Arada, Addis Ababa"
//                   value={branchForm.location}
//                   onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
//                   className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
//                 />
//               </div>

//               <div className="flex items-center gap-2.5 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
//                 <input
//                   type="checkbox"
//                   id="isWarehouse"
//                   checked={branchForm.isWarehouse}
//                   onChange={(e) => setBranchForm({ ...branchForm, isWarehouse: e.target.checked })}
//                   className="h-4 w-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-400 cursor-pointer"
//                 />
//                 <label htmlFor="isWarehouse" className="text-xs font-bold text-slate-700 cursor-pointer">
//                   Is this a Central Storage Warehouse?
//                 </label>
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
//                 <button
//                   type="button"
//                   onClick={() => setShowBranchModal(false)}
//                   className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] text-xs font-extrabold shadow-sm cursor-pointer"
//                 >
//                   Save Branch
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// client/src/pages/inventory/TransfersPage.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { 
  ArrowRightLeft, 
  Warehouse, 
  Store, 
  Send, 
  Loader2, 
  ClipboardList, 
  Plus, 
  Building2, 
  Eye, 
  PackageCheck, 
  Calendar, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

export default function TransfersPage() {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const [form, setForm] = useState({
    sourceId: '',
    destId: '',
    productId: '',
    quantity: '',
    notes: ''
  });

  const [branchForm, setBranchForm] = useState({
    name: '',
    location: '',
    isWarehouse: false
  });

  const fetchData = async () => {
    try {
      const [branchRes, prodRes, transferRes] = await Promise.all([
        apiClient.get('/branches').catch(() => ({ data: { data: [] } })),
        apiClient.get('/products').catch(() => ({ data: { data: [] } })),
        apiClient.get('/transfers').catch(() => ({ data: { data: [] } }))
      ]);
      setBranches(branchRes.data.data || []);
      setProducts(prodRes.data.data || []);
      setTransfers(transferRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load transfer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!form.sourceId || !form.destId || !form.productId || !form.quantity) {
      toast.error('Please fill out all required fields');
      return;
    }

    if (form.sourceId === form.destId) {
      toast.error('Source and destination cannot be the same branch.');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/transfers', {
        ...form,
        quantity: Number(form.quantity)
      });
      toast.success('Stock transfer completed successfully!');
      setForm({ sourceId: '', destId: '', productId: '', quantity: '', notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name) {
      toast.error('Branch name is required');
      return;
    }

    try {
      await apiClient.post('/branches', branchForm);
      toast.success('New branch registered successfully!');
      setBranchForm({ name: '', location: '', isWarehouse: false });
      setShowBranchModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create branch');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner with Add Branch Action */}
      <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2">
            <Warehouse className="h-3.5 w-3.5" /> Multi-Branch Logistics
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Stock Movement & Transfers</h1>
          <p className="text-xs text-slate-300 mt-1">Seamlessly distribute items from Central Warehouse or stores to any active branch in Addis Ababa.</p>
        </div>
        <button
          onClick={() => setShowBranchModal(true)}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.3)] shrink-0 relative z-10"
        >
          <Plus className="h-4 w-4" /> Register New Branch
        </button>
      </div>

      {/* Transfer Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Submission Form */}
        <form onSubmit={handleTransfer} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 lg:col-span-1">
          <h2 className="font-extrabold text-sm text-[#022036] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <ArrowRightLeft className="h-4 w-4 text-yellow-600" /> New Stock Movement
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Source Location</label>
            <select
              value={form.sourceId}
              onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
              required
            >
              <option value="">Select Source...</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.isWarehouse ? '📦 [Central Warehouse]' : '🏪 [Retail Store]'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Destination Location</label>
            <select
              value={form.destId}
              onChange={(e) => setForm({ ...form, destId: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
              required
            >
              <option value="">Select Destination...</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Product Item</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
              required
            >
              <option value="">Select Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku}) — Available: {p.stockQty}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Quantity to Transfer</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 25"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none font-mono bg-slate-50/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Transfer Notes / Reason (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Weekly restock for Bole branch"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Execute Stock Transfer
          </button>
        </form>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-yellow-600" /> Transfer Audit History
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Immutable record of all inventory movements across system nodes.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-mono text-xs font-bold">
              {transfers.length} Transfers
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/45 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Product Item</th>
                  <th className="p-4">Route</th>
                  <th className="p-4 font-mono">Moved Qty</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-slate-400 font-medium">
                      No stock transfers recorded yet. Execute your first movement above.
                    </td>
                  </tr>
                ) : (
                  transfers.map(t => (
                    <tr key={t.id} className="hover:bg-yellow-50/20 transition-colors">
                      <td className="p-4">
                        <span className="font-bold block text-[#022036]">{t.product?.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">SKU: {t.product?.sku}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            {t.sourceBranch?.name}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {t.destBranch?.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-extrabold text-emerald-700 text-sm">
                        +{t.quantity}
                      </td>
                      <td className="p-4 text-slate-500 text-[11px] font-mono">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedTransfer(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-yellow-400 hover:text-[#022036] text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-600 font-bold">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#022036]">Transfer Manifest & Audit Details</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedTransfer.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTransfer(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Route Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">From Source</span>
                  <span className="text-xs font-extrabold text-slate-800">{selectedTransfer.sourceBranch?.name}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-400 text-[#022036] flex items-center justify-center shadow-sm shrink-0">
                  <ArrowRightLeft className="h-4 w-4" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">To Destination</span>
                  <span className="text-xs font-extrabold text-emerald-700">{selectedTransfer.destBranch?.name}</span>
                </div>
              </div>

              {/* Product Info & Quantities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Product Item</span>
                  <span className="text-xs font-extrabold text-[#022036] mt-0.5 block">{selectedTransfer.product?.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">SKU: {selectedTransfer.product?.sku}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono block">Transferred Quantity</span>
                  <span className="text-base font-mono font-extrabold text-emerald-800 mt-0.5 block">+{selectedTransfer.quantity} Units</span>
                </div>
              </div>

             {/* Remaining Stock Banner */}
<div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
  <div>
    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono block">Source Stock Status</span>
    <span className="text-xs font-medium text-amber-900">Remaining inventory at {selectedTransfer.sourceBranch?.name}</span>
  </div>
  <span className="text-sm font-mono font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
    {selectedTransfer.remainingSourceStock !== undefined 
      ? `${selectedTransfer.remainingSourceStock} Units Left`
      : (selectedTransfer.notes?.includes('Remaining Source Stock:') 
          ? selectedTransfer.notes.split('Remaining Source Stock:')[1].trim() + ' Units Left'
          : 'Check Current Product Stock')}
  </span>
</div>

              {/* Timestamp & Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold"><Calendar className="h-4 w-4 text-slate-400" /> Executed At:</span>
                  <span className="font-mono">{new Date(selectedTransfer.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-start justify-between text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 font-semibold shrink-0"><FileText className="h-4 w-4 text-slate-400" /> Notes:</span>
                  <span className="text-right font-medium text-slate-800 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 max-w-[260px] truncate">
                    {selectedTransfer.notes || 'No custom notes provided.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTransfer(null)}
                className="px-5 py-2.5 rounded-xl bg-[#022036] hover:bg-[#021827] text-white text-xs font-extrabold shadow-md cursor-pointer"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-2">
                <Building2 className="h-4 w-4 text-yellow-600" /> Register New Branch / Warehouse
              </h3>
              <button 
                onClick={() => setShowBranchModal(false)}
                className="text-slate-400 hover:text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g., Piassa Branch or Warehouse B"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Location / Address</label>
                <input
                  type="text"
                  placeholder="e.g., Piassa, Arada, Addis Ababa"
                  value={branchForm.location}
                  onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isWarehouse"
                  checked={branchForm.isWarehouse}
                  onChange={(e) => setBranchForm({ ...branchForm, isWarehouse: e.target.checked })}
                  className="h-4 w-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-400 cursor-pointer"
                />
                <label htmlFor="isWarehouse" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Is this a Central Storage Warehouse?
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] text-xs font-extrabold shadow-sm cursor-pointer"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}