import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/app/components/ui/table';

const expenses = [
  {
    id: 1,
    instance: "web-01",
    type: "t3.micro",
    dailyCost: "less than one cent",
    monthlyCost: "less than one cent",
  },
]

export default function EC2InstancesTable(){
  return(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Instances</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[100px]">Daily Estimate</TableHead>
          <TableHead className="w-[100px] text-right">Monthly Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense)=>(
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.instance}</TableCell>
            <TableCell className="font-medium">{expense.type}</TableCell>
            <TableCell className="font-medium">{expense.dailyCost}</TableCell>
            <TableCell className="font-medium text-right">{expense.monthlyCost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}