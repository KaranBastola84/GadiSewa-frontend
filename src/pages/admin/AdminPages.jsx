import React from 'react';

const PlaceholderAdminPage = ({ title }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">{title}</h1>
          <p className="text-slate-400 font-medium">Manage your {title.toLowerCase()} here.</p>
        </div>
      </div>
      <div className="bg-white p-12 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">{title} Module</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-md">This module is connected to the backend. Content will be populated from the API.</p>
      </div>
    </div>
  );
};

export const Vendors = () => <PlaceholderAdminPage title="Vendors" />;
export const Parts = () => <PlaceholderAdminPage title="Parts Inventory" />;
export const Purchases = () => <PlaceholderAdminPage title="Purchases" />;
export const Reports = () => <PlaceholderAdminPage title="Financial Reports" />;
