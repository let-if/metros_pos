// // client/src/components/DailyOverviewBanner.jsx
// import { useState, useEffect } from 'react';
// import { apiClient } from '../api/axiosConfig';
// import { TrendingUp, ShoppingCart, AlertTriangle, CreditCard, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

// export default function DailyOverviewBanner() {
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOverview = async () => {
//       try {
//         const res = await apiClient.get('/overview/daily');
//         setOverview(res.data.data);
//       } catch (err) {
//         console.error('Failed to load daily overview');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOverview();
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-[#022036] rounded-2xl p-4 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-xs gap-2">
//         <Loader2 className="h-4 w-4 animate-spin" /> Loading daily shift overview...
//       </div>
//     );
//   }

//   if (!overview) return null;

//   const isAdmin = overview.role === 'ADMIN';

//   return (
//     <div className="bg-[#022036] rounded-2xl border border-yellow-500/40 p-5 shadow-lg text-white relative overflow-hidden">
//       {/* Background Glow Accent */}
//       <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-yellow-500/20">
//         <div className="flex items-center gap-2.5">
//           <div className="p-2 rounded-xl bg-yellow-500 text-[#022036]">
//             <Sparkles className="h-4 w-4" />
//           </div>
//           <div>
//             <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
//               MeretPOS Daily Shift Overview
//               <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-mono">
//                 {overview.role} MODE
//               </span>
//             </h3>
//             <p className="text-[11px] text-slate-300">
//               {isAdmin ? 'Store-wide financial & inventory snapshot for today' : 'Your personal shift performance recorded today'}
//             </p>
//           </div>
//         </div>

//         <div className="text-xs font-mono text-yellow-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
//           📅 Date: {overview.date}
//         </div>
//       </div>

//       {/* Metric Cards Grid */}
//       <div className={`grid grid-cols-1 ${isAdmin ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
        
//         {/* Today's Revenue / Sales */}
//         <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//               {isAdmin ? "Today's Total Revenue" : "My Sales Today"}
//             </p>
//             <p className="text-base font-extrabold text-yellow-400 font-mono mt-0.5">
//               {Number(overview.todayRevenue).toFixed(2)} ETB
//             </p>
//             <p className="text-[10px] text-slate-300 mt-0.5">{overview.todaySalesCount} transactions completed</p>
//           </div>
//           <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
//             <TrendingUp className="h-5 w-5" />
//           </div>
//         </div>

//         {/* Admin Metric 1: Low Stock Alerts */}
//         {isAdmin && (
//           <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Stock Warnings</p>
//               <p className="text-base font-extrabold text-red-400 font-mono mt-0.5">
//                 {overview.lowStockCount} Items
//               </p>
//               <p className="text-[10px] text-slate-300 mt-0.5">Requires immediate restock</p>
//             </div>
//             <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
//               <AlertTriangle className="h-5 w-5" />
//             </div>
//           </div>
//         )}

//         {/* Admin Metric 2: Total Yeketena Credit Debt */}
//         {isAdmin && (
//           <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Yeketena Debt</p>
//               <p className="text-base font-extrabold text-yellow-300 font-mono mt-0.5">
//                 {Number(overview.totalOutstandingCredit).toFixed(2)} ETB
//               </p>
//               <p className="text-[10px] text-slate-300 mt-0.5">Customer credit ledger balance</p>
//             </div>
//             <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
//               <CreditCard className="h-5 w-5" />
//             </div>
//           </div>
//         )}

//         {/* Cashier Quick Prompt */}
//         {!isAdmin && (
//           <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shift Status</p>
//               <p className="text-sm font-extrabold text-emerald-400 mt-1">
//                 Active & Recording
//               </p>
//               <p className="text-[10px] text-slate-300 mt-0.5">Keep up the great work!</p>
//             </div>
//             <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
//               <ShoppingCart className="h-5 w-5" />
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
// client/src/components/DailyOverviewBanner.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';
import { TrendingUp, ShoppingCart, AlertTriangle, CreditCard, Sparkles, Loader2, Calendar } from 'lucide-react';

export default function DailyOverviewBanner() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiClient.get('/overview/daily');
        setOverview(res.data.data);
      } catch (err) {
        console.error('Failed to load daily overview');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#022036] rounded-2xl p-6 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-xs gap-2.5 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin text-yellow-400" /> Loading daily shift overview...
      </div>
    );
  }

  if (!overview) return null;

  const isAdmin = overview.role === 'ADMIN';

  return (
    <div className="bg-[#022036] rounded-3xl border border-yellow-500/40 p-6 sm:p-7 shadow-xl text-white relative overflow-hidden">
      {/* Background Glow Ambient Accent */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-yellow-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-yellow-400 text-[#022036] shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2.5 tracking-tight">
              MeretPOS Daily Shift Overview
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-mono font-bold shadow-2xs">
                {overview.role} MODE
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAdmin ? 'Store-wide financial & inventory snapshot for today' : 'Your personal shift performance recorded today'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-yellow-300 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 w-fit backdrop-blur-md shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-yellow-400" /> Date: {overview.date}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 relative z-10`}>
        
        {/* Today's Revenue / Sales */}
        <div className="bg-white/5 hover:bg-white/10 transition-all rounded-2xl p-4.5 border border-white/10 flex items-center justify-between group shadow-sm">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {isAdmin ? "Today's Total Revenue" : "My Sales Today"}
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-yellow-400 font-mono tracking-tight mt-0.5">
              {Number(overview.todayRevenue).toFixed(2)} <span className="text-xs font-semibold text-slate-300">ETB</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-1 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {overview.todaySalesCount} transactions completed
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Admin Metric 1: Low Stock Alerts */}
        {isAdmin && (
          <div className="bg-white/5 hover:bg-white/10 transition-all rounded-2xl p-4.5 border border-white/10 flex items-center justify-between group shadow-sm">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Low Stock Warnings</p>
              <p className="text-lg sm:text-xl font-extrabold text-red-400 font-mono tracking-tight mt-0.5">
                {overview.lowStockCount} <span className="text-xs font-semibold text-slate-300">Items</span>
              </p>
              <p className="text-[11px] text-slate-300 mt-1 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
                Requires immediate restock
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Admin Metric 2: Total Yeketena Credit Debt */}
        {isAdmin && (
          <div className="bg-white/5 hover:bg-white/10 transition-all rounded-2xl p-4.5 border border-white/10 flex items-center justify-between group shadow-sm">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Outstanding Yeketena Debt</p>
              <p className="text-lg sm:text-xl font-extrabold text-yellow-300 font-mono tracking-tight mt-0.5">
                {Number(overview.totalOutstandingCredit).toFixed(2)} <span className="text-xs font-semibold text-slate-300">ETB</span>
              </p>
              <p className="text-[11px] text-slate-300 mt-1 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                Customer credit ledger balance
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 group-hover:scale-110 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Cashier Quick Prompt */}
        {!isAdmin && (
          <div className="bg-white/5 hover:bg-white/10 transition-all rounded-2xl p-4.5 border border-white/10 flex items-center justify-between group shadow-sm">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Shift Status</p>
              <p className="text-base sm:text-lg font-extrabold text-emerald-400 tracking-tight mt-1">
                Active & Recording
              </p>
              <p className="text-[11px] text-slate-300 mt-1 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Keep up the great work!
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}