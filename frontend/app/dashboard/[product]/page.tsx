import ProductCard from "@/components/product-card"
import TrackingJobsCard from "@/components/tracking-jobs-card"
import { products, trackingJobs } from "@/data/sample-data"

export default function Home({ params }: { params: { product: string } }) {
  // Find the product based on the URL parameter, or default to first product
  const product = products.find(p => p.id === params.product) || products[0];
  
  // Filter tracking jobs to only show those associated with this product
  const filteredJobs = trackingJobs.filter(job => 
    product.associatedJobIds.includes(job.id)
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="grid w-full max-w-7xl gap-6 md:grid-cols-2">
        <ProductCard product={product} />
        <TrackingJobsCard trackingJobs={filteredJobs} />
      </div>
    </main>
  )
}

