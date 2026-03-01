import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, Clock, CheckCircle2, TrendingUp, FileText } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuthStore();

    const stats = [
        { title: "В работе", value: "12", icon: Activity, trend: "+2", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Завершено", value: "148", icon: CheckCircle2, trend: "+14", color: "text-brand-600", bg: "bg-brand-500/20" },
        { title: "Просрочено", value: "3", icon: Clock, trend: "-1", color: "text-destructive", bg: "bg-destructive/10" },
        { title: "Эффективность", value: "98%", icon: TrendingUp, trend: "+2.4%", color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Добро пожаловать, {user?.full_name?.split(' ')[0] || 'Коллега'} 👋</h2>
                    <p className="text-muted-foreground mt-1 text-base">Вот краткая сводка по вашим задачам на сегодня.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="glass-card hover:-translate-y-1 transition-transform duration-300">
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
                                <div className="mt-4 flex items-center text-xs">
                                    <span className={`font-medium ${stat.trend.startsWith('+') ? 'text-brand-600' : 'text-destructive'}`}>
                                        {stat.trend}
                                    </span>
                                    <span className="text-muted-foreground ml-1">по сравнению с прошлой неделей</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="glass-card col-span-4">
                    <CardHeader>
                        <CardTitle>Активность</CardTitle>
                        <CardDescription>Количество деклараций и сертификатов (за неделю)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-border/40 text-muted-foreground">
                        {/* Рендер графика будет здесь (Recharts/Chart.js) */}
                        <p>Место для графика</p>
                    </CardContent>
                </Card>

                <Card className="glass-card col-span-3">
                    <CardHeader>
                        <CardTitle>Недавние задачи</CardTitle>
                        <CardDescription>Последние изменения статусов</CardDescription>
                    </CardHeader>
                    <CardContent className="border-t border-border/40 p-0">
                        <div className="divide-y divide-border/40">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center p-4 hover:bg-white/40 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center mr-4">
                                        <FileText className="w-4 h-4 text-brand-600" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">Декларация №{20405 + i}</p>
                                        <p className="text-xs text-muted-foreground truncate">Клиент ООО "СИМВОЛ"</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        2 ч назад
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
