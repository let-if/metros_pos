// // client/src/pages/auth/LoginPage.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { ShieldCheck, Loader2, Phone, Lock, Store } from 'lucide-react';

// export default function LoginPage() {
//   const [phone, setPhone] = useState('');
//   const [pin, setPin] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!phone || !pin) {
//       toast.error('Please enter your phone number and security PIN');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await apiClient.post('/auth/login', { phone, pin });
//       localStorage.setItem('meret_token', res.data.token);
//       localStorage.setItem('meret_user', JSON.stringify(res.data.user));
//       toast.success('Welcome back to MeretPOS!');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl border border-brand-tertiary/40 shadow-elegant overflow-hidden">
        
//         {/* Signature Dark-Blue Header Card */}
//         <div className="bg-brand-primary text-white p-6 relative">
//           <div className="h-1 w-full bg-brand-tertiary absolute top-0 left-0" />
//           <div className="flex items-center gap-3.5 mb-2">
//             <div className="h-12 w-12 rounded-xl bg-brand-primary border border-brand-tertiary flex items-center justify-center shadow-inner">
//               <Store className="h-6 w-6 text-brand-tertiary" strokeWidth={2.25} />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold tracking-tight text-brand-heading">MeretPOS</h1>
//               <p className="text-xs font-medium text-white/80 mt-0.5">Ethiopian SME Inventory & Sales Ledger</p>
//             </div>
//           </div>
//         </div>

//         {/* Login Form Body */}
//         <form onSubmit={handleLogin} className="p-6 space-y-4">
//           <div className="rounded-xl border border-brand-tertiary/30 bg-brand-tertiary/5 p-3 text-xs text-brand-primary/80">
//             <p className="font-semibold mb-0.5">💡 Quick Tip:</p>
//             Use your registered mobile phone number and POS security PIN to access your store registry.
//           </div>

//           <label className="block text-sm space-y-1.5">
//             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/50">Phone Number</span>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-primary/40 pointer-events-none">
//                 <Phone className="h-4 w-4" />
//               </span>
//               <input
//                 type="text"
//                 placeholder="e.g. 0911223344"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full rounded-lg border border-brand-primary/15 bg-white pl-10 pr-3.5 py-2.5 text-sm text-brand-primary outline-none focus:border-brand-tertiary focus:ring-2 focus:ring-brand-tertiary/20 placeholder:text-brand-primary/30 transition-all"
//               />
//             </div>
//           </label>

//           <label className="block text-sm space-y-1.5">
//             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/50">Security PIN</span>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-primary/40 pointer-events-none">
//                 <Lock className="h-4 w-4" />
//               </span>
//               <input
//                 type="password"
//                 placeholder="••••"
//                 value={pin}
//                 onChange={(e) => setPin(e.target.value)}
//                 className="w-full rounded-lg border border-brand-primary/15 bg-white pl-10 pr-3.5 py-2.5 text-sm text-brand-primary outline-none focus:border-brand-tertiary focus:ring-2 focus:ring-brand-tertiary/20 placeholder:text-brand-primary/30 transition-all"
//               />
//             </div>
//           </label>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 inline-flex h-11 items-center justify-center rounded-lg border border-brand-tertiary bg-brand-primary px-6 text-sm font-semibold text-brand-secondary hover:bg-[#032a45] transition-all shadow-sm disabled:opacity-60 cursor-pointer"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin text-brand-tertiary" /> : "Sign In to POS"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// client/src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Phone, Lock, Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !pin) {
      toast.error('Please enter your phone number and security PIN');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { phone, pin });
      
      localStorage.setItem('meret_token', res.data.token);
      localStorage.setItem('meret_user', JSON.stringify(res.data.user));

      toast.success('Welcome back to MeretPOS!');
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#01121d] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#092032_1px,transparent_1px),linear-gradient(to_bottom,#092032_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>

      {/* Outer Glow Container */}
      <div className="relative w-full max-w-3xl bg-[#011627]/95 rounded-3xl border border-yellow-500/30 shadow-[0_0_90px_rgba(0,0,0,0.95)] p-6 sm:p-10 backdrop-blur-2xl">
        
        {/* Back to Home Button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-yellow-400/20 text-yellow-400 text-xs font-bold hover:bg-yellow-400/10 transition-all shadow-sm group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Secure Registry Portal</span>
          </div>
        </div>

        {/* Inner Shining Neon Card */}
        <div className="relative rounded-2xl bg-[#021827] border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.4)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT SIDE: Login Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center relative z-10 space-y-6">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-yellow-400 text-[#022036] flex items-center justify-center font-extrabold shadow-md">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-sm text-white tracking-tight">Meret<span className="text-yellow-400">POS</span></span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Login</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Phone Input Field */}
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Phone Number (e.g. 0911223344)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-600 focus:border-yellow-400 py-2.5 pl-2 pr-9 text-xs text-white placeholder-slate-400 outline-none transition-colors font-mono"
                />
                <Phone className="absolute right-2 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Security PIN Input Field */}
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Security PIN (••••)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-600 focus:border-yellow-400 py-2.5 pl-2 pr-9 text-xs text-white placeholder-slate-400 outline-none transition-colors font-mono"
                />
                <Lock className="absolute right-2 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Glowing Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-[#022036] font-extrabold text-xs transition-all shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:shadow-[0_0_35px_rgba(250,204,21,0.9)] cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#022036]" /> : 'Sign In to POS'}
              </button>

            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                Need registry assistance?{' '}
                <a href="tel:0900460680" className="text-yellow-400 font-bold hover:underline">
                  0900460680
                </a>
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: Welcome Back Panel with Exact Diagonal Cut */}
          <div className="relative hidden md:flex flex-col justify-center items-end p-8 sm:p-10 bg-gradient-to-bl from-yellow-500/20 via-[#022036] to-[#01101a] text-right overflow-hidden border-l border-yellow-400/30">
            
            {/* Exact Diagonal Split Line Graphic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#011627]/80 to-[#000000] pointer-events-none [clip-path:polygon(0_0,100%_0,100%_100%,0_0)]"></div>
            
            <div className="space-y-3 relative z-10 pr-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase leading-tight drop-shadow-md">
                WELCOME <br />
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">BACK!</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-[220px] ml-auto">
                We’re happy to have you with us back again! Enter your phone and PIN to open your store shift.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}