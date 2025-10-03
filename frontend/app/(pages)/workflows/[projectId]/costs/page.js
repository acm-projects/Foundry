import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue, SelectLabel } from '@/app/components/ui/select.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/app/components/ui/card.jsx';
import { ChartBarDefault } from '@/app/components/ChartBarDefault';

export default function CostsPage({ params }) {
  return (
    <div className="pt-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold mt-4">
          Costs Monitoring for Project {params.projectId}
        </h1>
        <h3 className="text-lg mt-4">
          Track your AWS infrastructure spending and optimize costs.
        </h3>
      </div>
      <div>
        <div className="flex justify-between gap-5 w-full mt-8">
            <Card className="flex-grow min-h-50">
              <CardHeader>
                <CardTitle>Current Month</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                  $255
                </h1>
              </CardContent>
            </Card>
            <Card className="flex-grow min-h-50">
              <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                $400
                </h1>
              </CardContent>
            </Card>
            <Card className="flex-grow min-h-50">
              <CardHeader>
                <CardTitle>Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                  $8.50
                </h1>
              </CardContent>
            </Card>
        </div>
        <div className="flex">
          <Card className="flex-grow mt-8 min-h-100">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle> Monthly Spending (This Year) </CardTitle>
                  <CardDescription>Monthly cost breakdowns for every month.</CardDescription>
                </div>
                <div>
                  <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="This Month" />
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Months</SelectLabel>
                        <SelectItem value="december">January</SelectItem>
                        <SelectItem value="november">February</SelectItem>
                        <SelectItem value="october">March</SelectItem>
                        <SelectItem value="september">April</SelectItem>
                        <SelectItem value="august">May</SelectItem>
                        <SelectItem value="july">June</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex-grow mt-8 min-h-100">
                <ChartBarDefault/>
              </div>
            </CardContent>
          </Card>
        </div>
          <div>
            <Card className="flex-grow mt-8 min-h-80">
              <CardHeader>
                <CardTitle>Resource and Usage Costs </CardTitle>
                <CardDescription>Detailed breakdown of resource utilization and associated costs.</CardDescription>
              </CardHeader>
            </Card>
          </div>
      </div>

    </div>
  );
}