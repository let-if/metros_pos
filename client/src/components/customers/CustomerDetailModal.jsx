
// import { useState } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { X, Award, Phone, CreditCard, Receipt, Loader2, Send } from 'lucide-react';

// export default function CustomerDetailModal({ customer, onClose, onUpdate }) {
//   const [adjustingPoints, setAdjustingPoints] = useState(false);
//   const [pointDelta, setPointDelta] = useState('');
//   const [loadingPoints, setLoadingPoints] = useState(false);

//   // SMS Text State
//   const [smsText, setSmsText] = useState('');

//   if (!customer) return null;

//   // Determine VIP Tier badge based on points
//   const getTierBadge = (pts) => {
//     if (pts >= 500) return { label: 'Gold VIP', bg: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
//     if (pts >= 100) return { label: 'Silver Member', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
//     return { label: 'Bronze Shopper', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
//   };

//   const tier = getTierBadge(customer.loyaltyPoints || 0);

//   // Manual point adjustment handler
//   const handlePointAdjustment = async (isAdd) => {
//     const val = parseInt(pointDelta);
//     if (isNaN(val) || val <= 0) {
//       toast.error('Please enter a valid point amount');
//       return;
//     }

//     setLoadingPoints(true);
//     try {
//       const finalVal = isAdd ? val : -val;
//       await apiClient.patch(`/customers/${customer.id}/points`, { pointsDelta: finalVal });
//       toast.success('Customer loyalty points updated successfully!');
//       setPointDelta('');
//       setAdjustingPoints(false);
//       if (onUpdate) onUpdate(); // Refresh parent list
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update points');
//     } finally {
//       setLoadingPoints(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-2xl w-full border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
//         {/* Header */}
//         <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shrink-0">
//           <div>
//             <div className="flex items-center gap-2">
//               <h3 className="font-extrabold text-sm text-yellow-400">{customer.fullName}</h3>
//               <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tier.bg}`}>
//                 {tier.label}
//               </span>
//             </div>
//             <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1 mt-1">
//               <Phone className="h-3 w-3" /> {customer.phone}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-yellow-400 hover:text-white text-xs font-bold cursor-pointer">✕</button>
//         </div>

//         {/* Summary Badges & Quick Action */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-slate-50 border-b border-slate-200 shrink-0">
//           <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
//                 <Award className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase">Loyalty Balance</p>
//                 <p className="text-sm font-extrabold text-[#022036] font-mono">{customer.loyaltyPoints || 0} pts</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setAdjustingPoints(!adjustingPoints)}
//               className="text-[10px] font-bold text-yellow-600 hover:underline cursor-pointer"
//             >
//               {adjustingPoints ? 'Cancel' : 'Adjust'}
//             </button>
//           </div>

//           <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
//             <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200">
//               <CreditCard className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold text-slate-400 uppercase">Yeketena Credit Owed</p>
//               <p className="text-sm font-extrabold text-red-600 font-mono">{Number(customer.totalCredit || 0).toFixed(2)} ETB</p>
//             </div>
//           </div>
//         </div>

//         {/* Manual Point Adjustment Drawer */}
//         {adjustingPoints && (
//           <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-200 flex items-center gap-2 shrink-0 text-xs">
//             <span className="font-bold text-amber-900">Manager Override Points:</span>
//             <input
//               type="number"
//               placeholder="Qty..."
//               value={pointDelta}
//               onChange={(e) => setPointDelta(e.target.value)}
//               className="w-24 rounded-lg border border-amber-300 px-2.5 py-1 text-xs bg-white font-mono outline-none"
//             />
//             <button
//               onClick={() => handlePointAdjustment(true)}
//               disabled={loadingPoints}
//               className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer shadow-2xs"
//             >
//               + Add
//             </button>
//             <button
//               onClick={() => handlePointAdjustment(false)}
//               disabled={loadingPoints}
//               className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer shadow-2xs"
//             >
//               - Deduct
//             </button>
//           </div>
//         )}

//         {/* Scrollable Content Area */}
//         <div className="flex-1 p-5 overflow-y-auto space-y-4">
          
