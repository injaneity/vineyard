import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileIcon, InfoIcon, LinkIcon } from "lucide-react"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-white pb-4">
        <CardTitle className="text-xl font-medium">{product.title}</CardTitle>
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
          {product.dynamicPricing}
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-500">Relevant Files</h3>
            <div className="flex flex-col gap-3">
              {product.relevantFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow"
                >
                  <FileIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{file}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Insights</h3>
              <div className="rounded-md border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{product.insights}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Associated Jobs</h3>
              <div className="rounded-md border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{product.associatedJobIds.length} jobs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

