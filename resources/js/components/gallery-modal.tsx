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
  achievement?: {
    name: string
    organizer: string
    description?: string
    proof?: string
    awarded_at: string
    achievement_type: { name: string }
    achievement_category: { name: string }
    achievement_level: { name: string }
    students: Array<{ nim: string; name: string }>
  }
}

export function GalleryModal({
  isOpen,
  onClose,
  images,
  title = "Galeri Foto",
  achievement,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getLevelColor = (levelName: string) => {
    const name = levelName.toLowerCase()
    if (name.includes('internasional')) return 'bg-purple-500'
    if (name.includes('nasional')) return 'bg-red-500'
    if (name.includes('regional') || name.includes('provinsi')) return 'bg-blue-500'
    if (name.includes('lokal') || name.includes('universitas')) return 'bg-green-500'
    return 'bg-gray-500'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Backdrop overlay with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <DialogContent
        className={cn(
          "fixed left-1/2 z-[999] w-full",
          "max-w-sm sm:max-w-3xl lg:max-w-5xl",
          "justify-center",
          "max-h-[calc(100vh-40px)]",
          "-translate-x-1/2",
          "-translate-y-1/2 ",
          "border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
          "rounded-lg shadow-lg p-0",
          "overflow-hidden",
          "flex flex-col"
        )}
      >
        {/* Header */}
        {achievement && (
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {achievement.name}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Image Carousel */}
            <div className="bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[300px] lg:min-h-[500px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
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
                          className="max-w-full max-h-full object-contain rounded-md"
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

                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center gap-2">
                    <CarouselDots />
                  </div>
                )}

                {/* Image Counter Badge */}
                {images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </Carousel>
            </div>

            {/* Right: Achievement Details */}
            {achievement && (
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                {/* Organizer */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Penyelenggara
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {achievement.organizer}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Tanggal Perolehan
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(achievement.awarded_at)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {/* Level Badge */}
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white",
                    getLevelColor(achievement.achievement_level.name)
                  )}>
                    {achievement.achievement_level.name}
                  </span>

                  {/* Type Badge */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {achievement.achievement_type.name}
                  </span>

                  {/* Category Badge */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {achievement.achievement_category.name}
                  </span>
                </div>

                {/* Description */}
                {achievement.description && (
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Deskripsi
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {achievement.description}
                    </p>
                  </div>
                )}

                {/* Students */}
                {achievement.students && achievement.students.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Mahasiswa ({achievement.students.length})
                    </h3>
                    <div className="space-y-2">
                      {achievement.students.map((student, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-medium">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {student.nim}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
