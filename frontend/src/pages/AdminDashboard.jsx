import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  EditIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
} from "lucide-react";

import "./AdminDashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

function AdminDashboard({ onNavigate, onLogout }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE}/admin/users`, {
        headers: authHeaders,
      });

      setUsers(res.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách user. Hãy kiểm tra quyền admin."
      );
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      [user.fullName, user.email, user.phone, user.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [search, users]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingUser(null);
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setMessage("");
    setError("");

    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "user",
    });
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (!editingUser && !payload.password) {
        setError("Mật khẩu là bắt buộc khi tạo user mới.");
        return;
      }

      if (editingUser) {
        const res = await axios.put(
          `${API_BASE}/admin/users/${editingUser._id}`,
          payload,
          { headers: authHeaders }
        );

        setUsers((current) =>
          current.map((user) =>
            user._id === editingUser._id ? res.data.user : user
          )
        );

        setMessage("Cập nhật user thành công.");
      } else {
        const res = await axios.post(`${API_BASE}/admin/users`, payload, {
          headers: authHeaders,
        });

        setUsers((current) => [res.data.user, ...current]);
        setMessage("Tạo user thành công.");
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu user.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Xóa user ${user.fullName || user.email}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_BASE}/admin/users/${user._id}`, {
        headers: authHeaders,
      });

      setUsers((current) => current.filter((item) => item._id !== user._id));
      setMessage("Xóa user thành công.");
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa user.");
    }
  };

  return (
    <div className="app-layout">
            <div className="admin-sidebar">
        <div>
          <h1 className="admin-logo">
            FITNESS <span>UT</span>
          </h1>

          <div className="admin-menu">
            <div className="admin-menu-item" onClick={() => onNavigate("home")}>
              Dashboard
            </div>

            <div className="admin-menu-item" onClick={() => onNavigate("workout")}>
              Workout
            </div>

            <div className="admin-menu-item" onClick={() => onNavigate("meal")}>
              Meal Plan
            </div>

            <div className="admin-menu-item" onClick={() => onNavigate("progress")}>
              Progress
            </div>

            <div className="admin-menu-item" onClick={() => onNavigate("ai-coach")}>
              AI Coach
            </div>

            <div className="admin-menu-item" onClick={() => onNavigate("profile")}>
              Profile
            </div>

            <div className="admin-menu-active" onClick={() => onNavigate("admin")}>
              Admin
            </div>
          </div>
        </div>

        <div className="admin-logout" onClick={onLogout}>
          Logout
        </div>
      </div>

      <main className="main-content admin-page">
        <div className="admin-header">
          <div>
            <h1>Quản lý user</h1>
            <p>Tạo, sửa, xóa và phân quyền tài khoản người dùng.</p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCwIcon size={16} />
            Refresh
          </button>
        </div>

        {(message || error) && (
          <div className={error ? "admin-alert error" : "admin-alert success"}>
            {error || message}
          </div>
        )}

        <section className="admin-card">
          <div className="admin-card-title">
            <h2>{editingUser ? "Sửa user" : "Tạo user mới"}</h2>
            <p>
              Khi sửa user, để trống password nếu không muốn đổi mật khẩu.
            </p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label>Full name</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required={!editingUser}
              />
            </div>

            <div className="admin-field">
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="admin-actions">
              <button className="admin-main-btn" type="submit" disabled={saving}>
                {editingUser ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
                {editingUser ? "Lưu thay đổi" : "Tạo user"}
              </button>

              {editingUser && (
                <button
                  className="admin-cancel-btn"
                  type="button"
                  onClick={resetForm}
                >
                  <XIcon size={16} />
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card">
          <div className="admin-list-header">
            <div>
              <h2>Danh sách user</h2>
              <p>{filteredUsers.length} tài khoản</p>
            </div>

            <div className="admin-search">
              <SearchIcon size={16} />
              <input
                placeholder="Tìm tên, email, phone, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      Đang tải user...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      Không có user phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName || "No name"}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "-"}</td>
                      <td>
                        <span
                          className={
                            user.role === "admin"
                              ? "role-badge admin"
                              : "role-badge"
                          }
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => startEdit(user)}>
                            <EditIcon size={14} />
                            Sửa
                          </button>

                          <button
                            className="delete"
                            onClick={() => deleteUser(user)}
                          >
                            <Trash2Icon size={14} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;