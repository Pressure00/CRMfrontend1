import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Building2, Phone, Mail, FileText, MoreVertical } from 'lucide-react';

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const clients = [
        { id: 1, name: "ООО 'АЛЬФА'", inn: "1234567890", director: "Иванов И.И.", phone: "+7 (999) 123-45-67", email: "info@alpha.ru", contracts: 2 },
        { id: 2, name: "ИП Смирнов", inn: "0987654321", director: "Смирнов А.А.", phone: "+7 (999) 987-65-43", email: "smirnov@mail.ru", contracts: 1 },
        { id: 3, name: "ЗАО 'Вектор'", inn: "5556667778", director: "Петров В.В.", phone: "+7 (495) 111-22-33", email: "contact@vector.com", contracts: 5 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Клиенты</h2>
                    <p className="text-muted-foreground mt-1 text-base">База данных ваших клиентов и заказчиков.</p>
                </div>
                <Button className="shrink-0 gap-2">
                    <Plus className="w-4 h-4" />
                    Добавить клиента
                </Button>
            </div>

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
                                        <th className="px-6 py-3 font-medium">Контакты</th>
                                        <th className="px-6 py-3 font-medium">Договоры</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-white/60 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-base">{client.name}</div>
                                                        <div className="text-xs text-muted-foreground">{client.director}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-muted-foreground">{client.inn}</td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-muted-foreground" /> {client.phone}</div>
                                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-muted-foreground" /> {client.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/40">
                                                    <FileText className="w-3 h-3" />
                                                    {client.contracts} активных
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm">Профиль</Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
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
