import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerLayout from "../../components/CustomerLayout";
import customerService from "../../services/customerService";
import { ArrowLeft, Printer } from "lucide-react";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await customerService.getSalesInvoiceById(id);
        setInvoice(data?.result || data || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load invoice details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <CustomerLayout pageTitle="Invoice Details">
        <div className="flex justify-center items-center py-20">
          <p className="text-slate-400">Loading invoice...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !invoice) {
    return (
      <CustomerLayout pageTitle="Invoice Details">
        <div className="bg-red-50 p-4 rounded-xl text-red-700 text-center">
          <p>{error || "Invoice not found"}</p>
          <Link to="/customer/history" className="text-sm font-semibold mt-2 inline-block underline">
            Back to History
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout pageTitle={`Invoice ${invoice.invoiceNo || `#${id}`}`}>
      <div className="flex items-center justify-between mb-5">
        <Link to="/customer/history" className="flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
        <button onClick={() => window.print()} className="flex items-center text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <Printer size={16} className="mr-2" /> Print
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-3xl mx-auto shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">INVOICE</h2>
            <p className="text-sm text-slate-500 font-mono mt-1">{invoice.invoiceNo || `INV-${id}`}</p>
            <div className="mt-4">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${invoice.status === "Paid" ? "bg-green-100 text-green-800" :
                  invoice.status === "Credit" ? "bg-red-100 text-red-800" :
                    "bg-amber-100 text-amber-800"
                }`}>
                {invoice.status || "Pending"}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">GadiSewa Service Center</p>
            <p>Kathmandu, Nepal</p>
            <p>+977-1-4567890</p>
            <p className="mt-4"><span className="font-semibold">Date:</span> {invoice.date ? new Date(invoice.date).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mb-8">
          <p className="text-sm font-semibold text-slate-800 mb-2">Billed To:</p>
          <p className="text-sm text-slate-600">{invoice.customerName || "Customer"}</p>
          <p className="text-sm text-slate-600">{invoice.vehicle ? `Vehicle: ${invoice.vehicle}` : ""}</p>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-4 text-slate-800">
                  {invoice.description || "Service & Parts"}
                </td>
                <td className="py-4 px-4 text-right text-slate-800">
                  Rs. {((invoice.amount || 0) + (invoice.discount || 0)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-sm">
          <div className="w-full sm:w-1/2 space-y-2">
            <div className="flex justify-between text-slate-600 px-4">
              <span>Subtotal:</span>
              <span>Rs. {((invoice.amount || 0) + (invoice.discount || 0)).toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-green-600 px-4">
                <span>Discount:</span>
                <span>- Rs. {invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-800 text-base border-t border-slate-200 pt-2 px-4 mt-2">
              <span>Total:</span>
              <span>Rs. {invoice.amount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-1">Notes</p>
            <p className="text-sm text-slate-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
