
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { Users, Shield, Store, KeyRound, UserPlus, Lock, Unlock, Loader2, CheckCircle2, Building, Phone } from 'lucide-react';

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // New User Form State
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [pin, setPin] = useState('');
//   const [role, setRole] = useState('CASHIER');
//   const [canRefund, setCanRefund] = useState(false);
//   const [canOverridePrice, setCanOverridePrice] = useState(false);
//   const [canViewReports, setCanViewReports] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Reset PIN State
//   const [resetModalUser, setResetModalUser] = useState(null);
//   const [newPin, setNewPin] = useState('');

//   // Store Settings & ERCA Tax Profile State
//   const savedStoreConfig = JSON.parse(localStorage.getItem('meret_store_config') || '{}');
//   const [storeName, setStoreName] = useState(savedStoreConfig.storeName || 'MeretPOS Retail Shop');
//   const [storeLocation, setStoreLocation] = useState(savedStoreConfig.storeLocation || 'Bole Road, Addis Ababa');
//   const [tinNumber, setTinNumber] = useState(savedStoreConfig.tinNumber || '0012345678');
//   const [vatNo, setVatNo] = useState(savedStoreConfig.vatNo || 'VAT-987654321');
//   const [taxRate, setTaxRate] = useState('0.00');

//   const fetchUsers = async () => {
//     try {
//       const res = await apiClient.get('/users');
//       setUsers(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load team accounts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       await apiClient.post('/users', { 
//         fullName, 
//         phone, 
//         pin, 
//         role, 
//         canRefund, 
//         canOverridePrice, 
//         canViewReports 
//       });
//       toast.success('Staff account created successfully!');
//       setFullName('');
//       setPhone('');
//       setPin('');
//       setRole('CASHIER');
//       setCanRefund(false);
//       setCanOverridePrice(false);
//       setCanViewReports(false);
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create user');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleToggleStatus = async (id) => {
//     try {
//       await apiClient.patch(`/users/${id}/status`);
//       toast.success('User status updated');
//       fetchUsers();
//     } catch (err) {
//       toast.error('Failed to update status');
//     }
//   };

//   const handlePermissionToggle = async (user, permissionKey) => {
//     const updatedPermissions = {
//       canRefund: permissionKey === 'canRefund' ? !user.canRefund : user.canRefund,
//       canOverridePrice: permissionKey === 'canOverridePrice' ? !user.canOverridePrice : user.canOverridePrice,
//       canViewReports: permissionKey === 'canViewReports' ? !user.canViewReports : user.canViewReports,
//     };

//     try {
//       await apiClient.patch(`/users/${user.id}/permissions`, updatedPermissions);
//       toast.success('Staff permissions updated');
//       fetchUsers();
//     } catch (err) {
//       toast.error('Failed to update permissions');
//     }
//   };

//   const handleResetPinSubmit = async (e) => {
//     e.preventDefault();
//     if (!resetModalUser) return;

//     try {
//       await apiClient.patch(`/users/${resetModalUser.id}/reset-pin`, { newPin });
//       toast.success('PIN reset successfully');
//       setResetModalUser(null);
//       setNewPin('');
//     } catch (err) {
//       toast.error('Failed to reset PIN');
//     }
//   };

//   const handleSaveStoreProfile = () => {
//     const config = { storeName, storeLocation, tinNumber, vatNo, taxRate };
//     localStorage.setItem('meret_store_config', JSON.stringify(config));
//     toast.success('Store tax profile & receipt metadata saved successfully!');
//   };

//   return (
//     <div className="space-y-6 max-w-5xl mx-auto">
      
//       {/* Page Header */}
//       <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 shadow-md text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//             <Shield className="h-4 w-4" /> Admin Configuration Center
//           </div>
//           <h1 className="text-xl font-extrabold text-white">Settings & User Management</h1>
//           <p className="text-xs text-slate-300 mt-0.5">Manage cashier accounts, ERCA tax compliance, and granular security permissions.</p>
//         </div>

