import { Skeleton } from '@/shared/ui/skeleton'

const MovieSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4 rounded-md" />
    <Skeleton className="h-3 w-1/2 rounded-md" />
  </div>
)

export { MovieSkeleton }
