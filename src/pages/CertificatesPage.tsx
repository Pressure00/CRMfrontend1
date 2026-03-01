import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, FileBadge, CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCertificates, useCreateCertificate, useClients } from '@/api/hooks';

export default function CertificatesPage() {
    const { user } = useAuthStore();
    const isCertifier = user?.activity_type === 'certifier';
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCert, setNewCert] = useState({ certificate_type: '', deadline: '', client_id: '', note: '' });
    const [formError, setFormError] = useState('');

    const { data: certificates = [], isLoading, error } = useCertificates({
        status: statusFilter || undefined,
    });
    const { data: clients = [] } = useClients();
    const createCert = useCreateCertificate();

    const filtered = certificates.filter((c: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return c.certificate_type?.toLowerCase().includes(q) ||
            c.certificate_number?.toLowerCase().includes(q) ||
            c.client_name?.toLowerCase().includes(q);
    });

    const handleCreate = async () => {
        setFormError('');
        if (!newCert.certificate_type || !newCert.deadline || !newCert.client_id) {
            setFormError('Заполните все обязательные поля');
            return;
        }
        try {
            await createCert.mutateAsync({
                certificate_type: newCert.certificate_type,
                deadline: newCert.deadline,
                client_id: Number(newCert.client_id),
                is_self: true,
                note: newCert.note || undefined,
            });
            setShowCreateModal(false);
            setNewCert({ certificate_type: '', deadline: '', client_id: '', note: '' });
        } catch (err: any) {
            setFormError(err.response?.data?.detail || 'Ошибка');
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-brand-600" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
            default: return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const map: Record<string, { label: string; cls: string }> = {
            completed: { label: 'Готово', cls: 'bg-brand-500/10 text-brand-600 border-brand-500/20' },
            in_progress: { label: 'В работе', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
            rejected: { label: 'Отклонено', cls: 'bg-destructive/10 text-destructive border-destructive/20' },
            waiting_payment: { label: 'Ожидает оплату', cls: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
            on_review: { label: 'На проверке', cls: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
        };
        const s = map[status] || { label: status, cls: 'bg-muted text-muted-foreground border-border/40' };
        return <span className={`${s.cls} px-2 py-1 rounded-full text-xs font-medium border`}>{s.label}</span>;
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
                    <Button className="shrink-0 gap-2" onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4" />Заявка на сертификат
                    </Button>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />Не удалось загрузить сертификаты.
                </div>
            )}

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Поиск по номеру, типу или клиенту..." className="pl-9 bg-white/50"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <Select className="w-[160px] bg-white/50" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">Все статусы</option>
                                <option value="completed">Готово</option>
                                <option value="in_progress">В работе</option>
                                <option value="rejected">Отклонено</option>
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
                                        <th className="px-6 py-3 font-medium">№ / Тип</th>
                                        <th className="px-6 py-3 font-medium">Клиент</th>
                                        <th className="px-6 py-3 font-medium">Дедлайн</th>
                                        <th className="px-6 py-3 font-medium">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Сертификаты не найдены</td></tr>
                                    ) : (
                                        filtered.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium flex items-center gap-2">
                                                        <FileBadge className="w-4 h-4 text-brand-600" />
                                                        {item.certificate_number || `#${item.id}`}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">{item.certificate_type}</div>
                                                </td>
                                                <td className="px-6 py-4">{item.client_name || '—'}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.deadline}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon status={item.status} />
                                                        <StatusBadge status={item.status} />
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

            <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Заявка на сертификат">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Тип сертификата *</Label>
                        <Input placeholder="Сертификат Соответствия, Фитосанитарный, СЭЗ..." value={newCert.certificate_type}
                            onChange={e => setNewCert({ ...newCert, certificate_type: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Клиент *</Label>
                        <Select value={newCert.client_id} onChange={e => setNewCert({ ...newCert, client_id: e.target.value })}>
                            <option value="">Выберите клиента...</option>
                            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Дедлайн *</Label>
                        <Input type="date" value={newCert.deadline}
                            onChange={e => setNewCert({ ...newCert, deadline: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Примечание</Label>
                        <textarea className="input-base min-h-[80px] resize-y p-3 w-full" placeholder="Детали заявки..."
                            value={newCert.note} onChange={e => setNewCert({ ...newCert, note: e.target.value })} />
                    </div>
                    {formError && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{formError}</div>}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Отмена</Button>
                        <Button onClick={handleCreate} isLoading={createCert.isPending}>Отправить заявку</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
