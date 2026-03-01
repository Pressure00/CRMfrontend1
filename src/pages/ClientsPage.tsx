import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Building2, Phone, Mail, FileText, MoreVertical, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useClients, useCreateClient, useDeleteClient } from '@/api/hooks';

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClient, setNewClient] = useState({ company_name: '', inn: '', director_name: '', note: '' });
    const [formError, setFormError] = useState('');

    const { data: clients = [], isLoading, error } = useClients({
        company_name: searchQuery || undefined,
    });
    const createClient = useCreateClient();
    const deleteClient = useDeleteClient();

    const handleCreate = async () => {
        setFormError('');
        if (!newClient.company_name.trim()) {
            setFormError('Введите название компании');
            return;
        }
        try {
            await createClient.mutateAsync({
                company_name: newClient.company_name,
                inn: newClient.inn || undefined,
                director_name: newClient.director_name || undefined,
                note: newClient.note || undefined,
            });
            setShowAddModal(false);
            setNewClient({ company_name: '', inn: '', director_name: '', note: '' });
        } catch (err: any) {
            setFormError(err.response?.data?.detail || 'Ошибка при создании клиента');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить этого клиента?')) {
            try {
                await deleteClient.mutateAsync(id);
            } catch (err: any) {
                alert(err.response?.data?.detail || 'Ошибка при удалении');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Клиенты</h2>
                    <p className="text-muted-foreground mt-1 text-base">База данных ваших клиентов и заказчиков.</p>
                </div>
                <Button className="shrink-0 gap-2" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4" />
                    Добавить клиента
                </Button>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Не удалось загрузить клиентов. Проверьте подключение к серверу.
                </div>
            )}

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по названию, ИНН или директору..."
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
                                        <th className="px-6 py-3 font-medium">Компания</th>
                                        <th className="px-6 py-3 font-medium">ИНН</th>
                                        <th className="px-6 py-3 font-medium">Директор</th>
                                        <th className="px-6 py-3 font-medium">Связи</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : clients.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            Клиенты не найдены
                                        </td></tr>
                                    ) : (
                                        clients.map((client: any) => (
                                            <tr key={client.id} className="hover:bg-white/60 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                                                            <Building2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-base">{client.company_name}</div>
                                                            {client.note && <div className="text-xs text-muted-foreground">{client.note}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-muted-foreground">{client.inn || '—'}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{client.director_name || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/40">
                                                        <FileText className="w-3 h-3" />
                                                        {client.declarations_count ?? 0} декл.
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(client.id)}>
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

            {/* Add Client Modal */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить клиента">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Название компании *</Label>
                        <Input placeholder="ООО 'Пример'" value={newClient.company_name}
                            onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>ИНН</Label>
                        <Input placeholder="1234567890" value={newClient.inn}
                            onChange={(e) => setNewClient({ ...newClient, inn: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Директор</Label>
                        <Input placeholder="Иванов И.И." value={newClient.director_name}
                            onChange={(e) => setNewClient({ ...newClient, director_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Примечание</Label>
                        <Input placeholder="Дополнительная информация" value={newClient.note}
                            onChange={(e) => setNewClient({ ...newClient, note: e.target.value })} />
                    </div>
                    {formError && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">{formError}</div>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Отмена</Button>
                        <Button onClick={handleCreate} isLoading={createClient.isPending}>Добавить</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
