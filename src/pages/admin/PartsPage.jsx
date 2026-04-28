import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminPartsService } from "../../services/adminPartsService";

const emptyForm = {
  name: "",
  partNumber: "",
  description: "",
  unitPrice: "",
  stockQuantity: "",
  reorderLevel: "",
};

export default function PartsPage() {
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadParts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminPartsService.getParts();
      setParts(response?.result || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load parts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const lowStockCount = useMemo(
    () => parts.filter((part) => part.isLowStock).length,
    [parts],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      partNumber: form.partNumber.trim(),
      description: form.description.trim(),
      unitPrice: Number(form.unitPrice),
      stockQuantity: Number(form.stockQuantity),
      reorderLevel: Number(form.reorderLevel),
    };

    try {
      if (editingId) {
        await adminPartsService.updatePart(editingId, payload);
      } else {
        await adminPartsService.createPart(payload);
      }

      resetForm();
      await loadParts();
    } catch (saveError) {
      setError(saveError.message || "Failed to save part.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (part) => {
    setEditingId(part.partId);
    setForm({
      name: part.name || "",
      partNumber: part.partNumber || "",
      description: part.description || "",
      unitPrice: part.unitPrice ?? "",
      stockQuantity: part.stockQuantity ?? "",
      reorderLevel: part.reorderLevel ?? "",
    });
  };

  const handleDelete = async (partId) => {
    const confirmed = window.confirm("Delete this part?");
    if (!confirmed) return;

    try {
      await adminPartsService.deletePart(partId);
      await loadParts();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete part.");
    }
  };

  return (
    <AdminLayout
      pageTitle="Parts"
      subtitle="Create, edit, and track vehicle parts inventory"
    >
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {editingId ? "Edit part" : "Add part"}
              </h2>
              <p className="text-sm text-slate-500">
                Keep the catalog current and aligned with stock.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {lowStockCount} low stock
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Field
              label="Part number"
              name="partNumber"
              value={form.partNumber}
              onChange={handleChange}
              required
            />
            <Field
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              textarea
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Unit price"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                required
              />
              <Field
                label="Stock"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                type="number"
                min="0"
                required
              />
            </div>
            <Field
              label="Reorder level"
              name="reorderLevel"
              value={form.reorderLevel}
              onChange={handleChange}
              type="number"
              min="0"
              required
            />

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update part"
                    : "Create part"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Inventory list
              </h2>
              <p className="text-sm text-slate-500">
                View and manage all part records.
              </p>
            </div>
            <button
              type="button"
              onClick={loadParts}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading parts...
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <Th>Name</Th>
                      <Th>Part #</Th>
                      <Th className="text-right">Price</Th>
                      <Th className="text-right">Stock</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parts.map((part) => (
                      <tr key={part.partId} className="align-top">
                        <Td>
                          <div>
                            <p className="font-semibold text-slate-950">
                              {part.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {part.description}
                            </p>
                          </div>
                        </Td>
                        <Td>{part.partNumber}</Td>
                        <Td className="text-right">
                          Rs. {Number(part.unitPrice || 0).toLocaleString()}
                        </Td>
                        <Td className="text-right">{part.stockQuantity}</Td>
                        <Td>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              part.isLowStock
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {part.isLowStock ? "Low stock" : "Healthy"}
                          </span>
                        </Td>
                        <Td className="text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(part)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(part.partId)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                    {parts.length === 0 && (
                      <tr>
                        <Td
                          colSpan={6}
                          className="py-12 text-center text-sm text-slate-500"
                        >
                          No parts available yet.
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
    </AdminLayout>
  );
}

function Field({ label, textarea = false, className = "", ...props }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          {...props}
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        />
      ) : (
        <input
          {...props}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        />
      )}
    </label>
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
