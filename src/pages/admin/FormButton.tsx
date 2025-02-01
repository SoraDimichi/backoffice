import { CreateUserForm, AddUser } from "@/components/forms/CreateUser";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FormButtonP = { className: string; addUser: AddUser };
export const FormButton = ({ className, addUser }: FormButtonP) => {
  const [shown, setShowForm] = useState(false);

  const close = () => setShowForm(false);

  return (
    <div>
      <Button className={className} onClick={() => setShowForm(true)}>
        Create New User
      </Button>
      {shown && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-20 flex items-center justify-center z-50">
          <div className="relative min-w-75">
            <CreateUserForm addUser={addUser} close={close} />
            <Button className="absolute absolute top-7 right-4" onClick={close}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