//         {/* Tab Switcher */}
//         <div className="flex bg-white/10 p-1 rounded-xl border border-white/15">
//           <button
//             onClick={() => setActiveTab('users')}
//             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
//               activeTab === 'users' ? 'bg-yellow-400 text-[#022036]' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             Team & Staff
//           </button>
//           <button
//             onClick={() => setActiveTab('store')}
//             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
//               activeTab === 'store' ? 'bg-yellow-400 text-[#022036]' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             Store & ERCA Profile
//           </button>
//         </div>
//       </div>

//       {activeTab === 'users' ? (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* LEFT: Create New Staff Form (5 Cols) */}
//           <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
//             <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
//               <UserPlus className="h-4 w-4 text-yellow-600" />
//               <h3 className="font-bold text-sm text-[#022036]">Add New Cashier / Admin</h3>
//             </div>

//             <form onSubmit={handleCreateUser} className="space-y-3">
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. Dawit Kebede"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-yellow-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. 0911223344"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-yellow-500 font-mono"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Security PIN</label>
//                 <input
//                   type="password"
//                   maxLength="6"
//                   required
//                   placeholder="4-6 digit PIN"
//                   value={pin}
//                   onChange={(e) => setPin(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-yellow-500 font-mono"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Role</label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-yellow-500 bg-white font-bold"
//                 >
//                   <option value="CASHIER">CASHIER</option>
//                   <option value="ADMIN">ADMIN</option>
//                 </select>
//               </div>

//               {/* Granular Permissions Checkboxes */}
//               {role === 'CASHIER' && (
//                 <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
//                   <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#022036]">Cashier Permissions Matrix</p>
//                   <div className="space-y-1.5 text-xs">
//                     <label className="flex items-center gap-2 cursor-pointer text-slate-700">
//                       <input 
//                         type="checkbox" 
//                         checked={canRefund} 
//                         onChange={(e) => setCanRefund(e.target.checked)} 
//                         className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                       />
//                       <span>Allow Processing Refunds</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer text-slate-700">
//                       <input 
//                         type="checkbox" 
//                         checked={canOverridePrice} 
//                         onChange={(e) => setCanOverridePrice(e.target.checked)} 
//                         className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                       />
//                       <span>Allow Price Overrides</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer text-slate-700">
//                       <input 
//                         type="checkbox" 
//                         checked={canViewReports} 
//                         onChange={(e) => setCanViewReports(e.target.checked)} 
//                         className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                       />
//                       <span>Allow Viewing Profit Reports</span>
//                     </label>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-2"
//               >
//                 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-yellow-400" /> : 'Create Account'}
//               </button>
//             </form>
//           </div>

//           {/* RIGHT: Staff Accounts List (7 Cols) */}
//           <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-100">
//               <h3 className="font-bold text-sm text-[#022036] flex items-center gap-2">
//                 <Users className="h-4 w-4 text-yellow-600" /> Registered Staff Members
//               </h3>
//               <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
//                 {users.length} Users
//               </span>
//             </div>

//             {loading ? (
//               <div className="flex justify-center py-10">
//                 <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
//               </div>
//             ) : users.length === 0 ? (
//               <p className="text-xs text-slate-400 text-center py-10">No staff accounts found.</p>
//             ) : (
//               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//                 {users.map(u => (
//                   <div key={u.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3 text-xs">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 rounded-xl bg-[#022036] text-yellow-400 font-extrabold flex items-center justify-center text-xs shadow-inner shrink-0">
//                           {u.fullName.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-bold text-[#022036]">{u.fullName}</p>
//                           <p className="text-[10px] text-slate-500 font-mono">{u.phone}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
//                           u.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-blue-50 text-blue-700 border border-blue-200'
//                         }`}>
//                           {u.role}
//                         </span>

//                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
//                           u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
//                         }`}>
//                           {u.isActive ? 'Active' : 'Disabled'}
//                         </span>

//                         <button
//                           onClick={() => setResetModalUser(u)}
//                           className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all cursor-pointer"
//                           title="Reset PIN"
//                         >
//                           <KeyRound className="h-3.5 w-3.5" />
//                         </button>

