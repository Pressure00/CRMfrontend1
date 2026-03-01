import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';

export default function CreateDeclarationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock save
        setTimeout(() => setIsSubmitting(false), 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full hover:bg-white/50">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-display font-semibold tracking-tight">Новая декларация</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Заполните данные для создания ГТД</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="gap-2">
                        Сохранить черновик
                    </Button>
                    <Button onClick={handleSubmit} isLoading={isSubmitting} className="gap-2">
                        <Save className="w-4 h-4" />
                        Выпустить
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Main Info */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg">Основные сведения</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="postCode">Код поста</Label>
                            <Input id="postCode" placeholder="Например: 12345" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="regDate">Дата регистрации</Label>
                            <Input id="regDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number">Номер ГТД</Label>
                            <Input id="number" placeholder="Например: 10001" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="regime">Режим</Label>
                            <Select id="regime" required>
                                <option value="">Выберите режим...</option>
                                <option value="im40">ИМ40 (Выпуск для внутр. потреб.)</option>
                                <option value="im70">ИМ70 (Таможенный склад)</option>
                                <option value="im74">ИМ74 (Таможенный склад - другой)</option>
                                <option value="ek10">ЭК10 (Экспорт)</option>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="client">Клиент (Владелец груза)</Label>
                            <Select id="client" required>
                                <option value="">Выберите клиента из базы...</option>
                                <option value="1">ООО "АЛЬФА" (ИНН: 123456789)</option>
                                <option value="2">ИП Смирнов (ИНН: 987654321)</option>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="vehicle">Номер Транспортного Средства</Label>
                            <Input id="vehicle" placeholder="A123BC, B456EK..." required />
                        </div>
                    </CardContent>
                </Card>

                {/* Notes & Files */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg">Детали и документы</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Примечания (необязательно)</Label>
                            <textarea
                                id="notes"
                                className="input-base min-h-[100px] resize-y p-3"
                                placeholder="Особые отметки, комментарии для сертификатчиков..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Прикрепленные файлы (Инвойс, CMR, Упаковочный)</Label>
                            <div className="border-2 border-dashed border-border/60 hover:border-brand-500/50 hover:bg-white/40 bg-white/20 transition-all rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mb-2">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium">Нажмите для загрузки или перетащите файлы сюда</p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG (макс. 10MB)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </form>
        </div>
    );
}
