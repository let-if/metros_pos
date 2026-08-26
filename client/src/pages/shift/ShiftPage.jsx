
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { Clock, DollarSign, ShieldAlert, CheckCircle2, AlertCircle, Loader2, Lock, Unlock, FileText, Monitor } from 'lucide-react';

// export default function ShiftPage() {
//   const [shift, setShift] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [openingFloat, setOpeningFloat] = useState('');
//   const [terminalId, setTerminalId] = useState('POS-1'); // 👈 Multi-terminal station state
//   const [closingCash, setClosingCash] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [zReport, setZReport] = useState(null);

//   const fetchActiveShift = async () => {
//     try {
//       const res = await apiClient.get('/shift/active');
//       setShift(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load shift status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveShift();
//   }, []);

//   const handleOpenShift = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const res = await apiClient.post('/shift/open', { openingFloat, terminalId });
//       toast.success(`Shift opened successfully on ${terminalId}!`);
//       setShift(res.data.data);
//       setOpeningFloat('');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to open shift');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseShift = async (e) => {
//     e.preventDefault();
//     if (!shift) return;

//     setIsSubmitting(true);
//     try {
//       const res = await apiClient.post('/shift/close', {
//         shiftId: shift.id,
//         closingCash
//       });
//       toast.success('Z-Report generated successfully!');
//       setZReport(res.data.data);
//       setShift(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to close shift');
//     } finally {
//       setIsSubmitting(false);
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
//     <div className="space-y-6 max-w-2xl mx-auto">
      
//       {/* Page Header */}
//       <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 shadow-md text-white">
//         <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//           <Clock className="h-4 w-4" /> Shift Cash Drawer & Z-Report
//         </div>
//         <h1 className="text-xl font-extrabold text-white">Register Reconciliation</h1>
//         <p className="text-xs text-slate-300 mt-0.5">Manage starting floats, physical terminal stations, and daily cash drawer audits in ETB.</p>
//       </div>

//       {/* Z-Report Summary Card if just closed */}
//       {zReport && (
//         <div className="bg-white rounded-2xl border border-yellow-500/40 p-6 shadow-xl space-y-4">
//           <div className="flex items-center justify-between border-b pb-3">
//             <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-2">
//               <FileText className="h-4 w-4 text-yellow-600" /> Z-Report Summary
//             </h3>
//             <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
//               Closed Successfully
//             </span>
//           </div>

//           <div className="space-y-2 text-xs font-mono">
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Terminal Station:</span>
//               <span className="font-bold text-[#022036]">{zReport.terminalId || 'POS-1'}</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Opening Float:</span>
//               <span className="font-bold">{Number(zReport.openingFloat).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Cash Sales:</span>
//               <span className="font-bold text-emerald-700">{(Number(zReport.expectedCash) - Number(zReport.openingFloat)).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Telebirr / Other Sales:</span>
//               <span className="font-bold text-blue-700">{Number(zReport.totalTelebirr || 0).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Total Sales Recorded:</span>
//               <span className="font-bold text-[#022036]">{Number(zReport.totalSales).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Expected Cash in Drawer:</span>
//               <span className="font-bold">{Number(zReport.expectedCash).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-1 border-b border-slate-100">
//               <span className="text-slate-500">Actual Physical Cash Counted:</span>
//               <span className="font-bold">{Number(zReport.closingCash).toFixed(2)} ETB</span>
//             </div>
//             <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl font-bold">
//               <span className="text-slate-700">Discrepancy (Short/Surplus):</span>
//               <span className={Number(zReport.discrepancy) < 0 ? 'text-red-600' : 'text-emerald-600'}>
//                 {Number(zReport.discrepancy).toFixed(2)} ETB
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={() => setZReport(null)}
//             className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer"
//           >
//             Start New Shift
//           </button>
//         </div>
//       )}