//                         <button
//                           onClick={() => handleToggleStatus(u.id)}
//                           className={`p-1.5 rounded-lg transition-all cursor-pointer ${
//                             u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
//                           }`}
//                           title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
//                         >
//                           {u.isActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Granular Permission Matrix Toggles for Cashiers */}
//                     {u.role === 'CASHIER' && (
//                       <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-[11px] text-slate-600">
//                         <label className="flex items-center gap-1.5 cursor-pointer font-medium">
//                           <input 
//                             type="checkbox" 
//                             checked={u.canRefund} 
//                             onChange={() => handlePermissionToggle(u, 'canRefund')}
//                             className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                           />
//                           Refunds
//                         </label>
//                         <label className="flex items-center gap-1.5 cursor-pointer font-medium">
//                           <input 
//                             type="checkbox" 
//                             checked={u.canOverridePrice} 
//                             onChange={() => handlePermissionToggle(u, 'canOverridePrice')}
//                             className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                           />
//                           Price Override
//                         </label>
//                         <label className="flex items-center gap-1.5 cursor-pointer font-medium">
//                           <input 
//                             type="checkbox" 
//                             checked={u.canViewReports} 
//                             onChange={() => handlePermissionToggle(u, 'canViewReports')}
//                             className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500"
//                           />
//                           View Reports
//                         </label>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>
//       ) : (
//         /* Store Profile & ERCA Tax Tab */
//         <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl mx-auto space-y-4">
//           <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
//             <Building className="h-4 w-4 text-yellow-600" />
//             <h3 className="font-bold text-sm text-[#022036]">Ethiopian ERCA / Store Tax Profile</h3>
//           </div>

