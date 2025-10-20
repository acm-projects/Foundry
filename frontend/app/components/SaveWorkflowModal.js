"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useState } from "react"
import { Save } from "lucide-react"

export default function SaveWorkflowDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your build</DialogTitle>
            <DialogDescription>
              Add a title and description before saving your build.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Input placeholder="Build title" />
            <Input placeholder="Build description" />
          </div>

          <DialogFooter>
            <Button variant="outline" className="hover:cursor-pointer"onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-500/80 hover:cursor-pointer"onClick={() => setOpen(false)}>
              <Save/>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}