//       {/* Active Shift View or Open Shift Form */}
//       {!zReport && !shift ? (
//         <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200">
//               <Unlock className="h-6 w-6" />
//             </div>
//             <div>
//               <h3 className="font-bold text-sm text-[#022036]">No Active Shift Open</h3>
//               <p className="text-xs text-slate-500">Select your physical register terminal and starting float to begin sales.</p>
//             </div>
//           </div>

//           <form onSubmit={handleOpenShift} className="space-y-4">
//             {/* Terminal Station Selector */}
//             <div>
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Register Terminal Station</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//                   <Monitor className="h-4 w-4" />
//                 </span>
//                 <select
//                   value={terminalId}
//                   onChange={(e) => setTerminalId(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-[#022036] outline-none focus:border-yellow-500 cursor-pointer"
//                 >
//                   <option value="POS-1">Terminal Station 1 (POS-1)</option>
//                   <option value="POS-2">Terminal Station 2 (POS-2)</option>
//                   <option value="POS-3">Terminal Station 3 (POS-3)</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Starting Cash Float (ETB)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 required
//                 placeholder="e.g. 500.00"
//                 value={openingFloat}
//                 onChange={(e) => setOpeningFloat(e.target.value)}
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm disabled:opacity-50"
//             >
//               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-yellow-400" /> : 'Open Register Shift'}
//             </button>
//           </form>
//         </div>
//       ) : !zReport && shift && (
//         <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
//           <div className="flex items-center justify-between border-b pb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
//                 <Lock className="h-6 w-6" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-sm text-[#022036]">Shift Active on {shift.terminalId || 'POS-1'}</h3>
//                 <p className="text-xs text-slate-500">Opened at: {new Date(shift.openedAt).toLocaleTimeString()}</p>
//               </div>
//             </div>
//             <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
//               OPEN
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
//               <p className="text-[10px] font-bold text-slate-400 uppercase">Starting Float</p>
//               <p className="text-base font-extrabold text-[#022036] font-mono mt-1">
//                 {Number(shift.openingFloat).toFixed(2)} ETB
//               </p>
//             </div>
//             <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
//               <p className="text-[10px] font-bold text-slate-400 uppercase">Transactions This Shift</p>
//               <p className="text-base font-extrabold text-[#022036] font-mono mt-1">
//                 {shift.sales?.length || 0} Sales
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleCloseShift} className="space-y-4 pt-4 border-t border-slate-100">
//             <div>
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Physical Cash Counted in Drawer (ETB)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 required
//                 placeholder="Count cash in drawer..."
//                 value={closingCash}
//                 onChange={(e) => setClosingCash(e.target.value)}
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
//               />
//               <p className="text-[10px] text-slate-400 mt-1">Count all physical cash notes/coins in the drawer to reconcile against system sales.</p>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-sm disabled:opacity-50"
//             >
//               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-white" /> : 'Close Shift & Generate Z-Report'}
//             </button>
//           </form>
//         </div>
//       )}

//     </div>
//   );
// }
// client/src/pages/shift/ShiftPage.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Clock, DollarSign, ShieldAlert, CheckCircle2, AlertCircle, Loader2, Lock, Unlock, FileText, Monitor, Sparkles } from 'lucide-react';

