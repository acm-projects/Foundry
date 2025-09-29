import {Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetContent, SheetClose} from '../components/ui/sheet'
import {Input} from '../components/ui/input'
// import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '../components/ui/dropdown-menu'

export default function EC2InstanceConfigMenu(){
  return(
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"> EC2 Drag Simulate </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>EC2 Instance 1</SheetTitle>
            <SheetDescription>Configure your EC2 Instance 1 instance with the required parameters.</SheetDescription>
          </SheetHeader>
          <Input type="ami-id" placeholder="ami-0123456789abcdef0"></Input>
          <Input type="key-pair-name" placeholder="my-key-pair"></Input>
          <Input type="security-group-id" placeholder="sg-0123456789abcdef0"></Input>
          <Input type="subnet-vpc" placeholder="subnet-0123456789abcdef0"></Input>
        </SheetContent>
      </Sheet>
    </div>
  )
}
