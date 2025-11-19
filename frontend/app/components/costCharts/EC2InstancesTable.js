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

export default function EC2InstancesTable(ec2){


  console.log("hii there",ec2)

// {ec2.ec2.map((instance) => {
//   console.log("instance in table",instance)
// })


  return(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Instances</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[100px]">hours running</TableHead>
          <TableHead className="w-[100px] text-right">Monthly Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
     { ec2.ec2.map((type) => ( 
      <TableRow>
        <TableCell className="font-medium">{type.instance_id}</TableCell>
        <TableCell>{type.instance_type}</TableCell>
        <TableCell>{type.hours_running}</TableCell>
        <TableCell className="text-right">{type.cost}</TableCell>
   </TableRow>
      ))}
      </TableBody>
    </Table>
  )
}