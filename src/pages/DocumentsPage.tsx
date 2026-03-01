import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Filter, Folder, File, FileText, Image as ImageIcon, MoreVertical, Upload, Lock, Unlock, Users } from 'lucide-react';

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const documents = [
        { id: 1, name: "Уставные документы", type: "folder", access: "private", date: "2026-03-01", size: "-" },
        { id: 2, name: "Шаблоны договоров", type: "folder", access: "shared", date: "2026-02-28", size: "-" },
        { id: 3, name: "Договор_ООО_Вектор.pdf", type: "pdf", access: "private", date: "2026-03-01", size: "2.4 MB" },
        { id: 4, name: "Счет_фактура_123.xlsx", type: "excel", access: "public", date: "2026-03-01", size: "1.1 MB" },
        { id: 5, name: "Скан_паспорта.jpg", type: "image", access: "private", date: "2026-02-25", size: "4.5 MB" },
    ];

    const FileIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'folder': return <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />;
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case 'excel': return <File className="w-5 h-5 text-green-500" />;
            case 'image': return <ImageIcon className="w-5 h-5 text-purple-500" />;
            default: return <File className="w-5 h-5 text-gray-500" />;
        }
    };

    const AccessIcon = ({ access }: { access: string }) => {
        switch (access) {
            case 'private': return <Lock className="w-3 h-3 text-muted-foreground" />;
            case 'shared': return <Users className="w-3 h-3 text-brand-600" />;
            case 'public': return <Unlock className="w-3 h-3 text-green-600" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Документы</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление файлами, парками и правами доступа.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2">
                        <Folder className="w-4 h-4" />
                        Создать папку
                    </Button>
                    <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Загрузить
                    </Button>
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск файлов и папок..."
                                className="pl-9 bg-white/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select className="w-[160px] bg-white/50">
                                <option value="">Все типы</option>
                                <option value="folders">Только папки</option>
                                <option value="files">Только файлы</option>
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
                                        <th className="px-6 py-3 font-medium">Имя</th>
                                        <th className="px-6 py-3 font-medium">Доступ</th>
                                        <th className="px-6 py-3 font-medium">Размер</th>
                                        <th className="px-6 py-3 font-medium">Дата изменения</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {documents.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/60 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 font-medium">
                                                    <FileIcon type={item.type} />
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 opacity-80">
                                                    <AccessIcon access={item.access} />
                                                    <span className="text-xs capitalize">{item.access === 'private' ? 'Только я' : item.access === 'shared' ? 'Коллеги' : 'Все'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{item.size}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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
