import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UserPlus, Shield, User, Lock, ArrowRightLeft, UserX } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function EmployeesPage() {
    const { user } = useAuthStore();
    const isDirector = user?.role === 'director' || user?.role === 'admin';
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const employees = [
        { id: 1, name: "Иванов Иван", role: "director", phone: "+7 (900) 111-22-33", email: "ivanov@test.ru", status: "active" },
        { id: 2, name: "Петрова Анна", role: "senior", phone: "+7 (900) 222-33-44", email: "petrova@test.ru", status: "active" },
        { id: 3, name: "Сидоров Алексей", role: "standard", phone: "+7 (900) 333-44-55", email: "sidorov@test.ru", status: "blocked" },
    ];

    const RoleBadge = ({ role }: { role: string }) => {
        switch (role) {
            case 'director': return <span className="bg-purple-500/10 text-purple-600 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Shield className="w-3 h-3" /> Директор</span>;
            case 'senior': return <span className="bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><User className="w-3 h-3" /> Старший</span>;
            default: return <span className="bg-gray-500/10 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">Сотрудник</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Сотрудники</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление персоналом вашей компании.</p>
                </div>
                {isDirector && (
                    <Button className="shrink-0 gap-2">
                        <UserPlus className="w-4 h-4" />
                        Пригласить сотрудника
                    </Button>
                )}
            </div>

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по имени, email или телефону..."
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
                                        <th className="px-6 py-3 font-medium">Сотрудник</th>
                                        <th className="px-6 py-3 font-medium">Роль</th>
                                        <th className="px-6 py-3 font-medium">Контакты</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className={`hover:bg-white/60 transition-colors group ${emp.status === 'blocked' ? 'opacity-50 grayscale' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                                                        {emp.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-base flex items-center gap-2">
                                                            {emp.name}
                                                            {emp.status === 'blocked' && <span className="text-xs text-destructive border border-destructive/20 bg-destructive/10 px-1.5 rounded">Заблокирован</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={emp.role} />
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                <div className="text-xs">{emp.phone}</div>
                                                <div className="text-xs">{emp.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isDirector && emp.role !== 'director' && (
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" title="Передать данные" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <ArrowRightLeft className="w-4 h-4" />
                                                        </Button>
                                                        {emp.status === 'active' ? (
                                                            <Button variant="ghost" size="icon" title="Заблокировать" className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                                                <Lock className="w-4 h-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button variant="ghost" size="icon" title="Разблокировать" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                                <Lock className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" title="Удалить" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                            <UserX className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
