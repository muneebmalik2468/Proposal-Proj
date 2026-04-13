"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Spinner } from "@/components/ui/spinner";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  category: string | null;
  plan: "free" | "basic" | "pro" | "promax" | null;
  credits: number;
  credits_limit: number;
  is_admin: boolean;
  usage_count: number;
  plan_since: string | null;
  plan_expires: string | null;
  created_at: string;
}

interface EditingUser {
  [key: string]: Partial<User>;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingUser>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter out admin users and search
  const nonAdminUsers = users.filter((u) => !u.is_admin);
  const filteredUsers = nonAdminUsers.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (user: User) => {
    setEditing({
      ...editing,
      [user.id]: { ...user },
    });
  };

  const cancelEdit = (userId: string) => {
    const newEditing = { ...editing };
    delete newEditing[userId];
    setEditing(newEditing);
  };

  const updateEditField = (
    userId: string,
    field: keyof User,
    value: any
  ) => {
    setEditing({
      ...editing,
      [userId]: {
        ...editing[userId],
        [field]: value,
      },
    });
  };

  const saveUser = async (userId: string) => {
    const editedUser = editing[userId];
    if (!editedUser) return;

    setSaving({ ...saving, [userId]: true });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: editedUser.full_name,
          category: editedUser.category,
          plan: editedUser.plan,
          credits: editedUser.credits,
          credits_limit: editedUser.credits_limit,
          is_admin: editedUser.is_admin,
          usage_count: editedUser.usage_count,
          plan_expires: editedUser.plan_expires,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("User updated successfully");
        setUsers(users.map((u) => (u.id === userId ? data.user : u)));
        cancelEdit(userId);
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setSaving({ ...saving, [userId]: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Total users: <span className="font-semibold">{nonAdminUsers.length}</span>
            </p>
          </div>
          <div className="w-full lg:w-64">
            <label className="text-sm font-semibold text-slate-900">
              Search by email
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-slate-600">
                {searchQuery ? "No users found matching your search." : "No users to display."}
              </p>
            </Card>
          ) : (
            filteredUsers.map((user) => {
              const isEditing = editing[user.id];
              const isSaving = saving[user.id];

            return (
              <Card key={user.id} className="p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={isEditing.email || ""}
                        disabled
                        className="mt-1 w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-normal">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={isEditing.full_name || ""}
                        onChange={(e) =>
                          updateEditField(user.id, "full_name", e.target.value)
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900 break-words whitespace-normal">
                        {user.full_name || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Category
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={isEditing.category || ""}
                        onChange={(e) =>
                          updateEditField(user.id, "category", e.target.value)
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900 break-words whitespace-normal">
                        {user.category || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Plan
                    </label>
                    {isEditing ? (
                      <select
                        value={isEditing.plan || "free"}
                        onChange={(e) =>
                          updateEditField(user.id, "plan", e.target.value as "free" | "basic" | "pro" | "promax")
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="free">Free (5 credits)</option>
                        <option value="basic">Basic (15 credits)</option>
                        <option value="pro">Pro (200 credits)</option>
                        <option value="promax">ProMax (Unlimited)</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-slate-900 capitalize">
                        {user.plan || "free"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Credits Left
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={isEditing.credits || 0}
                        onChange={(e) =>
                          updateEditField(user.id, "credits", parseInt(e.target.value))
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900">{user.credits}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Credits Limit
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={isEditing.credits_limit || 0}
                        onChange={(e) =>
                          updateEditField(user.id, "credits_limit", parseInt(e.target.value))
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900">{user.credits_limit}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Admin
                    </label>
                    {isEditing ? (
                      <select
                        value={isEditing.is_admin ? "true" : "false"}
                        onChange={(e) =>
                          updateEditField(user.id, "is_admin", e.target.value === "true")
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-slate-900">
                        {user.is_admin ? "✓ Yes" : "No"}
                      </p>
                    )}
                  </div> */}

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Usage Count
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={isEditing.usage_count || 0}
                        onChange={(e) =>
                          updateEditField(user.id, "usage_count", parseInt(e.target.value))
                        }
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900">{user.usage_count}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Plan Expires
                    </label>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={isEditing.plan_expires ? new Date(isEditing.plan_expires).toISOString().slice(0, 16) : ""}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                          updateEditField(user.id, "plan_expires", date);
                        }}
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-900"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-slate-900">
                        {user.plan_expires ? new Date(user.plan_expires).toLocaleDateString() : "-"}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          className="flex-1 text-xs"
                          zone="navy"
                          onClick={() => saveUser(user.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? "..." : "Save"}
                        </Button>
                        <Button
                          className="flex-1 text-xs"
                          variant="secondary"
                          onClick={() => cancelEdit(user.id)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full text-xs"
                        variant="secondary"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
