// src/LoadingScreen.jsx

const animations = {
  spinner: (
    <div className="w-12 h-12 rounded-full border-[3px] border-white/10 border-t-indigo-500 animate-spin" />
  ),

  pulse: (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-60" />
      <div className="w-12 h-12 rounded-full bg-indigo-500 animate-pulse" />
    </div>
  ),

  bars: (
    <div className="flex items-end gap-1 h-9">
      {[20, 30, 36, 28, 18].map((h, i) => (
        <div
          key={i}
          className="w-1.5 bg-indigo-500 rounded-full animate-bounce"
          style={{ height: h, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  ),

 dots: (
    <div className="flex gap-2">
      {[0, 0.15, 0.3].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  ),
};


import { useEffect } from 'react'
export default function LoadingScreen({
  variant = 'spinner',   // 'spinner' | 'pulse' | 'bars' | 'dots'
  title = 'Setting things up…',
  subtitle = 'Loading your workspace',
  logo = null, 
  duration = 1500,
  onDone,   
}) {

    useEffect(() => {
        if (!onDone) return
        const timer = setTimeout(onDone, duration)
        return () => clearTimeout(timer)
    }, [duration, onDone])

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 h-screen bg-gray-900">
        {logo ?? animations[variant]}
        <p className="text-white text-sm font-medium">{title}</p>
        {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
        </div>
    );
}