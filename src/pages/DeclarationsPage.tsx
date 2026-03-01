import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Search, FileText, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useDeclarations, useDeleteDeclaration } from '@/api/hooks';

export default function DeclarationsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: declarations = [], isLoading, error } = useDeclarations();
    const deleteMutation = useDeleteDeclaration();

    const filtered = declarations.filter((d: any) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            d.display_number?.toLowerCase().includes(q) ||
            d.client_name?.toLowerCase().includes(q) ||
            d.declaration_number?.toLowerCase().includes(q);
        return matchesSearch;
    });

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить эту декларацию?')) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (err: any) {
                alert(err.response?.data?.detail || 'Ошибка при удалении');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Декларации</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление и отслеживание таможенных деклараций.</p>
                </div>
                <Button className="shrink-0 gap-2" onClick={() => navigate('/declarations/new')}>
                    <Plus className="w-4 h-4" />
                    Создать декларацию
                </Button>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Не удалось загрузить декларации.
                </div>
            )}

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по номеру, клиенту или авто..."
                                className="pl-9 bg-white/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select className="w-[160px] bg-white/50" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">Все режимы</option>
                                <option value="ИМ/40">ИМ/40</option>
                                <option value="ЭК/10">ЭК/10</option>
                                <option value="ИМ/70">ИМ/70</option>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border/40 overflow-hidden bg-white/40">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/40">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">№ ДТ</th>
                                        <th className="px-6 py-3 font-medium">Код поста / Дата</th>
                                        <th className="px-6 py-3 font-medium">Клиент</th>
                                        <th className="px-6 py-3 font-medium">Режим</th>
                                        <th className="px-6 py-3 font-medium">Транспорт</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            Декларации не найдены
                                        </td></tr>
                                    ) : (
                                        filtered.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/40 transition-colors group">
                                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-brand-600" />
                                                    {item.display_number || item.declaration_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>{item.post_number}</div>
                                                    <div className="text-xs text-muted-foreground">{item.send_date}</div>
                                                </td>
                                                <td className="px-6 py-4">{item.client_name || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border/40">
                                                        {item.regime}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.vehicles?.map((v: any) => v.vehicle_number).join(', ') || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
