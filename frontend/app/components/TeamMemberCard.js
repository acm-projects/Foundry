import { Item, ItemActions, ItemContent, ItemTitle} from '@/app/components/ui/item'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem, SelectGroup } from "@/app/components/ui/select";
import { User } from 'lucide-react';

export default function TeamMemberCard({ member, onRoleChange }){
  return (
    <Item
      variant="outline"
      className="border border-gray-300 rounded-md hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-400 transition"
    >
      <ItemContent>
        <div className="flex gap-5 items-center">
          <User />
          <ItemTitle>{member.email}</ItemTitle>
        </div>
      </ItemContent>
      <ItemActions>
        <Select value={member.role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Read" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="modify">Modify</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ItemActions>
    </Item>
  );
}