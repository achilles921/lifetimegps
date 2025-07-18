/**
 * Responsive Layout Component
 * 
 * A flexible layout component that adapts to different screen sizes
 * and provides optimal user experience across devices
 */

import React from 'react';
import { usePerformance } from '@/context/PerformanceContext';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  // Layout type
  type?: 'default' | 'narrow' | 'wide' | 'fullWidth';
  // Side panel can be displayed differently on different devices
  sidePanel?: React.ReactNode;
  sidePanelWidth?: number | string;
  // Behavior on different devices
  mobileBehavior?: 'stack' | 'hide-side' | 'tabbed' | 'modal';
  tabletBehavior?: 'stack' | 'hide-side' | 'side-by-side' | 'modal';
  // Spacing
  spacing?: 'none' | 'tight' | 'normal' | 'loose';
  // Header and footer
  header?: React.ReactNode;
  footer?: React.ReactNode;
  // Additional props
  mainProps?: React.HTMLAttributes<HTMLDivElement>;
  sideProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ResponsiveLayout({
  children,
  className,
  type = 'default',
  sidePanel,
  sidePanelWidth = '300px',
  mobileBehavior = 'stack',
  tabletBehavior = 'side-by-side',
  spacing = 'normal',
  header,
  footer,
  mainProps,
  sideProps,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet } = usePerformance();
  
  // Calculate size and layout parameters
  const hasSidePanel = !!sidePanel;
  
  const maxWidthClass = type === 'narrow' ? 'max-w-3xl' :
                        type === 'default' ? 'max-w-6xl' :
                        type === 'wide' ? 'max-w-7xl' : 
                        'max-w-none'; // fullWidth
  
  const spacingClass = spacing === 'none' ? 'p-0' :
                       spacing === 'tight' ? 'p-2 md:p-4' :
                       spacing === 'normal' ? 'p-4 md:p-6' :
                       'p-6 md:p-8'; // loose
  
  const innerSpacingClass = spacing === 'none' ? 'gap-0' :
                           spacing === 'tight' ? 'gap-2 md:gap-4' :
                           spacing === 'normal' ? 'gap-4 md:gap-6' :
                           'gap-6 md:gap-8'; // loose
  
  // If we're on mobile with stack behavior, or tablet with stack behavior
  const shouldStack = (isMobile && mobileBehavior === 'stack') || 
                      (isTablet && tabletBehavior === 'stack');
  
  // If the side panel should be hidden
  const hideSidePanel = (isMobile && mobileBehavior === 'hide-side') ||
                        (isTablet && tabletBehavior === 'hide-side');
  
  // On mobile with tabbed behavior, we'll render tabs for main content and side panel
  const useTabbedLayout = isMobile && mobileBehavior === 'tabbed';
  
  // Modal behavior (dialog for side panel)
  const useModalForSide = (isMobile && mobileBehavior === 'modal') ||
                         (isTablet && tabletBehavior === 'modal');
  
  // State for tabbed layout and modal dialog
  const [activeTab, setActiveTab] = React.useState<'main' | 'side'>('main');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Handle modal toggle for side panel
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  // Determine the actual layout
  let contentLayout: React.ReactNode;
  
  if (useTabbedLayout && hasSidePanel) {
    // Tabbed layout for mobile
    contentLayout = (
      <div className="w-full flex flex-col">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'main' ? 'border-b-2 border-primary' : ''
            }`}
            onClick={() => setActiveTab('main')}
          >
            Main Content
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'side' ? 'border-b-2 border-primary' : ''
            }`}
            onClick={() => setActiveTab('side')}
          >
            Details
          </button>
        </div>
        <div className="flex-1">
          {activeTab === 'main' ? (
            <main {...mainProps} className={cn('w-full', mainProps?.className)}>
              {children}
            </main>
          ) : (
            <aside {...sideProps} className={cn('w-full', sideProps?.className)}>
              {sidePanel}
            </aside>
          )}
        </div>
      </div>
    );
  } else if (useModalForSide && hasSidePanel) {
    // Modal behavior for side panel
    contentLayout = (
      <>
        <main {...mainProps} className={cn('w-full', mainProps?.className)}>
          {children}
          <button
            onClick={handleOpenModal}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Open Details
          </button>
        </main>
        
        {/* Modal dialog for side panel */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-background rounded-lg w-11/12 max-w-lg max-h-[90vh] overflow-auto">
              <div className="sticky top-0 flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Details</h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <aside {...sideProps} className={cn('w-full', sideProps?.className)}>
                  {sidePanel}
                </aside>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (shouldStack && hasSidePanel) {
    // Stacked layout
    contentLayout = (
      <div className={cn("flex flex-col", innerSpacingClass)}>
        <main {...mainProps} className={cn('w-full', mainProps?.className)}>
          {children}
        </main>
        <aside {...sideProps} className={cn('w-full', sideProps?.className)}>
          {sidePanel}
        </aside>
      </div>
    );
  } else if (hideSidePanel || !hasSidePanel) {
    // Just the main content
    contentLayout = (
      <main {...mainProps} className={cn('w-full', mainProps?.className)}>
        {children}
      </main>
    );
  } else {
    // Side-by-side layout
    contentLayout = (
      <div className={cn("flex flex-row", innerSpacingClass)}>
        <main 
          {...mainProps} 
          className={cn('flex-1', mainProps?.className)}
          style={{
            width: `calc(100% - ${sidePanelWidth})`,
          }}
        >
          {children}
        </main>
        <aside 
          {...sideProps} 
          className={cn('shrink-0', sideProps?.className)}
          style={{
            width: typeof sidePanelWidth === 'number' ? `${sidePanelWidth}px` : sidePanelWidth,
          }}
        >
          {sidePanel}
        </aside>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "w-full mx-auto", 
        maxWidthClass, 
        spacingClass,
        className
      )}
    >
      {/* Header */}
      {header && (
        <header className="mb-6">
          {header}
        </header>
      )}
      
      {/* Main content area */}
      {contentLayout}
      
      {/* Footer */}
      {footer && (
        <footer className="mt-6">
          {footer}
        </footer>
      )}
    </div>
  );
}