import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { User, Shield, KeyRound, Bell, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile, useRequestPasswordChange, useRequestEmailChange } from '@/api/hooks';

type TabId = 'profile' | 'security' | 'notifications';

export default function SettingsPage() {
    const { user, setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Profile form
    const [firstName, setFirstName] = useState(user?.full_name?.split(' ')[1] || '');
    const [lastName, setLastName] = useState(user?.full_name?.split(' ')[0] || '');
    const [phone, setPhone] = useState('');

    // Password form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');

    // Email form
    const [newEmail, setNewEmail] = useState('');
    const [emailMsg, setEmailMsg] = useState('');

    const updateProfile = useUpdateProfile();
    const requestPasswordChange = useRequestPasswordChange();
    const requestEmailChange = useRequestEmailChange();

    const handleSaveProfile = async () => {
        setSaveMsg('');
        setIsSaving(true);
        try {
            const fullName = `${lastName} ${firstName}`.trim();
            const data = await updateProfile.mutateAsync({
                full_name: fullName || undefined,
                phone: phone || undefined,
            });
            if (user && data) {
                setUser({ ...user, full_name: data.full_name || user.full_name });
            }
            setSaveMsg('✓ Сохранено');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err: any) {
            setSaveMsg(err.response?.data?.detail || 'Ошибка сохранения');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordMsg('');
        if (!oldPassword || !newPassword) { setPasswordMsg('Заполните оба поля'); return; }
        try {
            await requestPasswordChange.mutateAsync({ old_password: oldPassword, new_password: newPassword });
            setPasswordMsg('✓ Запрос отправлен. Проверьте Telegram для подтверждения.');
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            setPasswordMsg(err.response?.data?.detail || 'Ошибка');
        }
    };

    const handleEmailChange = async () => {
        setEmailMsg('');
        if (!newEmail) { setEmailMsg('Введите новый email'); return; }
        try {
            await requestEmailChange.mutateAsync({ new_email: newEmail });
            setEmailMsg('✓ Код подтверждения отправлен в Telegram.');
            setNewEmail('');
        } catch (err: any) {
            setEmailMsg(err.response?.data?.detail || 'Ошибка');
        }
    };

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'profile', label: 'Основная информация', icon: <User className="w-4 h-4" /> },
        { id: 'security', label: 'Безопасность', icon: <Shield className="w-4 h-4" /> },
        { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Настройки профиля</h2>
                    <p className="text-muted-foreground mt-1 text-base">Управление личными данными и безопасностью.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Navigation Sidebar */}
                <div className="space-y-2 md:col-span-1 hidden md:block">
                    {tabs.map(tab => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                            className={`w-full justify-start gap-3 ${activeTab === tab.id ? 'bg-white/60' : 'hover:bg-white/40'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon} {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Mobile tabs */}
                <div className="flex gap-2 md:hidden md:col-span-3">
                    {tabs.map(tab => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                        </Button>
                    ))}
                </div>

                <div className="space-y-6 md:col-span-2">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
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
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Имя</Label>
                                        <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Фамилия</Label>
                                        <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="phone">Телефон</Label>
                                        <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                            placeholder="+7 (999) 000-00-00" />
                                    </div>
                                </div>
                                {saveMsg && (
                                    <div className={`p-3 rounded-md text-sm ${saveMsg.startsWith('✓') ? 'bg-brand-500/10 text-brand-600' : 'bg-destructive/10 text-destructive'}`}>
                                        {saveMsg}
                                    </div>
                                )}
                                <Button onClick={handleSaveProfile} isLoading={isSaving} className="mt-4">
                                    Сохранить изменения
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
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
                                            <Label htmlFor="currentEmail">Текущий Email</Label>
                                            <Input id="currentEmail" type="email" defaultValue={user?.email || ''} readOnly className="bg-muted/50" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-end">
                                        <div className="space-y-2 flex-1">
                                            <Label>Новый Email</Label>
                                            <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@example.com" />
                                        </div>
                                        <Button variant="secondary" onClick={handleEmailChange} isLoading={requestEmailChange.isPending}>
                                            Запросить код
                                        </Button>
                                    </div>
                                    {emailMsg && <div className={`p-3 rounded-md text-sm ${emailMsg.startsWith('✓') ? 'bg-brand-500/10 text-brand-600' : 'bg-destructive/10 text-destructive'}`}>{emailMsg}</div>}
                                </div>

                                <div className="pt-4 border-t border-border/40 space-y-4">
                                    <h4 className="font-medium text-sm">Изменение пароля</h4>
                                    <div className="space-y-2">
                                        <Label>Текущий пароль</Label>
                                        <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Новый пароль</Label>
                                        <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </div>
                                    {passwordMsg && <div className={`p-3 rounded-md text-sm ${passwordMsg.startsWith('✓') ? 'bg-brand-500/10 text-brand-600' : 'bg-destructive/10 text-destructive'}`}>{passwordMsg}</div>}
                                    <Button variant="secondary" className="w-full sm:w-auto" onClick={handlePasswordChange}
                                        isLoading={requestPasswordChange.isPending}>
                                        Обновить пароль
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                            <CardContent className="p-6">
                                <h4 className="font-semibold flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    Уведомления
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Уведомления приходят через Telegram бот. Убедитесь, что ваш аккаунт привязан.
                                </p>
                                <div className="mt-4 p-4 rounded-xl bg-white/40 border border-border/40">
                                    <p className="text-sm font-medium">Telegram: {user?.email || 'Не привязан'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Все уведомления о задачах, декларациях и сертификатах будут приходить в Telegram.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
