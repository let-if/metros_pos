
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, CheckCircle, Loader2, Receipt, History, Printer, X, Camera, Edit3, AlertTriangle, Award, Sparkles, Building2 } from 'lucide-react';
// import BarcodeScannerModal from '../../components/pos/BarcodeScannerModal';

// export default function PosPage() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Branch Context State
//   const [branches, setBranches] = useState([]);
//   const [activeBranchId, setActiveBranchId] = useState('');
//   const [activeBranchName, setActiveBranchName] = useState('Loading Branch...');

//   // Checkout & Receipt State
//   const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('CASH');
//   const [customerName, setCustomerName] = useState('');
//   const [customerPhone, setCustomerPhone] = useState('');
  
//   // Loyalty Points State
//   const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState(0);
//   const [redeemLoyalty, setRedeemLoyalty] = useState(false);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [completedSale, setCompletedSale] = useState(null);

//   // Recent Sales History State
//   const [recentSales, setRecentSales] = useState([]);
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);

//   // Barcode Scanner Modal State
//   const [isScannerOpen, setIsScannerOpen] = useState(false);

//   // Refund Confirmation Modal State
//   const [refundTargetId, setRefundTargetId] = useState(null);
//   const [isRefunding, setIsRefunding] = useState(false);

//   // Custom Branded Price Override Modal State
//   const [overrideTargetItem, setOverrideTargetItem] = useState(null);
//   const [customPriceInput, setCustomPriceInput] = useState('');

//   // Permission Helpers
//   const currentUser = JSON.parse(localStorage.getItem('meret_user') || '{}');
//   const isAdmin = currentUser.role === 'ADMIN';
//   const canRefund = isAdmin || currentUser.canRefund === true;
//   const canOverridePrice = isAdmin || currentUser.canOverridePrice === true;

//   // 1. Fetch Branches and initialize active branch for the cashier
//   const fetchBranchContext = async () => {
//     try {
//       const res = await apiClient.get('/branches');
//       const branchList = res.data.data || [];
//       setBranches(branchList);

//       // Determine cashier's assigned branch or fallback to first available branch/warehouse
//       const assignedId = currentUser.branchId;
//       const matchedBranch = branchList.find(b => b.id === assignedId) || branchList[0];

//       if (matchedBranch) {
//         setActiveBranchId(matchedBranch.id);
//         setActiveBranchName(`${matchedBranch.name} ${matchedBranch.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}`);
//       }
//     } catch (err) {
//       console.error('Failed to load branches', err);
//     }
//   };

//   // 2. Fetch products with branch-specific inventory mapping
//   const fetchProducts = async (branchId) => {
//     try {
//       setLoading(true);
//       // If a branch is selected, fetch branch inventory items or merge them
//       const res = await apiClient.get('/products');
//       const baseProducts = res.data.data || [];

//       // If it's a regular store branch, fetch branch specific inventory counts if available
//       if (branchId) {
//         const invRes = await apiClient.get(`/branches/${branchId}/inventory`).catch(() => null);
//         const branchInventories = invRes?.data?.data || [];
        
//         if (branchInventories.length > 0) {
//           const mappedProducts = baseProducts.map(p => {
//             const foundInv = branchInventories.find(inv => inv.productId === p.id);
//             return {
//               ...p,
//               stockQty: foundInv ? foundInv.stockQty : 0 // Branch specific stock
//             };
//           });
//           setProducts(mappedProducts);
//           setLoading(false);
//           return;
//         }
//       }

//       setProducts(baseProducts);
//     } catch (err) {
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecentSales = async () => {
//     try {
//       const res = await apiClient.get('/sales');
//       setRecentSales(res.data.data.slice(0, 5));
//     } catch (err) {
//       console.error('Failed to load sales history');
//     }
//   };

//   useEffect(() => {
//     fetchBranchContext();
//     fetchRecentSales();
//   }, []);

//   useEffect(() => {
//     if (activeBranchId) {
//       fetchProducts(activeBranchId);
//       setCart([]); // Reset cart to an empty array
//     }
//   }, [activeBranchId]);

//   const addToCart = (product) => {
//     if (product.stockQty <= 0) {
//       toast.error('Item is out of stock at this location!');
//       return;
//     }

//     setCart(prevCart => {
//       const existing = prevCart.find(item => item.id === product.id);
//       if (existing) {
//         if (existing.quantity >= product.stockQty) {
//           toast.error('Cannot exceed available stock quantity at this branch');
//           return prevCart;
//         }
//         return prevCart.map(item => 
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prevCart, { ...product, quantity: 1, productId: product.id }];
//     });
//   };

//   const handleBarcodeScanned = (scannedSku) => {
//     const matchedProduct = products.find(p => p.sku.toLowerCase() === scannedSku.toLowerCase());
//     if (matchedProduct) {
//       addToCart(matchedProduct);
//       toast.success(`Scanned: ${matchedProduct.name}`);
//     } else {
//       toast.error(`Product with code "${scannedSku}" not found`);
//     }
//     setIsScannerOpen(false);
//   };

//   const handleOpenPriceOverrideModal = (item) => {
//     if (!canOverridePrice) {
//       toast.error('Unauthorized: You do not have permission to override product prices.');
//       return;
//     }

//     setOverrideTargetItem(item);
//     setCustomPriceInput(item.unitPrice.toString());
//   };

//   const submitPriceOverride = (e) => {
//     e.preventDefault();
//     if (!overrideTargetItem) return;

