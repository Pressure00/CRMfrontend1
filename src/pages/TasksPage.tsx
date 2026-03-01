import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, CheckSquare, Clock, AlertCircle as AlertCircleIcon, MoreHorizontal, Loader2 } from 'lucide-react';
import { useTasks, useCreateTask, useUpdateTask } from '@/api/hooks';
import { useAuthStore } from '@/store/authStore';

const STATUS_MAP: Record<string, string> = {
    new: 'todo',
    in_progress: 'in_progress',
    waiting: 'in_progress',
    on_review: 'review',
    completed: 'done',
    cancelled: 'done',
    frozen: 'todo',
};

const COLUMNS = [
    { id: 'todo', title: 'К выполнению', color: 'bg-muted/50 border-border/40', statuses: ['new', 'frozen'] },
    { id: 'in_progress', title: 'В работе', color: 'bg-blue-500/10 border-blue-500/20', statuses: ['in_progress', 'waiting'] },
    { id: 'review', title: 'На проверке', color: 'bg-purple-500/10 border-purple-500/20', statuses: ['on_review'] },
    { id: 'done', title: 'Завершено', color: 'bg-brand-500/10 border-brand-500/20', statuses: ['completed', 'cancelled'] },
];

export default function TasksPage() {
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', note: '', priority: 'normal', deadline: '' });
    const [formError, setFormError] = useState('');

    const { data: tasks = [], isLoading, error } = useTasks();
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const filtered = tasks.filter((t: any) => {
        if (!searchQuery) return true;
        return t.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCreate = async () => {
        setFormError('');
        if (!newTask.title.trim() || !newTask.deadline) {
            setFormError('Заполните название и дедлайн');
            return;
        }
        try {
            await createTask.mutateAsync({
                target_company_id: user?.company_id || 0,
                target_user_id: user?.id || 0,
                title: newTask.title,
                note: newTask.note || undefined,
                priority: newTask.priority,
                deadline: newTask.deadline,
            });
            setShowCreateModal(false);
            setNewTask({ title: '', note: '', priority: 'normal', deadline: '' });
        } catch (err: any) {
            setFormError(err.response?.data?.detail || 'Ошибка');
        }
    };

    const handleStatusChange = (taskId: number, newStatus: string) => {
        updateTask.mutate({ id: taskId, data: { status: newStatus } });
    };

    const PriorityIcon = ({ priority }: { priority: string }) => {
        switch (priority) {
            case 'urgent': return <AlertCircleIcon className="w-4 h-4 text-destructive" />;
            case 'high': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'normal': return <CheckSquare className="w-4 h-4 text-brand-600" />;
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
                        <Input placeholder="Поиск задач..." className="pl-9 bg-white/50 w-[250px]"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Button className="shrink-0 gap-2" onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4" />Создать задачу
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircleIcon className="w-4 h-4 shrink-0" />Не удалось загрузить задачи.
                </div>
            )}

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />Загрузка...
                </div>
            ) : (
                <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                    {COLUMNS.map(col => {
                        const colTasks = filtered.filter((t: any) => col.statuses.includes(t.status));
                        return (
                            <div key={col.id} className={`flex-1 min-w-[300px] flex flex-col rounded-xl border ${col.color} p-4`}>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="font-semibold">{col.title}</h3>
                                    <span className="text-xs font-medium bg-white/50 px-2 py-1 rounded-full text-muted-foreground shadow-sm">
                                        {colTasks.length}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                    {colTasks.map((task: any) => (
                                        <Card key={task.id} className="glass-card hover:border-brand-500/50 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <p className="font-medium text-sm leading-tight">{task.title}</p>
                                                </div>
                                                {task.note && <p className="text-xs text-muted-foreground mb-2">{task.note}</p>}
                                                <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-border/40">
                                                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                                                        <PriorityIcon priority={task.priority} />
                                                        {task.deadline}
                                                    </div>
                                                    {task.is_overdue && <span className="text-destructive text-xs font-medium">Просрочено</span>}
                                                </div>
                                                {col.id !== 'done' && (
                                                    <div className="mt-2 pt-2 border-t border-border/20">
                                                        {col.id === 'todo' && (
                                                            <Button size="sm" variant="ghost" className="text-xs w-full" onClick={() => handleStatusChange(task.id, 'in_progress')}>
                                                                → В работу
                                                            </Button>
                                                        )}
                                                        {col.id === 'in_progress' && (
                                                            <Button size="sm" variant="ghost" className="text-xs w-full" onClick={() => handleStatusChange(task.id, 'on_review')}>
                                                                → На проверку
                                                            </Button>
                                                        )}
                                                        {col.id === 'review' && (
                                                            <Button size="sm" variant="ghost" className="text-xs w-full" onClick={() => handleStatusChange(task.id, 'completed')}>
                                                                ✓ Завершить
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-3 text-muted-foreground gap-2 justify-start hover:bg-white/40"
                                    onClick={() => setShowCreateModal(true)}>
                                    <Plus className="w-4 h-4" /> Добавить
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Новая задача">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Название *</Label>
                        <Input placeholder="Описание задачи" value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Примечание</Label>
                        <textarea className="input-base min-h-[80px] resize-y p-3 w-full" placeholder="Детали..."
                            value={newTask.note} onChange={e => setNewTask({ ...newTask, note: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Приоритет</Label>
                            <select className="input-base h-10 px-3 w-full rounded-md" value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                <option value="normal">Обычный</option>
                                <option value="high">Высокий</option>
                                <option value="urgent">Срочный</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Дедлайн *</Label>
                            <Input type="date" value={newTask.deadline}
                                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
                        </div>
                    </div>
                    {formError && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{formError}</div>}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Отмена</Button>
                        <Button onClick={handleCreate} isLoading={createTask.isPending}>Создать</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