//           <div className="space-y-3">
//             <div>
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Store Name (English & Amharic)</label>
//               <input
//                 type="text"
//                 value={storeName}
//                 onChange={(e) => setStoreName(e.target.value)}
//                 placeholder="e.g. MeretPOS Retail Shop / መረት ፖስ ቸርቻሪ"
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-bold text-[#022036]"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">TIN Number (የግብር ከፋይ ቁጥር)</label>
//                 <input
//                   type="text"
//                   value={tinNumber}
//                   onChange={(e) => setTinNumber(e.target.value)}
//                   placeholder="e.g. 0012345678"
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">VAT / TOT Reg No.</label>
//                 <input
//                   type="text"
//                   value={vatNo}
//                   onChange={(e) => setVatNo(e.target.value)}
//                   placeholder="e.g. VAT-987654321"
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location & Phone</label>
//               <input
//                 type="text"
//                 value={storeLocation}
//                 onChange={(e) => setStoreLocation(e.target.value)}
//                 placeholder="Bole Road, Addis Ababa | +251 911 223 344"
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-bold text-[#022036]"
//               />
//             </div>

//             <button
//               onClick={handleSaveStoreProfile}
//               className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm mt-3"
//             >
//               Save Store Tax Profile
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Reset PIN Modal */}
//       {resetModalUser && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4">
//             <div className="flex items-center justify-between border-b pb-3">
//               <h3 className="font-extrabold text-sm text-[#022036]">Reset PIN for {resetModalUser.fullName}</h3>
//               <button onClick={() => setResetModalUser(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
//             </div>

//             <form onSubmit={handleResetPinSubmit} className="space-y-3">
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">New Security PIN</label>
//                 <input
//                   type="password"
//                   maxLength="6"
//                   required
//                   placeholder="Enter new PIN..."
//                   value={newPin}
//                   onChange={(e) => setNewPin(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-yellow-500 font-mono"
//                 />
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setResetModalUser(null)}
//                   className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm"
//                 >
//                   Update PIN
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
// client/src/pages/settings/SettingsPage.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Users, Shield, Store, KeyRound, UserPlus, Lock, Unlock, Loader2, CheckCircle2, Building, Phone, Sparkles, Settings } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New User Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('CASHIER');
  const [canRefund, setCanRefund] = useState(false);
  const [canOverridePrice, setCanOverridePrice] = useState(false);
  const [canViewReports, setCanViewReports] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset PIN State
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPin, setNewPin] = useState('');

  // Store Settings & ERCA Tax Profile State
  const savedStoreConfig = JSON.parse(localStorage.getItem('meret_store_config') || '{}');
  const [storeName, setStoreName] = useState(savedStoreConfig.storeName || 'MeretPOS Retail Shop');
  const [storeLocation, setStoreLocation] = useState(savedStoreConfig.storeLocation || 'Bole Road, Addis Ababa');
  const [tinNumber, setTinNumber] = useState(savedStoreConfig.tinNumber || '0012345678');
  const [vatNo, setVatNo] = useState(savedStoreConfig.vatNo || 'VAT-987654321');
  const [taxRate, setTaxRate] = useState('0.00');

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load team accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/users', { 
        fullName, 
        phone, 
        pin, 
        role, 
        canRefund, 
        canOverridePrice, 
        canViewReports 
      });
      toast.success('Staff account created successfully!');
      setFullName('');
      setPhone('');
      setPin('');
      setRole('CASHIER');
      setCanRefund(false);
      setCanOverridePrice(false);
      setCanViewReports(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await apiClient.patch(`/users/${id}/status`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handlePermissionToggle = async (user, permissionKey) => {
    const updatedPermissions = {
      canRefund: permissionKey === 'canRefund' ? !user.canRefund : user.canRefund,
      canOverridePrice: permissionKey === 'canOverridePrice' ? !user.canOverridePrice : user.canOverridePrice,
      canViewReports: permissionKey === 'canViewReports' ? !user.canViewReports : user.canViewReports,
    };

    try {
      await apiClient.patch(`/users/${user.id}/permissions`, updatedPermissions);
      toast.success('Staff permissions updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update permissions');
    }
  };

  const handleResetPinSubmit = async (e) => {
    e.preventDefault();
    if (!resetModalUser) return;

    try {
      await apiClient.patch(`/users/${resetModalUser.id}/reset-pin`, { newPin });
      toast.success('PIN reset successfully');
      setResetModalUser(null);
      setNewPin('');
    } catch (err) {
      toast.error('Failed to reset PIN');
    }
  };

  const handleSaveStoreProfile = () => {
    const config = { storeName, storeLocation, tinNumber, vatNo, taxRate };
    localStorage.setItem('meret_store_config', JSON.stringify(config));
    toast.success('Store tax profile & receipt metadata saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">

      {/* Page Header Banner */}
      <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-2xl text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Admin Configuration Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Settings & User Management</h1>
          <p className="text-xs sm:text-sm text-slate-300">Manage cashier accounts, ERCA tax compliance, and granular security permissions.</p>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-yellow-400 text-[#022036] shadow-lg' : 'text-white hover:bg-white/10'
            }`}
          >
            Team & Staff Accounts
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'store' ? 'bg-yellow-400 text-[#022036] shadow-lg' : 'text-white hover:bg-white/10'
            }`}
          >
            Store & ERCA Profile
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Create New Staff Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-yellow-400/20 text-yellow-600 shadow-2xs">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#022036]">Add New Cashier / Admin</h3>
                <p className="text-[11px] text-slate-400">Configure credentials & security privileges</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawit Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-bold text-[#022036] shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0911223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-mono font-bold text-[#022036] shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Security PIN</label>
                <input
                  type="password"
                  maxLength="6"
                  required
                  placeholder="4-6 digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-mono font-bold text-[#022036] shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 bg-white font-extrabold text-[#022036] shadow-2xs cursor-pointer transition-all"
                >
                  <option value="CASHIER">CASHIER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              {role === 'CASHIER' && (
                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 shadow-2xs">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#022036]">Cashier Permissions Matrix</p>
                  <div className="space-y-2.5 text-xs">
                    <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-medium">
                      <input 
                        type="checkbox" 
                        checked={canRefund} 
                        onChange={(e) => setCanRefund(e.target.checked)} 
                        className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                      />
                      <span>Allow Processing Refunds</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-medium">
                      <input 
                        type="checkbox" 
                        checked={canOverridePrice} 
                        onChange={(e) => setCanOverridePrice(e.target.checked)} 
                        className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                      />
                      <span>Allow Price Overrides</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-medium">
                      <input 
                        type="checkbox" 
                        checked={canViewReports} 
                        onChange={(e) => setCanViewReports(e.target.checked)} 
                        className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                      />
                      <span>Allow Viewing Profit Reports</span>
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2 border border-yellow-400/40 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-yellow-400" /> : 'Create Staff Account'}
              </button>
            </form>
          </div>

          {/* RIGHT: Staff Accounts List (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-yellow-400/20 text-yellow-600 shadow-2xs">
                  <Users className="h-5 w-5" />
                </div>
                Registered Staff Members
              </h3>
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-extrabold shadow-2xs">
                {users.length} Active Accounts
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-20 font-medium">No staff accounts found.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {users.map(u => (
                  <div key={u.id} className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3.5 text-xs shadow-2xs hover:border-yellow-400 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-2xl bg-[#022036] text-yellow-400 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 group-hover:scale-105 transition-transform">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#022036] text-sm group-hover:text-amber-700 transition-colors">{u.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase shadow-2xs ${
                          u.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {u.role}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-2xs ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>

                        <button
                          onClick={() => setResetModalUser(u)}
                          className="p-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all cursor-pointer shadow-2xs"
                          title="Reset PIN"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                            u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {u.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Granular Permission Matrix Toggles for Cashiers */}
                    {u.role === 'CASHIER' && (
                      <div className="pt-3 border-t border-slate-200/80 flex flex-wrap gap-6 text-[11px] text-slate-600 font-semibold">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#022036] transition-colors">
                          <input 
                            type="checkbox" 
                            checked={u.canRefund} 
                            onChange={() => handlePermissionToggle(u, 'canRefund')}
                            className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                          />
                          Refunds
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#022036] transition-colors">
                          <input 
                            type="checkbox" 
                            checked={u.canOverridePrice} 
                            onChange={() => handlePermissionToggle(u, 'canOverridePrice')}
                            className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                          />
                          Price Override
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#022036] transition-colors">
                          <input 
                            type="checkbox" 
                            checked={u.canViewReports} 
                            onChange={() => handlePermissionToggle(u, 'canViewReports')}
                            className="rounded border-slate-300 text-[#022036] focus:ring-yellow-500 cursor-pointer h-4 w-4"
                          />
                          View Reports
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Store Profile & ERCA Tax Tab */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-5 animate-fadeIn">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-yellow-400/20 text-yellow-600 shadow-2xs">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#022036]">Ethiopian ERCA / Store Tax Profile</h3>
              <p className="text-[11px] text-slate-400">Configure receipt metadata and official TIN/VAT numbers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Store Name (English & Amharic)</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. MeretPOS Retail Shop / መረት ፖስ ቸርቻሪ"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-bold text-[#022036] shadow-2xs transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">TIN Number (የግብር ከፋይ ቁጥር)</label>
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  placeholder="e.g. 0012345678"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-mono font-bold text-[#022036] shadow-2xs transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">VAT / TOT Reg No.</label>
                <input
                  type="text"
                  value={vatNo}
                  onChange={(e) => setVatNo(e.target.value)}
                  placeholder="e.g. VAT-987654321"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-mono font-bold text-[#022036] shadow-2xs transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Location & Phone</label>
              <input
                type="text"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                placeholder="Bole Road, Addis Ababa | +251 911 223 344"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 font-bold text-[#022036] shadow-2xs transition-all"
              />
            </div>

            <button
              onClick={handleSaveStoreProfile}
              className="w-full py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md mt-4 border border-yellow-400/40 transform hover:-translate-y-0.5"
            >
              Save Store Tax Profile
            </button>
          </div>
        </div>
      )}

      {/* Reset PIN Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="font-extrabold text-sm text-[#022036]">Reset PIN for {resetModalUser.fullName}</h3>
              <button onClick={() => setResetModalUser(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">✕</button>
            </div>

            <form onSubmit={handleResetPinSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">New Security PIN</label>
                <input
                  type="password"
                  maxLength="6"
                  required
                  autoFocus
                  placeholder="Enter new PIN..."
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036] shadow-2xs"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}