import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { api } from '@/api/axios';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        activity_type: 'declarant',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/api/auth/register', formData);
            if (res.data.needs_company_setup) {
                // Saving minimal info to local storage to pass to company setup steps
                localStorage.setItem('temp_user_id', res.data.user_id.toString());
                localStorage.setItem('temp_email', formData.email);
                navigate('/company-setup');
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Ошибка регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f1f3] p-4 relative overflow-hidden">
            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple-main/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <Card className="max-w-md w-full relative z-10 glass-card">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6 text-brand-600" />
                    </div>
                    <CardTitle className="text-3xl">Регистрация</CardTitle>
                    <CardDescription>Создайте аккаунт для начала работы</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">ФИО полностью</Label>
                            <Input
                                id="full_name"
                                placeholder="Иванов Иван Иванович"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Электронная почта</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ivan@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Номер телефона</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+998901234567"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="activity_type">Деятельность</Label>
                            <Select
                                id="activity_type"
                                value={formData.activity_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="declarant">Декларант</option>
                                <option value="certifier">Сертификация</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Пароль (минимум 8 символов)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                            Зарегистрироваться
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Уже есть аккаунт?{' '}
                            <a href="/login" className="text-brand-600 font-medium hover:underline">
                                Войти
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
