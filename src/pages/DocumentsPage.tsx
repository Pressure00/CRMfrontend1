import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Search, Filter, Folder, File, FileText, Image as ImageIcon, MoreVertical, Upload, Lock, Unlock, Users, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useFolders, useDocuments, useCreateFolder, useUploadDocument, useDeleteDocument, useDeleteFolder } from '@/api/hooks';

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderAccess, setNewFolderAccess] = useState('public');
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: folders = [], isLoading: foldersLoading } = useFolders();
    const { data: documents = [], isLoading: docsLoading, error } = useDocuments();
    const createFolder = useCreateFolder();
    const uploadDoc = useUploadDocument();
    const deleteDoc = useDeleteDocument();
    const deleteFolder = useDeleteFolder();

    const isLoading = foldersLoading || docsLoading;

    const handleCreateFolder = async () => {
        setFormError('');
        if (!newFolderName.trim()) { setFormError('Введите название папки'); return; }
        try {
            await createFolder.mutateAsync({ name: newFolderName, access_type: newFolderAccess });
            setShowFolderModal(false);
            setNewFolderName('');
        } catch (err: any) {
            setFormError(err.response?.data?.detail || 'Ошибка');
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (const file of Array.from(files)) {
            const fd = new FormData();
            fd.append('file', file);
            try {
                await uploadDoc.mutateAsync(fd);
            } catch (err: any) {
                alert(`Ошибка загрузки ${file.name}: ${err.response?.data?.detail || 'Ошибка'}`);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const allItems = [
        ...folders.map((f: any) => ({ ...f, _type: 'folder' })),
        ...documents.map((d: any) => ({ ...d, _type: 'file' })),
    ].filter((item: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const name = item._type === 'folder' ? item.name : item.original_filename;
        return name?.toLowerCase().includes(q);
    });

    const FileIcon = ({ type, mime }: { type: string; mime?: string }) => {
        if (type === 'folder') return <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />;
        if (mime?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        if (mime?.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const AccessIcon = ({ access }: { access: string }) => {
        if (access === 'private') return <Lock className="w-3 h-3 text-muted-foreground" />;
        if (access === 'shared') return <Users className="w-3 h-3 text-brand-600" />;
        return <Unlock className="w-3 h-3 text-green-600" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Документы</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление файлами, папками и правами доступа.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2" onClick={() => setShowFolderModal(true)}>
                        <Folder className="w-4 h-4" />Создать папку
                    </Button>
                    <Button className="gap-2" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4" />Загрузить
                    </Button>
                    <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleUpload} />
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />Не удалось загрузить документы.
                </div>
            )}

            {uploadDoc.isPending && (
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 text-sm flex items-center gap-2 border border-blue-500/20">
                    <Loader2 className="w-4 h-4 animate-spin" />Загрузка файла...
                </div>
            )}

            <Card className="glass-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Поиск файлов и папок..." className="pl-9 bg-white/50"
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
                                        <th className="px-6 py-3 font-medium">Имя</th>
                                        <th className="px-6 py-3 font-medium">Доступ</th>
                                        <th className="px-6 py-3 font-medium">Размер</th>
                                        <th className="px-6 py-3 font-medium">Дата</th>
                                        <th className="px-6 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Загрузка...
                                        </td></tr>
                                    ) : allItems.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Файлы не найдены</td></tr>
                                    ) : (
                                        allItems.map((item: any) => (
                                            <tr key={`${item._type}-${item.id}`} className="hover:bg-white/60 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 font-medium">
                                                        <FileIcon type={item._type} mime={item.mime_type} />
                                                        {item._type === 'folder' ? item.name : item.original_filename}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 opacity-80">
                                                        <AccessIcon access={item.access_type || 'public'} />
                                                        <span className="text-xs">{item.access_type === 'private' ? 'Только я' : 'Все'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {item._type === 'folder' ? `${item.documents_count ?? 0} файлов` : (item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(1)} MB` : '—')}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.created_at?.split('T')[0] || '—'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => {
                                                                if (!window.confirm('Удалить?')) return;
                                                                if (item._type === 'folder') deleteFolder.mutate(item.id);
                                                                else deleteDoc.mutate(item.id);
                                                            }}>
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

            <Modal open={showFolderModal} onClose={() => setShowFolderModal(false)} title="Создать папку">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Название папки *</Label>
                        <Input placeholder="Уставные документы" value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Доступ</Label>
                        <Select value={newFolderAccess} onChange={e => setNewFolderAccess(e.target.value)}>
                            <option value="public">Все сотрудники</option>
                            <option value="private">Только я</option>
                        </Select>
                    </div>
                    {formError && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{formError}</div>}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowFolderModal(false)}>Отмена</Button>
                        <Button onClick={handleCreateFolder} isLoading={createFolder.isPending}>Создать</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
