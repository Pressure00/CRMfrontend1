import { Bell, Volume2, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
    const { user } = useAuthStore();

    return (
        <header className="h-16 border-b border-border/40 bg-white/30 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">

            {/* Search Bar - Optional per role, adding for UI completeness */}
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

                {/* Connection Status / Firm Info */}
                {user?.company_name && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold border border-brand-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                        {user.company_name}
                    </div>
                )}

                <button className="relative w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/60">
                    <Volume2 className="h-4 w-4" />
                </button>

                <button className="relative w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/60">
                    <Bell className="h-4 w-4" />
                    {/* Notification Badge */}
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full"></span>
                </button>

            </div>
        </header>
    );
}
