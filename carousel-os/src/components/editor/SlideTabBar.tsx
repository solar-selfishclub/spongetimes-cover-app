'use client';

import { SLIDE_LABELS } from '@/tokens';

type SlideTabBarProps = {
  activeTab: number;
  onTabChange: (tab: number) => void;
};

export function SlideTabBar({ activeTab, onTabChange }: SlideTabBarProps) {
  return (
    <div className="tab-bar">
      {SLIDE_LABELS.map((label, i) => (
        <button
          key={i}
          className={`tab-item${activeTab === i ? ' active' : ''}`}
          onClick={() => onTabChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
