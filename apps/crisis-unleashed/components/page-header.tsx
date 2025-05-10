import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem as UICBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <UICBreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </UICBreadcrumbItem>
            <BreadcrumbSeparator />

            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <React.Fragment key={index}>
                  <UICBreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
                    )}
                  </UICBreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-lg text-gray-300">{description}</p>}
    </div>
  )
}
