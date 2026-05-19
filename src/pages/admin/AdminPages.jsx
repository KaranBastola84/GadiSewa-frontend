import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Toast from '../../components/Toast';

// ── VENDORS MODULE ──────────────────────────────────────────
export const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getVendors();
      setVendors(res?.result || res?.data || res || []);
    } catch (err) {
      showToast(err.message || 'Failed to load vendors', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleOpenCreate = () => {
    setEditingVendor(null);
    setFormData({ name: '', contactPerson: '', email: '', phoneNumber: '', address: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      address: vendor.address || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      showToast('Name, Email, and Phone are required.', 'error');
      return;
    }
    try {
      if (editingVendor) {
        await adminService.updateVendor(editingVendor.id, formData);
        showToast('Vendor updated successfully!');
      } else {
        await adminService.createVendor(formData);
        showToast('Vendor registered successfully!');
      }
      setShowModal(false);
      loadVendors();
    } catch (err) {
      showToast(err.message || 'Transaction failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await adminService.deleteVendor(id);
      showToast('Vendor deleted.');
      loadVendors();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Vendor Registry</h1>
          <p className="text-slate-400 font-medium">Manage wholesale suppliers and spare parts distributors.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-[#1c1c1c] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Register Vendor</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Person</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-xs text-slate-400 font-medium">No vendors registered.</td>
                  </tr>
                ) : (
                  vendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{v.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold lowercase mt-0.5">{v.email}</p>
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-700">{v.contactPerson}</td>
                      <td className="p-6 text-xs font-bold text-slate-700">{v.phoneNumber}</td>
                      <td className="p-6 text-xs text-slate-500 font-medium">{v.address || 'N/A'}</td>
                      <td className="p-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
                {editingVendor ? 'Modify Supplier' : 'Register Supplier'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Supplier Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none focus:border-slate-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Representative</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={e => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none focus:border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#1c1c1c] text-white font-bold uppercase tracking-widest rounded-xl text-xs">
                Save Vendor Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── PARTS INVENTORY MODULE ──────────────────────────────────
export const Parts = () => {
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    description: '',
    unitPrice: 0,
    stockQuantity: 0,
    reorderLevel: 5
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadParts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getParts();
      setParts(res?.result || res?.data || res || []);
    } catch (err) {
      showToast(err.message || 'Failed to load inventory', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  const handleOpenCreate = () => {
    setEditingPart(null);
    setFormData({ name: '', partNumber: '', description: '', unitPrice: 0, stockQuantity: 0, reorderLevel: 5 });
    setShowModal(true);
  };

  const handleOpenEdit = (part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      partNumber: part.partNumber,
      description: part.description || '',
      unitPrice: part.unitPrice || part.price || 0,
      stockQuantity: part.stockQuantity || 0,
      reorderLevel: part.reorderLevel || 5
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.partNumber) {
      showToast('Name and Part Number are required.', 'error');
      return;
    }
    try {
      const payload = {
        ...formData,
        unitPrice: Number(formData.unitPrice),
        stockQuantity: Number(formData.stockQuantity),
        reorderLevel: Number(formData.reorderLevel)
      };

      if (editingPart) {
        await adminService.updatePart(editingPart.id, payload);
        showToast('Part inventory updated!');
      } else {
        await adminService.createPart(payload);
        showToast('New part added to warehouse!');
      }
      setShowModal(false);
      loadParts();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this part?')) return;
    try {
      await adminService.deletePart(id);
      showToast('Part removed.');
      loadParts();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Parts Inventory</h1>
          <p className="text-slate-400 font-medium">Warehouse spare parts stock and reorder warnings.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-[#1c1c1c] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Add Part Spec</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Part Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU Code</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Stock</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-xs text-slate-400 font-medium">No parts found in inventory.</td>
                  </tr>
                ) : (
                  parts.map(p => {
                    const isLowStock = (p.stockQuantity || 0) <= (p.reorderLevel || 5);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{p.name}</p>
                          {p.description && <p className="text-[10px] text-slate-400 mt-0.5 italic">"{p.description}"</p>}
                        </td>
                        <td className="p-6 text-xs font-bold text-slate-700 uppercase">{p.partNumber}</td>
                        <td className="p-6">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            isLowStock ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.stockQuantity || 0} left {isLowStock && '⚠️'}
                          </span>
                        </td>
                        <td className="p-6 text-xs font-bold text-slate-900">Rs. {(p.unitPrice || p.price || 0).toLocaleString()}</td>
                        <td className="p-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
                {editingPart ? 'Modify Inventory Spec' : 'Add New Spec'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Part Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none focus:border-slate-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SKU / Part Number</label>
                <input
                  type="text"
                  value={formData.partNumber}
                  onChange={e => setFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Price (Rs.)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={e => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stock Qty</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={e => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Reorder Pt.</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={e => setFormData(prev => ({ ...prev, reorderLevel: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea
                  value={formData.description}
                  rows="3"
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-950"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#1c1c1c] text-white font-bold uppercase tracking-widest rounded-xl text-xs">
                Save Inventory Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── PURCHASES MODULE (PURCHASE INVOICES) ────────────────────
export const Purchases = () => {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [vendorId, setVendorId] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([
    { partId: '', quantity: 1, unitCost: 0 }
  ]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPurchaseInvoices();
      setInvoices(res?.result || res?.data || res || []);

      const vRes = await adminService.getVendors();
      setVendors(vRes?.result || vRes?.data || vRes || []);

      const pRes = await adminService.getParts();
      setParts(pRes?.result || pRes?.data || pRes || []);
    } catch (err) {
      showToast(err.message || 'Failed to load purchases', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addLine = () => setInvoiceItems(prev => [...prev, { partId: '', quantity: 1, unitCost: 0 }]);
  const removeLine = (idx) => setInvoiceItems(prev => prev.filter((_, i) => i !== idx));

  const updateLine = (idx, field, value) => {
    setInvoiceItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === 'partId') {
        const found = parts.find(p => p.id === value);
        if (found) {
          updated.unitCost = found.unitPrice || found.price || 0;
        }
      }
      return updated;
    }));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!vendorId) { showToast('Please select a supplier.', 'error'); return; }
    const valid = invoiceItems.filter(item => item.partId && item.quantity > 0);
    if (valid.length === 0) { showToast('Add at least one part item.', 'error'); return; }

    try {
      const payload = {
        vendorId,
        invoiceDate: new Date().toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        taxAmount: Number(taxAmount),
        items: valid.map(item => ({
          partId: item.partId,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost)
        }))
      };

      await adminService.createPurchaseInvoice(payload);
      showToast('Purchase invoice recorded successfully!');
      setShowModal(false);
      // Reset form
      setVendorId('');
      setTaxAmount(0);
      setDueDate('');
      setInvoiceItems([{ partId: '', quantity: 1, unitCost: 0 }]);
      loadData();
    } catch (err) {
      showToast(err.message || 'Create purchase invoice failed.', 'error');
    }
  };

  const handleReceiveStock = async (invoice) => {
    try {
      const payload = {
        items: invoice.items.map(item => ({
          itemId: item.id || item.purchaseInvoiceItemId,
          quantityReceived: item.quantity
        }))
      };

      await adminService.receiveStock(invoice.id, payload);
      showToast('Stock inventory updated successfully!');
      loadData();
    } catch (err) {
      showToast(err.message || 'Receiving stock failed.', 'error');
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase invoice?')) return;
    try {
      await adminService.deletePurchaseInvoice(id);
      showToast('Purchase invoice deleted.');
      loadData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitCost)), 0);
  const grandTotal = subtotal + Number(taxAmount);

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Purchase Logs</h1>
          <p className="text-slate-400 font-medium">Record wholesale part purchases and receive inventory stock.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#1c1c1c] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Record Purchase</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Supplier</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ordered Items</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Purchase</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-xs text-slate-400 font-medium">No purchase records registered.</td>
                  </tr>
                ) : (
                  invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-900 tracking-tighter uppercase">{invoice.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-700 uppercase">
                        {invoice.vendorName || invoice.vendor?.name || 'Unknown Supplier'}
                      </td>
                      <td className="p-6">
                        <div className="max-w-[200px] space-y-1">
                          {invoice.items?.map((item, idx) => (
                            <p key={idx} className="text-[10px] text-slate-500 font-medium truncate">
                              • {item.part?.name || item.partName || 'Part'} (x{item.quantity})
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-900">Rs. {invoice.totalAmount.toLocaleString()}</td>
                      <td className="p-6">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          invoice.status === 0 || invoice.status === 'Unpaid'
                            ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                            : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {invoice.status === 0 || invoice.status === 'Unpaid' ? 'Unpaid' : 'Paid & Received'}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        {(invoice.status === 0 || invoice.status === 'Unpaid') && (
                          <>
                            <button
                              onClick={() => handleReceiveStock(invoice)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Receive Stock
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {(invoice.status === 1 || invoice.status === 'Paid') && (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Record Part Purchase</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Supplier</label>
                  <select
                    value={vendorId}
                    onChange={e => setVendorId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="">-- Choose Supplier --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tax (Rs.)</label>
                  <input
                    type="number"
                    value={taxAmount}
                    onChange={e => setTaxAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Part Items List</label>
                  <button type="button" onClick={addLine} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Add Part Line</button>
                </div>
                <div className="space-y-3">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl relative">
                      <div className="flex-1 space-y-1">
                        <select
                          value={item.partId}
                          onChange={e => updateLine(idx, 'partId', e.target.value)}
                          className="w-full bg-white border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                          <option value="">-- Choose Part --</option>
                          {parts.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.partNumber})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          min="1"
                          onChange={e => updateLine(idx, 'quantity', Number(e.target.value))}
                          className="w-full bg-white border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold text-center"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          placeholder="Unit Cost"
                          value={item.unitCost}
                          onChange={e => updateLine(idx, 'unitCost', Number(e.target.value))}
                          className="w-full bg-white border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold text-right"
                        />
                      </div>
                      {invoiceItems.length > 1 && (
                        <button type="button" onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-6 rounded-3xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Part Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Tax Amount:</span>
                  <span>Rs. {taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 uppercase pt-2 border-t border-slate-200">
                  <span>Total Purchase Cost:</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#1c1c1c] text-white font-bold uppercase tracking-widest rounded-xl text-xs">
                Submit Purchase Log & Add Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── FINANCIAL REPORTS MODULE ────────────────────────────────
export const Reports = () => {
  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      let res;
      if (reportType === 'daily') {
        res = await adminService.getDailyReport();
      } else if (reportType === 'yearly') {
        res = await adminService.getYearlyReport();
      } else {
        res = await adminService.getMonthlyReport();
      }
      setReport(res?.result || res?.data || res || null);
    } catch (err) {
      showToast(err.message || 'Report fetch failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [reportType]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Financial Reports</h1>
          <p className="text-slate-400 font-medium">Daily, Monthly, and Yearly P&L margins.</p>
        </div>

        <div className="flex gap-2">
          {['daily', 'monthly', 'yearly'].map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                reportType === type
                  ? 'bg-[#1c1c1c] text-white border-transparent'
                  : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Revenue</p>
              <p className="text-xl font-black text-slate-900 mt-2">Rs. {(report?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operating Costs</p>
              <p className="text-xl font-black text-red-600 mt-2">Rs. {(report?.totalCosts || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operating Profit</p>
              <p className="text-xl font-black text-green-600 mt-2">Rs. {(report?.totalProfit || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profit Margin</p>
              <p className="text-xl font-black text-blue-600 mt-2">{(report?.profitMargin || 0).toFixed(1)}%</p>
            </div>
          </div>

          {/* List of Periods */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Period</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Costs</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Profit</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {!report?.lines || report.lines.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-xs text-slate-400 font-medium">No ledger details found for period.</td>
                    </tr>
                  ) : (
                    report.lines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 text-xs font-black text-slate-900 uppercase tracking-tighter">{line.period}</td>
                        <td className="p-6 text-xs font-bold text-slate-700">Rs. {line.revenue.toLocaleString()}</td>
                        <td className="p-6 text-xs font-bold text-red-600">Rs. {line.costs.toLocaleString()}</td>
                        <td className="p-6 text-xs font-bold text-green-600">Rs. {line.profit.toLocaleString()}</td>
                        <td className="p-6">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                            line.profitMargin >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {line.profitMargin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
