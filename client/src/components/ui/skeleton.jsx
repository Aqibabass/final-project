import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

export function SkeletonCard({ imageClassName = "h-[125px]" }) {
  return (
    <div className="space-y-3">
      <Skeleton className={`${imageClassName} w-full rounded-xl`} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}