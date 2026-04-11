import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-[400px]">
      <Skeleton className="h-[280px] w-full rounded-none" />
      <CardContent className="flex-1 p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
         <Skeleton className="h-4 w-1/3" />
         <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  );
}

export function MovieGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-in fade-in duration-500">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
