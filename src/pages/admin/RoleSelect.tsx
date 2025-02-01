import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export const RoleSelect = ({ onValueChange, value }: SelectProps) => (
  <Select onValueChange={onValueChange} defaultValue={value}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="user">User</SelectItem>
      <SelectItem value="admin">Admin</SelectItem>
    </SelectContent>
  </Select>
);
