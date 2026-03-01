import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api/axios';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStepOne = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate first step check, actual logic expects all three in one request per backend spec
        if (login && password) setStep(2);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/admin/login', { login, password, code });
            const token = response.data.access_token;

            const userRes = await api.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAuth(token, userRes.data);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Ошибка авторизации.');
            setStep(1);
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <Card className="max-w-md w-full relative z-10 bg-gray-800/80 backdrop-blur-xl border-gray-700 text-gray-100">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-brand-500" />
                    </div>
                    <CardTitle className="text-3xl">Вход <span className="text-brand-500">Администратора</span></CardTitle>
                    <CardDescription className="text-gray-400">Панель управления системой CRM</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <form onSubmit={handleStepOne} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="login" className="text-gray-300">Логин</Label>
                                <Input
                                    id="login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    className="bg-gray-900 border-gray-700 text-white focus-visible:ring-brand-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-900 border-gray-700 text-white focus-visible:ring-brand-500"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-brand-500 text-black hover:bg-brand-600">
                                Далее
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-gray-300">Код из Telegram</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="bg-gray-900 border-gray-700 text-white text-center tracking-[0.5em] text-xl focus-visible:ring-brand-500"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-400 text-center mt-2">Введите одноразовый код, отправленный в ваш Telegram</p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 text-center">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full mt-4 bg-brand-500 text-black hover:bg-brand-600" isLoading={isLoading}>
                                Войти в систему
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
