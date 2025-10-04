import { Card , CardHeader, CardTitle, CardContent, CardDescription} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select , SelectTrigger, SelectContent, SelectValue, SelectItem, SelectGroup} from '@/app/components/ui/select'
import { Button } from '@/app/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle, ItemDescription} from '@/app/components/ui/item'
import { User } from 'lucide-react';

export default function SettingsPage({ params }) {
  return (
    <div className="pt-8 pb-8">
      <h1 className="text-2xl font-bold mt-4">
        Settings for Project {params.projectId}
      </h1>
      <div className="flex gap-5 mt-6">
        <Card className="max-w-30vw flex-1 flex-grow min-h-90 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl transition-transform duration-200">
          <CardHeader>
            <CardTitle>Project Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <Label htmlFor="projectName" className="mb-1">Project Name</Label>
                  <Input id="projectName" placeholder="My Foundry Workflow" />
                </div>
                <div className="flex flex-col w-full">
                  <Label htmlFor="environment" className="mb-1">Environment</Label>
                  <Select id="environment">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Development" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  </Select>

                </div>
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="description" className="mb-1">Description</Label>
                <Input id="description" placeholder="This is an AWS deployment made easy by Foundry." />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="region" className="mb-1">Region</Label>
                <Input id="region" placeholder="US East" />
              </div>
              <Button className="mt-5 w-full max-w-70 self-center bg-orange-600 hover:bg-orange-600/80 hover:cursor-pointer">Save</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-30vw flex-1 flex-grow min-h-100 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl transition-transform duration-200">
          <CardHeader>
            <CardTitle>Team Access</CardTitle>
            <CardDescription>Invite your team members to collaborate.</CardDescription>
          </CardHeader>
          <CardContent>
            <Item variant="outline">
              <ItemContent>
                <div className="flex gap-5">
                  <User/>
                  <ItemTitle>John Smith</ItemTitle>
                </div>
              </ItemContent>
              <ItemActions>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Read" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="modify">Modify</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </ItemActions>
            </Item>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}