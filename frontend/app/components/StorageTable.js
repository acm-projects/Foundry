import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/app/components/ui/table';

const expenses = [
  {
    id: 1,
    bucket: "app-assets",
    size: "120GB",
    dailyCost: "$4.20",
    monthlyCost: "$126",
  },
  {
    id: 2,
    bucket: "user-files",
    size: "90GB",
    dailyCost: "$6.30",
    monthlyCost: "$189",
  },
  {
    id:3,
    bucket: "app-backup",
    size: "290GB",
    dailyCost: "$2.10",
    monthlyCost: "$63",
  },
]

export default function StorageTable(){
  return(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Bucket</TableHead>
          <TableHead className="w-[100px]">Size</TableHead>
          <TableHead className="w-[100px]">Daily Estimate</TableHead>
          <TableHead className="w-[100px] text-right">Monthly Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense)=>(
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.bucket}</TableCell>
            <TableCell className="font-medium">{expense.size}</TableCell>
            <TableCell className="font-medium">{expense.dailyCost}</TableCell>
            <TableCell className="font-medium text-right">{expense.monthlyCost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}