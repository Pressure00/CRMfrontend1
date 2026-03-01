import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Search, Filter, FileBadge, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function CertificatesPage() {
    const { user } = useAuthStore();
    const isCertifier = user?.activity_type === 'certifier';
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const certificates = [
        { id: 1, number: "СЕРТ-001", type: "Сертификат Соответствия", client: "ООО 'Вектор'", declarant: "Иванов И.И.", status: "completed", date: "2026-03-01" },
        { id: 2, number: "СЕРТ-002", type: "Фитосанитарный", client: "ИП Петров", declarant: "Смирнов С.С.", status: "in_progress", date: "2026-03-02" },
        { id: 3, number: "СЕРТ-003", type: "СЭЗ", client: "ЗАО Альфа", declarant: "Иванов И.И.", status: "rejected", date: "2026-03-03" },
    ];

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-brand-600" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
            default: return null;
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <span className="bg-brand-500/10 text-brand-600 px-2 py-1 rounded-full text-xs font-medium border border-brand-500/20">Готово</span>;
            case 'in_progress': return <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/20">В работе</span>;
            case 'rejected': return <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-full text-xs font-medium border border-destructive/20">Отклонено</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Сертификаты</h2>
                    <p className="text-muted-foreground mt-1 text-base">
                        {isCertifier ? "Управление и обработка заявок на сертификацию." : "Отслеживание отправленных заявок на сертификацию."}
                    </p>
                </div>
                {!isCertifier && (
                    <Button className="shrink-0 gap-2">
                        <Plus className="w-4 h-4" />
                        Заявка на сертификат
                    </Button>
                )}
            </div>

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по номеру, типу или клиенту..."
                                className="pl-9 bg-white/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select className="w-[160px] bg-white/50">
                                <option value="">Все статусы</option>
                                <option value="completed">Готово</option>
                                <option value="in_progress">В работе</option>
                                <option value="rejected">Отклонено</option>
                            </Select>
                            <Button variant="secondary" size="icon" className="shrink-0">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border/40 overflow-hidden bg-white/40">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/40">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">№ / Тип</th>
                                        <th className="px-6 py-3 font-medium">Клиент</th>
                                        {isCertifier && <th className="px-6 py-3 font-medium">Декларант</th>}
                                        <th className="px-6 py-3 font-medium">Дата создания</th>
                                        <th className="px-6 py-3 font-medium">Статус</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {certificates.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium flex items-center gap-2">
                                                    <FileBadge className="w-4 h-4 text-brand-600" />
                                                    {item.number}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">{item.type}</div>
                                            </td>
                                            <td className="px-6 py-4">{item.client}</td>
                                            {isCertifier && <td className="px-6 py-4">{item.declarant}</td>}
                                            <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon status={item.status} />
                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {isCertifier && item.status === 'in_progress' && (
                                                        <Button size="sm" variant="secondary" className="h-8">Обработать</Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
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
        </div>
    );
}
