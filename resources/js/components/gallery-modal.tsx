import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel"

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  title?: string
}

export function GalleryModal({
  isOpen,
  onClose,
  images,
  title = "Galeri Foto",
}: GalleryModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0)
    }
  }, [isOpen])

  if (!mounted) return null

  if (!images || images.length === 0) {
    return null
  }

  const normalizeImageUrl = (image: string) => {
    if (image.startsWith("/storage/")) return image
    return `/storage/${image}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full",
          "max-w-sm sm:max-w-2xl md:max-w-3xl",
          "max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-120px)]",
          "-translate-x-1/2 -translate-y-1/2",
          "border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
          "rounded-lg shadow-lg p-0",
          "overflow-hidden",
          "flex flex-col"
        )}
      >
        {/* Content with Carousel */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 relative">
          <Carousel 
            initialSlide={0} 
            ref={carouselRef} 
            className="w-full h-full relative"
            itemCount={images.length}
            onCurrentChange={(index) => setCurrentIndex(index)}
          >
            <CarouselContent className="relative w-full h-full">
              {images.map((image, index) => (
                <CarouselItem
                  key={`${index}-${image}`}
                  index={index}
                  className="flex items-center justify-center h-full w-full"
                >
                  <div className="w-full h-full flex items-center justify-center px-2 py-2 sm:px-4 sm:py-3">
                    <img
                      src={normalizeImageUrl(image)}
                      alt={`${title} - Foto ${index + 1}`}
                      className="max-w-sm max-h-sm aspect-square object-contain rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <CarouselPrevious
                  className={cn(
                    "bg-white/90 hover:bg-white text-gray-900 shadow-md",
                    "dark:bg-gray-700/90 dark:hover:bg-gray-700 dark:text-white",
                    "left-2 sm:left-4"
                  )}
                />
                <CarouselNext
                  className={cn(
                    "bg-white/90 hover:bg-white text-gray-900 shadow-md",
                    "dark:bg-gray-700/90 dark:hover:bg-gray-700 dark:text-white",
                    "right-2 sm:right-4"
                  )}
                />
              </>
            )}

            {/* Dots and Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center gap-2">
                <CarouselDots />
              </div>
            )}
          </Carousel>
        </div>

        {/* Footer */}
        {images.length > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 flex justify-between items-center flex-shrink-0">
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {images.length} foto
            </div>
            <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
              <span>{currentIndex + 1}</span>
              <span className="text-gray-600 dark:text-gray-400"> / </span>
              <span>{images.length}</span>
            </div>
            <div className="w-12"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
