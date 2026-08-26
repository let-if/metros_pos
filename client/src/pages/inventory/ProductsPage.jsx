
// import { useState, useEffect } from 'react';
// import { apiClient } from '../../api/axiosConfig';
// import { toast } from 'sonner';
// import { Package, Plus, AlertTriangle, Trash2, Search, Loader2, ArrowUpCircle, Filter, Sparkles, Edit3 } from 'lucide-react';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
  
//   // Modals state
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [restockProductObj, setRestockProductObj] = useState(null);
//   const [restockQty, setRestockQty] = useState('');

//   // 👈 New Edit Price Modal State
//   const [editPriceProductObj, setEditPriceProductObj] = useState(null);
//   const [editPriceData, setEditPriceData] = useState({ unitPrice: '', costPrice: '', lowStockAlert: '' });

//   // Form state for new product
//   const [formData, setFormData] = useState({
//     sku: '',
//     name: '',
//     category: 'General',
//     unitPrice: '',
//     costPrice: '',
//     stockQty: '',
//     lowStockAlert: '5'
//   });

//   const user = JSON.parse(localStorage.getItem('meret_user') || '{}');
//   const isAdmin = user.role === 'ADMIN';

//   const fetchProducts = async () => {
//     try {
//       const res = await apiClient.get('/products');
//       setProducts(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load inventory stock');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleCreateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await apiClient.post('/products', formData);
//       toast.success('Product added to inventory!');
//       setIsCreateModalOpen(false);
//       setFormData({ sku: '', name: '', category: 'General', unitPrice: '', costPrice: '', stockQty: '', lowStockAlert: '5' });
//       fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create product');
//     }
//   };

//   const handleRestockSubmit = async (e) => {
//     e.preventDefault();
//     if (!restockProductObj) return;
//     try {
//       await apiClient.patch(`/products/${restockProductObj.id}/restock`, { addQty: restockQty });
//       toast.success(`Successfully added ${restockQty} units to ${restockProductObj.name}`);
//       setRestockProductObj(null);
//       setRestockQty('');
//       fetchProducts();
//     } catch (err) {
//       toast.error('Failed to update stock quantity');
//     }
//   };

//   // 👈 Handle price update submission
//   const handleEditPriceSubmit = async (e) => {
//     e.preventDefault();
//     if (!editPriceProductObj) return;
//     try {
//       await apiClient.patch(`/products/${editPriceProductObj.id}/price`, editPriceData);
//       toast.success(`Updated pricing for ${editPriceProductObj.name}`);
//       setEditPriceProductObj(null);
//       fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update product price');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
//     try {
//       await apiClient.delete(`/products/${id}`);
//       toast.success('Product removed');
//       fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Unauthorized or deletion failed');
//     }
//   };

//   // Extract unique categories for filter chips
//   const categories = ['All', ...new Set(products.map(p => p.category))];

//   // Filter products by search and category
//   const filteredProducts = products.filter(p => {
//     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           p.sku.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Page Header Banner */}
//       <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
//         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

//         <div className="relative z-10 space-y-1">
//           <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
//             <Sparkles className="h-4 w-4 animate-pulse" /> Stock Management Catalog
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Product Inventory</h1>
//           <p className="text-xs text-slate-300">Manage stock levels, retail pricing in ETB, and inventory shipments.</p>
//         </div>

