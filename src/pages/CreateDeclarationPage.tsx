import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Save } from 'lucide-react';
import { useClients, useCreateDeclaration } from '@/api/hooks';

const REGIMES = [
    "ЭК/10", "ЭК/11", "ЭК/12", "ИМ/40", "ИМ/41", "ИМ/42",
    "ИМ/51", "ЭК/51", "ЭК/61", "ИМ/61", "ИМ/70", "ИМ/71",
    "ЭК/71", "ИМ/72", "ЭК/72", "ИМ/73", "ЭК/73", "ИМ/74",
    "ЭК/74", "ИМ/75", "ЭК/75", "ИМ/76", "ТР/80",
];

const VEHICLE_TYPES = [
    "10/МОРСКОЙ", "20/ЖД", "30/АВТО", "40/АВИА",
    "71/ТРУБОПРОВОД", "72/ЛЭП", "80/РЕЧНОЙ", "90/САМОХОД"
];

export default function CreateDeclarationPage() {
    const navigate = useNavigate();
    const { data: clients = [] } = useClients();
    const createDeclaration = useCreateDeclaration();

    const [form, setForm] = useState({
        post_number: '',
        send_date: '',
        declaration_number: '',
        client_id: '',
        regime: '',
        vehicle_type: '30/АВТО',
        vehicle_number: '',
        note: '',
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!form.post_number || !form.send_date || !form.declaration_number || !form.client_id || !form.regime || !form.vehicle_number) {
            setFormError('Заполните все обязательные поля');
            return;
        }

        try {
            await createDeclaration.mutateAsync({
                post_number: form.post_number,
                send_date: form.send_date,
                declaration_number: form.declaration_number,
                client_id: Number(form.client_id),
                regime: form.regime,
                vehicles: [{ vehicle_type: form.vehicle_type, vehicle_number: form.vehicle_number }],
                note: form.note || undefined,
            });
            navigate('/declarations');
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setFormError(detail.map((d: any) => d.msg).join('; '));
            } else {
                setFormError(detail || 'Ошибка при создании декларации');
            }
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full hover:bg-white/50" onClick={() => navigate('/declarations')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-display font-semibold tracking-tight">Новая декларация</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Заполните данные для создания ГТД</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => navigate('/declarations')}>Отмена</Button>
                    <Button onClick={handleSubmit} isLoading={createDeclaration.isPending} className="gap-2">
                        <Save className="w-4 h-4" />
                        Выпустить
                    </Button>
                </div>
            </div>

            {formError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="glass-card">
                    <CardHeader><CardTitle className="text-lg">Основные сведения</CardTitle></CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="postCode">Код поста (5 цифр) *</Label>
                            <Input id="postCode" placeholder="12345" required maxLength={5}
                                value={form.post_number} onChange={e => setForm({ ...form, post_number: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="regDate">Дата отправления *</Label>
                            <Input id="regDate" type="date" required
                                value={form.send_date} onChange={e => setForm({ ...form, send_date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number">Номер декларации (7 цифр) *</Label>
                            <Input id="number" placeholder="0010722" required maxLength={7}
                                value={form.declaration_number} onChange={e => setForm({ ...form, declaration_number: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="regime">Режим *</Label>
                            <Select id="regime" required value={form.regime} onChange={e => setForm({ ...form, regime: e.target.value })}>
                                <option value="">Выберите режим...</option>
                                {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="client">Клиент (Владелец груза) *</Label>
                            <Select id="client" required value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                                <option value="">Выберите клиента из базы...</option>
                                {clients.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.company_name}{c.inn ? ` (ИНН: ${c.inn})` : ''}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Тип транспорта *</Label>
                            <Select value={form.vehicle_type} onChange={e => setForm({ ...form, vehicle_type: e.target.value })}>
                                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Номер ТС *</Label>
                            <Input placeholder="A123BC" required value={form.vehicle_number}
                                onChange={e => setForm({ ...form, vehicle_number: e.target.value })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader><CardTitle className="text-lg">Примечания</CardTitle></CardHeader>
                    <CardContent>
                        <textarea
                            className="input-base min-h-[100px] resize-y p-3 w-full"
                            placeholder="Особые отметки, комментарии..."
                            value={form.note}
                            onChange={e => setForm({ ...form, note: e.target.value })}
                        />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
