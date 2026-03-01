import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Settings, Users, ShieldCheck } from 'lucide-react';

export function ClientsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-semibold tracking-tight">Клиенты</h2>
            </div>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-brand-600" /> База клиентов</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-t border-border/40">
                    Модуль в разработке
                </CardContent>
            </Card>
        </div>
    );
}

export function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-semibold tracking-tight">Настройки профиля</h2>
            </div>
            <Card className="glass-card max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-brand-600" /> Настройки аккаунта</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-t border-border/40">
                    Модуль в разработке
                </CardContent>
            </Card>
        </div>
    );
}

export function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-semibold tracking-tight">Панель Администратора</h2>
            </div>
            <Card className="glass-card bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand-500" /> Сводка по системе</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-gray-500 border-t border-gray-800">
                    Дашборд администратора в разработке
                </CardContent>
            </Card>
        </div>
    );
}
