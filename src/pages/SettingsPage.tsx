import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { User, Shield, KeyRound, Bell, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Настройки профиля</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление личными данными и безопасностью.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Navigation Sidebar (Desktop) */}
                <div className="space-y-2 md:col-span-1 hidden md:block">
                    <Button variant="secondary" className="w-full justify-start gap-3 bg-white/60">
                        <User className="w-4 h-4" /> Основная информация
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/40">
                        <Shield className="w-4 h-4" /> Безопасность
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/40">
                        <Bell className="w-4 h-4" /> Уведомления
                    </Button>
                </div>

                <div className="space-y-6 md:col-span-2">
                    {/* Main Info */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Личные данные</CardTitle>
                            <CardDescription>Измените информацию о себе, которая будет видна коллегам.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-display font-semibold">
                                    {user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                </div>
                                <Button variant="secondary">Изменить фото</Button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Имя</Label>
                                    <Input id="firstName" defaultValue={user?.full_name?.split(' ')[1] || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Фамилия</Label>
                                    <Input id="lastName" defaultValue={user?.full_name?.split(' ')[0] || ''} />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="phone">Телефон</Label>
                                    <Input id="phone" type="tel" defaultValue="+7 (999) 000-00-00" />
                                </div>
                            </div>
                            <Button onClick={handleSave} isLoading={isSaving} className="mt-4">
                                Сохранить изменения
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="glass-card border-orange-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="w-5 h-5 text-orange-500" />
                                Смена пароля и Email
                            </CardTitle>
                            <CardDescription>Для изменения критичных данных потребуется подтверждение через Telegram.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Смена Email адреса</h4>
                                <div className="flex gap-4 items-end">
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="email">Текущий Email</Label>
                                        <Input id="email" type="email" defaultValue={user?.email || ''} readOnly className="bg-muted/50" />
                                    </div>
                                    <Button variant="secondary">Запросить код в TG</Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/40 space-y-4">
                                <h4 className="font-medium text-sm">Изменение пароля</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Текущий пароль</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Новый пароль</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <Button variant="secondary" className="w-full sm:w-auto">
                                    Обновить пароль
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Telegram link */}
                    <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    Telegram подключен
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">@username • Привязан 2 января 2026 г.</p>
                            </div>
                            <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                Отвязать
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
