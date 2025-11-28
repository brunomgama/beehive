"use client";

import { useState, ReactNode } from "react";

interface Section {
  id: number;
  component: ReactNode;
}

interface SwipeableCardsProps {
  activeIndex: number;
  onIndexChange: (index: number) => void;
  sections: Section[];
}

const SwipeableCards = ({ activeIndex, onIndexChange, sections }: SwipeableCardsProps) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;
    
    const maxDrag = window.innerWidth * 0.8;
    const limitedOffset = Math.max(-maxDrag, Math.min(maxDrag, offset));
    setDragOffset(limitedOffset);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    
    if (!touchStart || !touchEnd) {
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < sections.length - 1) {
      onIndexChange(activeIndex + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      onIndexChange(activeIndex - 1);
    }
    
    setDragOffset(0);
  };

  const dragPercentage = dragOffset / window.innerWidth;

  const renderSection = (sectionIndex: number, position: 'prev' | 'current' | 'next') => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) {
      return null;
    }

    const section = sections[sectionIndex];
    let transform = '';
    let opacity = 1;
    let zIndex = 1;

    if (isDragging) {
      if (position === 'current') {
        transform = `translateX(${dragOffset}px)`;
        opacity = 1 - Math.abs(dragPercentage) * 0.3;
        zIndex = 10;
      } else if (position === 'next' && dragOffset < 0) {
        const nextOffset = window.innerWidth + dragOffset;
        transform = `translateX(${nextOffset}px)`;
        opacity = Math.abs(dragPercentage);
        zIndex = 5;
      } else if (position === 'prev' && dragOffset > 0) {
        const prevOffset = -window.innerWidth + dragOffset;
        transform = `translateX(${prevOffset}px)`;
        opacity = Math.abs(dragPercentage);
        zIndex = 5;
      } else {
        return null;
      }
    } else {
      if (position === 'current') {
        transform = 'translateX(0)';
        zIndex = 10;
      } else {
        return null;
      }
    }

    return (
      <div key={section.id}
        className="absolute inset-0"
        style={{
          transform: transform,
          opacity: opacity,
          zIndex: zIndex,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
        }}
      >
        {section.component}
      </div>
    );
  };

  return (
    <div 
      className="h-full relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-full overflow-hidden">
        {renderSection(activeIndex - 1, 'prev')}
        {renderSection(activeIndex, 'current')}
        {renderSection(activeIndex + 1, 'next')}
      </div>
    </div>
  );
};

export default SwipeableCards;