export default function ShiftPage() {
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openingFloat, setOpeningFloat] = useState('');
  const [terminalId, setTerminalId] = useState('POS-1');
  const [closingCash, setClosingCash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zReport, setZReport] = useState(null);

  const fetchActiveShift = async () => {
    try {
      const res = await apiClient.get('/shift/active');
      setShift(res.data.data);
    } catch (err) {
      toast.error('Failed to load shift status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveShift();
  }, []);

  const handleOpenShift = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/shift/open', { openingFloat, terminalId });
      toast.success(`Shift opened successfully on ${terminalId}!`);
      setShift(res.data.data);
      setOpeningFloat('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShift = async (e) => {
    e.preventDefault();
    if (!shift) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/shift/close', {
        shiftId: shift.id,
        closingCash
      });
      toast.success('Z-Report generated successfully!');
      setZReport(res.data.data);
      setShift(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close shift');
    } finally {
      setIsSubmitting(false);
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
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Shift Cash Drawer & Z-Report
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Register Reconciliation</h1>
          <p className="text-xs text-slate-300">Manage starting floats, physical terminal stations, and daily cash drawer audits in ETB.</p>
        </div>
      </div>

      {/* Z-Report Summary Card if just closed */}
      {zReport && (
        <div className="bg-white rounded-3xl border border-yellow-500/40 p-6 sm:p-8 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-sm sm:text-base text-[#022036] flex items-center gap-2">
              <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-600">
                <FileText className="h-4 w-4" />
              </div>
              Z-Report Summary
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
              Closed Successfully
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Terminal Station:</span>
              <span className="font-extrabold text-[#022036]">{zReport.terminalId || 'POS-1'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Opening Float:</span>
              <span className="font-bold">{Number(zReport.openingFloat).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Cash Sales:</span>
              <span className="font-bold text-emerald-700">{(Number(zReport.expectedCash) - Number(zReport.openingFloat)).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Telebirr / Other Sales:</span>
              <span className="font-bold text-blue-700">{Number(zReport.totalTelebirr || 0).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Sales Recorded:</span>
              <span className="font-extrabold text-[#022036]">{Number(zReport.totalSales).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Expected Cash in Drawer:</span>
              <span className="font-bold">{Number(zReport.expectedCash).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Actual Physical Cash Counted:</span>
              <span className="font-bold">{Number(zReport.closingCash).toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between py-3 bg-slate-50 px-4 rounded-2xl font-bold border border-slate-200/60 shadow-2xs">
              <span className="text-slate-700">Discrepancy (Short/Surplus):</span>
              <span className={Number(zReport.discrepancy) < 0 ? 'text-red-600' : 'text-emerald-600'}>
                {Number(zReport.discrepancy).toFixed(2)} ETB
              </span>
            </div>
          </div>

          <button
            onClick={() => setZReport(null)}
            className="w-full py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md border border-yellow-400/40 transform hover:-translate-y-0.5"
          >
            Start New Shift
          </button>
        </div>
      )}

      {/* Active Shift View or Open Shift Form */}
      {!zReport && !shift ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-2xs">
              <Unlock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#022036]">No Active Shift Open</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select your physical register terminal and starting float to begin sales.</p>
            </div>
          </div>

          <form onSubmit={handleOpenShift} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Register Terminal Station</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Monitor className="h-4 w-4" />
                </span>
                <select
                  value={terminalId}
                  onChange={(e) => setTerminalId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs font-bold text-[#022036] outline-none focus:border-yellow-500 shadow-2xs cursor-pointer"
                >
                  <option value="POS-1">Terminal Station 1 (POS-1)</option>
                  <option value="POS-2">Terminal Station 2 (POS-2)</option>
                  <option value="POS-3">Terminal Station 3 (POS-3)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Starting Cash Float (ETB)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 500.00"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036] shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md disabled:opacity-50 border border-yellow-400/40 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-yellow-400" /> : 'Open Register Shift'}
            </button>
          </form>
        </div>
      ) : !zReport && shift && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#022036]">Shift Active on {shift.terminalId || 'POS-1'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Opened at: {new Date(shift.openedAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
              OPEN
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Starting Float</p>
              <p className="text-base sm:text-lg font-extrabold text-[#022036] font-mono tracking-tight mt-1">
                {Number(shift.openingFloat).toFixed(2)} ETB
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Transactions This Shift</p>
              <p className="text-base sm:text-lg font-extrabold text-[#022036] font-mono tracking-tight mt-1">
                {shift.sales?.length || 0} Sales
              </p>
            </div>
          </div>

          <form onSubmit={handleCloseShift} className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Physical Cash Counted in Drawer (ETB)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Count cash in drawer..."
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036] shadow-2xs"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Count all physical cash notes/coins in the drawer to reconcile against system sales.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-md disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-white" /> : 'Close Shift & Generate Z-Report'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}