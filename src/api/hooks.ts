import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './axios';

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════

export function useDashboard(params?: { date_from?: string; date_to?: string; user_id?: number }) {
    return useQuery({
        queryKey: ['dashboard', params],
        queryFn: () => api.get('/api/dashboard/declarant', { params }).then(r => r.data),
    });
}

// ═══════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════

export function useClients(params?: { company_name?: string; inn?: string; skip?: number; limit?: number }) {
    return useQuery({
        queryKey: ['clients', params],
        queryFn: () => api.get('/api/clients/', { params }).then(r => r.data),
    });
}

export function useCreateClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { company_name: string; inn?: string; director_name?: string; access_type?: string; note?: string }) =>
            api.post('/api/clients/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
    });
}

export function useDeleteClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/api/clients/${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
    });
}

// ═══════════════════════════════════════════
// DECLARATIONS
// ═══════════════════════════════════════════

export function useDeclarations(params?: {
    post_number?: string; client_id?: number; regime?: string;
    vehicle_number?: string; my_only?: boolean; skip?: number; limit?: number;
}) {
    return useQuery({
        queryKey: ['declarations', params],
        queryFn: () => api.get('/api/declarations/', { params }).then(r => r.data),
    });
}

export function useCreateDeclaration() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            post_number: string; send_date: string; declaration_number: string;
            client_id: number; regime: string; vehicles: { vehicle_type: string; vehicle_number: string }[];
            note?: string;
        }) => api.post('/api/declarations/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['declarations'] }),
    });
}

export function useDeleteDeclaration() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/api/declarations/${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['declarations'] }),
    });
}

// ═══════════════════════════════════════════
// DOCUMENTS & FOLDERS
// ═══════════════════════════════════════════

export function useFolders(params?: { parent_folder_id?: number; client_id?: number }) {
    return useQuery({
        queryKey: ['folders', params],
        queryFn: () => api.get('/api/documents/folders/', { params }).then(r => r.data),
    });
}

export function useDocuments(params?: { folder_id?: number; client_id?: number; filename?: string }) {
    return useQuery({
        queryKey: ['documents', params],
        queryFn: () => api.get('/api/documents/files/', { params }).then(r => r.data),
    });
}

export function useCreateFolder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; access_type?: string; parent_folder_id?: number; client_id?: number }) =>
            api.post('/api/documents/folders/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
    });
}

export function useUploadDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) =>
            api.post('/api/documents/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then(r => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['documents'] });
            qc.invalidateQueries({ queryKey: ['folders'] });
        },
    });
}

export function useDeleteDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/api/documents/files/${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    });
}

export function useDeleteFolder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/api/documents/folders/${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
    });
}

// ═══════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════

export function useTasks(params?: {
    status?: string; priority?: string; my_only?: boolean;
    skip?: number; limit?: number;
}) {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => api.get('/api/tasks/', { params }).then(r => r.data),
    });
}

export function useCreateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            target_company_id: number; target_user_id: number;
            title: string; note?: string; priority?: string;
            status?: string; deadline: string;
        }) => api.post('/api/tasks/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}

export function useUpdateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { status?: string; priority?: string; title?: string; note?: string } }) =>
            api.patch(`/api/tasks/${id}`, data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}

export function useDeleteTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/api/tasks/${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}

// ═══════════════════════════════════════════
// CERTIFICATES
// ═══════════════════════════════════════════

export function useCertificates(params?: {
    status?: string; client_id?: number; skip?: number; limit?: number;
}) {
    return useQuery({
        queryKey: ['certificates', params],
        queryFn: () => api.get('/api/certificates/', { params }).then(r => r.data),
    });
}

export function useCreateCertificate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            certificate_type: string; deadline: string; client_id: number;
            certifier_company_id?: number; is_self?: boolean;
            certificate_number?: string; note?: string;
            declaration_ids?: number[];
        }) => api.post('/api/certificates/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates'] }),
    });
}

// ═══════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════

export function useEmployees() {
    return useQuery({
        queryKey: ['employees'],
        queryFn: () => api.get('/api/employees/').then(r => r.data),
    });
}

export function useBlockEmployee() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userId: number) => api.post(`/api/employees/${userId}/block`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    });
}

export function useUnblockEmployee() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userId: number) => api.post(`/api/employees/${userId}/unblock`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    });
}

// ═══════════════════════════════════════════
// PARTNERSHIPS
// ═══════════════════════════════════════════

export function usePartnerships() {
    return useQuery({
        queryKey: ['partnerships'],
        queryFn: () => api.get('/api/partnerships/').then(r => r.data),
    });
}

export function usePartnershipRequests() {
    return useQuery({
        queryKey: ['partnership-requests'],
        queryFn: () => api.get('/api/partnerships/requests/').then(r => r.data),
    });
}

export function useSendPartnershipRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { target_inn: string; note?: string }) =>
            api.post('/api/partnerships/request', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['partnership-requests'] }),
    });
}

export function useRespondPartnership() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: number; action: 'approve' | 'reject' }) =>
            api.post(`/api/partnerships/${id}/respond`, { action }).then(r => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['partnerships'] });
            qc.invalidateQueries({ queryKey: ['partnership-requests'] });
        },
    });
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/api/settings/profile').then(r => r.data),
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { full_name?: string; phone?: string }) =>
            api.patch('/api/settings/profile', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
    });
}

export function useRequestPasswordChange() {
    return useMutation({
        mutationFn: (data: { old_password: string; new_password: string }) =>
            api.post('/api/settings/password/request', data).then(r => r.data),
    });
}

export function useRequestEmailChange() {
    return useMutation({
        mutationFn: (data: { new_email: string }) =>
            api.post('/api/settings/email/request', data).then(r => r.data),
    });
}

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => api.get('/api/notifications/').then(r => r.data),
        refetchInterval: 30000,  // every 30s
    });
}

export function useMarkNotificationRead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.patch(`/api/notifications/${id}/read`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    });
}

// ═══════════════════════════════════════════
// REQUESTS (Support)
// ═══════════════════════════════════════════

export function useRequests() {
    return useQuery({
        queryKey: ['requests'],
        queryFn: () => api.get('/api/requests/').then(r => r.data),
    });
}

export function useCreateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string; message: string }) =>
            api.post('/api/requests/', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
    });
}