//           {/* Direct SMS App Launcher Card */}
//           <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
//             <label className="block text-[10px] font-bold uppercase tracking-wider text-[#022036]">
//               Send Direct SMS to {customer.phone} via Phone App
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Type promo message or reward update..."
//                 value={smsText}
//                 onChange={(e) => setSmsText(e.target.value)}
//                 className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-yellow-500"
//               />
//               <a
//                 href={`sms:${customer.phone}?body=${encodeURIComponent(smsText)}`}
//                 onClick={() => toast.success(`Opening SMS app for ${customer.fullName}...`)}
//                 className="px-4 py-1.5 rounded-lg bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5 no-underline"
//               >
//                 <Send className="h-3.5 w-3.5" /> Open SMS App
//               </a>
//             </div>
//             <p className="text-[10px] text-slate-400">Clicking this will instantly launch your device's default messaging app with the number and message pre-filled.</p>
//           </div>

//           {/* Transaction History Section */}
//           <div>
//             <h4 className="font-bold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
//               <Receipt className="h-4 w-4 text-yellow-600" /> Purchase & Transaction History ({customer.sales?.length || 0})
//             </h4>

//             {!customer.sales || customer.sales.length === 0 ? (
//               <p className="text-xs text-slate-400 py-6 text-center">No recorded transactions for this customer yet.</p>
//             ) : (
//               <div className="space-y-2.5">
//                 {customer.sales.map(sale => (
//                   <div key={sale.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
//                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                       <div>
//                         <span className="font-bold text-[#022036]">{sale.receiptNo}</span>
//                         <span className="text-[10px] font-mono text-emerald-700 ml-2 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
//                           {sale.paymentMethod}
//                         </span>
//                       </div>
//                       <span className="font-mono font-extrabold text-sm text-[#022036]">{Number(sale.grandTotal).toFixed(2)} ETB</span>
//                     </div>

//                     <div className="text-[11px] text-slate-600 space-y-1">
//                       {sale.items?.map((item, i) => (
//                         <div key={i} className="flex justify-between">
//                           <span>{item.quantity}x {item.product?.name || 'Item'}</span>
//                           <span className="font-mono text-slate-500">{Number(item.totalPrice).toFixed(2)} ETB</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px] text-slate-400">
//                       <span>Fiscal No: {sale.fiscalReceiptNumber || 'N/A'}</span>
//                       <span>{new Date(sale.createdAt).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
//           <a
//             href={`tel:${customer.phone}`}
//             className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#022036]"
//           >
//             <Phone className="h-3.5 w-3.5 text-yellow-600" /> Call {customer.phone}
//           </a>
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer"
//           >
//             Close Profile
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
// client/src/components/customers/CustomerDetailModal.jsx
import { useState } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { X, Award, Phone, CreditCard, Receipt, Loader2, Send, Sparkles } from 'lucide-react';

