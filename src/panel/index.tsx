import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { createAdmin, CreateUserForm } from "./CreateUserForm";
import { RoleSelect as RS } from "./RoleSelect";
import { Boundary, useErrorBoundary } from "@/components/ui/Boundary";

const deleteUser = async (id: string) => {
  console.log(id);
  const { data, error } = await supabase.from("users").delete().eq("id", id);
  console.log(data);
  if (error) throw Error(error.message);
  return data;
};

const updateRole = async (value: string, id: string) => {
  if (value === "user") {
    const { error, data } = await supabase.from("users").delete().match({ id });

    if (error) throw Error(error.message);

    return data;
  }

  return createAdmin(id);
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

const DeleteButtonInner = (p: { id: string }) => {
  const { showBoundary } = useErrorBoundary();
  const [loading, setLoading] = useState(false);

  const del = async () => {
    setLoading(true);
    await deleteUser(p.id)
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

export const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);

  const getUsers = () =>
    supabase
      .from("users")
      .select("*")
      .then((r) => (r.data ? setUsers(r.data) : setUsers([])));

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
          {users?.map((userItem) => (
            <div
              key={userItem.id}
              className="border p-4 mt-2 flex space-x-2 rounded"
            >
              <p className="font-semibold">{userItem.username}</p>
              <RoleSelect id={userItem.user_id} role={userItem.role} />
              <DeleteButton id={userItem.user_id} />
            </div>
          ))}
        </div>
      </div>
      <PlusButton className={"self-center"} />
    </div>
  );
};

const PlusButton = ({ className }: { className: string }) => {
  const [shown, setShowForm] = useState(false);

  return (
    <>
      <Button
        className={className}
        onClick={() => setShowForm((prev) => !prev)}
      >
        {shown ? "Close form" : "Create New User"}
      </Button>
      {shown && <CreateUserForm />}
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
