import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminUsersService } from "../../services";
import { adminStaffService } from "../../services";
import { USER_ROLES } from "../../context/AuthContext";

const roleLabels = {
  Admin: "Admin",
  Staff: "Staff",
  Customer: "Customer",
  1: "Admin",
  2: "Staff",
  3: "Customer",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Staff modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    position: "",
    hireDate: "",
    isAvailable: true,
  });
  const [staffError, setStaffError] = useState("");
  const [staffSaving, setStaffSaving] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminUsersService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load staff
  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      const response = await adminStaffService.getAllStaff();
      setStaff(response.data || []);
    } catch (error) {
      console.error("Error loading staff:", error);
      setStaff([]);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadStaff();
  }, []);

  // Handle user detail view
  const openUserDetails = async (userId) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    try {
      const response = await adminUsersService.getUserById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error loading user details:", error);
      setSelectedUser(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Toggle user status
  const toggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      await adminUsersService.updateUserStatus(user.userId, newStatus);
      loadUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  // Open staff edit modal
  const openStaffEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    const { firstName, lastName } = splitFullName(staffMember.fullName || "");
    setStaffForm({
      firstName,
      lastName,
      phoneNumber: staffMember.phoneNumber || "",
      position: staffMember.position || "",
      hireDate: normalizeDateInput(staffMember.hireDate || ""),
      isAvailable: staffMember.isAvailable ?? true,
    });
    setStaffError("");
    setShowStaffModal(true);
  };

  // Handle staff form change
  const handleStaffFormChange = (event) => {
    const { name, value } = event.target;
    setStaffForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle staff update
  const handleStaffUpdate = async (event) => {
    event.preventDefault();
    setStaffError("");
    setStaffSaving(true);

    try {
      const payload = {
        firstName: staffForm.firstName.trim(),
        lastName: staffForm.lastName.trim(),
        phoneNumber: staffForm.phoneNumber.trim(),
        position: staffForm.position.trim(),
        hireDate: staffForm.hireDate,
        isAvailable: staffForm.isAvailable,
      };

      await adminStaffService.updateStaff(selectedStaff.staffId, payload);
      setShowStaffModal(false);
      loadStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      setStaffError(
        error.response?.data?.message || "Failed to update staff member",
      );
    } finally {
      setStaffSaving(false);
    }
  };

  // Handle staff delete
  const handleStaffDelete = async (staffId) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      await adminStaffService.deleteStaff(staffId);
      loadStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-950">Users & Staff</h1>
          <p className="mt-1 text-slate-600">
            Manage customer and staff accounts across the platform.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === "users"
                ? "border-b-2 border-slate-950 text-slate-950"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === "staff"
                ? "border-b-2 border-slate-950 text-slate-950"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Staff ({staff.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  User directory
                </h2>
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
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Staff directory
                </h2>
                <p className="text-sm text-slate-500">
                  Manage staff members and their assignments.
                </p>
              </div>
              <button
                type="button"
                onClick={loadStaff}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {staffLoading ? (
              <div className="py-20 text-center text-sm text-slate-500">
                Loading staff...
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <Th>Name</Th>
                        <Th>Position</Th>
                        <Th>Phone</Th>
                        <Th>Hire Date</Th>
                        <Th>Status</Th>
                        <Th className="text-right">Action</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {staff.map((member) => (
                        <tr key={member.staffId}>
                          <Td>
                            <div>
                              <p className="font-semibold text-slate-950">
                                {member.fullName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {member.staffId}
                              </p>
                            </div>
                          </Td>
                          <Td>{member.position}</Td>
                          <Td>{member.phoneNumber}</Td>
                          <Td>
                            {member.hireDate
                              ? new Date(member.hireDate).toLocaleDateString()
                              : "-"}
                          </Td>
                          <Td>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                member.isAvailable
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {member.isAvailable ? "Available" : "Unavailable"}
                            </span>
                          </Td>
                          <Td className="text-right">
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => openStaffEdit(member)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleStaffDelete(member.staffId)
                                }
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </Td>
                        </tr>
                      ))}
                      {staff.length === 0 && (
                        <tr>
                          <Td
                            colSpan={6}
                            className="py-12 text-center text-sm text-slate-500"
                          >
                            No staff members available yet.
                          </Td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* User Detail Modal */}
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

      {/* Staff Edit Modal */}
      {showStaffModal && (
        <Modal title="Edit staff" onClose={() => setShowStaffModal(false)}>
          <form className="space-y-4" onSubmit={handleStaffUpdate}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="First name"
                name="firstName"
                value={staffForm.firstName}
                onChange={handleStaffFormChange}
                required
              />
              <Field
                label="Last name"
                name="lastName"
                value={staffForm.lastName}
                onChange={handleStaffFormChange}
                required
              />
              <Field
                label="Phone"
                name="phoneNumber"
                value={staffForm.phoneNumber}
                onChange={handleStaffFormChange}
              />
              <Field
                label="Position"
                name="position"
                value={staffForm.position}
                onChange={handleStaffFormChange}
                required
              />
              <Field
                label="Hire date"
                name="hireDate"
                type="date"
                value={staffForm.hireDate}
                onChange={handleStaffFormChange}
                required
              />
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={staffForm.isAvailable}
                  onChange={(event) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      isAvailable: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Available for assignments
              </label>
            </div>

            {staffError && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {staffError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={staffSaving}
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {staffSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}

function splitFullName(fullName) {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function normalizeDateInput(value) {
  if (!value) return "";
  if (value.length >= 10) return value.slice(0, 10);
  return value;
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
