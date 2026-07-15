'use client';
import { useState } from 'react';
import { useAuth } from './auth';
import BottomNav from './BottomNav';
import NotesTab from './NotesTab';
import TodosTab from './TodosTab';
import ProfileTab from './ProfileTab';

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  if (loading) return <div className='loading'>加载中...</div>;

  // Not logged in: show login form without bottom nav
  if (!user) {
    return <ProfileTab user={null} />;
  }

  return (
    <div className='app-layout'>
      <div className='app-content'>
        {activeTab === 0 && <NotesTab user={user} />}
        {activeTab === 1 && <TodosTab />}
        {activeTab === 2 && <ProfileTab user={user} />}
      </div>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