//         {isAdmin && (
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-[#022036] text-xs font-extrabold hover:bg-yellow-300 transition-all shadow-md cursor-pointer border border-yellow-400/40 transform hover:-translate-y-0.5"
//           >
//             <Plus className="h-4 w-4" /> Add New Product
//           </button>
//         )}
//       </div>

//       {/* Search Bar & Category Filter Chips */}
//       <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//         <div className="relative flex-1 max-w-md">
//           <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//             <Search className="h-4 w-4" />
//           </span>
//           <input
//             type="text"
//             placeholder="Search by product name or SKU..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
//           />
//         </div>

//         {/* Category Filter Chips */}
//         <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
//           <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mr-1 flex items-center gap-1">
//             <Filter className="h-3 w-3" /> Filter:
//           </span>
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
//                 selectedCategory === cat 
//                   ? 'bg-[#022036] text-yellow-400 shadow-md' 
//                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Product Table Container */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
//           </div>
//         ) : filteredProducts.length === 0 ? (
//           <div className="text-center py-20 text-slate-400 text-xs font-medium">
//             No products found matching your filter.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
//                   <th className="p-4.5">SKU / Item</th>
//                   <th className="p-4.5">Category</th>
//                   <th className="p-4.5">Unit Price (ETB)</th>
//                   <th className="p-4.5">Cost Price (ETB)</th>
//                   <th className="p-4.5">Stock Level</th>
//                   <th className="p-4.5">Status</th>
//                   <th className="p-4.5 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
//                 {filteredProducts.map((p) => {
//                   const isLowStock = p.stockQty <= p.lowStockAlert;
//                   return (
//                     <tr key={p.id} className="hover:bg-yellow-50/30 transition-colors group">
//                       <td className="p-4.5">
//                         <p className="font-bold text-[#022036] group-hover:text-amber-700 transition-colors">{p.name}</p>
//                         <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</p>
//                       </td>
//                       <td className="p-4.5">
//                         <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
//                           {p.category}
//                         </span>
//                       </td>
//                       <td className="p-4.5 font-mono font-extrabold text-emerald-700">
//                         {Number(p.unitPrice).toFixed(2)} ETB
//                       </td>
//                       <td className="p-4.5 font-mono text-slate-600">
//                         {Number(p.costPrice || 0).toFixed(2)} ETB
//                       </td>
//                       <td className="p-4.5 font-mono font-bold">
//                         {p.stockQty} units
//                       </td>
//                       <td className="p-4.5">
//                         {isLowStock ? (
//                           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold shadow-2xs animate-pulse">
//                             <AlertTriangle className="h-3 w-3" /> Low Stock
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shadow-2xs">
//                             In Stock
//                           </span>
//                         )}
//                       </td>
//                       <td className="p-4.5 text-right">
//                         <div className="flex items-center justify-end gap-1.5">
//                           {isAdmin && (
//                             <button
//                               onClick={() => {
//                                 setEditPriceProductObj(p);
//                                 setEditPriceData({
//                                   unitPrice: p.unitPrice,
//                                   costPrice: p.costPrice || 0,
//                                   lowStockAlert: p.lowStockAlert || 5
//                                 });
//                               }}
//                               className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
//                               title="Edit Price & Cost"
//                             >
//                               <Edit3 className="h-3.5 w-3.5" /> Edit Price
//                             </button>
//                           )}
//                           <button
//                             onClick={() => setRestockProductObj(p)}
//                             className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
//                             title="Restock Item"
//                           >
//                             <ArrowUpCircle className="h-3.5 w-3.5 text-yellow-600" /> Restock
//                           </button>
//                           {isAdmin && (
//                             <button
//                               onClick={() => handleDelete(p.id)}
//                               className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
//                               title="Delete Product"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit Price Modal */}
//       {editPriceProductObj && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
//             <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
//               <h3 className="font-extrabold text-xs">Update Pricing: {editPriceProductObj.name}</h3>
//               <button onClick={() => setEditPriceProductObj(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
//             </div>
//             <form onSubmit={handleEditPriceSubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Unit Price (ETB)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={editPriceData.unitPrice}
//                   onChange={(e) => setEditPriceData({...editPriceData, unitPrice: e.target.value})}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono font-bold shadow-2xs"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Cost Price (ETB)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={editPriceData.costPrice}
//                   onChange={(e) => setEditPriceData({...editPriceData, costPrice: e.target.value})}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Low Stock Warning Threshold</label>
//                 <input
//                   type="number"
//                   required
//                   value={editPriceData.lowStockAlert}
//                   onChange={(e) => setEditPriceData({...editPriceData, lowStockAlert: e.target.value})}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
//               >
//                 Save Updated Prices
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Restock Modal */}
//       {restockProductObj && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
//             <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
//               <h3 className="font-extrabold text-xs">Restock: {restockProductObj.name}</h3>
//               <button onClick={() => setRestockProductObj(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
//             </div>
//             <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
//               <p className="text-xs text-slate-500">Current Stock: <span className="font-bold text-[#022036]">{restockProductObj.stockQty} units</span></p>
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Quantity to Add</label>
//                 <input
//                   type="number"
//                   min="1"
//                   required
//                   autoFocus
//                   placeholder="e.g. 24"
//                   value={restockQty}
//                   onChange={(e) => setRestockQty(e.target.value)}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
//               >
//                 Confirm Restock Shipment
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Product Modal */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
//             <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
//               <h3 className="font-extrabold text-sm tracking-tight">Add New Stock Item</h3>
//               <button onClick={() => setIsCreateModalOpen(false)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕ Close</button>
//             </div>
            
