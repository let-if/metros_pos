
// import { useState } from 'react';
// import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Package, 
//   ShoppingCart, 
//   Users, 
//   BarChart3, 
//   Clock,
//   Settings, 
//   LogOut, 
//   Store, 
//   Menu, 
//   X,
//   UserCheck 
// } from 'lucide-react';
// import Navbar from './Navbar';

// const navItems = [
//   { name: 'Daily Overview', path: '/app', icon: LayoutDashboard, adminOnly: false },
//   { name: 'POS Checkout', path: '/pos', icon: ShoppingCart, adminOnly: false },
//   { name: 'Products & Stock', path: '/inventory', icon: Package, adminOnly: false },
//   { name: 'Customer Directory', path: '/customers', icon: UserCheck, adminOnly: false },
//   { name: 'Yeketena Credits', path: '/credit', icon: Users, adminOnly: false },
//   { name: 'Shift & Z-Report', path: '/shift', icon: Clock, adminOnly: false },
//   { name: 'Financial Reports', path: '/reports', icon: BarChart3, adminOnly: true, permissionKey: 'canViewReports' },
//   { name: 'Settings & Staff', path: '/settings', icon: Settings, adminOnly: true }, 
// ];

// export default function DashboardLayout() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const user = JSON.parse(localStorage.getItem('meret_user') || '{"fullName": "Merchant User", "role": "CASHIER"}');
//   const isAdmin = user.role === 'ADMIN';

//   const handleLogout = () => {
//     localStorage.removeItem('meret_token');
//     localStorage.removeItem('meret_user');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative selection:bg-yellow-400 selection:text-[#022036]">
      
//       {/* Mobile Top Header Bar with Jumbo 3-Line Menu Button */}
//       <div className="md:hidden bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 sticky top-0 z-50 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-xl bg-[#021827] border border-yellow-400/80 flex items-center justify-center font-bold text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
//             <Store className="h-5 w-5" />
//           </div>
//           <div>
//             <span className="font-extrabold text-base tracking-tight text-white block leading-none">Meret<span className="text-yellow-400">POS</span></span>
//             <span className="text-[9px] text-slate-400 font-mono">Mobile Terminal</span>
//           </div>
//         </div>

//         {/* Jumbo 3-Line Mobile Menu Button */}
//         <button 
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           aria-label="Toggle Mobile Menu"
//           className="p-2.5 rounded-xl bg-[#011827] border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] cursor-pointer flex flex-col justify-center items-center gap-1.5 w-12 h-12"
//         >
//           {mobileMenuOpen ? (
//             <X className="h-6 w-6 text-yellow-400 transform rotate-90 transition-transform" />
//           ) : (
//             <div className="space-y-1 w-6 flex flex-col items-end">
//               <span className="block h-0.5 w-6 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
//               <span className="block h-0.5 w-4 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
//               <span className="block h-0.5 w-5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
//             </div>
//           )}
//         </button>
//       </div>

//       {/* Mobile Backdrop Overlay */}
//       {mobileMenuOpen && (
//         <div 
//           onClick={() => setMobileMenuOpen(false)}
//           className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
//         />
//       )}

//       {/* Sidebar Navigation (Fixed Sticky on Desktop, Sliding Drawer on Mobile) */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-72 bg-[#022036] text-white flex flex-col border-r border-yellow-500/30 shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen
//         ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         {/* Sidebar Brand Header */}
//         <div className="p-6 border-b border-yellow-500/20 hidden md:flex items-center gap-3 relative bg-[#022036]">
//           <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
//           <div className="h-10 w-10 rounded-xl bg-[#011827] border border-yellow-400 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)]">
//             <Store className="h-5 w-5 text-yellow-400" />
//           </div>
//           <div>
//             <h1 className="text-base font-extrabold tracking-tight text-white">Meret<span className="text-yellow-400">POS</span></h1>
//             <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-mono font-semibold">Ethiopian SME Ledger</p>
//           </div>
//         </div>

//         {/* User Info Profile Badge */}
//         <div className="p-4 mx-4 mt-6 rounded-2xl bg-[#011827] border border-yellow-500/20 flex items-center gap-3.5 shadow-md shrink-0">
//           <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-yellow-400 text-[#022036] font-extrabold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(250,204,21,0.5)]">
//             {user.fullName ? user.fullName.charAt(0) : 'M'}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
//             <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase tracking-wider mt-1 ${
//               isAdmin ? 'bg-yellow-400 text-[#022036] shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-blue-400/20 text-blue-200 border border-blue-400/40'
//             }`}>
//               {user.role}
//             </span>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
//           <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Main Menu</p>
//           {navItems.map((item) => {
//             if (item.adminOnly && !isAdmin) {
//               if (item.permissionKey && user[item.permissionKey] === true) {
//                 // Allow cashier if explicit permission flag is true
//               } else {
//                 return null;
//               }
//             }

