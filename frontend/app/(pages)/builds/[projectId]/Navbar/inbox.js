import { Inbox, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Invite_Inbox() {
const [open, setOpen] = useState(false);
const [invitations, setInvitations] = useState([
{ id: 1, projectName: "Project Alpha", inviter: "Alice" },
{ id: 2, projectName: "Project Beta", inviter: "Bob" },
]);
const boxRef = useRef(null);

useEffect(() => {
const onDocClick = (e) => {
if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
};
document.addEventListener("mousedown", onDocClick);
return () => document.removeEventListener("mousedown", onDocClick);
}, []);

const handleAction = (id) => {
setInvitations((prev) => prev.filter((invite) => invite.id !== id));
};

return (
<div className="relative" ref={boxRef}>
<div
onClick={() => setOpen((v) => !v)}
className="flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer"
aria-haspopup="true"
aria-expanded={open}
>
<Inbox className="h-7 w-7" />
</div>

{open && (
<div className="absolute -right-10 top-full mt-2 z-50 w-80 max-w-[90vw] rounded-xl border border-gray-200 bg-gray-100 shadow-lg">
<ul className="max-h-60 overflow-auto divide-y divide-gray-100">
{invitations.length === 0 && (
    <li className="p-3 text-sm text-gray-500">No invitations</li>
)}
{invitations.map((invite) => (
    <li key={invite.id} className="flex items-center justify-between gap-3 p-3">
    <p className="text-sm text-gray-900">
        <span className="font-medium">{invite.inviter}</span> invited you to{" "}
        <span className="font-semibold">{invite.projectName}</span>
    </p>
    <div className="flex items-center gap-2">
        <button className="p-1 rounded hover:bg-gray-200" aria-label="Decline"onClick={() => handleAction(invite.id)}>
        <X className="h-5 w-5" />
        </button>
        <button className="p-1 rounded hover:bg-gray-200" aria-label="Accept" onClick={() => handleAction(invite.id)}>
        <Check className="h-5 w-5" />
        </button>
    </div>
    </li>
))}
</ul>
</div>
)}
</div>
);
}