//     const parsedPrice = parseFloat(customPriceInput);
//     if (isNaN(parsedPrice) || parsedPrice < 0) {
//       toast.error('Please enter a valid unit price.');
//       return;
//     }

//     setCart(prevCart => prevCart.map(cartItem => 
//       cartItem.id === overrideTargetItem.id ? { ...cartItem, unitPrice: parsedPrice } : cartItem
//     ));
//     toast.success(`Price successfully overridden to ${parsedPrice.toFixed(2)} ETB`);
//     setOverrideTargetItem(null);
//     setCustomPriceInput('');
//   };

//   const confirmRefundSale = async () => {
//     if (!refundTargetId) return;

//     if (!canRefund) {
//       toast.error('Unauthorized: You do not have permission to process refunds.');
//       setRefundTargetId(null);
//       return;
//     }

//     setIsRefunding(true);
//     try {
//       await apiClient.delete(`/sales/${refundTargetId}/refund`);
//       toast.success('Sale successfully refunded and branch inventory restocked!');
//       fetchProducts(activeBranchId);
//       fetchRecentSales();
//       setCompletedSale(null);
//       setRefundTargetId(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to process refund');
//       setRefundTargetId(null);
//     } finally {
//       setIsRefunding(false);
//     }
//   };

//   const updateQuantity = (id, delta) => {
//     setCart(prevCart => {
//       return prevCart.map(item => {
//         if (item.id === id) {
//           const newQty = item.quantity + delta;
//           if (newQty > item.stockQty) {
//             toast.error('Exceeds available stock at this branch');
//             return item;
//           }
//           return newQty > 0 ? { ...item, quantity: newQty } : null;
//         }
//         return item;
//       }).filter(Boolean);
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const subtotal = cart.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);
//   const loyaltyDiscount = redeemLoyalty && customerLoyaltyPoints >= 100 ? 100 : 0;
//   const finalDueAmount = Math.max(0, subtotal - loyaltyDiscount);

