import { Item, ItemActions, ItemContent, ItemTitle} from '@/app/components/ui/item'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem, SelectGroup } from "@/app/components/ui/select";
import { User } from 'lucide-react';

export default function TeamMemberCard({ member, onRoleChange }){
  return(
    <>
      <Item variant="outline">
        <ItemContent>
          <div className="flex gap-5">
            <User/>
            <ItemTitle>{member.name}</ItemTitle>
          </div>
        </ItemContent>
        <ItemActions>
          <Select value={member.role} onValueChange={onRoleChange}>
            <SelectTrigger>
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
    </>
  )
}