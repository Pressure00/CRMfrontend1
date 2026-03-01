import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Shield, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEmployees, useBlockEmployee, useUnblockEmployee } from '@/api/hooks';

export default function EmployeesPage() {
    const { user } = useAuthStore();
    const isDirector = user?.role === 'director' || user?.role === 'admin';
    const [searchQuery, setSearchQuery] = useState('');

    const { data: employeesData, isLoading, error } = useEmployees();
    const blockEmployee = useBlockEmployee();
    const unblockEmployee = useUnblockEmployee();

    // The API returns { my_company: { name, members: [...] }, partner_companies: [...] }
    const myMembers = employeesData?.my_company?.members || [];
    const partnerCompanies = employeesData?.partner_companies || [];

    const filtered = myMembers.filter((emp: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return emp.full_name?.toLowerCase().includes(q) ||
            emp.email?.toLowerCase().includes(q);
    });

    const handleBlock = async (userId: number) => {
        if (!window.confirm('Заблокировать этого сотрудника?')) return;
        try { await blockEmployee.mutateAsync(userId); } catch (err: any) {
            alert(err.response?.data?.detail || 'Ошибка');
        }
    };

    const handleUnblock = async (userId: number) => {
        try { await unblockEmployee.mutateAsync(userId); } catch (err: any) {
            alert(err.response?.data?.detail || 'Ошибка');
        }
    };

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
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />Не удалось загрузить сотрудников.
                </div>
            )}

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Поиск по имени, email или телефону..." className="pl-9 bg-white/50"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Сотрудники не найдены</td></tr>
                                    ) : (
                                        filtered.map((emp: any) => (
                                            <tr key={emp.user_id} className={`hover:bg-white/60 transition-colors group ${emp.is_blocked ? 'opacity-50 grayscale' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                                                            {emp.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-base flex items-center gap-2">
                                                                {emp.full_name}
                                                                {emp.is_blocked && <span className="text-xs text-destructive border border-destructive/20 bg-destructive/10 px-1.5 rounded">Заблокирован</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><RoleBadge role={emp.role || 'standard'} /></td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    <div className="text-xs">{emp.phone || '—'}</div>
                                                    <div className="text-xs">{emp.email || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isDirector && emp.role !== 'director' && (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!emp.is_blocked ? (
                                                                <Button variant="ghost" size="icon" title="Заблокировать" className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                    onClick={() => handleBlock(emp.user_id)}>
                                                                    <Lock className="w-4 h-4" />
                                                                </Button>
                                                            ) : (
                                                                <Button variant="ghost" size="icon" title="Разблокировать" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    onClick={() => handleUnblock(emp.user_id)}>
                                                                    <Lock className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Partner Companies Section */}
                    {partnerCompanies.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Сотрудники партнёров</h3>
                            {partnerCompanies.map((pc: any) => (
                                <div key={pc.company_id || pc.name} className="mb-4">
                                    <h4 className="text-sm font-semibold mb-2">{pc.name}</h4>
                                    <div className="space-y-2">
                                        {pc.members?.map((m: any) => (
                                            <div key={m.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                    {m.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{m.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">{m.role || 'Сотрудник'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
