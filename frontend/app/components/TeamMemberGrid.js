import TeamMemberCard from "./TeamMemberCard";
import { Input } from '@/app/components/ui/input'

export default function TeamMemberGrid({ members, setMembers }) {
  const handleRoleChange = (index, value) => {
    const updated = [...members];
    updated[index].role = value;
    setMembers(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Enter a GitHub username..."/>
      {members.map((member, index) => (
        <TeamMemberCard
          key={index}
          member={member}
          onRoleChange={(value) => handleRoleChange(index, value)}
        />
      ))}
    </div>
  );
}