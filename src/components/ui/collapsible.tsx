import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"

interface CollapsibleProps {
  children: React.ReactNode
  defaultOpen?: boolean
  title: string
  icon?: React.ReactNode
  routes?: string[] // Routes that belong to this section
}

export function Collapsible({ children, defaultOpen = false, title, icon, routes = [] }: CollapsibleProps) {
  const location = useLocation()
  const isActiveRoute = routes.some(route => location.pathname === route || location.pathname.startsWith(route + '/'))
  const [isOpen, setIsOpen] = React.useState(defaultOpen || isActiveRoute)

  // Auto-expand if current route is in this section
  React.useEffect(() => {
    if (isActiveRoute && !isOpen) {
      setIsOpen(true)
    }
  }, [location.pathname, isActiveRoute, isOpen])

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent group transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          {icon && <span className="text-muted-foreground group-hover:text-primary">{icon}</span>}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
      </button>
      {isOpen && (
        <div className="pl-7 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}
