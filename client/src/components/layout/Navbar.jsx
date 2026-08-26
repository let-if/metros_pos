
// import { ShieldCheck, UserCheck, Bell, Sparkles } from 'lucide-react';

// export default function Navbar() {
//   const user = JSON.parse(localStorage.getItem('meret_user') || '{"fullName": "Merchant User", "role": "CASHIER"}');
//   const isAdmin = user.role === 'ADMIN';

//   return (
//     <header className="bg-white border-b border-yellow-500/20 px-6 py-4 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.04)] sticky top-0 z-30 backdrop-blur-md">
      
//       {/* Left Context / Welcome Message */}
//       <div className="flex items-center gap-3.5">
//         <div className="h-10 w-10 rounded-xl bg-[#022036] border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)] transform hover:scale-105 transition-transform">
//           <Sparkles className="h-4 w-4 text-yellow-400" />
//         </div>
//         <div>
//           <h2 className="text-sm font-extrabold text-[#022036] tracking-tight flex items-center gap-1.5">
//             Welcome back, <span className="text-amber-600">{user.fullName}</span>
//           </h2>
//           <p className="text-[11px] text-slate-500 font-medium font-mono">
//             MeretPOS Register &bull; <span className="text-emerald-600 font-bold">Currency: ETB (Birr)</span>
//           </p>
//         </div>
//       </div>

//       {/* Right Role-Based Indicators & Actions */}
//       <div className="flex items-center gap-3.5">
        
//         {/* Role Badge Pill */}
//         <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold shadow-2xs transition-all ${
//           isAdmin 
//             ? 'bg-[#022036] border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.25)]' 
//             : 'bg-blue-50 border-blue-200 text-blue-700'
//         }`}>
//           {isAdmin ? <ShieldCheck className="h-3.5 w-3.5 text-yellow-400" /> : <UserCheck className="h-3.5 w-3.5 text-blue-600" />}
//           <span>{isAdmin ? 'Admin Full Access' : 'Cashier Mode'}</span>
//         </div>

//         {/* Notification Bell with Shining Hover */}
//         <button className="relative p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[#022036] hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-amber-600 transition-all cursor-pointer shadow-2xs group">
//           <Bell className="h-4 w-4 transform group-hover:rotate-12 transition-transform" />
//           <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500 ring-2 ring-white animate-pulse" />
//         </button>

//       </div>
//     </header>
//   );
// }
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Bell, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('meret_user') || '{"fullName": "Merchant User", "role": "CASHIER"}');
  const isAdmin = user.role === 'ADMIN';

  const fetchAlerts = async () => {
    try {
      const res = await apiClient.get('/products');
      const products = res.data.data || [];
      const lowStock = products.filter(p => p.stockQty <= (p.lowStockAlert || 5));
      setLowStockItems(lowStock);
    } catch (err) {
      console.error('Failed to load navbar alert notifications');
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-yellow-500/20 px-6 py-4 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.04)] sticky top-0 z-30 backdrop-blur-md">
      
      {/* Left Context / Welcome Message */}
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-[#022036] border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)] transform hover:scale-105 transition-transform">
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#022036] tracking-tight flex items-center gap-1.5">
            Welcome back, <span className="text-amber-600">{user.fullName}</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium font-mono">
            MeretPOS Register &bull; <span className="text-emerald-600 font-bold">Currency: ETB (Birr)</span>
          </p>
        </div>
      </div>

      {/* Right Role-Based Indicators & Actions */}
      <div className="flex items-center gap-3.5 relative">
        
        {/* Role Badge Pill */}
        <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold shadow-2xs transition-all ${
          isAdmin 
            ? 'bg-[#022036] border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.25)]' 
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {isAdmin ? <ShieldCheck className="h-3.5 w-3.5 text-yellow-400" /> : <UserCheck className="h-3.5 w-3.5 text-blue-600" />}
          <span>{isAdmin ? 'Admin Full Access' : 'Cashier Mode'}</span>
        </div>

        {/* Interactive Notification Bell with Live Drawer */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[#022036] hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-amber-600 transition-all cursor-pointer shadow-2xs group flex items-center justify-center"
            title="Low-Stock Alerts"
          >
            <Bell className="h-4 w-4 transform group-hover:rotate-12 transition-transform" />
            {lowStockItems.length > 0 ? (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white font-mono text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                {lowStockItems.length}
              </span>
            ) : (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Drawer */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-yellow-500/30 shadow-2xl overflow-hidden z-50 animate-fadeIn text-left">
              <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30">
                <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 text-yellow-400">
                  <AlertTriangle className="h-4 w-4" /> Stock Restock Alerts ({lowStockItems.length})
                </h4>
                <button onClick={() => setIsDropdownOpen(false)} className="text-yellow-400 text-xs font-bold cursor-pointer hover:text-white">✕</button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
                {lowStockItems.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">All inventory levels are healthy!</p>
                  </div>
                ) : (
                  lowStockItems.map(item => (
                    <div key={item.id} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-xs text-[#022036]">{item.name}</p>
                        <p className="text-[10px] text-red-600 font-mono font-semibold mt-0.5">
                          Stock: {item.stockQty} left (Threshold: {item.lowStockAlert || 5})
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDropdownOpen(false);
                          navigate('/inventory'); // 👈 Corrected route path
                        }}
                        className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#022036] text-[10px] font-extrabold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      >
                        Restock
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/inventory'); // 👈 Corrected route path
                  }}
                  className="text-[11px] font-bold text-[#022036] hover:underline cursor-pointer"
                >
                  View Full Inventory Catalog →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}