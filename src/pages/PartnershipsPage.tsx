import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Building, Check, X, ShieldAlert, Zap } from 'lucide-react';

export default function PartnershipsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const partners = [
        { id: 1, name: "ООО 'Брокер Сервис'", inn: "1112223334", type: "Сертификаторы", status: "active", since: "2026-01-15" },
        { id: 2, name: "ИП Сидоров (Таможенный Представитель)", inn: "9998887776", type: "Декларанты", status: "active", since: "2026-02-20" },
    ];

    const incomingRequests = [
        { id: 101, name: "ЗАО 'Глобал Логистик'", inn: "4445556667", message: "Хотим с вами работать по сертификации" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Сотрудничество</h2>
                    <p className="text-muted-foreground mt-1 text-base">Интеграция с другими фирмами для обмена задачами.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Connection Tool */}
                <Card className="glass-card lg:col-span-1 border-brand-500/20 bg-brand-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-brand-500" />
                            Отправить запрос
                        </CardTitle>
                        <CardDescription>Укажите ИНН фирмы, с которой хотите сотрудничать</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input placeholder="Введите ИНН (10 или 12 цифр)" className="bg-white/50" />
                        </div>
                        <Button className="w-full">Найти и предложить</Button>
                    </CardContent>
                </Card>

                {/* Incoming Requests */}
                <Card className="glass-card lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-orange-500" />
                            Входящие запросы
                        </CardTitle>
                        <CardDescription>Компании, которые хотят с вами работать</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {incomingRequests.length > 0 ? (
                            <div className="space-y-4">
                                {incomingRequests.map(req => (
                                    <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-white/40 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                                <Building className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{req.name}</div>
                                                <div className="text-xs text-muted-foreground">ИНН: {req.inn}</div>
                                                {req.message && <div className="text-sm mt-1 italic opacity-80">"{req.message}"</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button variant="secondary" className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10"><X className="w-4 h-4 mr-1" /> Отклонить</Button>
                                            <Button className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"><Check className="w-4 h-4 mr-1" /> Принять</Button>
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
                            <Input
                                placeholder="Поиск партнера..."
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
                                        <th className="px-6 py-3 font-medium">Сфера</th>
                                        <th className="px-6 py-3 font-medium">Сотрудничество с</th>
                                        <th className="px-6 py-3 font-medium text-right">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {partners.map((partner) => (
                                        <tr key={partner.id} className="hover:bg-white/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-base">{partner.name}</div>
                                                <div className="text-xs text-muted-foreground">ИНН: {partner.inn}</div>
                                            </td>
                                            <td className="px-6 py-4">{partner.type}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{partner.since}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                                                    Активно
                                                </span>
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