//   const handleCheckoutSubmit = async (e) => {
//     e.preventDefault();
//     if (cart.length === 0) return;

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         items: cart.map(item => ({ 
//           productId: item.productId, 
//           quantity: item.quantity,
//           unitPrice: item.unitPrice // 👈 Passes the custom overridden price to the backend
//         })),
//         paymentMethod,
//         customerName: customerName || (paymentMethod === 'CREDIT' ? 'Credit Customer' : 'Walk-in Customer'),
//         customerPhone: customerPhone || null,
//         redeemPoints: redeemLoyalty,
//         branchId: activeBranchId 
//       };

//       const res = await apiClient.post('/sales', payload);
//       toast.success('Sale completed with overridden price and branch inventory updated!');
      
//       const savedSale = res.data.data;
//       setCompletedSale(savedSale);

//       setCart([]);
//       setIsCheckoutOpen(false);
//       setCustomerName('');
//       setCustomerPhone('');
//       setCustomerLoyaltyPoints(0);
//       setRedeemLoyalty(false);
//       fetchProducts(activeBranchId); 
//       fetchRecentSales();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Checkout failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredProducts = products.filter(p => 
//     p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     p.sku.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Branded Header Banner Matching Other Pages */}
//       <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
//         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

//         <div className="relative z-10 space-y-1">
//           <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//             <Sparkles className="h-4 w-4 animate-pulse" /> MeretPOS Point of Sale Register
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Fast Checkout & Terminal Context</h1>
//           <p className="text-xs text-slate-300">Ring up sales, manage cart items, and process branch inventory checkouts seamlessly.</p>
//         </div>

//         <div className="relative z-10 flex flex-wrap items-center gap-3">
//           {/* Branch Selector Dropdown */}
//           <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 backdrop-blur-md">
//             <Building2 className="h-4 w-4 text-yellow-400 shrink-0" />
//             <select
//               value={activeBranchId}
//               onChange={(e) => setActiveBranchId(e.target.value)}
//               className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
//             >
//               {branches.map(b => (
//                 <option key={b.id} value={b.id} className="text-slate-900">
//                   {b.name} {b.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={() => setIsHistoryOpen(!isHistoryOpen)}
//             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xs"
//           >
//             <History className="h-3.5 w-3.5 text-yellow-400" /> Recent Sales ({recentSales.length})
//           </button>
//         </div>
//       </div>

//       {/* Recent Sales History Drawer */}
//       {isHistoryOpen && (
//         <div className="bg-white rounded-2xl border border-yellow-500/30 p-5 shadow-xl animate-fadeIn">
//           <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
//             <h4 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-1.5">
//               <Sparkles className="h-3.5 w-3.5 text-yellow-500" /> Latest Completed Transactions
//             </h4>
//             <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
//           </div>
//           {recentSales.length === 0 ? (
//             <p className="text-xs text-slate-400 py-3 text-center">No sales recorded yet this shift.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//               {recentSales.map(sale => (
//                 <div key={sale.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between hover:border-yellow-400 transition-all shadow-2xs">
//                   <div className="space-y-1">
//                     <div className="flex justify-between font-bold text-[#022036]">
//                       <span>{sale.receiptNo}</span>
//                       <span className="text-emerald-700 font-mono">{Number(sale.grandTotal).toFixed(2)} ETB</span>
//                     </div>
//                     <p className="text-[10px] font-mono text-emerald-600">Fiscal No: {sale.fiscalReceiptNumber || 'N/A'}</p>
//                     <p className="text-[10px] text-slate-500">Branch: <span className="font-semibold text-slate-700">{sale.branch?.name || 'General'}</span></p>
//                     <p className="text-[10px] text-slate-400">{new Date(sale.createdAt).toLocaleTimeString()}</p>
//                   </div>
                  
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={() => setCompletedSale(sale)}
//                       className="flex-1 py-2 rounded-xl bg-[#022036] text-yellow-400 font-bold text-[10px] hover:bg-[#032a45] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
//                     >
//                       <Receipt className="h-3 w-3" /> Reprint
//                     </button>
//                     <button
//                       onClick={() => {
//                         if (!canRefund) {
//                           toast.error('Unauthorized: You do not have permission to process refunds.');
//                           return;
//                         }
//                         setRefundTargetId(sale.id);
//                       }}
//                       className={`px-3 py-2 rounded-xl font-bold text-[10px] transition-all border flex items-center justify-center ${
//                         canRefund 
//                           ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200 cursor-pointer shadow-2xs' 
//                           : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
//                       }`}
//                       title={canRefund ? "Refund / Return Sale" : "Locked: Requires Refund Permission"}
//                     >
//                       Refund
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Main Split Screen */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)]">
        
//         {/* LEFT: Product Catalog Selection Grid (7 Cols) */}
//         <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//           <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
//             <div className="relative flex-1">
//               <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//                 <Search className="h-4 w-4" />
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search items or scan barcode..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
//               />
//             </div>

//             <button
//               onClick={() => setIsScannerOpen(true)}
//               className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md border border-yellow-400/30 shrink-0 transform hover:-translate-y-0.5"
//             >
//               <Camera className="h-4 w-4" /> Scan QR
//             </button>
//           </div>

//           <div className="flex-1 p-4 overflow-y-auto">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="text-center py-20 text-slate-400 text-xs font-medium">No products found in this branch inventory.</div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
//                 {filteredProducts.map(p => {
//                   const isLowStock = p.stockQty > 0 && p.stockQty <= 5;
//                   const isOutOfStock = p.stockQty <= 0;

//                   return (
//                     <button
//                       key={p.id}
//                       onClick={() => addToCart(p)}
//                       disabled={isOutOfStock}
//                       className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
//                         isOutOfStock 
//                           ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
//                           : isLowStock
//                           ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500 hover:shadow-md'
//                           : 'bg-white border-slate-200/80 hover:border-yellow-400 hover:shadow-md transform hover:-translate-y-0.5'
//                       }`}
//                     >
//                       <div>
//                         <p className="font-bold text-xs text-[#022036] line-clamp-2 group-hover:text-amber-700 transition-colors">{p.name}</p>
//                         <p className="text-[10px] text-slate-400 font-mono mt-1">{p.sku}</p>
//                       </div>
//                       <div className="mt-4 flex items-center justify-between">
//                         <span className="font-mono font-extrabold text-emerald-700 text-xs">
//                           {Number(p.unitPrice).toFixed(2)} ETB
//                         </span>
                        
//                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${
//                           isOutOfStock 
//                             ? 'bg-red-100 text-red-700' 
//                             : isLowStock 
//                             ? 'bg-amber-100 text-amber-800 animate-pulse' 
//                             : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
//                         }`}>
//                           {isLowStock && <AlertTriangle className="h-2.5 w-2.5" />}
//                           {p.stockQty} left
//                         </span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Active Cart & Checkout Panel (5 Cols) */}
//         <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//           <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
//             <div className="flex items-center gap-2">
//               <ShoppingCart className="h-4 w-4 text-yellow-400" />
//               <h3 className="font-bold text-xs uppercase tracking-wider">Current Register Cart</h3>
//             </div>
//             <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-[#022036] text-[10px] font-extrabold shadow-sm">
//               {cart.length} Items
//             </span>
//           </div>

//           <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
//             {cart.length === 0 ? (
//               <div className="text-center py-20 text-slate-400 text-xs font-medium">
//                 Cart is empty. Click items from the catalog or scan a barcode to ring up a sale.
//               </div>
//             ) : (
//               cart.map(item => (
//                 <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 group">
//                   <div className="overflow-hidden flex-1">
//                     <p className="font-bold text-xs text-[#022036] truncate">{item.name}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <p className="text-[10px] text-slate-500 font-mono">
//                         {Number(item.unitPrice).toFixed(2)} ETB × {item.quantity}
//                       </p>
//                       <button
//                         type="button"
//                         onClick={() => handleOpenPriceOverrideModal(item)}
//                         className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
//                           canOverridePrice 
//                             ? 'bg-[#022036] text-yellow-400 hover:bg-[#032a45] border-yellow-400/40 cursor-pointer shadow-2xs' 
//                             : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
//                         }`}
//                         title={canOverridePrice ? "Override item price" : "Locked: Requires Price Override Permission"}
//                       >
//                         <Edit3 className="h-2.5 w-2.5" /> Edit Price
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
//                       <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer">
//                         <Minus className="h-3 w-3" />
//                       </button>
//                       <span className="px-2.5 text-xs font-bold font-mono text-[#022036]">{item.quantity}</span>
//                       <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer">
//                         <Plus className="h-3 w-3" />
//                       </button>
//                     </div>

//                     <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors">
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">Total Amount</span>
//               <span className="font-mono font-extrabold text-xl text-[#022036]">
//                 {subtotal.toFixed(2)} ETB
//               </span>
//             </div>

//             <button
//               onClick={() => setIsCheckoutOpen(true)}
//               disabled={cart.length === 0}
//               className="w-full py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md disabled:opacity-40 cursor-pointer border border-yellow-400/40 transform hover:-translate-y-0.5"
//             >
//               Proceed to Payment
//             </button>
//           </div>
//         </div>

//       </div>

//       {/* Barcode Scanner Camera Modal */}
//       {isScannerOpen && (
//         <BarcodeScannerModal
//           onClose={() => setIsScannerOpen(false)}
//           onScanSuccess={handleBarcodeScanned}
//         />
//       )}

//       {/* Custom Branded Price Override Modal */}
//       {overrideTargetItem && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4 animate-fadeIn">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h3 className="font-extrabold text-sm text-[#022036]">Override Item Price</h3>
//               <button onClick={() => setOverrideTargetItem(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
//             </div>

//             <div>
//               <p className="text-xs font-bold text-slate-700">{overrideTargetItem.name}</p>
//               <p className="text-[10px] text-slate-400 font-mono mt-0.5">Current Price: {Number(overrideTargetItem.unitPrice).toFixed(2)} ETB</p>
//             </div>

//             <form onSubmit={submitPriceOverride} className="space-y-3">
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Unit Price (ETB)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   autoFocus
//                   placeholder="Enter new price..."
//                   value={customPriceInput}
//                   onChange={(e) => setCustomPriceInput(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
//                 />
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setOverrideTargetItem(null)}
//                   className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm"
//                 >
//                   Apply Price
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Custom Branded Refund Confirmation Modal */}
//       {refundTargetId && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4 text-center animate-fadeIn">
//             <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-inner">
//               <Trash2 className="h-6 w-6" />
//             </div>
//             <div>
//               <h3 className="font-extrabold text-sm text-[#022036]">Confirm Sale Refund</h3>
//               <p className="text-xs text-slate-500 mt-1">Are you sure you want to refund this sale? All sold items will be automatically returned to branch inventory stock.</p>
//             </div>
//             <div className="flex gap-2 pt-2">
//               <button
//                 onClick={() => setRefundTargetId(null)}
//                 className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmRefundSale}
//                 disabled={isRefunding}
//                 className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
//               >
//                 {isRefunding ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'Yes, Refund'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Checkout Payment Modal with Loyalty Points Integration */}
//       {isCheckoutOpen && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
//             <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
//               <h3 className="font-extrabold text-sm tracking-tight">Finalize POS Checkout</h3>
//               <button onClick={() => setIsCheckoutOpen(false)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕ Close</button>
//             </div>

