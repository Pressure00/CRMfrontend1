import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, CheckSquare, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';

export default function TasksPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Tasks
    const columns = [
        { id: 'todo', title: 'К выполнению', color: 'bg-muted/50 border-border/40' },
        { id: 'in_progress', title: 'В работе', color: 'bg-blue-500/10 border-blue-500/20' },
        { id: 'review', title: 'На проверке', color: 'bg-purple-500/10 border-purple-500/20' },
        { id: 'done', title: 'Завершено', color: 'bg-brand-500/10 border-brand-500/20' },
    ];

    const tasks = [
        { id: 1, title: 'Подготовить ГТД для ООО АЛЬФА', status: 'todo', priority: 'high', date: 'Завтра' },
        { id: 2, title: 'Запросить сертификат СЭЗ', status: 'in_progress', priority: 'medium', date: 'Сегодня' },
        { id: 3, title: 'Проверить платежку', status: 'review', priority: 'low', date: '2 марта' },
        { id: 4, title: 'Оформить транспорт', status: 'done', priority: 'medium', date: 'Вчера' },
    ];

    const PriorityIcon = ({ priority }: { priority: string }) => {
        switch (priority) {
            case 'high': return <AlertCircle className="w-4 h-4 text-destructive" />;
            case 'medium': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'low': return <CheckSquare className="w-4 h-4 text-brand-600" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Задачи</h2>
                    <p className="text-muted-foreground mt-1 text-base">Канбан-доска для управления задачами.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Поиск задач..."
                            className="pl-9 bg-white/50 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="shrink-0 gap-2">
                        <Plus className="w-4 h-4" />
                        Создать задачу
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className={`flex-1 min-w-[300px] flex flex-col rounded-xl border ${col.color} p-4`}>
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="font-semibold">{col.title}</h3>
                            <span className="text-xs font-medium bg-white/50 px-2 py-1 rounded-full text-muted-foreground shadow-sm">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <Card key={task.id} className="glass-card hover:border-brand-500/50 transition-colors cursor-grab active:cursor-grabbing">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <p className="font-medium text-sm leading-tight">{task.title}</p>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -nr-2 -mt-1 text-muted-foreground">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-border/40">
                                            <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                                                <PriorityIcon priority={task.priority} />
                                                {task.date}
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-medium">
                                                АА
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Button variant="ghost" className="w-full mt-3 text-muted-foreground gap-2 justify-start hover:bg-white/40">
                            <Plus className="w-4 h-4" /> Добавить
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
