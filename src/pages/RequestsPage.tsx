import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HelpCircle, Mail, MessageSquare } from 'lucide-react';

export default function RequestsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold tracking-tight">Мои запросы</h2>
                    <p className="text-muted-foreground mt-1 text-base">Обращения в поддержку и системные уведомления.</p>
                </div>
                <Button className="shrink-0 gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Новое обращение
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle>История обращений</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-64 text-center border-t border-border/40">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium">Нет активных запросов</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1">Все ваши обращения в техническую поддержку будут отображаться здесь.</p>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-brand-500/5 border-brand-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-brand-600" />
                            Нужна помощь?
                        </CardTitle>
                        <CardDescription>Служба поддержки работает 24/7</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm">
                            <p className="mb-2"><strong>Телефон:</strong> 8 (800) 123-45-67</p>
                            <p><strong>Email:</strong> support@crmtribute.ru</p>
                        </div>
                        <Button variant="secondary" className="w-full">Частые вопросы (FAQ)</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
