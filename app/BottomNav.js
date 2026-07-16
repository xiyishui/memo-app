'use client';

export default function BottomNav({ activeTab, onChange }) {
  const tabs = [
    { id: 0, label: '便签', icon: '\u{1F4DD}' },
    { id: 1, label: '代办', icon: '\u2705' },
    { id: 2, label: '我的', icon: '\u{1F464}' },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button key={tab.id}
          className={'bottom-nav-item' + (activeTab === tab.id ? ' active' : '')}
          onClick={() => onChange(tab.id)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}