export default function CustomerDetailModal({ customer, onClose, onUpdate }) {
  const [adjustingPoints, setAdjustingPoints] = useState(false);
  const [pointDelta, setPointDelta] = useState('');
  const [loadingPoints, setLoadingPoints] = useState(false);

  // SMS Text State
  const [smsText, setSmsText] = useState('');

  if (!customer) return null;

  // Determine VIP Tier badge based on points
  const getTierBadge = (pts) => {
    if (pts >= 500) return { label: 'Gold VIP', bg: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (pts >= 100) return { label: 'Silver Member', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Bronze Shopper', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const tier = getTierBadge(customer.loyaltyPoints || 0);

  // Manual point adjustment handler
  const handlePointAdjustment = async (isAdd) => {
    const val = parseInt(pointDelta);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid point amount');
      return;
    }

    setLoadingPoints(true);
    try {
      const finalVal = isAdd ? val : -val;
      await apiClient.patch(`/customers/${customer.id}/points`, { pointsDelta: finalVal });
      toast.success('Customer loyalty points updated successfully!');
      setPointDelta('');
      setAdjustingPoints(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update points');
    } finally {
      setLoadingPoints(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#022036] text-white p-6 flex items-center justify-between border-b border-yellow-500/30 shrink-0 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-extrabold text-base text-yellow-400 tracking-tight">{customer.fullName}</h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${tier.bg}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-1">
              <Phone className="h-3.5 w-3.5 text-yellow-400" /> {customer.phone}
            </p>
          </div>
          <button onClick={onClose} className="text-yellow-400 hover:text-white text-sm font-bold cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors">✕</button>
        </div>

        {/* Summary Badges & Quick Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-50/70 border-b border-slate-200 shrink-0">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-yellow-400 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Loyalty Balance</p>
                <p className="text-base font-extrabold text-[#022036] font-mono">{customer.loyaltyPoints || 0} pts</p>
              </div>
            </div>
            <button
              onClick={() => setAdjustingPoints(!adjustingPoints)}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              {adjustingPoints ? 'Cancel' : 'Adjust'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:border-red-300 transition-all">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Yeketena Credit Owed</p>
              <p className="text-base font-extrabold text-red-600 font-mono">{Number(customer.totalCredit || 0).toFixed(2)} ETB</p>
            </div>
          </div>
        </div>

        {/* Manual Point Adjustment Drawer */}
        {adjustingPoints && (
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center gap-3 shrink-0 text-xs animate-fadeIn">
            <span className="font-extrabold text-amber-900">Manager Override Points:</span>
            <input
              type="number"
              placeholder="Qty..."
              value={pointDelta}
              onChange={(e) => setPointDelta(e.target.value)}
              className="w-28 rounded-xl border border-amber-300 px-3 py-2 text-xs bg-white font-mono outline-none focus:ring-2 focus:ring-amber-400/30 shadow-2xs"
            />
            <button
              onClick={() => handlePointAdjustment(true)}
              disabled={loadingPoints}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 cursor-pointer shadow-sm transition-all"
            >
              + Add
            </button>
            <button
              onClick={() => handlePointAdjustment(false)}
              disabled={loadingPoints}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-700 cursor-pointer shadow-sm transition-all"
            >
              - Deduct
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Direct SMS App Launcher Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 shadow-2xs">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#022036]">
              Send Direct SMS to {customer.phone} via Phone App
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type promo message or reward update..."
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
              />
              <a
                href={`sms:${customer.phone}?body=${encodeURIComponent(smsText)}`}
                onClick={() => toast.success(`Opening SMS app for ${customer.fullName}...`)}
                className="px-5 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5 no-underline transform hover:-translate-y-0.5"
              >
                <Send className="h-3.5 w-3.5" /> Open SMS App
              </a>
            </div>
            <p className="text-[11px] text-slate-400">Clicking this will instantly launch your device's default messaging app with the number and message pre-filled.</p>
          </div>

          {/* Transaction History Section */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-2">
              <Receipt className="h-4 w-4 text-yellow-600" /> Purchase & Transaction History ({customer.sales?.length || 0})
            </h4>

            {!customer.sales || customer.sales.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">No recorded transactions for this customer yet.</p>
            ) : (
              <div className="space-y-3">
                {customer.sales.map(sale => (
                  <div key={sale.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-xs hover:border-yellow-400 transition-all">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="font-extrabold text-[#022036]">{sale.receiptNo}</span>
                        <span className="text-[10px] font-mono text-emerald-700 ml-2.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                          {sale.paymentMethod}
                        </span>
                      </div>
                      <span className="font-mono font-extrabold text-sm text-[#022036]">{Number(sale.grandTotal).toFixed(2)} ETB</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1.5">
                      {sale.items?.map((item, i) => (
                        <div key={i} className="flex justify-between font-medium">
                          <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                          <span className="font-mono text-slate-500">{Number(item.totalPrice).toFixed(2)} ETB</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                      <span>Fiscal No: {sale.fiscalReceiptNumber || 'N/A'}</span>
                      <span>{new Date(sale.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-[#022036]"
          >
            <Phone className="h-4 w-4 text-yellow-600" /> Call {customer.phone}
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}