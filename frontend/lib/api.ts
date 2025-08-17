import { ApiResponse, HealthData, Patient, Doctor, Appointment, MedicalRecord, Organ } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || 'Произошла ошибка при выполнении запроса',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  }

  // Методы для работы с показателями здоровья
  async getHealthData(patientId: string): Promise<ApiResponse<HealthData>> {
    return this.request<HealthData>(`/api/health/${patientId}`);
  }

  async updateHealthData(patientId: string, data: Partial<HealthData>): Promise<ApiResponse<HealthData>> {
    return this.request<HealthData>(`/api/health/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Методы для работы с пациентами
  async getPatients(): Promise<ApiResponse<Patient[]>> {
    return this.request<Patient[]>('/api/patients');
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/api/patients/${id}`);
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<ApiResponse<Patient>> {
    return this.request<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Методы для работы с врачами
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    return this.request<Doctor[]>('/api/doctors');
  }

  async getDoctor(id: string): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>(`/api/doctors/${id}`);
  }

  async createDoctor(doctor: Omit<Doctor, 'id'>): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    });
  }

  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>(`/api/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    });
  }

  async deleteDoctor(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Методы для работы с назначениями
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>('/api/appointments');
  }

  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/api/appointments/${id}`);
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/api/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Методы для работы с медицинскими записями
  async getMedicalRecords(patientId: string): Promise<ApiResponse<MedicalRecord[]>> {
    return this.request<MedicalRecord[]>(`/api/medical-records/${patientId}`);
  }

  async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<ApiResponse<MedicalRecord>> {
    return this.request<MedicalRecord>('/api/medical-records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    return this.request<MedicalRecord>(`/api/medical-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  }

  async deleteMedicalRecord(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/medical-records/${id}`, {
      method: 'DELETE',
    });
  }

  // Методы для работы с органами
  async getOrgans(): Promise<ApiResponse<Organ[]>> {
    return this.request<Organ[]>('/api/organs');
  }

  async getOrganInfo(organId: string): Promise<ApiResponse<Organ>> {
    return this.request<Organ>(`/api/organs/${organId}`);
  }

  async updateOrganHealth(organId: string, healthData: any): Promise<ApiResponse<Organ>> {
    return this.request<Organ>(`/api/organs/${organId}/health`, {
      method: 'PUT',
      body: JSON.stringify(healthData),
    });
  }

  // Методы для аналитики
  async getHealthAnalytics(patientId: string, period: string = '7d'): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/analytics/health/${patientId}?period=${period}`);
  }

  async getPatientStatistics(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/analytics/patients');
  }

  // Методы для поиска
  async searchPatients(query: string): Promise<ApiResponse<Patient[]>> {
    return this.request<Patient[]>(`/api/search/patients?q=${encodeURIComponent(query)}`);
  }

  async searchDoctors(query: string): Promise<ApiResponse<Doctor[]>> {
    return this.request<Doctor[]>(`/api/search/doctors?q=${encodeURIComponent(query)}`);
  }

  // Методы для уведомлений
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/notifications');
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Методы для загрузки файлов
  async uploadFile(file: File, type: string): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Убираем Content-Type для FormData
    });
  }
}

// Создаем экземпляр API клиента
export const apiClient = new ApiClient();

// Экспортируем класс для возможности создания дополнительных экземпляров
export default ApiClient;