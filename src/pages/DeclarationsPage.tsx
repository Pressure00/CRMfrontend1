import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Search, Filter, FileText, Download, MoreVertical } from 'lucide-react';

export default function DeclarationsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const declarations = [
        { id: 1, postCode: "12345", regDate: "2026-03-01", number: "10001", client: "ООО 'АЛЬФА'", regime: "ИМ40", vehicle: "A123BC", status: "completed" },
        { id: 2, postCode: "67890", regDate: "2026-03-02", number: "10002", client: "ИП Смирнов", regime: "ЭК10", vehicle: "В456ЕК", status: "in_progress" },
        { id: 3, postCode: "54321", regDate: "2026-03-03", number: "10003", client: "ZAO BETA", regime: "ИМ70", vehicle: "С789МН", status: "draft" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Декларации</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление и отслеживание таможенных деклараций.</p>
                </div>
                <Button className="shrink-0 gap-2">
                    <Plus className="w-4 h-4" />
                    Создать декларацию
                </Button>
            </div>

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
                            <Select className="w-[160px] bg-white/50">
                                <option value="">Все статусы</option>
                                <option value="completed">Выпущено</option>
                                <option value="in_progress">В работе</option>
                                <option value="draft">Черновик</option>
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
                                        <th className="px-6 py-3 font-medium">№ ДТ</th>
                                        <th className="px-6 py-3 font-medium">Код поста / Дата</th>
                                        <th className="px-6 py-3 font-medium">Клиент</th>
                                        <th className="px-6 py-3 font-medium">Режим</th>
                                        <th className="px-6 py-3 font-medium">Транспорт</th>
                                        <th className="px-6 py-3 font-medium">Статус</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {declarations.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/40 transition-colors group">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-brand-600" />
                                                {item.number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{item.postCode}</div>
                                                <div className="text-xs text-muted-foreground">{item.regDate}</div>
                                            </td>
                                            <td className="px-6 py-4">{item.client}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border/40">
                                                    {item.regime}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{item.vehicle}</td>
                                            <td className="px-6 py-4">
                                                {item.status === 'completed' && <span className="text-brand-600 bg-brand-500/10 px-2 py-1 rounded-full text-xs font-medium border border-brand-500/20">Выпущено</span>}
                                                {item.status === 'in_progress' && <span className="text-blue-600 bg-blue-500/10 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/20">В работе</span>}
                                                {item.status === 'draft' && <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs font-medium border border-border/40">Черновик</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
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
