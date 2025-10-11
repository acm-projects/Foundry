import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/app/components/ui/table';

const expenses = [
  {
    id: 1,
    database: "main-db",
    engine: "t3.medium",
    dailyCost: "$4.20",
    monthlyCost: "$126",
  },
  {
    id: 2,
    database: "secondary-db",
    engine: "t3.large",
    dailyCost: "$6.30",
    monthlyCost: "$189",
  },
  {
    id:3,
    database: "web-server",
    engine: "t3.small",
    dailyCost: "$2.10",
    monthlyCost: "$63",
  },
]

export default function DatabaseTable(){
  return(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Databases</TableHead>
          <TableHead className="w-[100px]">Enginge</TableHead>
          <TableHead className="w-[100px]">Daily Estimate</TableHead>
          <TableHead className="w-[100px] text-right">Monthly Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense)=>(
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.database}</TableCell>
            <TableCell className="font-medium">{expense.engine}</TableCell>
            <TableCell className="font-medium">{expense.dailyCost}</TableCell>
            <TableCell className="font-medium text-right">{expense.monthlyCost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}