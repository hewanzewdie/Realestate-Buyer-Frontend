import { Skeleton } from "../ui/skeleton";

const LoadingSkeleton = ({
  type,
}: {
  type: "propertyCard" | "propertyDetail" | "landing" | "messages";
}) => {
  if (type === "propertyCard") {
    return (
      <div className="rounded-lg shadow-sm">
        <Skeleton className="w-full h-44" />
        <div className="p-5 space-y-4">
          <Skeleton className="h-6 w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }
  if (type === "propertyDetail") {
    return (
      <div className="p-10 w-full">
        <div className="space-y-3">
          <div className="flex justify-between space-x-5">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex space-x-2 self-start">
              <Skeleton className="w-7 h-7" />
              <Skeleton className="w-7 h-7" />
              <Skeleton className="w-7 h-7" />
            </div>
          </div>

          <div className="grid grid-cols-4 grid-rows-2 w-full h-86 mb-5 gap-2">
            <Skeleton className=" col-start-1 col-end-3 row-start-1 row-end-3" />
            <Skeleton className="col-start-3 col-end-5 row-start-1 row-end-2" />
            <Skeleton className="col-start-3 col-end-4 row-start-2 row-end-3" />
            <Skeleton className="col-start-4 col-end-5 row-start-2 row-end-3" />
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <Skeleton className="w-16 h-10" />
              <Skeleton className="w-16 h-10" />
              <Skeleton className="w-16 h-10" />
            </div>
            <Skeleton className="w-16 h-10" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-2/3 h-5" />
            <Skeleton className="w-24 h-7" />
          </div>
        </div>
      </div>
    );
  }
  if (type === "landing") {
    return (
      <div className="w-full flex flex-col min-h-full">
        <Skeleton className="w-full h-16" />

        <div className="w-full flex flex-col md:flex-row p-10 py-20 justify-between gap-10">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-4/5" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-10 w-36 rounded-md" />
          </div>

          <div className="flex-1 flex justify-center">
            <Skeleton className="h-100 w-full md:w-[80%] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (type === "messages") {
    return (
      <div className="w-full flex p-10 h-screen space-x-10">
        <div className="flex flex-col w-1/2 space-y-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex w-full h-10">
              <Skeleton className="w-10 rounded-full" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-100 h-5" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="w-full hidden md:flex" />
      </div>
    );
  }
};

export default LoadingSkeleton;
