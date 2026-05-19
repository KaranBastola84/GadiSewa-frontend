import React, { useState } from "react";
import StaffLayout from "../../components/StaffLayout";
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Tag } from "lucide-react";

const partsInventory = [
  { id: "P-101", name: "Brake Pads (Ceramic)", category: "Brakes", price: 3500, stock: 15, image: "https://placehold.co/100x100/e2e8f0/475569?text=Brake" },
  { id: "P-102", name: "Oil Filter", category: "Engine", price: 850, stock: 42, image: "https://placehold.co/100x100/e2e8f0/475569?text=Filter" },
  { id: "P-103", name: "Spark Plug Set", category: "Engine", price: 2100, stock: 8, image: "https://placehold.co/100x100/e2e8f0/475569?text=Spark" },
  { id: "P-104", name: "Air Filter", category: "Engine", price: 1200, stock: 24, image: "https://placehold.co/100x100/e2e8f0/475569?text=Air" },
  { id: "P-105", name: "Headlight Bulb (LED)", category: "Electrical", price: 4500, stock: 6, image: "https://placehold.co/100x100/e2e8f0/475569?text=Bulb" },
];

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  const filteredParts = partsInventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (part) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === part.id);
      if (existing) {
        return prev.map(item => item.id === part.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...part, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subTotal * 0.13; // 13% VAT
  const total = subTotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty");
    alert("Checkout functionality would trigger here! Invoice generated.");
    setCart([]);
  };

  return (
    <StaffLayout pageTitle="Point of Sale" subtitle="Process new part sales and generate invoices dynamically.">
      <div className="flex flex-col lg:flex-row gap-8 pb-12">
        {/* Left Side: Inventory */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search parts by name or SKU..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/60 shadow-xs text-slate-900 rounded-2xl focus:outline-hidden focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Parts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredParts.map(part => (
              <div key={part.id} className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer" onClick={() => addToCart(part)}>
                <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                  <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-xs rounded-md text-[10px] font-bold text-slate-700 shadow-xs">
                    {part.stock} in stock
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mb-1 block">{part.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{part.name}</h3>
                  <p className="text-xs text-slate-500">{part.id}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-900">रु {part.price.toLocaleString()}</span>
                  <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredParts.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-slate-500">
                No parts found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart */}
        <div className="w-full lg:w-96 xl:w-[400px] shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs flex flex-col h-auto lg:sticky lg:top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-bold text-slate-900">Current Order</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">{cart.length} items</span>
            </div>

            <div className="p-6 flex-1 max-h-[400px] overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                  <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium text-sm">Your cart is empty.</p>
                  <p className="text-xs mt-1">Select parts from inventory.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{item.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <span>रु {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><X className="w-4 h-4" /></button>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200/60">
                        <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center bg-white rounded-md shadow-xs text-slate-600 hover:text-rose-600"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center bg-white rounded-md shadow-xs text-slate-600 hover:text-emerald-600"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-4">
              {/* Discount Input */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number" 
                  value={discount > 0 ? discount : ""}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="Discount Amount (रु)" 
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">रु {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tax (13% VAT)</span>
                  <span className="font-medium text-slate-900">रु {tax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- रु {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-black text-emerald-600">रु {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10"
              >
                <CreditCard className="w-5 h-5" />
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