//             <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
//               <div className="p-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-between shadow-2xs">
//                 <span className="text-xs font-bold text-yellow-900">Total Due:</span>
//                 <span className="font-mono font-extrabold text-sm text-[#022036]">
//                   {finalDueAmount.toFixed(2)} ETB {loyaltyDiscount > 0 && <span className="text-xs text-emerald-700 font-normal line-through ml-1">{subtotal.toFixed(2)}</span>}
//                 </span>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Payment Method</label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { id: 'CASH', label: 'Cash', icon: Banknote },
//                     { id: 'TELEBIRR', label: 'Telebirr', icon: Smartphone },
//                     { id: 'CREDIT', label: 'Yeketena Credit', icon: CreditCard },
//                   ].map(method => {
//                     const Icon = method.icon;
//                     return (
//                       <button
//                         key={method.id}
//                         type="button"
//                         onClick={() => setPaymentMethod(method.id)}
//                         className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
//                           paymentMethod === method.id
//                             ? 'bg-[#022036] text-yellow-400 border-[#022036] shadow-md'
//                             : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
//                         }`}
//                       >
//                         <Icon className="h-4 w-4 mb-1" />
//                         {method.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Customer Phone (For Loyalty Points)</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. 0911223344"
//                   value={customerPhone}
//                   onChange={async (e) => {
//                     const phone = e.target.value;
//                     setCustomerPhone(phone);
                    
//                     if (phone.length >= 9) {
//                       try {
//                         const res = await apiClient.get(`/customers/lookup?phone=${phone}`);
//                         if (res.data.data) {
//                           const pts = res.data.data.loyaltyPoints || 0;
//                           setCustomerName(res.data.data.fullName || '');
//                           setCustomerLoyaltyPoints(pts);
//                           if (pts >= 100) {
//                             toast.success(`🎉 VIP Customer Unlocked! ${pts} Loyalty Points available.`);
//                           }
//                         }
//                       } catch (err) {
//                         setCustomerLoyaltyPoints(0);
//                       }
//                     } else {
//                       setCustomerLoyaltyPoints(0);
//                       setRedeemLoyalty(false);
//                     }
//                   }}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Customer Name {paymentMethod === 'CREDIT' && '*'}</label>
//                 <input
//                   type="text"
//                   required={paymentMethod === 'CREDIT'}
//                   placeholder={paymentMethod === 'CREDIT' ? 'Required for Yeketena credit' : 'Walk-in Customer (Optional)'}
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                 />
//               </div>

