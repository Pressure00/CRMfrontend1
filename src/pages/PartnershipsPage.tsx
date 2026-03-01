import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Building, Check, X, ShieldAlert, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { usePartnerships, usePartnershipRequests, useSendPartnershipRequest, useRespondPartnership } from '@/api/hooks';

export default function PartnershipsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [inn, setInn] = useState('');
    const [sendMsg, setSendMsg] = useState('');

    const { data: partners = [], isLoading, error } = usePartnerships();
    const { data: incomingRequests = [] } = usePartnershipRequests();
    const sendRequest = useSendPartnershipRequest();
    const respondPartnership = useRespondPartnership();

    const handleSendRequest = async () => {
        setSendMsg('');
        if (!inn.trim()) { setSendMsg('Введите ИНН'); return; }
        try {
            await sendRequest.mutateAsync({ target_inn: inn });
            setSendMsg('✓ Запрос отправлен!');
            setInn('');
        } catch (err: any) {
            setSendMsg(err.response?.data?.detail || 'Ошибка. Компания не найдена или уже есть запрос.');
        }
    };

    const handleRespond = async (id: number, action: 'approve' | 'reject') => {
        try {
            await respondPartnership.mutateAsync({ id, action });
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Ошибка');
        }
    };

    const filtered = partners.filter((p: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return p.company_name?.toLowerCase().includes(q) || p.company_inn?.includes(q);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Сотрудничество</h2>
                    <p className="text-muted-foreground mt-1 text-base">Интеграция с другими фирмами для обмена задачами.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />Не удалось загрузить данные.
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Connection Tool */}
                <Card className="glass-card lg:col-span-1 border-brand-500/20 bg-brand-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-brand-500" />Отправить запрос
                        </CardTitle>
                        <CardDescription>Укажите ИНН фирмы, с которой хотите сотрудничать</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input placeholder="Введите ИНН (9 цифр)" className="bg-white/50" value={inn}
                                onChange={e => setInn(e.target.value)} maxLength={9} />
                        </div>
                        {sendMsg && (
                            <div className={`p-3 rounded-md text-sm ${sendMsg.startsWith('✓') ? 'bg-brand-500/10 text-brand-600' : 'bg-destructive/10 text-destructive'}`}>
                                {sendMsg}
                            </div>
                        )}
                        <Button className="w-full" onClick={handleSendRequest} isLoading={sendRequest.isPending}>
                            Найти и предложить
                        </Button>
                    </CardContent>
                </Card>

                {/* Incoming Requests */}
                <Card className="glass-card lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-orange-500" />Входящие запросы
                        </CardTitle>
                        <CardDescription>Компании, которые хотят с вами работать</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {incomingRequests.length > 0 ? (
                            <div className="space-y-4">
                                {incomingRequests.map((req: any) => (
                                    <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-white/40 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                                <Building className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{req.requester_company_name || 'Компания'}</div>
                                                <div className="text-xs text-muted-foreground">ИНН: {req.requester_company_inn || '—'}</div>
                                                {req.note && <div className="text-sm mt-1 italic opacity-80">"{req.note}"</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button variant="secondary" className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRespond(req.id, 'reject')}
                                                isLoading={respondPartnership.isPending}>
                                                <X className="w-4 h-4 mr-1" /> Отклонить
                                            </Button>
                                            <Button className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleRespond(req.id, 'approve')}
                                                isLoading={respondPartnership.isPending}>
                                                <Check className="w-4 h-4 mr-1" /> Принять
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">Нет новых запросов</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle>Активные партнеры</CardTitle>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Поиск партнера..." className="pl-9 bg-white/50"
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
                                        <th className="px-6 py-3 font-medium">Компания</th>
                                        <th className="px-6 py-3 font-medium">Сфера</th>
                                        <th className="px-6 py-3 font-medium">Сотрудничество с</th>
                                        <th className="px-6 py-3 font-medium text-right">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Нет активных партнеров</td></tr>
                                    ) : (
                                        filtered.map((partner: any) => (
                                            <tr key={partner.partnership_id || partner.id} className="hover:bg-white/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-base">{partner.company_name}</div>
                                                    <div className="text-xs text-muted-foreground">ИНН: {partner.company_inn || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4">{partner.activity_type || '—'}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{partner.created_at?.split('T')[0] || '—'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                                                        Активно
                                                    </span>
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
