import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, ExpandIcon } from "lucide-react"
import type { TrackingJob } from "@/types"

interface TrackingJobsCardProps {
  trackingJobs: TrackingJob[]
}

export default function TrackingJobsCard({ trackingJobs }: TrackingJobsCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="border-b bg-white pb-4">
        <CardTitle className="text-xl font-medium">Tracking Jobs in Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4 text-sm font-medium text-gray-500">
          <div>Listings</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Insights</div>
        </div>

        <div className="divide-y">
          {trackingJobs.map((job, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-gray-50">
              <div className="font-medium">{job.listing}</div>
              <div className="text-gray-600">{job.startDate}</div>
              <div className="text-gray-600">{job.endDate}</div>
              <div className="flex items-center text-blue-600">
                <span>{job.insights}</span>
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center p-4">
          <Button variant="outline" className="flex items-center gap-2 text-gray-600">
            <ExpandIcon className="h-4 w-4" />
            <span>Expand to detailed view</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

