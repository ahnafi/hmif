import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselContextProps = {
  current: number
  count: number
  handleClick: (index: number) => void
  onCurrentChange?: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  initialSlide?: number
  onCurrentChange?: (index: number) => void
  itemCount?: number
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(({ initialSlide = 0, onCurrentChange, itemCount, children, ...props }, ref) => {
  const [current, setCurrent] = React.useState(initialSlide)
  const [count, setCount] = React.useState(itemCount || 0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Merge refs
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

  // Jika itemCount provided, gunakan itu sebagai count yang akurat
  React.useEffect(() => {
    if (itemCount !== undefined) {
      setCount(itemCount)
    }
  }, [itemCount])

  // Update count when children change jika itemCount tidak provided
  React.useEffect(() => {
    if (itemCount !== undefined) return // Skip jika itemCount sudah provided

    const updateCount = () => {
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll("[data-carousel-item]")
        const newCount = items.length
        setCount(newCount)
      }
    }

    // Update immediately
    updateCount()

    // Setup observer untuk perubahan dinamis
    const observer = new MutationObserver(updateCount)
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [children, itemCount])

  const handleClick = React.useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(index, count - 1))
    setCurrent(newIndex)
    onCurrentChange?.(newIndex)
  }, [count, onCurrentChange])

  return (
    <CarouselContext.Provider
      value={{
        current,
        count,
        handleClick,
        onCurrentChange,
      }}
    >
      <div ref={containerRef} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("overflow-hidden", className)}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index?: number
  }
>(({ className, index = 0, ...props }, ref) => {
  const { current } = useCarousel()
  const isActive = current === index

  return (
    <div
      ref={ref}
      data-carousel-item
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        "transition-opacity duration-300",
        isActive ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { current, handleClick, count } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-4 top-1/2 z-40 -translate-y-1/2",
        "h-10 w-10 rounded-full",
        className
      )}
      onClick={() => {
        const newIndex = current === 0 ? count - 1 : current - 1
        handleClick(newIndex)
      }}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { current, handleClick, count } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-4 top-1/2 z-40 -translate-y-1/2",
        "h-10 w-10 rounded-full",
        className
      )}
      onClick={() => {
        const newIndex = current === count - 1 ? 0 : current + 1
        handleClick(newIndex)
      }}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { current, handleClick, count } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn("flex justify-center gap-2 py-4", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            current === index
              ? "w-8 bg-blue-500"
              : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
})
CarouselDots.displayName = "CarouselDots"

export {
  type CarouselContextProps,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
}
