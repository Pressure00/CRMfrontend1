import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard,
    FileText,
    FileBadge,
    CheckSquare,
    FolderLock,
    Users,
    Handshake,
    UserSquare2,
    BellRing,
    Settings,
    LogOut,
    Building2,
    Users2
} from 'lucide-react';
import { cn } from '../ui/Input';

const commonClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted";
const activeClasses = "bg-white/50 text-brand-600 font-medium shadow-sm backdrop-blur-md border border-white/40";

export default function Sidebar() {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    if (!user) return null;

    return (
        <aside className="w-64 flex flex-col border-r border-border/40 bg-white/30 backdrop-blur-xl h-screen sticky top-0">

            {/* Brand & Profile */}
            <div className="p-6 border-b border-border/40">
                <h1 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-brand-500"></div>
                    Tribute<span className="text-brand-600">One</span>
                </h1>

                <div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-white/50 shadow-sm">
                    <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full bg-muted object-cover border border-white"
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.role || user.activity_type}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">

                {/* Admin Navigation */}
                {user.role === 'admin' ? (
                    <>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <LayoutDashboard className="h-4 w-4" /> Дашборд
                        </NavLink>
                        <NavLink to="/admin/companies" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <Building2 className="h-4 w-4" /> Компании
                        </NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <Users2 className="h-4 w-4" /> Пользователи
                        </NavLink>
                        <NavLink to="/admin/requests" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <BellRing className="h-4 w-4" /> Запросы
                        </NavLink>
                    </>
                ) : (
                    <>
                        {/* Standard User Navigation */}
                        <NavLink to="/" end className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <LayoutDashboard className="h-4 w-4" /> Дашборд
                        </NavLink>
                        <NavLink to="/declarations" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <FileText className="h-4 w-4" /> Декларации
                        </NavLink>
                        <NavLink to="/certificates" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <FileBadge className="h-4 w-4" /> Сертификаты
                        </NavLink>
                        <NavLink to="/tasks" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <CheckSquare className="h-4 w-4" /> Задачи
                        </NavLink>
                        <NavLink to="/documents" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <FolderLock className="h-4 w-4" /> Документы
                        </NavLink>
                        <NavLink to="/clients" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <Users className="h-4 w-4" /> Клиенты
                        </NavLink>
                        <NavLink to="/partnerships" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <Handshake className="h-4 w-4" /> Компании
                        </NavLink>

                        {(user.role === 'director' || user.role === 'senior') && (
                            <>
                                <div className="pt-4 pb-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Управление</div>
                                <NavLink to="/employees" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                                    <UserSquare2 className="h-4 w-4" /> Мои сотрудники
                                </NavLink>
                                <NavLink to="/requests" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                                    <BellRing className="h-4 w-4" /> Запросы
                                </NavLink>
                            </>
                        )}

                        <div className="pt-4 pb-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Система</div>
                        <NavLink to="/settings" className={({ isActive }) => cn(commonClasses, isActive && activeClasses)}>
                            <Settings className="h-4 w-4" /> Настройки
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto border-t border-border/40">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium text-sm">Выйти</span>
                </button>
            </div>
        </aside>
    );
}
