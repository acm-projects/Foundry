import TeamMemberCard from "./TeamMemberCard";

export default function TeamMemberGrid({ members, setMembers }) {
  const handleRoleChange = (index, value) => {
    const updated = [...members];
    updated[index].role = value;
    setMembers(updated);
  };

  return (
    <div className="flex flex-col gap-2">
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