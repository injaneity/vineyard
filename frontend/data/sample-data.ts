import type { Product, TrackingJob } from "@/types"

export const products: Product[] = [
  {
    id: "prod-1",
    title: "Premium Sunscreen SPF 50",
    dynamicPricing: "$24.99",
    relevantFiles: ["product-specs.pdf", "lab-results.xlsx", "customer-feedback.docx"],
    insights: "32% increase in summer sales",
    associatedJobIds: ["job-1", "job-3", "job-4"],
  },
  {
    id: "prod-2",
    title: "Moisturizing Sunscreen SPF 30",
    dynamicPricing: "$19.99",
    relevantFiles: ["ingredient-list.pdf", "dermatologist-approval.xlsx"],
    insights: "Most popular for daily use",
    associatedJobIds: ["job-2"],
  },
]

export const trackingJobs: TrackingJob[] = [
  {
    id: "job-1",
    listing: "Brand X Ultra Protection Sunscreen",
    startDate: "Apr 1, 2025",
    endDate: "Apr 30, 2025",
    insights: "View report",
  },
  {
    id: "job-2",
    listing: "Brand Y Waterproof Sunscreen",
    startDate: "Mar 15, 2025",
    endDate: "Apr 15, 2025",
    insights: "View report",
  },
  {
    id: "job-3",
    listing: "Brand Z Natural Sunscreen",
    startDate: "Feb 1, 2025",
    endDate: "Ongoing",
    insights: "View report",
  },
  {
    id: "job-4",
    listing: "Brand W Kids Sunscreen",
    startDate: "Jan 10, 2025",
    endDate: "Jul 10, 2025",
    insights: "View report",
  },
]

