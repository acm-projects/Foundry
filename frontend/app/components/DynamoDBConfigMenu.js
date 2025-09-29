import {Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetContent, SheetClose} from '../components/ui/sheet'
import {Input} from '../components/ui/input'
// import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '../components/ui/dropdown-menu'

export default function DynamoDBConfigMenu(){
  return(
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"> DynamoDB Drag Simulate </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>DynamoDB Table 1</SheetTitle>
            <SheetDescription>Configure your DynamoDB Table 1 instance with the required parameters.</SheetDescription>
          </SheetHeader>
          <Input type="table-name" placeholder="my-dynamodb-table"></Input>
          <Input type="partition-key" placeholder="id"></Input>
        </SheetContent>
      </Sheet>
    </div>
  )
}
