import {Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetContent, SheetClose} from '../components/ui/sheet'
import {Input} from '../components/ui/input'
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '../components/ui/dropdown-menu'

export default function S3BucketConfigMenu(){
  return(
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"> S3 Drag Simulate </button>
        </SheetTrigger>
        <SheetContent className="!h-[80vh] !max-h-[80vh] !top-1/2 !translate-y-[-50%] !bottom-auto max-w-lg w-full sm:w-3/4 rounded-l-xl">
          <SheetHeader>
            <SheetTitle>S3 Bucket 1</SheetTitle>
            <SheetDescription>Configure your S3 Bucket 1 instance with the required parameters.</SheetDescription>
          </SheetHeader>
          <Input type="bucket-name" placeholder="my-s3-bucket"></Input>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">choose a region      ⌄ </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                us-east-1
              </DropdownMenuItem>
              <DropdownMenuItem>
                us-west-2
              </DropdownMenuItem>
              <DropdownMenuItem>
                eu-west-1
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetContent>
      </Sheet>
    </div>
  )
}

