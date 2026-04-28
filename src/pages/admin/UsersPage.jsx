import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminUsersService } from "../../services/adminUsersService";
import { USER_ROLES } from "../../context/AuthContext";

const roleLabels = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.STAFF]: "Staff",
  [USER_ROLES.CUSTOMER]: "Customer",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminUsersService.getUsers();
      setUsers(response?.result || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const stats = useMemo(() => {
    return {
      adminCount: users.filter((user) => user.role === USER_ROLES.ADMIN).length,
      staffCount: users.filter((user) => user.role === USER_ROLES.STAFF).length,
      customerCount: users.filter((user) => user.role === USER_ROLES.CUSTOMER)
        .length,
    };
  }, [users]);

  const toggleStatus = async (user) => {
    try {
      await adminUsersService.updateUserStatus(user.userId, {
        isActive: !user.isActive,
      });
      await loadUsers();
    } catch (updateError) {
      setError(updateError.message || "Failed to update user status.");
    }
  };

  return (
    <AdminLayout
      pageTitle="Users"
      subtitle="Review staff and admin accounts, then manage their status"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Admins" value={stats.adminCount} />
        <StatCard label="Staff" value={stats.staffCount} />
        <StatCard label="Customers" value={stats.customerCount} />
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">User directory</h2>
            <p className="text-sm text-slate-500">
              Monitor roles, login activity, and account state.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Last login</Th>
                    <Th className="text-right">Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <Td>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.userId}
                          </p>
                        </div>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>{user.phoneNumber}</Td>
                      <Td>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {roleLabels[user.role] || user.role}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </Td>
                      <Td>
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString()
                          : "Never"}
                      </Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          onClick={() => toggleStatus(user)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Toggle status
                        </button>
                      </Td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <Td
                        colSpan={7}
                        className="py-12 text-center text-sm text-slate-500"
                      >
                        No users available yet.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
    </div>
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
