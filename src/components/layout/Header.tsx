import { useState, useRef, useEffect } from 'react';
import { Bell, Volume2, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotifications, useMarkNotificationRead } from '@/api/hooks';

export default function Header() {
    const { user } = useAuthStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: notifData } = useNotifications();
    const markRead = useMarkNotificationRead();

    const notifications = Array.isArray(notifData) ? notifData : (notifData?.notifications || []);
    const unreadCount = notifData?.unread_count ?? notifications.filter((n: any) => !n.is_read).length;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="h-16 border-b border-border/40 bg-white/30 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Поиск по системе..."
                        className="w-full h-9 pl-9 pr-4 rounded-md bg-white/50 border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">

                {/* Company Badge */}
                {user?.company_name && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold border border-brand-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                        {user.company_name}
                    </div>
                )}

                <button className="relative w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/60">
                    <Volume2 className="h-4 w-4" />
                </button>

                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="relative w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/60"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-2xl border border-border/40 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Уведомления</h4>
                                {unreadCount > 0 && (
                                    <span className="bg-destructive text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto divide-y divide-border/40">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground text-sm">Нет уведомлений</div>
                                ) : (
                                    notifications.slice(0, 10).map((n: any) => (
                                        <div
                                            key={n.id}
                                            className={`px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer ${!n.is_read ? 'bg-brand-500/5' : ''}`}
                                            onClick={() => { if (!n.is_read) markRead.mutate(n.id); }}
                                        >
                                            <p className="text-sm font-medium">{n.title || 'Уведомление'}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{n.message || ''}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{n.created_at?.split('T')[0] || ''}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
