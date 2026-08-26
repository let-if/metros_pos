// client/src/pages/reports/BranchReportsSection.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { toast } from 'sonner';
import { Building2, Store, Warehouse, TrendingUp, DollarSign, Package, Loader2 } from 'lucide-react';

export default function BranchReportsSection() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranchReports = async () => {
      try {
        const res = await apiClient.get('/reports/branch-performance');
        setReportData(res.data.data?.branchPerformance || []);
      } catch (err) {
        toast.error('Failed to load branch performance metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchBranchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[#022036]">Branch & Warehouse Performance</h2>
          <p className="text-xs text-slate-500">Real-time revenue, inventory valuation, and sales breakdown per Addis Ababa location.</p>
        </div>
      </div>

      {/* Grid Cards per Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportData.map((branch) => (
          <div key={branch.branchId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative overflow-hidden">
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Total Revenue</span>
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
  );
}