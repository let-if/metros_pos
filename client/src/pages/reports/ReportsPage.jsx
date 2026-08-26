
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   DollarSign, 
//   PieChart, 
//   ShieldCheck, 
//   Loader2, 
//   Calendar, 
//   FileText, 
//   RefreshCw, 
//   Download, 
//   Award, 
//   Sparkles, 
//   Bot, 
//   CheckCircle2, 
//   ChevronDown, 
//   ChevronUp, 
//   Globe,
//   Building2,
//   Store,
//   Warehouse
// } from 'lucide-react';

// export default function ReportsPage() {
//   const navigate = useNavigate();
//   const [allSales, setAllSales] = useState([]);
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [timeRange, setTimeRange] = useState('all'); 
//   const [aiInsights, setAiInsights] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [language, setLanguage] = useState('en');

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem('meret_user') || '{}');
//     const isAdmin = currentUser.role === 'ADMIN';
//     const hasReportsPerm = currentUser.canViewReports === true;

//     if (!isAdmin && !hasReportsPerm) {
//       toast.error('Unauthorized: You do not have permission to view financial reports.');
//       navigate('/pos');
//     }
//   }, [navigate]);

//   const fetchReports = async (isManual = false) => {
//     if (isManual) setIsRefreshing(true);
//     else setLoading(true);

//     try {
//       const res = await apiClient.get(`/reports?range=${timeRange}`);
//       const data = res.data.data || {};
      
//       setAllSales(data.recentSales || []);
//       setReportData(data);

