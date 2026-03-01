import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { api } from '@/api/axios';
import { Building2 } from 'lucide-react';

export default function CompanySetupPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'create' | 'join'>('create');

    const [inn, setInn] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInn(val);
        setError('');

        // Auto-lookup logic for joining
        if (mode === 'join' && val.length === 9) {
            setIsLoading(true);
            try {
                const res = await api.post('/api/auth/company/lookup', { inn: val });
                if (res.data.found) {
                    setCompanyName(res.data.company_name);
                } else {
                    setError('Фирма с таким ИНН не найдена. Проверьте правильность.');
                    setCompanyName('');
                }
            } catch (err) {
                setError('Ошибка при поиске фирмы');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'create') {
                if (inn.length !== 9) throw new Error("ИНН должен состоять из 9 цифр");
                await api.post('/api/auth/company/create', { name: companyName, inn });
                setSuccess('Фирма успешно зарегистрирована! Ожидайте подтверждения администратора.');
            } else {
                if (!companyName) throw new Error("Фирма не найдена");
                await api.post('/api/auth/company/join', { inn });
                setSuccess('Запрос на вступление отправлен директору фирмы.');
            }

            // Clear local storage temp data and redirect to login
            setTimeout(() => {
                localStorage.removeItem('temp_user_id');
                localStorage.removeItem('temp_email');
                navigate('/login');
            }, 3000);

        } catch (err: any) {
            setError(err.message || err.response?.data?.detail?.[0]?.msg || 'Ошибка операции');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f1f3] p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

            <Card className="max-w-md w-full relative z-10 glass-card">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-brand-600" />
                    </div>
                    <CardTitle className="text-2xl">Настройка фирмы</CardTitle>
                    <CardDescription>Зарегистрируйте свою фирму или войдите в существующую</CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex p-1 bg-muted rounded-lg mb-6">
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'create' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => { setMode('create'); setInn(''); setCompanyName(''); setError(''); }}
                        >
                            Создать
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'join' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => { setMode('join'); setInn(''); setCompanyName(''); setError(''); }}
                        >
                            Войти
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="inn">ИНН фирмы (9 цифр)</Label>
                            <Input
                                id="inn"
                                maxLength={9}
                                placeholder="123456789"
                                value={inn}
                                onChange={handleInnChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyName">Имя фирмы</Label>
                            <Input
                                id="companyName"
                                placeholder="ООО ОГУРЦОВЫЙ"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                readOnly={mode === 'join'}
                                className={mode === 'join' ? 'bg-muted cursor-not-allowed' : ''}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-md bg-brand-100 text-brand-600 text-sm font-medium border border-brand-500/20">
                                {success}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-4" isLoading={isLoading} disabled={!!success || (mode === 'join' && !companyName)}>
                            {mode === 'create' ? 'Зарегистрировать фирму' : 'Отправить запрос'}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