//               {customerLoyaltyPoints >= 100 && (
//                 <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="font-bold text-amber-900 flex items-center gap-1">
//                       <Award className="h-4 w-4 text-amber-600" /> Available Points: {customerLoyaltyPoints} pts
//                     </span>
//                     <span className="text-[10px] text-amber-700 font-semibold bg-amber-200/60 px-2 py-0.5 rounded">Reward Tier Unlocked!</span>
//                   </div>
//                   <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-900 font-medium">
//                     <input
//                       type="checkbox"
//                       checked={redeemLoyalty}
//                       onChange={(e) => setRedeemLoyalty(e.target.checked)}
//                       className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
//                     />
//                     Redeem 100 points for a 100.00 ETB discount reward?
//                   </label>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full mt-3 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md disabled:opacity-50 cursor-pointer border border-yellow-400/40 flex items-center justify-center gap-2"
//               >
//                 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-yellow-400" /> : <CheckCircle className="h-4 w-4" />}
//                 Complete Sale ({finalDueAmount.toFixed(2)} ETB)
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Printable Thermal Receipt Modal */}
//       {completedSale && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            
//             <div className="bg-[#022036] text-white p-4 flex items-center justify-between no-print shadow-sm">
//               <span className="font-bold text-xs flex items-center gap-1.5 text-yellow-400">
//                 <Receipt className="h-4 w-4" /> ERCA Fiscal Receipt Generated
//               </span>
//               <button onClick={() => setCompletedSale(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
//             </div>

//             {/* Thermal Receipt Paper Layout */}
//             <div id="thermal-receipt-print-area" className="p-6 font-mono text-xs space-y-3 bg-white text-slate-900 m-4 rounded-2xl border border-dashed border-slate-300 shadow-2xs">
//               {(() => {
//                 const config = JSON.parse(localStorage.getItem('meret_store_config') || '{"storeName": "MeretPOS Retail Shop", "tinNumber": "0012345678", "vatNo": "VAT-987654321", "storeLocation": "Bole Road, Addis Ababa"}');
//                 return (
//                   <div className="text-center pb-2 border-b border-dashed border-slate-300 space-y-0.5">
//                     <h3 className="font-extrabold text-sm text-slate-900">{config.storeName}</h3>
//                     <p className="text-[10px] text-slate-600">{config.storeLocation}</p>
//                     <p className="text-[10px] font-mono text-slate-600">TIN: {config.tinNumber} | VAT: {config.vatNo}</p>
//                     <p className="text-[10px] font-mono font-bold text-emerald-700 mt-1">Fiscal Receipt No: {completedSale.fiscalReceiptNumber || 'FRC-2026-984120'}</p>
//                     <p className="text-[10px] text-slate-500">Receipt: {completedSale.receiptNo}</p>
//                     <p className="text-[10px] text-slate-500">{new Date(completedSale.createdAt).toLocaleString()}</p>
//                   </div>
//                 );
//               })()}

//               <div className="space-y-1.5 py-1">
//                 {completedSale.items?.map((item, idx) => (
//                   <div key={idx} className="flex justify-between text-[11px]">
//                     <span className="truncate max-w-[150px]">{item.quantity}x {item.product?.name || 'Item'}</span>
//                     <span className="font-bold">{Number(item.totalPrice).toFixed(2)} ETB</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
//                 <div className="flex justify-between font-bold text-sm text-slate-900">
//                   <span>Grand Total:</span>
//                   <span>{Number(completedSale.grandTotal).toFixed(2)} ETB</span>
//                 </div>
//                 <div className="flex justify-between text-[10px] text-slate-600">
//                   <span>Payment Method:</span>
//                   <span className="font-semibold">{completedSale.paymentMethod}</span>
//                 </div>
//               </div>

//               {/* ERCA Regulatory QR Code Simulation Element */}
//               <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1.5">
//                 <div className="inline-block p-2 bg-white rounded-xl border border-slate-200">
//                   <div className="h-14 w-14 bg-slate-900 mx-auto flex items-center justify-center text-white text-[9px] font-mono rounded">
//                     [ERCA QR]
//                   </div>
//                 </div>
//                 <p className="text-[9px] text-slate-500 tracking-tight">Verified Ministry of Revenues Sale</p>
//                 <p className="text-[10px] font-semibold text-slate-900">እመሰግናለን! Thank you!</p>
//               </div>
//             </div>

//             <div className="p-4 bg-white border-t border-slate-100 flex gap-2.5 no-print">
//               <button
//                 onClick={() => window.print()}
//                 className="flex-1 py-3 rounded-xl bg-slate-100 text-[#022036] font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
//               >
//                 <Printer className="h-4 w-4 text-yellow-600" /> Print Thermal Roll
//               </button>
//               <button
//                 onClick={() => setCompletedSale(null)}
//                 className="flex-1 py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-sm"
//               >
//                 New Sale
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, CheckCircle, Loader2, Receipt, History, Printer, X, Camera, Edit3, AlertTriangle, Award, Sparkles, Building2 } from 'lucide-react';
import BarcodeScannerModal from '../../components/pos/BarcodeScannerModal';
// If it's located at client/src/components/TelegramReceiptSelector.jsx:
import TelegramReceiptSelector from '../../components/TelegramReceiptSelector';

// OR if it's located at client/src/components/pos/TelegramReceiptSelector.jsx:


