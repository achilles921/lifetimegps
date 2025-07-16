/**
 * PageSkeleton Component
 * 
 * A skeleton loading state that matches the layout of the final content,
 * creating a smoother perceived loading experience. This component reduces
 * layout shift and provides immediate visual feedback while content loads.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface PageSkeletonProps {
  type?: 'default' | 'dashboard' | 'profile' | 'roadmap' | 'career';
  className?: string;
}

export function PageSkeleton({ 
  type = 'default',
  className 
}: PageSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {type === 'default' && <DefaultSkeleton />}
      {type === 'dashboard' && <DashboardSkeleton />}
      {type === 'profile' && <ProfileSkeleton />}
      {type === 'roadmap' && <RoadmapSkeleton />}
      {type === 'career' && <CareerSkeleton />}
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-md w-3/4 max-w-md"></div>
        <div className="h-4 bg-muted rounded-md w-full max-w-2xl"></div>
      </div>
      
      {/* Content blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="h-6 bg-muted rounded-md w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-5/6"></div>
              <div className="h-4 bg-muted rounded-md w-4/6"></div>
            </div>
            <div className="h-10 bg-muted rounded-md w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="h-5 bg-muted rounded-md w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded-md w-2/3"></div>
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-muted rounded-md w-1/3 mb-4"></div>
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-muted"></div>
                  <div className="ml-4 space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded-md w-1/3"></div>
                    <div className="h-3 bg-muted rounded-md w-1/2"></div>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-muted rounded-md w-2/5 mb-4"></div>
            <div className="h-40 bg-muted rounded-md w-full"></div>
          </div>
        </div>
        
        {/* Side column */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-muted rounded-md w-1/2 mb-4"></div>
            <div className="h-32 bg-muted rounded-md w-full mb-4"></div>
            <div className="h-8 bg-muted rounded-md w-1/2 mx-auto"></div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-muted rounded-md w-3/5 mb-4"></div>
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded-md w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="h-32 w-32 rounded-full bg-muted"></div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="h-8 bg-muted rounded-md w-3/4 max-w-md"></div>
          <div className="h-4 bg-muted rounded-md w-full max-w-sm"></div>
          <div className="h-10 bg-muted rounded-md w-40"></div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="border-b flex">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className={`h-10 px-6 ${i === 0 ? 'border-b-2 border-primary' : ''}`}>
            <div className="h-4 bg-muted rounded-md w-20 mt-2"></div>
          </div>
        ))}
      </div>
      
      {/* Content section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded-md w-1/4"></div>
          <div className="h-4 bg-muted rounded-md w-full"></div>
          <div className="h-4 bg-muted rounded-md w-5/6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm space-y-3">
              <div className="h-5 bg-muted rounded-md w-1/2"></div>
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Roadmap header */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-md w-2/3 max-w-md"></div>
        <div className="h-4 bg-muted rounded-md w-full max-w-2xl"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-muted rounded-md w-32"></div>
          <div className="h-10 bg-muted rounded-md w-32"></div>
        </div>
      </div>
      
      {/* Roadmap timeline */}
      <div className="relative space-y-12 pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-muted">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-muted"></div>
            
            {/* Content */}
            <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
              <div className="h-6 bg-muted rounded-md w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {Array(3).fill(0).map((_, j) => (
                  <div key={j} className="h-8 bg-muted rounded-full w-20"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Career header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="h-48 md:w-64 bg-muted rounded-lg"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-muted rounded-md w-3/4"></div>
          <div className="h-5 bg-muted rounded-md w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-5/6"></div>
            <div className="h-4 bg-muted rounded-md w-4/6"></div>
          </div>
          <div className="pt-2 flex gap-3">
            <div className="h-10 bg-muted rounded-md w-32"></div>
            <div className="h-10 bg-muted rounded-md w-32"></div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="h-5 bg-muted rounded-md w-2/3 mb-2"></div>
            <div className="h-7 bg-muted rounded-md w-1/2"></div>
          </div>
        ))}
      </div>
      
      {/* Details section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-3/4"></div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/3"></div>
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="h-5 w-5 mt-0.5 rounded-full bg-muted"></div>
                  <div className="ml-3 space-y-1 flex-1">
                    <div className="h-4 bg-muted rounded-md w-5/6"></div>
                    <div className="h-3 bg-muted rounded-md w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="h-6 bg-muted rounded-md w-2/3"></div>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded-md w-1/3"></div>
                  <div className="h-4 bg-muted rounded-md w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/2"></div>
            <div className="h-32 bg-muted rounded-md w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}