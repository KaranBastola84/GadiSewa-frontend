import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminPurchaseInvoicesService } from "../../services/adminPurchaseInvoicesService";
import { adminVendorsService } from "../../services/adminVendorsService";
import { adminPartsService } from "../../services/adminPartsService";

const emptyItem = { partId: "", quantity: "", unitCost: "" };
const emptyForm = {
  vendorId: "",
  invoiceDate: "",
  dueDate: "",
  taxAmount: "",
  taxRatePercent: "",
  status: "Unpaid",
  items: [emptyItem],
};

const statusOptions = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" },
];

export default function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [receiveItems, setReceiveItems] = useState([]);
  const [receiveError, setReceiveError] = useState("");

  const vendorMap = useMemo(() => {
    return new Map(
      vendors.map((vendor) => [vendor.vendorId || vendor.id, vendor.name]),
    );
  }, [vendors]);

  const partMap = useMemo(() => {
    return new Map(
      parts.map((part) => [part.partId || part.id, part.name || part.partName]),
    );
  }, [parts]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [invoiceResponse, vendorResponse, partsResponse] =
        await Promise.allSettled([
          adminPurchaseInvoicesService.getInvoices(),
          adminVendorsService.getVendors(),
          adminPartsService.getParts(),
        ]);

      if (invoiceResponse.status === "fulfilled") {
        setInvoices(invoiceResponse.value?.result || []);
      }
      if (vendorResponse.status === "fulfilled") {
        setVendors(vendorResponse.value?.result || []);
      }
      if (partsResponse.status === "fulfilled") {
        setParts(partsResponse.value?.result || []);
      }

      const rejected = [invoiceResponse, vendorResponse, partsResponse].find(
        (item) => item.status === "rejected",
      );
      if (rejected) {
        setError(rejected.reason?.message || "Some data could not be loaded.");
      }
    } catch (loadError) {
      setError(loadError.message || "Failed to load purchase invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedInvoice?.items) {
      setReceiveItems([]);
      return;
    }

    const nextItems = selectedInvoice.items.map((item) => ({
      itemId: item.itemId || item.id,
      partName: item.partName || partMap.get(item.partId) || "Part",
      quantityOrdered: item.quantity,
      quantityReceived: item.quantity || "",
    }));

    setReceiveItems(nextItems);
    setReceiveError("");
  }, [selectedInvoice, partMap]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const items = prev.items.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      );
      return { ...prev, items };
    });
  };

  const handleReceiveItemChange = (index, value) => {
    setReceiveItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantityReceived: value } : item,
      ),
    );
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem] }));
  };

  const removeItem = (index) => {
    setForm((prev) => {
      const items = prev.items.filter((_, idx) => idx !== index);
      return { ...prev, items: items.length ? items : [emptyItem] };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!form.vendorId || !form.invoiceDate) {
      setError("Vendor and invoice date are required.");
      setSaving(false);
      return;
    }

    const cleanedItems = form.items
      .map((item) => ({
        partId: item.partId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      }))
      .filter((item) => item.partId && item.quantity > 0 && item.unitCost > 0);

    if (cleanedItems.length === 0) {
      setError("Add at least one valid item.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        vendorId: form.vendorId,
        invoiceDate: toIsoString(form.invoiceDate),
        status: form.status || "Unpaid",
        items: cleanedItems,
        ...(form.dueDate ? { dueDate: toIsoString(form.dueDate) } : {}),
        ...(form.taxAmount !== "" ? { taxAmount: Number(form.taxAmount) } : {}),
        ...(form.taxRatePercent !== ""
          ? { taxRatePercent: Number(form.taxRatePercent) }
          : {}),
      };

      await adminPurchaseInvoicesService.createInvoice(payload);
      resetForm();
      await loadData();
    } catch (saveError) {
      setError(saveError.message || "Failed to create purchase invoice.");
    } finally {
      setSaving(false);
    }
  };

  const openInvoiceDetails = async (invoiceId) => {
    setDetailLoading(true);
    setSelectedInvoice(null);
    setShowDetailModal(true);
    setError("");
    setReceiveError("");

    try {
      const response =
        await adminPurchaseInvoicesService.getInvoiceById(invoiceId);
      setSelectedInvoice(response?.result || null);
    } catch (detailError) {
      setError(detailError.message || "Failed to load invoice details.");
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReceiveStock = async (invoiceId) => {
    try {
      const payloadItems = receiveItems
        .map((item) => ({
          itemId: item.itemId,
          quantityReceived: Number(item.quantityReceived),
        }))
        .filter(
          (item) =>
            item.itemId &&
            Number.isFinite(item.quantityReceived) &&
            item.quantityReceived > 0,
        );

      if (payloadItems.length === 0) {
        setReceiveError("Enter received quantities for at least one item.");
        return;
      }

      await adminPurchaseInvoicesService.receiveStock(invoiceId, payloadItems);
      await loadData();
      setShowDetailModal(false);
    } catch (receiveError) {
      setReceiveError(receiveError.message || "Failed to receive stock.");
    }
  };

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString()}`;

  const toIsoString = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toISOString();
  };

  return (
    <AdminLayout
      pageTitle="Purchase Invoices"
      subtitle="Create and receive incoming stock from vendors"
    >
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Create invoice
              </h2>
              <p className="text-sm text-slate-500">
                Record purchases before receiving stock.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Vendor</span>
              <select
                name="vendorId"
                value={form.vendorId}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option
                    key={vendor.vendorId || vendor.id}
                    value={vendor.vendorId || vendor.id}
                  >
                    {vendor.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Invoice date
                </span>
                <input
                  type="datetime-local"
                  name="invoiceDate"
                  value={form.invoiceDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Due date
                </span>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Tax amount
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="taxAmount"
                  value={form.taxAmount}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Tax rate (%)
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="taxRatePercent"
                  value={form.taxRatePercent}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Add item
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {form.items.map((item, index) => (
                  <div
                    key={`item-${index}`}
                    className="rounded-2xl border border-slate-200 p-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-[1.6fr_0.8fr_0.8fr]">
                      <select
                        value={item.partId}
                        onChange={(e) =>
                          handleItemChange(index, "partId", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                      >
                        <option value="">Select part</option>
                        {parts.map((part) => (
                          <option
                            key={part.partId || part.id}
                            value={part.partId || part.id}
                          >
                            {part.name} ({part.partNumber})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                      />
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Unit cost"
                        value={item.unitCost}
                        onChange={(e) =>
                          handleItemChange(index, "unitCost", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                      />
                    </div>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove item
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create purchase invoice"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Invoice list</h2>
              <p className="text-sm text-slate-500">
                Track purchase orders and received stock.
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading invoices...
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <Th>Invoice</Th>
                      <Th>Vendor</Th>
                      <Th>Date</Th>
                      <Th className="text-right">Total</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Action</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {invoices.map((invoice) => {
                      const id = invoice.id || invoice.invoiceId;
                      const total =
                        invoice.totalAmount ||
                        invoice.total ||
                        invoice.items?.reduce(
                          (sum, item) =>
                            sum +
                            Number(item.quantity || 0) *
                              Number(item.unitCost || 0),
                          0,
                        );
                      return (
                        <tr key={id}>
                          <Td>
                            <div>
                              <p className="font-semibold text-slate-950">
                                {invoice.invoiceNumber || id}
                              </p>
                              <p className="text-xs text-slate-500">
                                {invoice.items?.length || 0} items
                              </p>
                            </div>
                          </Td>
                          <Td>
                            {invoice.vendorName ||
                              vendorMap.get(invoice.vendorId) ||
                              "-"}
                          </Td>
                          <Td>
                            {invoice.invoiceDate
                              ? new Date(
                                  invoice.invoiceDate,
                                ).toLocaleDateString()
                              : "-"}
                          </Td>
                          <Td className="text-right">
                            {formatCurrency(total)}
                          </Td>
                          <Td>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {invoice.status || "Unpaid"}
                            </span>
                          </Td>
                          <Td className="text-right">
                            <button
                              type="button"
                              onClick={() => openInvoiceDetails(id)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              View
                            </button>
                          </Td>
                        </tr>
                      );
                    })}
                    {invoices.length === 0 && (
                      <tr>
                        <Td
                          colSpan={6}
                          className="py-12 text-center text-sm text-slate-500"
                        >
                          No purchase invoices available yet.
                        </Td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {showDetailModal && (
        <Modal
          title="Purchase invoice details"
          onClose={() => setShowDetailModal(false)}
        >
          {detailLoading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading invoice details...
            </div>
          ) : selectedInvoice ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Invoice"
                  value={
                    selectedInvoice.invoiceNumber ||
                    selectedInvoice.invoiceId ||
                    selectedInvoice.id
                  }
                />
                <DetailRow
                  label="Vendor"
                  value={
                    selectedInvoice.vendorName ||
                    vendorMap.get(selectedInvoice.vendorId) ||
                    "-"
                  }
                />
                <DetailRow
                  label="Date"
                  value={
                    selectedInvoice.invoiceDate
                      ? new Date(
                          selectedInvoice.invoiceDate,
                        ).toLocaleDateString()
                      : "-"
                  }
                />
                <DetailRow
                  label="Due date"
                  value={
                    selectedInvoice.dueDate
                      ? new Date(selectedInvoice.dueDate).toLocaleDateString()
                      : "-"
                  }
                />
                <DetailRow
                  label="Status"
                  value={selectedInvoice.status || "Unpaid"}
                />
                <DetailRow
                  label="Tax amount"
                  value={formatCurrency(selectedInvoice.taxAmount)}
                />
                <DetailRow
                  label="Tax rate (%)"
                  value={Number(selectedInvoice.taxRatePercent || 0).toString()}
                />
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Items
                </div>
                <div className="divide-y divide-slate-100">
                  {(selectedInvoice.items || []).map((item, index) => (
                    <div
                      key={`item-${index}`}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {item.partName || partMap.get(item.partId) || "Part"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity} • Unit cost:{" "}
                          {formatCurrency(item.unitCost)}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-700">
                        {formatCurrency(
                          Number(item.quantity || 0) *
                            Number(item.unitCost || 0),
                        )}
                      </span>
                    </div>
                  ))}
                  {(!selectedInvoice.items ||
                    selectedInvoice.items.length === 0) && (
                    <p className="px-4 py-6 text-sm text-slate-500">
                      No items recorded.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Receive stock
                </div>
                <div className="divide-y divide-slate-100">
                  {receiveItems.map((item, index) => (
                    <div
                      key={item.itemId || index}
                      className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {item.partName || "Part"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Ordered: {item.quantityOrdered}
                        </p>
                      </div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty received"
                        value={item.quantityReceived}
                        onChange={(event) =>
                          handleReceiveItemChange(index, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 sm:w-40"
                      />
                    </div>
                  ))}
                  {receiveItems.length === 0 && (
                    <p className="px-4 py-6 text-sm text-slate-500">
                      No receivable items found.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Total: {formatCurrency(selectedInvoice.totalAmount)}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleReceiveStock(
                      selectedInvoice.invoiceId || selectedInvoice.id,
                    )
                  }
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Receive stock
                </button>
              </div>
              {receiveError && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {receiveError}
                </div>
              )}
            </div>
          ) : (
            <p className="py-6 text-sm text-slate-500">
              No invoice details available.
            </p>
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "", colSpan }) {
  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-4 text-sm text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">
        {value || "-"}
      </span>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
