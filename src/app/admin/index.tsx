import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FormButton } from "./CreateUserForm";
import { RoleSelect as RS } from "./RoleSelect";
import { Boundary, useErrorBoundary } from "@/components/ui/Boundary";
import { Header, logout } from "@/components/Header";
import { UserView } from "./type";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/context";
import { useNavigate } from "react-router-dom";

const deleteUser = async (p_user_id: string) => {
  const { data, error } = await supabase.rpc("delete_user", { p_user_id });
  if (error) throw Error(error.message);
  return data;
};

const updateRole = async (value: string, id: string) => {
  const { error, data } = await supabase
    .from("users")
    .update({ role: value })
    .eq("id", id)
    .select("id");

  if (error) throw Error(error?.message);
  return data[0]?.id;
};

const RoleSelectInner = (p: { role: string; id: string }) => {
  const { role, id } = p;
  const { user } = useUser();
  const push = useNavigate();
  const [loading, setLoading] = useState(false);

  const { showBoundary } = useErrorBoundary();
  const update = async (value: string) => {
    setLoading(true);
    try {
      const user_id = await updateRole(value, id);
      if (user?.id === user_id) await logout().finally(() => push("/auth"));
      setLoading(false);
    } catch (error) {
      showBoundary(error);
    }
  };

  return <RS disabled={loading} onValueChange={update} value={role} />;
};

const RoleSelect: typeof RoleSelectInner = (p) => (
  <Boundary>
    <RoleSelectInner {...p} />
  </Boundary>
);

type DeleteButtonInnerP = { id: string; unmount: () => void };
const DeleteButtonInner = (p: DeleteButtonInnerP) => {
  const { id, unmount } = p;
  const { showBoundary } = useErrorBoundary();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const push = useNavigate();

  const del = async () => {
    setLoading(true);
    try {
      const user_id = await deleteUser(id);
      if (user?.id === user_id) await logout().finally(() => push("/auth"));
      setLoading(false);
      unmount();
    } catch (error) {
      showBoundary(error);
    }
  };

  return (
    <Button disabled={loading} onClick={del}>
      Delete
    </Button>
  );
};

const DeleteButton: typeof DeleteButtonInner = (p) => (
  <Boundary>
    <DeleteButtonInner {...p} />
  </Boundary>
);

const UserItem = ({ id, role, username, email }: UserView) => {
  const [mounted, setMounted] = useState(true);

  if (!mounted) return null;

  return (
    <div
      key={id}
      className="border p-4 mt-2 flex space-x-2 justify-between rounded"
    >
      <div className="flex flex-col">
        <p className="font-semibold">{username}</p>
        <p className="text-sm">{email}</p>
        <p className="text-sm text-gray-500">{id}</p>
      </div>
      <div className="flex gap-4">
        <RoleSelect id={id} role={role} />
        <DeleteButton id={id} unmount={() => setMounted(false)} />
      </div>
    </div>
  );
};

const getUsers = async () => {
  const { data, error } = await supabase.from("users_with_email").select();

  if (error) throw Error(error.message);

  return data;
};

type UsersInnerP = {
  users: UserView[] | null;
  setUsers: (users: UserView[]) => void;
};
const UsersInner = ({ users, setUsers }: UsersInnerP) => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    getUsers().then(setUsers).catch(showBoundary);
  }, [showBoundary, setUsers]);

  if (users === null) return <Progress className="mt-4 justify-self-center" />;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-1">
      {users?.map((item) => <UserItem {...item} />)}
    </div>
  );
};

const Users: typeof UsersInner = (p) => (
  <Boundary>
    <UsersInner {...p} />
  </Boundary>
);

export type AddUser = (user: UserView) => void;
const AdminInner = () => {
  const [users, setUsers] = useState<UserView[] | null>(null);
  const addUser = (user: UserView) =>
    setUsers((prev) => {
      if (!prev) return [user];
      return [...prev, user];
    });

  return (
    <div className="container mx-auto py-10 grid">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <FormButton addUser={addUser} className={"self-center"} />
      </div>
      <Users users={users} setUsers={setUsers} />
    </div>
  );
};

export const Admin = () => (
  <div>
    <Header />
    <AdminInner />
  </div>
);