//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
//                   isActive
//                     ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#022036] shadow-[0_0_20px_rgba(250,204,21,0.5)] font-extrabold'
//                     : 'text-slate-300 hover:bg-white/10 hover:text-white'
//                 }`}
//               >
//                 <Icon className={`h-4 w-4 ${isActive ? 'text-[#022036]' : 'text-yellow-400'}`} />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Footer Logout Action */}
//         <div className="p-4 border-t border-yellow-500/20 bg-[#011627] shrink-0">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm group"
//           >
//             <LogOut className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
//             Sign Out of Register
//           </button>
//         </div>
//       </aside>

//       {/* Main Workspace Area with Responsive Padding & Scrolling */}
//       <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
//         <Navbar />
//         <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Clock,
  Settings, 
  LogOut, 
  Store, 
  Menu, 
  X,
  UserCheck,
  ArrowRightLeft // 👈 Icon for branch transfers
} from 'lucide-react';
import Navbar from './Navbar';

const navItems = [
  { name: 'Daily Overview', path: '/app', icon: LayoutDashboard, adminOnly: false },
  { name: 'POS Checkout', path: '/pos', icon: ShoppingCart, adminOnly: false },
  { name: 'Products & Stock', path: '/inventory', icon: Package, adminOnly: false },
  { name: 'Branch Transfers', path: '/transfers', icon: ArrowRightLeft, adminOnly: true }, // 👈 Added here for Admin access
  { name: 'Customer Directory', path: '/customers', icon: UserCheck, adminOnly: false },
  { name: 'Yeketena Credits', path: '/credit', icon: Users, adminOnly: false },
  { name: 'Shift & Z-Report', path: '/shift', icon: Clock, adminOnly: false },
  { name: 'Financial Reports', path: '/reports', icon: BarChart3, adminOnly: true, permissionKey: 'canViewReports' },
  { name: 'Settings & Staff', path: '/settings', icon: Settings, adminOnly: true }, 
];

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('meret_user') || '{"fullName": "Merchant User", "role": "CASHIER"}');
  const isAdmin = user.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('meret_token');
    localStorage.removeItem('meret_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative selection:bg-yellow-400 selection:text-[#022036]">
      
      {/* Mobile Top Header Bar with Jumbo 3-Line Menu Button */}
      <div className="md:hidden bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#011827] border border-yellow-400/80 flex items-center justify-center font-bold text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">Meret<span className="text-yellow-400">POS</span></span>
            <span className="text-[9px] text-slate-400 font-mono">Mobile Terminal</span>
          </div>
        </div>

        {/* Jumbo 3-Line Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
          className="p-2.5 rounded-xl bg-[#011827] border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] cursor-pointer flex flex-col justify-center items-center gap-1.5 w-12 h-12"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-yellow-400 transform rotate-90 transition-transform" />
          ) : (
            <div className="space-y-1 w-6 flex flex-col items-end">
              <span className="block h-0.5 w-6 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
              <span className="block h-0.5 w-4 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
              <span className="block h-0.5 w-5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#022036] text-white flex flex-col border-r border-yellow-500/30 shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-yellow-500/20 hidden md:flex items-center gap-3 relative bg-[#022036]">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          <div className="h-10 w-10 rounded-xl bg-[#011827] border border-yellow-400 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)]">
            <Store className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white">Meret<span className="text-yellow-400">POS</span></h1>
            <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-mono font-semibold">Ethiopian SME Ledger</p>
          </div>
        </div>

        {/* User Info Profile Badge */}
        <div className="p-4 mx-4 mt-6 rounded-2xl bg-[#011827] border border-yellow-500/20 flex items-center gap-3.5 shadow-md shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-yellow-400 text-[#022036] font-extrabold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            {user.fullName ? user.fullName.charAt(0) : 'M'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase tracking-wider mt-1 ${
              isAdmin ? 'bg-yellow-400 text-[#022036] shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-blue-400/20 text-blue-200 border border-blue-400/40'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Main Menu</p>
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) {
              if (item.permissionKey && user[item.permissionKey] === true) {
                // Allow cashier if explicit permission flag is true
              } else {
                return null;
              }
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#022036] shadow-[0_0_20px_rgba(250,204,21,0.5)] font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#022036]' : 'text-yellow-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout Action */}
        <div className="p-4 border-t border-yellow-500/20 bg-[#011627] shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm group"
          >
            <LogOut className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
            Sign Out of Register
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}