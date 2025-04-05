// components/RecentActivity.tsx
"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ActivityLog {
  activity: string
  date: string
}

interface RecentActivityProps {
  data: ActivityLog[]
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <div className="max-w-full max-h-[30vh]">
        <div className="py-4 text-lg font-semibold">Recent Activity</div>
        <div className="w-full overflow-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell>{item.activity}</TableCell>
                    <TableCell className="text-right">{item.date}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
