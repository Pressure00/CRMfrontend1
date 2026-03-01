import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, Clock, CheckCircle2, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { useDashboard } from '@/api/hooks';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: dashboard, isLoading, error } = useDashboard();

    const stats = dashboard ? [
        { title: "Активные задачи", value: String(dashboard.active_tasks ?? 0), icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Завершено задач", value: String(dashboard.completed_tasks ?? 0), icon: CheckCircle2, color: "text-brand-600", bg: "bg-brand-500/20" },
        { title: "Просрочено", value: String(dashboard.overdue_tasks ?? 0), icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
        { title: "Декларации", value: String(dashboard.sent_declarations ?? 0), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    ] : [
        { title: "Активные задачи", value: "—", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Завершено задач", value: "—", icon: CheckCircle2, color: "text-brand-600", bg: "bg-brand-500/20" },
        { title: "Просрочено", value: "—", icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
        { title: "Декларации", value: "—", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Добро пожаловать, {user?.full_name?.split(' ')[0] || 'Коллега'} 👋</h2>
                    <p className="text-muted-foreground mt-1 text-base">Вот краткая сводка по вашим задачам на сегодня.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Не удалось загрузить данные дашборда. Проверьте подключение к серверу.
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className={`glass-card hover:-translate-y-1 transition-transform duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold font-display">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="glass-card col-span-4">
                    <CardHeader>
                        <CardTitle>Последние декларации</CardTitle>
                        <CardDescription>Недавно созданные декларации</CardDescription>
                    </CardHeader>
                    <CardContent className="border-t border-border/40 p-0">
                        <div className="divide-y divide-border/40">
                            {dashboard?.recent_declarations?.length > 0 ? (
                                dashboard.recent_declarations.slice(0, 5).map((d: any) => (
                                    <div key={d.id} className="flex items-center p-4 hover:bg-white/40 transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center mr-4">
                                            <FileText className="w-4 h-4 text-brand-600" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{d.display_number}</p>
                                            <p className="text-xs text-muted-foreground truncate">{d.client_name || 'Без клиента'}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            {d.regime}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    {isLoading ? 'Загрузка...' : 'Нет деклараций'}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card col-span-3">
                    <CardHeader>
                        <CardTitle>Сертификаты</CardTitle>
                        <CardDescription>Статус заявок на сертификацию</CardDescription>
                    </CardHeader>
                    <CardContent className="border-t border-border/40 p-0">
                        <div className="divide-y divide-border/40">
                            {dashboard?.recent_certificates?.length > 0 ? (
                                dashboard.recent_certificates.slice(0, 4).map((c: any, i: number) => (
                                    <div key={i} className="flex items-center p-4 hover:bg-white/40 transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{c.certificate_type}</p>
                                            <p className="text-xs text-muted-foreground truncate">{c.certifier_company_name || c.declarant_company_name || ''}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            {c.status === 'completed' ? '✅' : c.status === 'rejected' ? '❌' : '⏳'} {c.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    {isLoading ? 'Загрузка...' : 'Нет сертификатов'}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
