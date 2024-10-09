import React from 'react'

export function Loader({ className = '' }: { className?: string }) {
  return (
      <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white ${className}`}></div>
  )
}