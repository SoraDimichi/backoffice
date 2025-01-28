import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { CreateUserForm } from "./CreateUserForm";
import { RoleSelect as RS } from "./RoleSelect";
import { Boundary, useErrorBoundary } from "@/components/ui/Boundary";

const deleteUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc("delete_user", { user_id });
  if (error) throw Error(error.message);
  return data;
};

const updateRole = async (value: string, id: string) => {
  const { error } = await supabase
    .from("users")
    .update({ role: value })
    .eq("id", id);

  if (error) throw Error(error?.message);
};

const RoleSelectInner = (p: { role: string; id: string }) => {
  const { role, id } = p;
  const [loading, setLoading] = useState(false);

  const { showBoundary } = useErrorBoundary();
  const update = async (value: string) => {
    setLoading(true);
    await updateRole(value, id)
      .catch(showBoundary)
      .finally(() => setLoading(false));
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

  const del = async () => {
    setLoading(true);
    await deleteUser(id)
      .then(unmount)
      .catch(showBoundary)
      .finally(() => setLoading(false));
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

type UserP = { id: string; role: string; username: string };
const User = ({ id, role, username }: UserP) => {
  const [mounted, setMounted] = useState(true);

  if (!mounted) return null;

  return (
    <div key={id} className="border p-4 mt-2 flex space-x-2 rounded">
      <p className="font-semibold">{username}</p>
      <RoleSelect id={id} role={role} />
      <DeleteButton id={id} unmount={() => setMounted(false)} />
    </div>
  );
};

const getUsers = async () => {
  const { data, error } = await supabase.from("users").select();

  if (error) throw Error(error.message);

  return data;
};

type User = { id: string; role: string; username: string };
type UsersInnerP = { users: User[]; setUsers: (users: User[]) => void };
const UsersInner = ({ users, setUsers }: UsersInnerP) => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    getUsers().then(setUsers).catch(showBoundary);
  }, [showBoundary, setUsers]);

  return (
    <div>
      <h2 className="text-xl font-bold">User Management</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
        {users?.map((item) => <User {...item} />)}
      </div>
    </div>
  );
};

const Users: typeof UsersInner = (p) => (
  <Boundary>
    <UsersInner {...p} />
  </Boundary>
);
export type AddUser = (user: User) => void;
export const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const addUser = (user: User) => setUsers((prev) => [...prev, user]);

  return (
    <div className="space-y-4">
      <Users users={users} setUsers={setUsers} />
      <PlusButton addUser={addUser} className={"self-center"} />
    </div>
  );
};
type PlusButtonP = { className: string; addUser: AddUser };
const PlusButton = ({ className, addUser }: PlusButtonP) => {
  const [shown, setShowForm] = useState(false);

  return (
    <>
      <Button
        className={className}
        onClick={() => setShowForm((prev) => !prev)}
      >
        {shown ? "Close form" : "Create New User"}
      </Button>
      {shown && <CreateUserForm addUser={addUser} />}
    </>
  );
};

// const setUserRole = (userId: string, roleId: string) =>
//   supabase
//     .from("users")
//     .update({ role_id: roleId })
//     .match({ id: userId })
//     .then((r) => console.log(r.data))
//     .catch((e) => console.error(e));
//
// const createUser = () =>
//   supabase
//     .from("users")
//     .insert([{ name: nameValue, email: emailValue, password: passwordValue }])
//     .then(() => getUsers())
//     .catch((e) => console.error(e));
//
// const updateUser = (id: string, newName: string) =>
//   supabase
//     .from("users")
//     .update({ name: newName })
//     .match({ id })
//     .then(() => getUsers())
//     .catch((e) => console.error(e));
//