//       if (isManual) toast.success('Analytics updated');
//     } catch (err) {
//       toast.error('Failed to load financial analytics.');
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   const fetchAIReportInsights = async (metrics, bestSellers, range, lang) => {
//     try {
//       setAiLoading(true);
//       const res = await apiClient.post('/overview/ai-insights', {
//         todayRevenue: metrics.totalRevenue,
//         todaySalesCount: metrics.totalTransactions,
//         grossProfit: metrics.grossProfit,
//         profitMargin: metrics.profitMargin,
//         bestSellers: bestSellers.map(b => b.name),
//         timeRange: range,
//         language: lang
//       }).catch(() => null);

//       if (res?.data?.data?.insights) {
//         setAiInsights(res.data.data.insights);
//       } else {
//         if (lang === 'am') {
//           setAiInsights(`• የዚህ የጊዜ ገደብ ጠቅላላ ሽያጭ ${Number(metrics.totalRevenue).toFixed(2)} ብር ደርሷል።\n• አጠቃላይ የትርፍ ህዳግ በ ${metrics.profitMargin}% ላይ ይገኛል።\n• በადዲስ አበባ የሚገኙትን ቅርንጫፎች ክምችት በጥንቃቄ ይቆጣጠሩ።`);
//         } else {
//           setAiInsights(`• Revenue for this period stands at ${Number(metrics.totalRevenue).toFixed(2)} ETB across ${metrics.totalTransactions} transactions.\n• Gross profit margin is currently holding steady at ${metrics.profitMargin}%.\n• Maintain strict inventory oversight across all Addis Ababa branches to sustain steady cash flow.`);
//         }
//       }
//     } catch (e) {
//       setAiInsights(lang === 'am' ? '• እቃዎችን በወቅቱ ይቆጣጠሩ።' : '• Monitor stock levels regularly.');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [timeRange]);

//   useEffect(() => {
//     if (reportData?.metrics && reportData?.bestSellers) {
//       fetchAIReportInsights(reportData.metrics, reportData.bestSellers, timeRange, language);
//     }
//   }, [language]);

//   const exportToCSV = () => {
//     const sales = reportData?.recentSales || [];
//     if (sales.length === 0) {
//       toast.error('No data available to export');
//       return;
//     }

//     const headers = ['Receipt No,Branch,Payment Method,Customer,Cashier,Grand Total (ETB),Timestamp'];
//     const rows = sales.map(s => 
//       `"${s.receiptNo}","${s.branch?.name || 'General'}","${s.paymentMethod}","${s.customer?.fullName || 'Walk-in'}","${s.cashier?.fullName || 'Staff'}","${Number(s.grandTotal || s.totalAmount).toFixed(2)}","${new Date(s.createdAt).toLocaleString()}"`
//     );

//     const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', `MeretPOS_Financial_Report_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success('Report spreadsheet downloaded successfully!');
//   };

//   if (loading && !reportData) {
//     return (
//       <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
//         <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
//       </div>
//     );
//   }

//   const metrics = reportData?.metrics || { totalRevenue: 0, grossProfit: 0, profitMargin: '0.0', totalTransactions: 0 };
//   const paymentBreakdown = reportData?.paymentBreakdown || { CASH: 0, TELEBIRR: 0, CREDIT: 0 };
//   const bestSellers = reportData?.bestSellers || [];
//   const salesHistory = reportData?.recentSales || [];
//   const branchPerformance = reportData?.branchPerformance || [];

//   return (
//     <div className="space-y-6 pb-12">
      
//       {/* Branded Header Banner */}
//       <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
//         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

//         <div className="relative z-10 space-y-1">
//           <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//             <Sparkles className="h-4 w-4 animate-pulse" /> Multi-Branch Financial & Profit Analytics
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Revenue, Profit & Branch Performance</h1>
//           <p className="text-xs text-slate-300">Comprehensive financial audit and location-based metrics calculated in Birr (ETB).</p>
//         </div>

//         <div className="relative z-10 flex items-center gap-3">
//           <button
//             onClick={exportToCSV}
//             className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xs"
//           >
//             <Download className="h-3.5 w-3.5 text-yellow-400" /> Export CSV
//           </button>
//           <button
//             onClick={() => fetchReports(true)}
//             disabled={isRefreshing}
//             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-md disabled:opacity-50"
//           >
//             <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Date Range Filter Pills */}
//       <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
//         {[
//           { id: 'today', label: 'Today' },
//           { id: 'week', label: 'Past 7 Days' },
//           { id: 'month', label: 'This Month' },
//           { id: 'all', label: 'All Time' },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setTimeRange(tab.id)}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//               timeRange === tab.id
//                 ? 'bg-[#022036] text-yellow-400 shadow-sm'
//                 : 'text-slate-600 hover:bg-slate-50'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* 🤖 GEMINI AI FINANCIAL ADVISOR BANNER */}
//       <div className="bg-white rounded-3xl border-2 border-yellow-400/60 p-6 sm:p-8 shadow-xl text-[#022036] relative overflow-hidden space-y-5">
//         <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 relative z-10">
//           <div className="flex items-center gap-3">
//             <div className="p-3 rounded-2xl bg-yellow-400 text-[#022036] shadow-md flex items-center justify-center">
//               <Bot className="h-5 w-5" />
//             </div>
//             <div>
//               <h2 className="text-base sm:text-lg font-extrabold text-[#022036] tracking-tight flex items-center gap-2">
//                 Gemini AI Financial & Profitability Advisor
//                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
//               </h2>
//               <p className="text-xs text-slate-500 font-medium">
//                 {language === 'am' ? 'የንግድ ትንተና እና የገንዘብ ነክ ምክሮች' : `Automated revenue audit and strategic retail optimization for selected range (${timeRange})`}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
//               <button
//                 onClick={() => setLanguage('en')}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
//                   language === 'en' ? 'bg-[#022036] text-yellow-400 shadow-xs' : 'text-slate-600 hover:text-black'
//                 }`}
//               >
//                 🇬🇧 EN
//               </button>
//               <button
//                 onClick={() => setLanguage('am')}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
//                   language === 'am' ? 'bg-[#022036] text-yellow-400 shadow-xs' : 'text-slate-600 hover:text-black'
//                 }`}
//               >
//                 🇪🇹 አማርኛ
//               </button>
//             </div>

//             <span className="px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-300 font-mono text-[10px] font-bold uppercase tracking-wider">
//               {aiLoading ? (language === 'am' ? 'በመተንተን ላይ...' : 'Analyzing...') : (language === 'am' ? 'ቀጥታ ትንተና' : 'Live Analysis')}
//             </span>
//           </div>
//         </div>

//         <div className="relative z-10 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-inner space-y-3">
//           {aiLoading ? (
//             <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-xs font-medium">
//               <Loader2 className="h-4 w-4 animate-spin text-yellow-600" /> 
//               {language === 'am' ? 'የገንዘብ ነክ ምክሮችን በማዘጋጀት ላይ...' : 'Generating financial insights...'}
//             </div>
//           ) : (
//             <div 
//               className={`text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line transition-all duration-300 overflow-hidden ${!isExpanded ? 'max-h-24' : 'max-h-[1000px]'}`}
//               style={{
//                 fontFamily: language === 'am' ? '"Noto Sans Ethiopic", "Abyssinica SIL", sans-serif' : 'inherit',
//                 fontWeight: language === 'am' ? '500' : 'normal'
//               }}
//             >
//               {aiInsights || (language === 'am' ? 'የፋይናንስ ጤናማነትን በመተንተን ላይ...' : 'Analyzing financial health and sales performance...')}
//             </div>
//           )}

//           {!isExpanded && !aiLoading && (
//             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-2xl" />
//           )}
//         </div>

//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 pt-1">
//           <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
//             <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
//             {language === 'am' ? 'ምክሮቹ ከተጣሩ የሽያጭ እና የትርፍ መረጃዎች የተገኙ ናቸው።' : 'Insights derived from filtered revenue, profit margins, and best-sellers.'}
//           </div>

//           <button
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] font-extrabold text-xs shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer ml-auto sm:ml-0"
//           >
//             {isExpanded ? (
//               <>{language === 'am' ? 'አሳንስ (Show Less)' : 'Show Less'} <ChevronUp className="h-4 w-4" /></>
//             ) : (
//               <>{language === 'am' ? 'አሳይ (Show More)' : 'Show More'} <ChevronDown className="h-4 w-4" /></>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* KPI Stat Cards Grid with Restored Sparklines */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
//         {/* Total Revenue */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
//           <div className="flex items-center justify-between text-slate-500 mb-2">
//             <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Revenue</span>
//             <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-110 transition-transform">
//               <DollarSign className="h-4 w-4" />
//             </div>
//           </div>
//           <div>
//             <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
//               {Number(metrics.totalRevenue).toFixed(2)} <span className="text-xs font-semibold text-slate-400">ETB</span>
//             </p>
//             <div className="mt-3 h-8 w-full">
//               <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
//                 <path d="M0,20 Q25,5 50,15 T100,2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
//                 <path d="M0,20 Q25,5 50,15 T100,2 L100,25 L0,25 Z" fill="#10b981" opacity="0.1" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Gross Profit */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
//           <div className="flex items-center justify-between text-slate-500 mb-2">
//             <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Gross Profit</span>
//             <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:scale-110 transition-transform">
//               <TrendingUp className="h-4 w-4" />
//             </div>
//           </div>
//           <div>
//             <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">
//               {Number(metrics.grossProfit).toFixed(2)} <span className="text-xs font-semibold text-slate-400">ETB</span>
//             </p>
//             <div className="mt-3 h-8 w-full">
//               <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
//                 <path d="M0,18 Q30,10 60,8 T100,1" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
//                 <path d="M0,18 Q30,10 60,8 T100,1 L100,25 L0,25 Z" fill="#3b82f6" opacity="0.1" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Profit Margin */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
//           <div className="flex items-center justify-between text-slate-500 mb-2">
//             <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profit Margin</span>
//             <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-110 transition-transform">
//               <ShieldCheck className="h-4 w-4" />
//             </div>
//           </div>
//           <div>
//             <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
//               {metrics.profitMargin}%
//             </p>
//             <div className="mt-3 h-8 w-full">
//               <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
//                 <path d="M0,15 Q20,18 50,10 T100,4" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
//                 <path d="M0,15 Q20,18 50,10 T100,4 L100,25 L0,25 Z" fill="#f59e0b" opacity="0.1" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Total Transactions */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
//           <div className="flex items-center justify-between text-slate-500 mb-2">
//             <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Transactions</span>
//             <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 group-hover:scale-110 transition-transform">
//               <FileText className="h-4 w-4" />
//             </div>
//           </div>
//           <div>
//             <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
//               {metrics.totalTransactions} <span className="text-xs font-semibold text-slate-400">Sales</span>
//             </p>
//             <div className="mt-3 h-8 w-full">
//               <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
//                 <path d="M0,22 Q35,12 70,15 T100,3" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
//                 <path d="M0,22 Q35,12 70,15 T100,3 L100,25 L0,25 Z" fill="#a855f7" opacity="0.1" />
//               </svg>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* 🏢 BRANCH PERFORMANCE BREAKDOWN SECTION */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-sm font-extrabold text-[#022036] uppercase tracking-wider flex items-center gap-2">
//               <Building2 className="h-4 w-4 text-yellow-600" /> Branch & Warehouse Performance Breakdown
//             </h2>
//             <p className="text-xs text-slate-500">Live revenue and inventory valuation tracked per Addis Ababa store and warehouse location.</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {branchPerformance.map((branch) => (
//             <div key={branch.branchId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative overflow-hidden group hover:border-yellow-400 transition-all">
//               <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-400/10 rounded-bl-full pointer-events-none" />

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold ${
//                     branch.isWarehouse ? 'bg-[#022036] text-yellow-400' : 'bg-yellow-400 text-[#022036]'
//                   }`}>
//                     {branch.isWarehouse ? <Warehouse className="h-5 w-5" /> : <Store className="h-5 w-5" />}
//                   </div>
//                   <div>
//                     <h3 className="font-extrabold text-sm text-[#022036]">{branch.branchName}</h3>
//                     <span className="text-[10px] font-mono text-slate-400">{branch.location}</span>
//                   </div>
//                 </div>
//                 <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-extrabold uppercase ${
//                   branch.isWarehouse ? 'bg-[#022036] text-yellow-400' : 'bg-emerald-100 text-emerald-800'
//                 }`}>
//                   {branch.isWarehouse ? 'Warehouse' : 'Store'}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 pt-2">
//                 <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Branch Revenue</span>
//                   <span className="text-sm font-mono font-extrabold text-emerald-700 mt-0.5 block">
//                     {branch.totalRevenue.toLocaleString()} ETB
//                   </span>
//                 </div>

//                 <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Stock Value</span>
//                   <span className="text-sm font-mono font-extrabold text-[#022036] mt-0.5 block">
//                     {branch.stockValuation.toLocaleString()} ETB
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
//                 <span>Transactions: <strong className="text-[#022036]">{branch.totalTransactions}</strong></span>
//                 <span>Units in Stock: <strong className="text-[#022036] font-mono">{branch.totalItemsInStock}</strong></span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Two Columns: Payment Breakdown & Best-Selling Leaderboard */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
//         {/* Payment Method Breakdown */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
//           <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#022036] mb-5 flex items-center gap-2">
//             <PieChart className="h-4 w-4 text-yellow-600" /> Revenue Split by Payment Method
//           </h3>
//           <div className="space-y-3.5">
//             {Object.entries(paymentBreakdown).map(([method, amount]) => {
//               const totalRev = Number(metrics.totalRevenue) || 1;
//               const percentage = Math.min(100, Math.round((Number(amount) / totalRev) * 100));
//               return (
//                 <div key={method} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 shadow-2xs">
//                   <div className="flex justify-between items-center text-xs">
//                     <span className="font-extrabold text-slate-700">{method}</span>
//                     <span className="font-mono font-extrabold text-[#022036]">{Number(amount).toFixed(2)} ETB ({percentage}%)</span>
//                   </div>
//                   <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Best-Selling Products Leaderboard */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
//           <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#022036] mb-5 flex items-center gap-2">
//             <Award className="h-4 w-4 text-yellow-600" /> Best-Selling Items Leaderboard
//           </h3>
//           {bestSellers.length === 0 ? (
//             <p className="text-xs text-slate-400 py-6 text-center font-medium">No product sales data for this period.</p>
//           ) : (
//             <div className="space-y-3">
//               {bestSellers.map((item, idx) => (
//                 <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs shadow-2xs hover:border-yellow-400 transition-all">
//                   <div className="flex items-center gap-3">
//                     <span className="h-6 w-6 rounded-full bg-yellow-400 text-[#022036] font-extrabold text-[10px] flex items-center justify-center shadow-2xs">
//                       {idx + 1}
//                     </span>
//                     <span className="font-bold text-[#022036]">{item.name}</span>
//                   </div>
//                   <div className="text-right font-mono">
//                     <span className="font-extrabold text-emerald-700">{Number(item.revenue).toFixed(2)} ETB</span>
//                     <span className="text-[10px] text-slate-400 ml-2">({item.quantity} sold)</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>

//       {/* Financial Audit Transaction History Table */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//         <div className="p-4.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
//           <h3 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider">Detailed Financial Transaction Audit Log</h3>
//           <span className="text-[10px] text-slate-400 font-mono">Showing {salesHistory.length} records</span>
//         </div>
//         {salesHistory.length === 0 ? (
//           <div className="text-center py-20 text-slate-400 text-xs font-medium">No sales recorded for this date range.</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
//                   <th className="p-4.5">Receipt No</th>
//                   <th className="p-4.5">Branch Location</th>
//                   <th className="p-4.5">Payment Method</th>
//                   <th className="p-4.5">Customer</th>
//                   <th className="p-4.5">Cashier</th>
//                   <th className="p-4.5 font-mono">Grand Total (ETB)</th>
//                   <th className="p-4.5">Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
//                 {salesHistory.map(sale => (
//                   <tr key={sale.id} className="hover:bg-yellow-50/30 transition-colors group">
//                     <td className="p-4.5 font-bold font-mono text-[#022036] group-hover:text-amber-700 transition-colors">{sale.receiptNo}</td>
//                     <td className="p-4.5">
//                       <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
//                         {sale.branch?.name || 'General'}
//                       </span>
//                     </td>
//                     <td className="p-4.5">
//                       <span className="px-3 py-1 rounded-full bg-slate-100 text-[#022036] text-[10px] font-extrabold border border-slate-200 shadow-2xs">
//                         {sale.paymentMethod}
//                       </span>
//                     </td>
//                     <td className="p-4.5 text-slate-600 font-medium">{sale.customer?.fullName || 'Walk-in Customer'}</td>
//                     <td className="p-4.5 text-slate-600 font-medium">{sale.cashier?.fullName || 'Staff'}</td>
//                     <td className="p-4.5 font-mono font-extrabold text-emerald-700 text-sm">
//                       {Number(sale.grandTotal || sale.totalAmount).toFixed(2)} ETB
//                     </td>
//                     <td className="p-4.5 text-slate-400 font-mono text-[10px]">
//                       {new Date(sale.createdAt).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Loader2, 
  Calendar, 
  FileText, 
  RefreshCw, 
  Download, 
  Award, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Globe,
  Building2,
  Store,
  Warehouse
} from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [allSales, setAllSales] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('all'); 
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('meret_user') || '{}');
    const isAdmin = currentUser.role === 'ADMIN';
    const hasReportsPerm = currentUser.canViewReports === true;

    if (!isAdmin && !hasReportsPerm) {
      toast.error('Unauthorized: You do not have permission to view financial reports.');
      navigate('/pos');
    }
  }, [navigate]);

  // 1. Fetch core financial data instantly without waiting for Gemini
  const fetchReports = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiClient.get(`/reports?range=${timeRange}`);
      const data = res.data.data || {};
      
      setAllSales(data.recentSales || []);
      setReportData(data);

      if (isManual) toast.success('Analytics updated');
    } catch (err) {
      toast.error('Failed to load financial analytics.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 2. Fetch Gemini AI insights asynchronously in the background using the new reports/ai-insights route
  const fetchAIReportInsights = async (metrics, bestSellers, range, lang) => {
    if (!metrics) return;
    try {
      setAiLoading(true);
      const res = await apiClient.post('/reports/ai-insights', {
        todayRevenue: metrics.totalRevenue,
        todaySalesCount: metrics.totalTransactions,
        grossProfit: metrics.grossProfit,
        profitMargin: metrics.profitMargin,
        bestSellers: bestSellers.map(b => b.name),
        timeRange: range,
        language: lang
      }).catch(() => null);

      if (res?.data?.data?.insights) {
        setAiInsights(res.data.data.insights);
      } else {
        if (lang === 'am') {
          setAiInsights(`• የዚህ የጊዜ ገደብ ጠቅላላ ሽያጭ ${Number(metrics.totalRevenue).toFixed(2)} ብር ደርሷል።\n• አጠቃላይ የትርፍ ህዳግ በ ${metrics.profitMargin}% ላይ ይገኛል።\n• በადዲስ አበባ የሚገኙትን ቅርንጫፎች ክምችት በጥንቃቄ ይቆጣጠሩ።`);
        } else {
          setAiInsights(`• Revenue for this period stands at ${Number(metrics.totalRevenue).toFixed(2)} ETB across ${metrics.totalTransactions} transactions.\n• Gross profit margin is currently holding steady at ${metrics.profitMargin}%.\n• Maintain strict inventory oversight across all Addis Ababa branches to sustain steady cash flow.`);
        }
      }
    } catch (e) {
      setAiInsights(lang === 'am' ? '• እቃዎችን በወቅቱ ይቆጣጠሩ።' : '• Monitor stock levels regularly.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  // Trigger AI fetch asynchronously whenever reportData or language updates
  useEffect(() => {
    if (reportData?.metrics && reportData?.bestSellers) {
      fetchAIReportInsights(reportData.metrics, reportData.bestSellers, timeRange, language);
    }
  }, [reportData, language]);

  const exportToCSV = () => {
    const sales = reportData?.recentSales || [];
    if (sales.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const headers = ['Receipt No,Branch,Payment Method,Customer,Cashier,Grand Total (ETB),Timestamp'];
    const rows = sales.map(s => 
      `"${s.receiptNo}","${s.branch?.name || 'General'}","${s.paymentMethod}","${s.customer?.fullName || 'Walk-in'}","${s.cashier?.fullName || 'Staff'}","${Number(s.grandTotal || s.totalAmount).toFixed(2)}","${new Date(s.createdAt).toLocaleString()}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MeretPOS_Financial_Report_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report spreadsheet downloaded successfully!');
  };

  if (loading && !reportData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const metrics = reportData?.metrics || { totalRevenue: 0, grossProfit: 0, profitMargin: '0.0', totalTransactions: 0 };
  const paymentBreakdown = reportData?.paymentBreakdown || { CASH: 0, TELEBIRR: 0, CREDIT: 0 };
  const bestSellers = reportData?.bestSellers || [];
  const salesHistory = reportData?.recentSales || [];
  const branchPerformance = reportData?.branchPerformance || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Branded Header Banner */}
      <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Multi-Branch Financial & Profit Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Revenue, Profit & Branch Performance</h1>
          <p className="text-xs text-slate-300">Comprehensive financial audit and location-based metrics calculated in Birr (ETB).</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-yellow-400" /> Export CSV
          </button>
          <button
            onClick={() => fetchReports(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Range Filter Pills */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        {[
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'Past 7 Days' },
          { id: 'month', label: 'This Month' },
          { id: 'all', label: 'All Time' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTimeRange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === tab.id
                ? 'bg-[#022036] text-yellow-400 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🤖 GEMINI AI FINANCIAL ADVISOR BANNER */}
      <div className="bg-white rounded-3xl border-2 border-yellow-400/60 p-6 sm:p-8 shadow-xl text-[#022036] relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-yellow-400 text-[#022036] shadow-md flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#022036] tracking-tight flex items-center gap-2">
                Gemini AI Financial & Profitability Advisor
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'am' ? 'የንግድ ትንተና እና የገንዘብ ነክ ምክሮች' : `Automated revenue audit and strategic retail optimization for selected range (${timeRange})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en' ? 'bg-[#022036] text-yellow-400 shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLanguage('am')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'am' ? 'bg-[#022036] text-yellow-400 shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                🇪🇹 አማርኛ
              </button>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              {aiLoading ? (language === 'am' ? 'በመተንተን ላይ...' : 'Analyzing...') : (language === 'am' ? 'ቀጥታ ትንተና' : 'Live Analysis')}
            </span>
          </div>
        </div>

        <div className="relative z-10 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-inner space-y-3">
          {aiLoading && !aiInsights ? (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-xs font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" /> 
              {language === 'am' ? 'የገንዘብ ነክ ምክሮችን በማዘጋጀት ላይ...' : 'Generating financial insights...'}
            </div>
          ) : (
            <div 
              className={`text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line transition-all duration-300 overflow-hidden ${!isExpanded ? 'max-h-24' : 'max-h-[1000px]'}`}
              style={{
                fontFamily: language === 'am' ? '"Noto Sans Ethiopic", "Abyssinica SIL", sans-serif' : 'inherit',
                fontWeight: language === 'am' ? '500' : 'normal'
              }}
            >
              {aiInsights || (language === 'am' ? 'የፋይናንስ ጤናማነትን በመተንተን ላይ...' : 'Analyzing financial health and sales performance...')}
            </div>
          )}

          {!isExpanded && !aiLoading && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-2xl" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {language === 'am' ? 'ምክሮቹ ከተጣሩ የሽያጭ እና የትርፍ መረጃዎች የተገኙ ናቸው።' : 'Insights derived from filtered revenue, profit margins, and best-sellers.'}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] font-extrabold text-xs shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer ml-auto sm:ml-0"
          >
            {isExpanded ? (
              <>{language === 'am' ? 'አሳንስ (Show Less)' : 'Show Less'} <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>{language === 'am' ? 'አሳይ (Show More)' : 'Show More'} <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid with Restored Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-110 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
              {Number(metrics.totalRevenue).toFixed(2)} <span className="text-xs font-semibold text-slate-400">ETB</span>
            </p>
            <div className="mt-3 h-8 w-full">
              <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                <path d="M0,20 Q25,5 50,15 T100,2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M0,20 Q25,5 50,15 T100,2 L100,25 L0,25 Z" fill="#10b981" opacity="0.1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Gross Profit</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {Number(metrics.grossProfit).toFixed(2)} <span className="text-xs font-semibold text-slate-400">ETB</span>
            </p>
            <div className="mt-3 h-8 w-full">
              <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                <path d="M0,18 Q30,10 60,8 T100,1" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M0,18 Q30,10 60,8 T100,1 L100,25 L0,25 Z" fill="#3b82f6" opacity="0.1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profit Margin</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
              {metrics.profitMargin}%
            </p>
            <div className="mt-3 h-8 w-full">
              <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                <path d="M0,15 Q20,18 50,10 T100,4" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M0,15 Q20,18 50,10 T100,4 L100,25 L0,25 Z" fill="#f59e0b" opacity="0.1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Transactions</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 group-hover:scale-110 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#022036] font-mono tracking-tight">
              {metrics.totalTransactions} <span className="text-xs font-semibold text-slate-400">Sales</span>
            </p>
            <div className="mt-3 h-8 w-full">
              <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                <path d="M0,22 Q35,12 70,15 T100,3" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M0,22 Q35,12 70,15 T100,3 L100,25 L0,25 Z" fill="#a855f7" opacity="0.1" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* 🏢 BRANCH PERFORMANCE BREAKDOWN SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#022036] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-yellow-600" /> Branch & Warehouse Performance Breakdown
            </h2>
            <p className="text-xs text-slate-500">Live revenue and inventory valuation tracked per Addis Ababa store and warehouse location.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branchPerformance.map((branch) => (
            <div key={branch.branchId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative overflow-hidden group hover:border-yellow-400 transition-all">
              <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-400/10 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold ${
                    branch.isWarehouse ? 'bg-[#022036] text-yellow-400' : 'bg-yellow-400 text-[#022036]'
                  }`}>
                    {branch.isWarehouse ? <Warehouse className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#022036]">{branch.branchName}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{branch.location}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-extrabold uppercase ${
                  branch.isWarehouse ? 'bg-[#022036] text-yellow-400' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {branch.isWarehouse ? 'Warehouse' : 'Store'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Branch Revenue</span>
                  <span className="text-sm font-mono font-extrabold text-emerald-700 mt-0.5 block">
                    {branch.totalRevenue.toLocaleString()} ETB
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Stock Value</span>
                  <span className="text-sm font-mono font-extrabold text-[#022036] mt-0.5 block">
                    {branch.stockValuation.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <span>Transactions: <strong className="text-[#022036]">{branch.totalTransactions}</strong></span>
                <span>Units in Stock: <strong className="text-[#022036] font-mono">{branch.totalItemsInStock}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Payment Breakdown & Best-Selling Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#022036] mb-5 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-yellow-600" /> Revenue Split by Payment Method
          </h3>
          <div className="space-y-3.5">
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const totalRev = Number(metrics.totalRevenue) || 1;
              const percentage = Math.min(100, Math.round((Number(amount) / totalRev) * 100));
              return (
                <div key={method} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-700">{method}</span>
                    <span className="font-mono font-extrabold text-[#022036]">{Number(amount).toFixed(2)} ETB ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best-Selling Products Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#022036] mb-5 flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-600" /> Best-Selling Items Leaderboard
          </h3>
          {bestSellers.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center font-medium">No product sales data for this period.</p>
          ) : (
            <div className="space-y-3">
              {bestSellers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs shadow-2xs hover:border-yellow-400 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-yellow-400 text-[#022036] font-extrabold text-[10px] flex items-center justify-center shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#022036]">{item.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-emerald-700">{Number(item.revenue).toFixed(2)} ETB</span>
                    <span className="text-[10px] text-slate-400 ml-2">({item.quantity} sold)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Financial Audit Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider">Detailed Financial Transaction Audit Log</h3>
          <span className="text-[10px] text-slate-400 font-mono">Showing {salesHistory.length} records</span>
        </div>
        {salesHistory.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs font-medium">No sales recorded for this date range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4.5">Receipt No</th>
                  <th className="p-4.5">Branch Location</th>
                  <th className="p-4.5">Payment Method</th>
                  <th className="p-4.5">Customer</th>
                  <th className="p-4.5">Cashier</th>
                  <th className="p-4.5 font-mono">Grand Total (ETB)</th>
                  <th className="p-4.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
                {salesHistory.map(sale => (
                  <tr key={sale.id} className="hover:bg-yellow-50/30 transition-colors group">
                    <td className="p-4.5 font-bold font-mono text-[#022036] group-hover:text-amber-700 transition-colors">{sale.receiptNo}</td>
                    <td className="p-4.5">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {sale.branch?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4.5">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[#022036] text-[10px] font-extrabold border border-slate-200 shadow-2xs">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4.5 text-slate-600 font-medium">{sale.customer?.fullName || 'Walk-in Customer'}</td>
                    <td className="p-4.5 text-slate-600 font-medium">{sale.cashier?.fullName || 'Staff'}</td>
                    <td className="p-4.5 font-mono font-extrabold text-emerald-700 text-sm">
                      {Number(sale.grandTotal || sale.totalAmount).toFixed(2)} ETB
                    </td>
                    <td className="p-4.5 text-slate-400 font-mono text-[10px]">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}