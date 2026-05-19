import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { USER_ROLES } from "../../context/AuthContext";
import { adminUsersService } from "../../services/adminUsersService";

const roleLabels = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.STAFF]: "Staff",
  [USER_ROLES.CUSTOMER]: "Customer",
};

const initialForm = {
  roleType: "staff",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  employeeCode: "",
  position: "",
  hireDate: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [form, setForm] = useState(initialForm);

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

  const stats = useMemo(
    () => ({
      adminCount: users.filter((user) => user.role === USER_ROLES.ADMIN).length,
      staffCount: users.filter((user) => user.role === USER_ROLES.STAFF).length,
      customerCount: users.filter((user) => user.role === USER_ROLES.CUSTOMER)
        .length,
    }),
    [users],
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const basePayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim(),
    };

    try {
      if (form.roleType === "admin") {
        await adminUsersService.createAdminAccount(basePayload);
      } else {
        await adminUsersService.createStaffAccount({
          ...basePayload,
          employeeCode: form.employeeCode.trim(),
          position: form.position.trim(),
          hireDate: form.hireDate,
        });
      }

      resetForm();
      await loadUsers();
    } catch (createError) {
      setError(createError.message || "Failed to create account.");
    } finally {
      setSaving(false);
    }
  };

  const openUserDetails = async (userId) => {
    setDetailLoading(true);
    setSelectedUser(null);
    setShowDetailModal(true);
    setError("");

    try {
      const response = await adminUsersService.getUserById(userId);
      setSelectedUser(response?.result || null);
    } catch (detailError) {
      setError(detailError.message || "Failed to load user details.");
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

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
      subtitle="Create staff and admin accounts, then manage access state"
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Create account</h2>
            <p className="text-sm text-slate-500">
              Use the correct endpoint for staff or admin account creation.
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

        <form className="mt-5 space-y-4" onSubmit={handleCreateUser}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Role type"
              name="roleType"
              value={form.roleType}
              onChange={handleFormChange}
              asSelect
            >
              <option value="staff">Staff account</option>
              <option value="admin">Admin account</option>
            </Field>
            <Field
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleFormChange}
              required
            />
          </div>

          {form.roleType === "staff" && (
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Employee code"
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleFormChange}
                required
              />
              <Field
                label="Position"
                name="position"
                value={form.position}
                onChange={handleFormChange}
                required
              />
              <Field
                label="Hire date"
                name="hireDate"
                type="date"
                value={form.hireDate}
                onChange={handleFormChange}
                required
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving
                ? "Creating..."
                : form.roleType === "admin"
                  ? "Create admin"
                  : "Create staff"}
            </button>
          </div>
        </form>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
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
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => openUserDetails(user.userId)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(user)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Toggle status
                          </button>
                        </div>
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

      {showDetailModal && (
        <Modal title="User details" onClose={() => setShowDetailModal(false)}>
          {detailLoading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading user details...
            </div>
          ) : selectedUser ? (
            <div className="space-y-3 text-sm text-slate-700">
              <DetailRow label="Full name" value={selectedUser.fullName} />
              <DetailRow label="Email" value={selectedUser.email} />
              <DetailRow label="Phone" value={selectedUser.phoneNumber} />
              <DetailRow
                label="Role"
                value={roleLabels[selectedUser.role] || selectedUser.role}
              />
              <DetailRow
                label="Status"
                value={selectedUser.isActive ? "Active" : "Inactive"}
              />
              <DetailRow
                label="Last login"
                value={
                  selectedUser.lastLoginAt
                    ? new Date(selectedUser.lastLoginAt).toLocaleString()
                    : "Never"
                }
              />
              <DetailRow label="User ID" value={selectedUser.userId} />
            </div>
          ) : (
            <p className="py-6 text-sm text-slate-500">
              No user details available.
            </p>
          )}
        </Modal>
      )}
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

function Field({ label, asSelect = false, children, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {asSelect ? (
        <select
          {...props}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        >
          {children}
        </select>
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
