import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Building2, Users, AlertTriangle, Check, X, Shield, Lock, Unlock, Mail } from 'lucide-react';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'users'>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const stats = [
        { title: "Всего компаний", value: "45", icon: Building2, trend: "+3", bgColor: "bg-blue-500/10", color: "text-blue-500" },
        { title: "Активные пользователи", value: "218", icon: Users, trend: "+12", bgColor: "bg-brand-500/10", color: "text-brand-600" },
        { title: "Ожидают проверки", value: "5", icon: AlertTriangle, trend: "+2", bgColor: "bg-orange-500/10", color: "text-orange-500" },
    ];

    const pendingCompanies = [
        { id: 1, name: "ООО 'Новая Логистика'", inn: "1231231231", requestDate: "2026-03-01", type: "declarant" },
        { id: 2, name: "ИП Тестовый", inn: "9879879879", requestDate: "2026-03-01", type: "certifier" },
    ];

    const systemUsers = [
        { id: 1, name: "Антон Админ", email: "admin@crm.com", role: "admin", company: "-", status: "active" },
        { id: 2, name: "Иван Иванов", email: "ivan@alpha.ru", role: "director", company: "ООО 'АЛЬФА'", status: "active" },
        { id: 3, name: "Петр Петров", email: "petr@alpha.ru", role: "standard", company: "ООО 'АЛЬФА'", status: "blocked" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Панель Администратора</h2>
                    <p className="text-muted-foreground mt-1 text-base">Глобальное управление системой, модерация и контроль доступа.</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-border/40 pb-px overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-brand-600 text-brand-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Обзор системы
                </button>
                <button
                    onClick={() => setActiveTab('companies')}
                    className={`pb-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'companies' ? 'border-brand-600 text-brand-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Управление компаниями
                    {pendingCompanies.length > 0 && <span className="ml-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCompanies.length}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Пользователи
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid gap-6 md:grid-cols-3">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={i} className="glass-card">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                                <p className="text-3xl font-bold font-display">{stat.value}</p>
                                            </div>
                                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                                <Icon className={`w-5 h-5 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="glass-card border-orange-500/20 bg-orange-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Ожидают модерации
                            </CardTitle>
                            <CardDescription>Новые компании, запросившие регистрацию в системе.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingCompanies.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingCompanies.map(company => (
                                        <div key={company.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-white/60 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{company.name}</div>
                                                    <div className="text-xs text-muted-foreground">ИНН: {company.inn} • Роль: {company.type === 'declarant' ? 'Декларанты' : 'Сертификатчики'}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">Дата запроса: {company.requestDate}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Button variant="secondary" className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10"><X className="w-4 h-4 mr-1" /> Отклонить</Button>
                                                <Button className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white"><Check className="w-4 h-4 mr-1" /> Одобрить</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">Все заявки обработаны</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'companies' && (
                <Card className="glass-card animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <CardTitle>Список компаний</CardTitle>
                            <div className="relative w-full md:w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Поиск по названию или ИНН..."
                                    className="pl-9 bg-white/50"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center border-t border-border/40 text-muted-foreground">
                        Здесь будет таблица всех компаний с возможностью блокировки.
                    </CardContent>
                </Card>
            )}

            {activeTab === 'users' && (
                <Card className="glass-card animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <CardTitle>Глобальный поиск пользователей</CardTitle>
                            <div className="relative w-full md:w-[350px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Поиск по email, имени, компании..."
                                    className="pl-9 bg-white/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-border/40 overflow-hidden bg-white/40">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/40">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Пользователь</th>
                                            <th className="px-6 py-3 font-medium">Компания</th>
                                            <th className="px-6 py-3 font-medium">Роль</th>
                                            <th className="px-6 py-3 font-medium text-right">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {systemUsers.map((userItem) => (
                                            <tr key={userItem.id} className={`hover:bg-white/60 transition-colors ${userItem.status === 'blocked' ? 'opacity-60' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium flex items-center gap-2">
                                                        {userItem.name}
                                                        {userItem.status === 'blocked' && <span className="text-[10px] text-destructive border border-destructive/20 bg-destructive/10 px-1.5 rounded uppercase font-semibold">Заблокирован</span>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{userItem.email}</div>
                                                </td>
                                                <td className="px-6 py-4">{userItem.company}</td>
                                                <td className="px-6 py-4">
                                                    {userItem.role === 'admin' ? (
                                                        <span className="flex items-center gap-1 text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded text-xs font-semibold w-max border border-purple-500/20"><Shield className="w-3 h-3" /> Админ</span>
                                                    ) : userItem.role === 'director' ? (
                                                        <span className="text-blue-600 text-xs font-medium">Директор</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">Стандарт</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" title="Написать" className="h-8 w-8 text-muted-foreground">
                                                            <Mail className="w-4 h-4" />
                                                        </Button>
                                                        {userItem.role !== 'admin' && (
                                                            userItem.status === 'active' ? (
                                                                <Button variant="ghost" size="icon" title="Заблокировать глобально" className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                                                    <Lock className="w-4 h-4" />
                                                                </Button>
                                                            ) : (
                                                                <Button variant="ghost" size="icon" title="Разблокировать" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                                    <Unlock className="w-4 h-4" />
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
