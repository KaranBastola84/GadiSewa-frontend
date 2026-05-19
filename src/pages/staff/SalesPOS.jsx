import React, { useState } from 'react';
import Button from '../../components/Button';

const SalesPOS = () => {
  const [cart, setCart] = useState([]);
  const [searchPart, setSearchPart] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const availableParts = [
    { id: 'P001', name: 'Brake Pad (Front)', price: 2500, stock: 45 },
    { id: 'P002', name: 'Engine Oil (4L)', price: 4200, stock: 12 },
    { id: 'P003', name: 'Air Filter', price: 1200, stock: 8 },
    { id: 'P004', name: 'Lead Acid Battery', price: 8500, stock: 5 },
    { id: 'P005', name: 'Spark Plug', price: 600, stock: 100 },
    { id: 'P006', name: 'Fuel Filter', price: 1800, stock: 15 },
  ];

  const addToCart = (part) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      setCart(cart.map(item => item.id === part.id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, {...part, qty: 1}]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[calc(100vh-160px)]">
      {/* Product Selection */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">New Part Sale</h1>
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search parts..." 
              value={searchPart}
              onChange={(e) => setSearchPart(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {availableParts.filter(p => p.name.toLowerCase().includes(searchPart.toLowerCase())).map(part => (
            <div 
              key={part.id} 
              onClick={() => addToCart(part)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 cursor-pointer transition-all active:scale-95 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${part.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {part.stock} IN STOCK
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{part.name}</h3>
              <p className="text-lg font-black text-slate-900 mt-2">Rs. {part.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / Invoice Panel */}
      <div className="w-full lg:w-[400px] bg-white rounded-3xl border border-slate-100 shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 bg-[#1a1a1a] text-white">
          <h2 className="text-lg font-bold uppercase tracking-tighter italic">Current Invoice</h2>
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Search Customer..." 
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="font-bold text-xs uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Rs. {item.price} x {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">Rs. {item.price * item.qty}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-black text-slate-900">Rs. {total.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all">Credit</button>
            <button className="bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all">Cash/Online</button>
          </div>
          <Button disabled={cart.length === 0} onClick={() => alert('Invoice Created & Emailed to Customer')}>
            Checkout & Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesPOS;