export default function PosPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Branch Context State
  const [branches, setBranches] = useState([]);
  const [activeBranchId, setActiveBranchId] = useState('');
  const [activeBranchName, setActiveBranchName] = useState('Loading Branch...');

  // Checkout & Receipt State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [telegramChatId, setTelegramChatId] = useState(''); // 👈 Telegram Chat ID state

  // Loyalty Points State
  const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState(0);
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  // Recent Sales History State
  const [recentSales, setRecentSales] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Barcode Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Refund Confirmation Modal State
  const [refundTargetId, setRefundTargetId] = useState(null);
  const [isRefunding, setIsRefunding] = useState(false);

  // Custom Branded Price Override Modal State
  const [overrideTargetItem, setOverrideTargetItem] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState('');

  // Permission Helpers
  const currentUser = JSON.parse(localStorage.getItem('meret_user') || '{}');
  const isAdmin = currentUser.role === 'ADMIN';
  const canRefund = isAdmin || currentUser.canRefund === true;
  const canOverridePrice = isAdmin || currentUser.canOverridePrice === true;

  // 1. Fetch Branches and initialize active branch for the cashier
  const fetchBranchContext = async () => {
    try {
      const res = await apiClient.get('/branches');
      const branchList = res.data.data || [];
      setBranches(branchList);

      const assignedId = currentUser.branchId;
      const matchedBranch = branchList.find(b => b.id === assignedId) || branchList[0];

      if (matchedBranch) {
        setActiveBranchId(matchedBranch.id);
        setActiveBranchName(`${matchedBranch.name} ${matchedBranch.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}`);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    }
  };

  // 2. Fetch products with branch-specific inventory mapping
  const fetchProducts = async (branchId) => {
    try {
      setLoading(true);
      const res = await apiClient.get('/products');
      const baseProducts = res.data.data || [];

      if (branchId) {
        const invRes = await apiClient.get(`/branches/${branchId}/inventory`).catch(() => null);
        const branchInventories = invRes?.data?.data || [];

        if (branchInventories.length > 0) {
          const mappedProducts = baseProducts.map(p => {
            const foundInv = branchInventories.find(inv => inv.productId === p.id);
            return {
              ...p,
              stockQty: foundInv ? foundInv.stockQty : 0
            };
          });
          setProducts(mappedProducts);
          setLoading(false);
          return;
        }
      }

      setProducts(baseProducts);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const res = await apiClient.get('/sales');
      setRecentSales(res.data.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load sales history');
    }
  };

  useEffect(() => {
    fetchBranchContext();
    fetchRecentSales();
  }, []);

  useEffect(() => {
    if (activeBranchId) {
      fetchProducts(activeBranchId);
      setCart([]); 
    }
  }, [activeBranchId]);

  const addToCart = (product) => {
    if (product.stockQty <= 0) {
      toast.error('Item is out of stock at this location!');
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQty) {
          toast.error('Cannot exceed available stock quantity at this branch');
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, productId: product.id }];
    });
  };

  const handleBarcodeScanned = (scannedSku) => {
    const matchedProduct = products.find(p => p.sku.toLowerCase() === scannedSku.toLowerCase());
    if (matchedProduct) {
      addToCart(matchedProduct);
      toast.success(`Scanned: ${matchedProduct.name}`);
    } else {
      toast.error(`Product with code "${scannedSku}" not found`);
    }
    setIsScannerOpen(false);
  };

  const handleOpenPriceOverrideModal = (item) => {
    if (!canOverridePrice) {
      toast.error('Unauthorized: You do not have permission to override product prices.');
      return;
    }

    setOverrideTargetItem(item);
    setCustomPriceInput(item.unitPrice.toString());
  };

  const submitPriceOverride = (e) => {
    e.preventDefault();
    if (!overrideTargetItem) return;

    const parsedPrice = parseFloat(customPriceInput);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error('Please enter a valid unit price.');
      return;
    }

    setCart(prevCart => prevCart.map(cartItem => 
      cartItem.id === overrideTargetItem.id ? { ...cartItem, unitPrice: parsedPrice } : cartItem
    ));
    toast.success(`Price successfully overridden to ${parsedPrice.toFixed(2)} ETB`);
    setOverrideTargetItem(null);
    setCustomPriceInput('');
  };

  const confirmRefundSale = async () => {
    if (!refundTargetId) return;

    if (!canRefund) {
      toast.error('Unauthorized: You do not have permission to process refunds.');
      setRefundTargetId(null);
      return;
    }

    setIsRefunding(true);
    try {
      await apiClient.delete(`/sales/${refundTargetId}/refund`);
      toast.success('Sale successfully refunded and branch inventory restocked!');
      fetchProducts(activeBranchId);
      fetchRecentSales();
      setCompletedSale(null);
      setRefundTargetId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process refund');
      setRefundTargetId(null);
    } finally {
      setIsRefunding(false);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.stockQty) {
            toast.error('Exceeds available stock at this branch');
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);
  const loyaltyDiscount = redeemLoyalty && customerLoyaltyPoints >= 100 ? 100 : 0;
  const finalDueAmount = Math.max(0, subtotal - loyaltyDiscount);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map(item => ({ 
          productId: item.productId, 
          quantity: item.quantity,
          unitPrice: item.unitPrice 
        })),
        paymentMethod,
        customerName: customerName || (paymentMethod === 'CREDIT' ? 'Credit Customer' : 'Walk-in Customer'),
        customerPhone: customerPhone || null,
        redeemPoints: redeemLoyalty,
        branchId: activeBranchId,
        telegramChatId: telegramChatId || null // 👈 Pass selected Telegram Chat ID to backend
      };

      const res = await apiClient.post('/sales', payload);
      toast.success('Sale completed! Digital receipt queued for Telegram.');

      const savedSale = res.data.data;
      setCompletedSale(savedSale);

      setCart([]);
      setIsCheckoutOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setTelegramChatId(''); // Reset Telegram selection
      setCustomerLoyaltyPoints(0);
      setRedeemLoyalty(false);
      fetchProducts(activeBranchId); 
      fetchRecentSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header Banner */}
      <div className="bg-[#022036] rounded-3xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> MeretPOS Point of Sale Register
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Fast Checkout & Terminal Context</h1>
          <p className="text-xs text-slate-300">Ring up sales, manage cart items, and process branch inventory checkouts seamlessly.</p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 backdrop-blur-md">
            <Building2 className="h-4 w-4 text-yellow-400 shrink-0" />
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="text-slate-900">
                  {b.name} {b.isWarehouse ? '📦 [Warehouse]' : '🏪 [Store]'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xs"
          >
            <History className="h-3.5 w-3.5 text-yellow-400" /> Recent Sales ({recentSales.length})
          </button>
        </div>
      </div>

      {/* Recent Sales History Drawer */}
      {isHistoryOpen && (
        <div className="bg-white rounded-2xl border border-yellow-500/30 p-5 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-xs text-[#022036] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" /> Latest Completed Transactions
            </h4>
            <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
          </div>
          {recentSales.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">No sales recorded yet this shift.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentSales.map(sale => (
                <div key={sale.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between hover:border-yellow-400 transition-all shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-[#022036]">
                      <span>{sale.receiptNo}</span>
                      <span className="text-emerald-700 font-mono">{Number(sale.grandTotal).toFixed(2)} ETB</span>
                    </div>
                    <p className="text-[10px] font-mono text-emerald-600">Fiscal No: {sale.fiscalReceiptNumber || 'N/A'}</p>
                    <p className="text-[10px] text-slate-500">Branch: <span className="font-semibold text-slate-700">{sale.branch?.name || 'General'}</span></p>
                    <p className="text-[10px] text-slate-400">{new Date(sale.createdAt).toLocaleTimeString()}</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setCompletedSale(sale)}
                      className="flex-1 py-2 rounded-xl bg-[#022036] text-yellow-400 font-bold text-[10px] hover:bg-[#032a45] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Receipt className="h-3 w-3" /> Reprint
                    </button>
                    <button
                      onClick={() => {
                        if (!canRefund) {
                          toast.error('Unauthorized: You do not have permission to process refunds.');
                          return;
                        }
                        setRefundTargetId(sale.id);
                      }}
                      className={`px-3 py-2 rounded-xl font-bold text-[10px] transition-all border flex items-center justify-center ${
                        canRefund 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200 cursor-pointer shadow-2xs' 
                          : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      Refund
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)]">
        {/* LEFT: Product Catalog */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search items or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
              />
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs hover:bg-[#032a45] transition-all cursor-pointer shadow-md border border-yellow-400/30 shrink-0 transform hover:-translate-y-0.5"
            >
              <Camera className="h-4 w-4" /> Scan QR
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium">No products found in this branch inventory.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredProducts.map(p => {
                  const isLowStock = p.stockQty > 0 && p.stockQty <= 5;
                  const isOutOfStock = p.stockQty <= 0;

                  return (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      disabled={isOutOfStock}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                        isOutOfStock 
                          ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                          : isLowStock
                          ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500 hover:shadow-md'
                          : 'bg-white border-slate-200/80 hover:border-yellow-400 hover:shadow-md transform hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs text-[#022036] line-clamp-2 group-hover:text-amber-700 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{p.sku}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono font-extrabold text-emerald-700 text-xs">
                          {Number(p.unitPrice).toFixed(2)} ETB
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${
                          isOutOfStock ? 'bg-red-100 text-red-700' : isLowStock ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {isLowStock && <AlertTriangle className="h-2.5 w-2.5" />}
                          {p.stockQty} left
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Active Cart */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-yellow-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Current Register Cart</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-[#022036] text-[10px] font-extrabold shadow-sm">
              {cart.length} Items
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium">
                Cart is empty. Click items from the catalog or scan a barcode to ring up a sale.
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 group">
                  <div className="overflow-hidden flex-1">
                    <p className="font-bold text-xs text-[#022036] truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-500 font-mono">
                        {Number(item.unitPrice).toFixed(2)} ETB × {item.quantity}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenPriceOverrideModal(item)}
                        className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                          canOverridePrice ? 'bg-[#022036] text-yellow-400 hover:bg-[#032a45] border-yellow-400/40 cursor-pointer shadow-2xs' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="h-2.5 w-2.5" /> Edit Price
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold font-mono text-[#022036]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">Total Amount</span>
              <span className="font-mono font-extrabold text-xl text-[#022036]">
                {subtotal.toFixed(2)} ETB
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md disabled:opacity-40 cursor-pointer border border-yellow-400/40 transform hover:-translate-y-0.5"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleBarcodeScanned}
        />
      )}

      {/* Price Override Modal */}
      {overrideTargetItem && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-[#022036]">Override Item Price</h3>
              <button onClick={() => setOverrideTargetItem(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{overrideTargetItem.name}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Current Price: {Number(overrideTargetItem.unitPrice).toFixed(2)} ETB</p>
            </div>
            <form onSubmit={submitPriceOverride} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Unit Price (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold text-[#022036]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setOverrideTargetItem(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs">Apply Price</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundTargetId && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4 text-center animate-fadeIn">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#022036]">Confirm Sale Refund</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to refund this sale? All sold items will be automatically returned to branch inventory stock.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setRefundTargetId(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
              <button onClick={confirmRefundSale} disabled={isRefunding} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                {isRefunding ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'Yes, Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Payment Modal with Telegram Receipt Selector */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shadow-sm sticky top-0 z-10">
              <h3 className="font-extrabold text-sm tracking-tight">Finalize POS Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕ Close</button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-between shadow-2xs">
                <span className="text-xs font-bold text-yellow-900">Total Due:</span>
                <span className="font-mono font-extrabold text-sm text-[#022036]">
                  {finalDueAmount.toFixed(2)} ETB {loyaltyDiscount > 0 && <span className="text-xs text-emerald-700 font-normal line-through ml-1">{subtotal.toFixed(2)}</span>}
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', label: 'Cash', icon: Banknote },
                    { id: 'TELEBIRR', label: 'Telebirr', icon: Smartphone },
                    { id: 'CREDIT', label: 'Yeketena Credit', icon: CreditCard },
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === method.id ? 'bg-[#022036] text-yellow-400 border-[#022036] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Customer Phone (For Loyalty Points)</label>
                <input
                  type="text"
                  placeholder="e.g. 0911223344"
                  value={customerPhone}
                  onChange={async (e) => {
                    const phone = e.target.value;
                    setCustomerPhone(phone);

                    if (phone.length >= 9) {
                      try {
                        const res = await apiClient.get(`/customers/lookup?phone=${phone}`);
                        if (res.data.data) {
                          const pts = res.data.data.loyaltyPoints || 0;
                          setCustomerName(res.data.data.fullName || '');
                          setCustomerLoyaltyPoints(pts);
                          if (pts >= 100) {
                            toast.success(`🎉 VIP Customer Unlocked! ${pts} Loyalty Points available.`);
                          }
                        }
                      } catch (err) {
                        setCustomerLoyaltyPoints(0);
                      }
                    } else {
                      setCustomerLoyaltyPoints(0);
                      setRedeemLoyalty(false);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Customer Name {paymentMethod === 'CREDIT' && '*'}</label>
                <input
                  type="text"
                  required={paymentMethod === 'CREDIT'}
                  placeholder={paymentMethod === 'CREDIT' ? 'Required for Yeketena credit' : 'Walk-in Customer (Optional)'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                />
              </div>

              {/* 📱 Integrated Telegram Receipt Selector Component */}
              <TelegramReceiptSelector
                selectedChatId={telegramChatId}
                onSelectChat={(chatId) => setTelegramChatId(chatId)}
              />

              {customerLoyaltyPoints >= 100 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Award className="h-4 w-4 text-amber-600" /> Available Points: {customerLoyaltyPoints} pts
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-200/60 px-2 py-0.5 rounded">Reward Tier Unlocked!</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-900 font-medium">
                    <input
                      type="checkbox"
                      checked={redeemLoyalty}
                      onChange={(e) => setRedeemLoyalty(e.target.checked)}
                      className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    Redeem 100 points for a 100.00 ETB discount reward?
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md disabled:opacity-50 cursor-pointer border border-yellow-400/40 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-yellow-400" /> : <CheckCircle className="h-4 w-4" />}
                Complete Sale ({finalDueAmount.toFixed(2)} ETB)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Thermal Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            <div className="bg-[#022036] text-white p-4 flex items-center justify-between no-print shadow-sm">
              <span className="font-bold text-xs flex items-center gap-1.5 text-yellow-400">
                <Receipt className="h-4 w-4" /> ERCA Fiscal Receipt Generated
              </span>
              <button onClick={() => setCompletedSale(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
            </div>

            <div id="thermal-receipt-print-area" className="p-6 font-mono text-xs space-y-3 bg-white text-slate-900 m-4 rounded-2xl border border-dashed border-slate-300 shadow-2xs">
              {(() => {
                const config = JSON.parse(localStorage.getItem('meret_store_config') || '{"storeName": "MeretPOS Retail Shop", "tinNumber": "0012345678", "vatNo": "VAT-987654321", "storeLocation": "Bole Road, Addis Ababa"}');
                return (
                  <div className="text-center pb-2 border-b border-dashed border-slate-300 space-y-0.5">
                    <h3 className="font-extrabold text-sm text-slate-900">{config.storeName}</h3>
                    <p className="text-[10px] text-slate-600">{config.storeLocation}</p>
                    <p className="text-[10px] font-mono text-slate-600">TIN: {config.tinNumber} | VAT: {config.vatNo}</p>
                    <p className="text-[10px] font-mono font-bold text-emerald-700 mt-1">Fiscal Receipt No: {completedSale.fiscalReceiptNumber || 'FRC-2026-984120'}</p>
                    <p className="text-[10px] text-slate-500">Receipt: {completedSale.receiptNo}</p>
                    <p className="text-[10px] text-slate-500">{new Date(completedSale.createdAt).toLocaleString()}</p>
                  </div>
                );
              })()}

              <div className="space-y-1.5 py-1">
                {completedSale.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[150px]">{item.quantity}x {item.product?.name || 'Item'}</span>
                    <span className="font-bold">{Number(item.totalPrice).toFixed(2)} ETB</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between font-bold text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span>{Number(completedSale.grandTotal).toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold">{completedSale.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1.5">
                <div className="inline-block p-2 bg-white rounded-xl border border-slate-200">
                  <div className="h-14 w-14 bg-slate-900 mx-auto flex items-center justify-center text-white text-[9px] font-mono rounded">
                    [ERCA QR]
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 tracking-tight">Verified Ministry of Revenues Sale</p>
                <p className="text-[10px] font-semibold text-slate-900">እመሰግናለን! Thank you!</p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2.5 no-print">
              <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl bg-slate-100 text-[#022036] font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <Printer className="h-4 w-4 text-yellow-600" /> Print Thermal Roll
              </button>
              <button onClick={() => setCompletedSale(null)} className="flex-1 py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45]">
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}