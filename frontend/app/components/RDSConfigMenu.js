import {Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetContent, SheetClose} from '../components/ui/sheet'
import {Input} from '../components/ui/input'
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '../components/ui/dropdown-menu'

export default function RDSConfigMenu(){
  return(
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"> RDS Drag Simulate </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>RDS 1</SheetTitle>
            <SheetDescription>Configure your RDS 1 instance with the required parameters.</SheetDescription>
          </SheetHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Select DB Engine      ⌄ </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                MySQL
              </DropdownMenuItem>
              <DropdownMenuItem>
                PostgreSQL
              </DropdownMenuItem>
              <DropdownMenuItem>
                MariaDB
              </DropdownMenuItem>
              <DropdownMenuItem>
                Oracle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Select instance class      ⌄ </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                db.t3.micro
              </DropdownMenuItem>
              <DropdownMenuItem>
                db.t3.small
              </DropdownMenuItem>
              <DropdownMenuItem>
                db.m5.large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input type="storage" placeholder="20"></Input>
          <Input type="master-username" placeholder="admin"></Input>
          <Input type="vpc-subnet-group" placeholder="default-subnet-group"></Input>
        </SheetContent>
      </Sheet>
    </div>
  )
}
