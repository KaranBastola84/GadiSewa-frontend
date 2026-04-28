import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminVendorsService } from "../../services/adminVendorsService";

const emptyForm = {
  name: "",
  contactPerson: "",
  email: "",
  phoneNumber: "",
  address: "",
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminVendorsService.getVendors();
      setVendors(response?.result || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

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
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      address: form.address.trim(),
    };

    try {
      if (editingId) {
        await adminVendorsService.updateVendor(editingId, payload);
      } else {
        await adminVendorsService.createVendor(payload);
      }
      resetForm();
      await loadVendors();
    } catch (saveError) {
      setError(saveError.message || "Failed to save vendor.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id || vendor.vendorId);
    setForm({
      name: vendor.name || "",
      contactPerson: vendor.contactPerson || "",
      email: vendor.email || "",
      phoneNumber: vendor.phoneNumber || "",
      address: vendor.address || "",
    });
  };

  const openVendorDetails = async (vendorId) => {
    setDetailLoading(true);
    setSelectedVendor(null);
    setShowDetailModal(true);
    setError("");

    try {
      const response = await adminVendorsService.getVendorById(vendorId);
      setSelectedVendor(response?.result || null);
    } catch (detailError) {
      setError(detailError.message || "Failed to load vendor details.");
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Delete this vendor?")) return;

    try {
      await adminVendorsService.deleteVendor(vendorId);
      await loadVendors();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete vendor.");
    }
  };

  return (
    <AdminLayout
      pageTitle="Vendors"
      subtitle="Manage supplier contacts and procurement records"
    >
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            {editingId ? "Edit vendor" : "Add vendor"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep supplier records ready for purchase invoices.
          </p>

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
              label="Contact person"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Field
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              textarea
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
                    ? "Update vendor"
                    : "Create vendor"}
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
                Vendor directory
              </h2>
              <p className="text-sm text-slate-500">
                Use this list when generating purchase invoices.
              </p>
            </div>
            <button
              type="button"
              onClick={loadVendors}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading vendors...
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {vendors.map((vendor) => {
                const id = vendor.id || vendor.vendorId;
                return (
                  <article
                    key={id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-950">
                          {vendor.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {vendor.contactPerson}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Supplier
                      </span>
                    </div>
                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                      <p>{vendor.email}</p>
                      <p>{vendor.phoneNumber}</p>
                      <p>{vendor.address}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openVendorDetails(id)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(vendor)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
              {vendors.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 md:col-span-2">
                  No vendors available yet.
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      {showDetailModal && (
        <Modal title="Vendor details" onClose={() => setShowDetailModal(false)}>
          {detailLoading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading vendor details...
            </div>
          ) : selectedVendor ? (
            <div className="space-y-3 text-sm text-slate-700">
              <DetailRow label="Name" value={selectedVendor.name} />
              <DetailRow
                label="Contact person"
                value={selectedVendor.contactPerson}
              />
              <DetailRow label="Email" value={selectedVendor.email} />
              <DetailRow label="Phone" value={selectedVendor.phoneNumber} />
              <DetailRow label="Address" value={selectedVendor.address} />
              <DetailRow
                label="Vendor ID"
                value={selectedVendor.id || selectedVendor.vendorId}
              />
            </div>
          ) : (
            <p className="py-6 text-sm text-slate-500">
              No vendor details available.
            </p>
          )}
        </Modal>
      )}
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
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
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
