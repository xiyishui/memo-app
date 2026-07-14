'use client';

import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, showToast };
}

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 14,
        color: '#fff',
        backgroundColor: toast.type === 'success' ? '#52c41a' : '#ff4d4f',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        transition: 'opacity 0.3s',
      }}
    >
      {toast.message}
    </div>
  );
}
