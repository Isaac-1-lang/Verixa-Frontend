"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Layers, Eye, TrendingUp, Zap } from 'lucide-react';

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
}

const STATS = [
  {
    label: 'Total Projects',
    icon: Layers,
    color: '#6C63FF',
    glow: 'rgba(108,99,255,',
  },
  {
    label: 'Total Views',
    icon: Eye,
    color: '#7C3AED',
    glow: 'rgba(124,58,237,',
  },
  {
    label: 'Enterprise Requests',
    icon: TrendingUp,
    color: '#4F46E5',
    glow: 'rgba(79,70,229,',
  },
  {
    label: 'Active Projects',
    icon: Zap,
    color: '#A78BFA',
    glow: 'rgba(167,139,250,',
  },
];

function StatCard({ stat, value, maxValue }) {
  const Icon = stat.icon;
  const counted = useCountUp(value);
  const fillPct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-md bg-white border transition-all duration-300 cursor-default select-none"
      style={{
        borderColor: 'var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Solid blob background (no gradient) */}
      <div
        className={`absolute -top-6 -right-6 w-28 h-28 rounded-md pointer-events-none transition-opacity duration-300`}
        style={{ background: `${stat.color}08`, opacity: hovered ? 1 : 0.5 }}
      />

      {/* Solid accent line (no gradient) */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: stat.color,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative z-10 p-5">
        {/* Icon container */}
        <div className="relative w-11 h-11 mb-4">
          {/* Steady inner icon bg */}
          <div
            className="absolute inset-0 rounded-md transition-all duration-300"
            style={{ background: hovered ? `${stat.color}20` : `${stat.color}12` }}
          />
          <div className="relative w-full h-full flex items-center justify-center" style={{ color: stat.color }}>
            <Icon size={20} strokeWidth={2} />
          </div>
        </div>

        {/* Value */}
        <p
          className="text-3xl font-extrabold leading-none mb-1 tabular-nums"
          style={{ fontFamily: 'var(--font-heading)', color: hovered ? stat.color : 'var(--text)', transition: 'color 0.3s' }}
        >
          {counted.toLocaleString()}
        </p>

        {/* Label */}
        <p className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-md flex-shrink-0"
            style={{ background: stat.color }}
          />
          {stat.label}
        </p>

        {/* Solid fill bar (no gradient) */}
        <div className="mt-4 h-1 rounded-md bg-navy/5 overflow-hidden">
          <div
            className="h-full rounded-md transition-all duration-1000 ease-out"
            style={{
              width: `${fillPct}%`,
              background: stat.color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function StatsOverview({ projects = [] }) {
  const totalViews    = projects.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalRequests = projects.reduce((sum, p) => sum + (p.enterpriseRequests || 0), 0);
  const activeCount   = projects.filter(p => p.projectStatus === 'ONGOING').length;

  const values   = [projects.length, totalViews, totalRequests, activeCount];
  const maxValue = Math.max(...values, 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} value={values[i]} maxValue={maxValue} />
      ))}
    </div>
  );
}