//             <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Product SKU Code</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. BEER-001"
//                   value={formData.sku}
//                   onChange={(e) => setFormData({...formData, sku: e.target.value})}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Item Name</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. St. George Lager 330ml"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Category</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="Beverages"
//                     value={formData.category}
//                     onChange={(e) => setFormData({...formData, category: e.target.value})}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Initial Stock Qty</label>
//                   <input
//                     type="number"
//                     required
//                     placeholder="50"
//                     value={formData.stockQty}
//                     onChange={(e) => setFormData({...formData, stockQty: e.target.value})}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Unit Price (ETB)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     placeholder="65.00"
//                     value={formData.unitPrice}
//                     onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Cost Price (ETB)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     placeholder="50.00"
//                     value={formData.costPrice}
//                     onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-2 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
//               >
//                 Save Product to Catalog
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Package, Plus, AlertTriangle, Trash2, Search, Loader2, ArrowUpCircle, Filter, Sparkles, Edit3 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [restockProductObj, setRestockProductObj] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  // Edit Price Modal State
  const [editPriceProductObj, setEditPriceProductObj] = useState(null);
  const [editPriceData, setEditPriceData] = useState({ unitPrice: '', costPrice: '', lowStockAlert: '' });

  // Form state for new product
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'General',
    unitPrice: '',
    costPrice: '',
    stockQty: '',
    lowStockAlert: '5'
  });

  const user = JSON.parse(localStorage.getItem('meret_user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products');
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load inventory stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/products', formData);
      toast.success('Product added to inventory!');
      setIsCreateModalOpen(false);
      setFormData({ sku: '', name: '', category: 'General', unitPrice: '', costPrice: '', stockQty: '', lowStockAlert: '5' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockProductObj) return;
    try {
      await apiClient.patch(`/products/${restockProductObj.id}/restock`, { addQty: restockQty });
      toast.success(`Successfully added ${restockQty} units to ${restockProductObj.name}`);
      setRestockProductObj(null);
      setRestockQty('');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to update stock quantity');
    }
  };

  const handleEditPriceSubmit = async (e) => {
    e.preventDefault();
    if (!editPriceProductObj) return;
    try {
      await apiClient.patch(`/products/${editPriceProductObj.id}/price`, editPriceData);
      toast.success(`Updated pricing for ${editPriceProductObj.name}`);
      setEditPriceProductObj(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product price');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized or deletion failed');
    }
  };

  // Extract unique categories for filter chips
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-10">
      
      {/* Page Header Banner */}
      <div className="bg-[#022036] rounded-2xl border border-yellow-500/30 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 animate-pulse" /> Stock Management Catalog
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Product Inventory</h1>
          <p className="text-xs text-slate-300">Manage stock levels, retail pricing in ETB, and inventory shipments.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-[#022036] text-xs font-extrabold hover:bg-yellow-300 transition-all shadow-md cursor-pointer border border-yellow-400/40 transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </button>
        )}
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-[#022036] outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 shadow-2xs transition-all"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#022036] text-yellow-400 shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs font-medium">
            No products found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4.5">SKU / Item</th>
                  <th className="p-4.5">Category</th>
                  <th className="p-4.5">Unit Price (ETB)</th>
                  <th className="p-4.5">Cost Price (ETB)</th>
                  <th className="p-4.5">Stock Level</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#022036]">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stockQty <= p.lowStockAlert;
                  return (
                    <tr key={p.id} className="hover:bg-yellow-50/30 transition-colors group">
                      <td className="p-4.5">
                        <p className="font-bold text-[#022036] group-hover:text-amber-700 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</p>
                      </td>
                      <td className="p-4.5">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4.5 font-mono font-extrabold text-emerald-700">
                        {Number(p.unitPrice).toFixed(2)} ETB
                      </td>
                      <td className="p-4.5 font-mono text-slate-600">
                        {Number(p.costPrice || 0).toFixed(2)} ETB
                      </td>
                      <td className="p-4.5 font-mono font-bold">
                        {p.stockQty} units
                      </td>
                      <td className="p-4.5">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold shadow-2xs animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shadow-2xs">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setEditPriceProductObj(p);
                                setEditPriceData({
                                  unitPrice: p.unitPrice,
                                  costPrice: p.costPrice || 0,
                                  lowStockAlert: p.lowStockAlert || 5
                                });
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                              title="Edit Price & Cost"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit Price
                            </button>
                          )}
                          <button
                            onClick={() => setRestockProductObj(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                            title="Restock Item"
                          >
                            <ArrowUpCircle className="h-3.5 w-3.5 text-yellow-600" /> Restock
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Price Modal (Aligned with Restock Modal UI) */}
      {editPriceProductObj && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
              <h3 className="font-extrabold text-xs">Update Pricing: {editPriceProductObj.name}</h3>
              <button onClick={() => setEditPriceProductObj(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleEditPriceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Unit Price (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPriceData.unitPrice}
                  onChange={(e) => setEditPriceData({...editPriceData, unitPrice: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">New Cost Price (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPriceData.costPrice}
                  onChange={(e) => setEditPriceData({...editPriceData, costPrice: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Low Stock Warning Threshold</label>
                <input
                  type="number"
                  required
                  value={editPriceData.lowStockAlert}
                  onChange={(e) => setEditPriceData({...editPriceData, lowStockAlert: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
              >
                Save Updated Prices
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockProductObj && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#022036] text-white p-4 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
              <h3 className="font-extrabold text-xs">Restock: {restockProductObj.name}</h3>
              <button onClick={() => setRestockProductObj(null)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">Current Stock: <span className="font-bold text-[#022036]">{restockProductObj.stockQty} units</span></p>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  autoFocus
                  placeholder="e.g. 24"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-mono shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
              >
                Confirm Restock Shipment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#022036] text-white p-5 flex items-center justify-between border-b border-yellow-500/30 shadow-sm">
              <h3 className="font-extrabold text-sm tracking-tight">Add New Stock Item</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-yellow-400 text-xs font-bold cursor-pointer">✕ Close</button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Product SKU Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BEER-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. George Lager 330ml"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Beverages"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({...formData, stockQty: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Unit Price (ETB)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="65.00"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Cost Price (ETB)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="50.00"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-[#022036] text-yellow-400 font-extrabold text-xs hover:bg-[#032a45] transition-all shadow-md cursor-pointer border border-yellow-400/40"
              >
                Save Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}