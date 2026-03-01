import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api/axios';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', { email, password });
            // We also need to fetch user profile after successful token response
            // For now, mocking user setup to proceed to dashboard
            const token = response.data.access_token;

            const userRes = await api.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAuth(token, userRes.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Ошибка авторизации. Проверьте данные.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f1f3] p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light relative overflow-hidden">

            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple-main/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-brand-cyan-main/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <Card className="max-w-md w-full relative z-10 glass-card">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="w-6 h-6 text-brand-600" />
                    </div>
                    <CardTitle className="text-3xl"><span className="text-brand-600 font-bold">CRM</span> Login</CardTitle>
                    <CardDescription>Введите email и пароль для входа в систему</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Электронная почта</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ivan@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Пароль</Label>
                                <a href="#" className="text-xs text-brand-600 hover:underline">Забыли пароль?</a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                            Войти
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-6">
                            Нет аккаунта?{' '}
                            <a href="/register" className="text-brand-600 font-medium hover:underline">
                                Зарегистрироваться
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
