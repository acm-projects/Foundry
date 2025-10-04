import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue, SelectLabel } from '@/app/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card';
import { ChartBarDefault } from '@/app/components/costCharts/ChartBarDefault';
import { ChartPieLegend } from '@/app/components/costCharts/ChartPieLegend';

import { TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger,} from '@/app/components/ui/tabs.jsx'
import EC2InstancesTable from '@/app/components/costCharts/EC2InstancesTable';

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
            <Card className="max-w-30vw flex-1 flex-grow min-h-50 
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle>Current Month</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                  $255
                </h1>
                <CardDescription className="flex mt-2"><TrendingUp className="h-5 w-4 mr-1" /> +8.6% from last month </CardDescription>
              </CardContent>
            </Card>
            <Card className=" flex-1 flex-grow min-h-50 
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                $400
                </h1>
              </CardContent>
            </Card>
            <Card className=" flex-1 flex-grow min-h-50 
  bg-white/90 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle>Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-3xl font-bold">
                  $8.50
                </h1>
                <CardDescription className="flex mt-2"> Based on the last 30 days </CardDescription>
              </CardContent>
            </Card>
        </div>
        <div className="flex justify-between gap-5 w-full">
          <Card className="flex-grow
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.008] mt-8 min-h-100 max-w-256">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle> Monthly Spending (This Year) </CardTitle>
                  <CardDescription>Monthly cost breakdowns for every month.</CardDescription>
                </div>
                <div>
                  <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select View" />
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Graph Views</SelectLabel>
                        <SelectItem value="bar">Bar Graph</SelectItem>
                        <SelectItem value="line">Line Graph</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex-grow min-h-100">
                <ChartBarDefault/>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-grow
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.008] mt-8 max-w-256 min-h-100 min-w-100">
          <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle> Cost by Resource </CardTitle>
                  <CardDescription>Current month breakdown by service</CardDescription>
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
                <ChartPieLegend/>
              </div>
            </CardContent>
          </Card>
        </div>
          <div>
            <Card className="flex-grow
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl
  transition-transform duration-200 hover:scale-[1.02] mt-8 min-h-80">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Resource and Usage Costs </CardTitle>
                    <CardDescription>Detailed breakdown of resource utilization and associated costs.</CardDescription>
                  </div>
                  <div>
                    <Tabs defaultValue = "ec2">
                      <TabsList>
                        <TabsTrigger value="ec2instances" className="px-6">EC2 Instances</TabsTrigger>
                        <TabsTrigger value="storage" className="px-6">Storage</TabsTrigger>
                        <TabsTrigger value="databases" className="px-6">Databases</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ec2instances">
                        <EC2InstancesTable />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              <Tabs defaultValue="ec2instances">
                <TabsContent value="ec2instances">
                  <EC2InstancesTable />
                </TabsContent>
                <TabsContent value="storage">
                </TabsContent>
                <TabsContent value="databases">
                </TabsContent>
              </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

    </div>
  );
}