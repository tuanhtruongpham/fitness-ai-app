import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CheckIcon,
  EditIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site-header";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

function AdminDashboard() {
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
      authorization: token,
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
          "Khong the tai danh sach user. Hay kiem tra token admin."
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
        setError("Mat khau la bat buoc khi tao user moi.");
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
        setMessage("Cap nhat user thanh cong.");
      } else {
        const res = await axios.post(`${API_BASE}/admin/users`, payload, {
          headers: authHeaders,
        });

        setUsers((current) => [res.data.user, ...current]);
        setMessage("Tao user thanh cong.");
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Khong the luu user.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(`Xoa user ${user.fullName || user.email}?`);

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_BASE}/admin/users/${user._id}`, {
        headers: authHeaders,
      });

      setUsers((current) => current.filter((item) => item._id !== user._id));
      setMessage("Xoa user thanh cong.");
    } catch (err) {
      setError(err.response?.data?.message || "Khong the xoa user.");
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="User Management" />
          <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Admin Panel</p>
                <h1 className="text-2xl font-semibold tracking-normal">
                  Quan ly user
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tao, sua, xoa va phan quyen tai khoan nguoi dung.
                </p>
              </div>

              <Button variant="outline" onClick={fetchUsers} disabled={loading}>
                <RefreshCwIcon />
                Refresh
              </Button>
            </header>

            {(message || error) && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  error
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-primary/40 bg-primary/10 text-primary"
                }`}
              >
                {error || message}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>
                  {editingUser ? "Sua user" : "Tao user moi"}
                </CardTitle>
                <CardDescription>
                  Khi sua user, de trong password neu khong muon doi mat khau.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
                  onSubmit={handleSubmit}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      required={!editingUser}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) => updateField("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 md:col-span-2 xl:col-span-5">
                    <Button type="submit" disabled={saving}>
                      {editingUser ? <CheckIcon /> : <PlusIcon />}
                      {editingUser ? "Luu thay doi" : "Tao user"}
                    </Button>
                    {editingUser && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <XIcon />
                        Huy
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Danh sach user</CardTitle>
                  <CardDescription>
                    {filteredUsers.length} tai khoan
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-80">
                  <SearchIcon className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Tim ten, email, phone, role..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Dang tai user...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Khong co user phu hop.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.fullName || "No name"}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "border-primary/40 text-primary"
                                  : "text-muted-foreground"
                              }
                            >
                              {user.role || "user"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEdit(user)}
                              >
                                <EditIcon />
                                Sua
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(user)}
                              >
                                <Trash2Icon />
                                Xoa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default AdminDashboard;
