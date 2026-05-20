import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import staffCustomersService from "../../services/staffCustomersService";
import appointmentsService from "../../services/appointmentsService";
import adminPartsService from "../../services/adminPartsService";
import salesInvoicesService from "../../services/salesInvoicesService";
import {
  Search,
  Plus,
  Trash2,
  Receipt,
  User,
  Calendar,
  AlertCircle,
  Tag,
  CheckCircle,
} from "lucide-react";

export default function CreateSalesInvoicePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search customer state
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Selected customer appointments
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  // Inventory parts lists
  const [parts, setParts] = useState([]);
  const [selectedPartIndex, setSelectedPartIndex] = useState("");

  // Invoice form state
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });
  const [taxAmount, setTaxAmount] = useState("0");
  const [items, setItems] = useState([
    { partId: "", description: "", quantity: 1, unitPrice: 0 },
  ]);

  // Load parts on mount
  useEffect(() => {
    const loadParts = async () => {
      try {
        const res = await adminPartsService.getParts();
        const rawParts = Array.isArray(res) ? res : res?.result || res?.parts || [];
        setParts(rawParts);
      } catch (err) {
        console.error("Failed to load parts", err);
      }
    };
    loadParts();
  }, []);

  // Customer search trigger
  const handleCustomerSearch = async (e) => {
    e.preventDefault();
    if (!customerSearch.trim()) return;
    try {
      setError("");
      const res = await staffCustomersService.searchCustomers({ q: customerSearch.trim() });
      const raw = Array.isArray(res) ? res : res?.result || [];
      setCustomerResults(raw);
    } catch (err) {
      setError("Failed to search customers");
    }
  };

  // Select customer callback
  const handleSelectCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setCustomerResults([]);
    setCustomerSearch("");

    // Fetch their appointments
    try {
      const res = await appointmentsService.getAppointments();
      const rawApts = Array.isArray(res) ? res : res?.result || [];
      // Filter for this customer and non-cancelled
      const customerApts = rawApts.filter(
        (a) => (a.customerId === cust.customerId || a.customerId === cust.id) && a.status !== 3
      );
      setAppointments(customerApts);
    } catch (err) {
      console.error(err);
    }
  };

  // Item list changers
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index][field] = Math.max(1, parseInt(value) || 1);
    } else if (field === "unitPrice") {
      newItems[index][field] = Math.max(0, parseFloat(value) || 0);
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const handleSelectPart = (index, partId) => {
    if (!partId) {
      handleItemChange(index, "partId", "");
      handleItemChange(index, "description", "");
      handleItemChange(index, "unitPrice", 0);
      return;
    }
    const part = parts.find((p) => p.id === partId);
    if (part) {
      const newItems = [...items];
      newItems[index].partId = partId;
      newItems[index].description = `${part.name} (${part.partNumber})`;
      newItems[index].unitPrice = part.sellingPrice;
      setItems(newItems);
    }
  };

  const addItemRow = () => {
    setItems([...items, { partId: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subTotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const loyaltyDiscountEligible = subTotal > 5000;
  const discountAmount = loyaltyDiscountEligible ? subTotal * 0.1 : 0;
  const taxableAmount = subTotal - discountAmount;
  const parsedTax = parseFloat(taxAmount) || 0;
  const totalAmount = taxableAmount + parsedTax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("Please select a customer first.");
      return;
    }
    if (items.some((it) => !it.description.trim() || it.unitPrice <= 0)) {
      setError("Please ensure all items have a description and unit price greater than 0.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        customerId: selectedCustomer.customerId || selectedCustomer.id,
        appointmentId: selectedAppointmentId || null,
        invoiceDate: new Date(invoiceDate).toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        taxAmount: parsedTax,
        items: items.map((it) => ({
          partId: it.partId || null,
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
      };

      const res = await salesInvoicesService.createSalesInvoice(payload);
      setSuccess("Sales Invoice generated successfully!");
      const created = res?.result || res;
      setTimeout(() => {
        navigate(`/staff/invoices/${created.invoiceId || created.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create sales invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout pageTitle="Create Sales Invoice" subtitle="Generate billing with part lookups and credit facility">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Panel: Customer Selector */}
          <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit space-y-4">
            <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold mb-4">Customer Select</h3>

            {!selectedCustomer ? (
              <form onSubmit={handleCustomerSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Name/Phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
                >
                  Search Customers
                </button>

                {customerResults.length > 0 && (
                  <div className="border border-slate-100 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-50 mt-2 bg-slate-50/50">
                    {customerResults.map((c) => (
                      <button
                        key={c.customerId || c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full p-2.5 text-left text-xs hover:bg-white flex flex-col gap-0.5"
                      >
                        <span className="font-bold text-slate-800">{c.firstName} {c.lastName}</span>
                        <span className="text-[10px] text-slate-400">{c.phoneNumber} • {c.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setAppointments([]);
                    setSelectedAppointmentId("");
                  }}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Change
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    {selectedCustomer.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-850 text-xs">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400">{selectedCustomer.phoneNumber}</p>
                  </div>
                </div>

                {/* Optional Appointment Attachment */}
                {appointments.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Link Appointment
                    </label>
                    <select
                      value={selectedAppointmentId}
                      onChange={(e) => setSelectedAppointmentId(e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none"
                    >
                      <option value="">No Linked Appointment</option>
                      {appointments.map((a) => (
                        <option key={a.id} value={a.id}>
                          #{a.appointmentNumber} - {a.problemDescription.slice(0, 20)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Due Date (For Credit facility)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Invoice Items Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base inline-flex items-center gap-2">
                  <Receipt size={18} className="text-sky-600" /> Invoice Line Items
                </h3>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Plus size={12} /> Add Item
                </button>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-end border-b border-slate-50 pb-4">
                    {/* Part Select */}
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Select Part
                      </label>
                      <select
                        value={item.partId}
                        onChange={(e) => handleSelectPart(idx, e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                      >
                        <option value="">-- Custom/Labour --</option>
                        {parts.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                            {p.name} {p.stockQuantity <= 0 ? "(Out of Stock)" : `(Stock: ${p.stockQuantity})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="flex-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                        placeholder="e.g. Engine Oil filter replacement"
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="w-16">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Qty *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="w-24">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Rate (Rs.) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="p-2 text-slate-450 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total calculations block */}
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-3">
                {loyaltyDiscountEligible && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 flex items-center gap-2">
                    <Tag size={14} />
                    <span>Loyalty discount of 10% applied automatically (Subtotal &gt; Rs. 5,000)</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rs. {subTotal.toLocaleString()}</span>
                </div>

                {loyaltyDiscountEligible && (
                  <div className="flex justify-between text-xs text-green-700">
                    <span>Loyalty Discount (10%):</span>
                    <span className="font-mono">- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-500 items-center">
                  <span>Tax (Custom input amount):</span>
                  <input
                    type="number"
                    min="0"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    className="w-20 p-1 border border-slate-200 rounded-lg text-right font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-slate-900 text-sm">
                  <span>Total Amount:</span>
                  <span className="font-mono text-sky-600">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/staff/invoices")}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  {loading ? "Generating..." : "Generate Invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
