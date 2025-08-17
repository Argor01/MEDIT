import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Утилита для объединения классов Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование даты
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Форматирование времени
export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Генерация случайного ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Валидация email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Валидация телефона
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Получение инициалов
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Расчет возраста
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Получение статуса здоровья по показателям
export function getHealthStatus(heartRate: number, bloodPressure: string, temperature: number, oxygenSaturation: number): 'normal' | 'warning' | 'critical' {
  // Проверка пульса (норма: 60-100 уд/мин)
  if (heartRate < 50 || heartRate > 120) {
    return 'critical';
  }
  if (heartRate < 60 || heartRate > 100) {
    return 'warning';
  }
  
  // Проверка температуры (норма: 36.1-37.2°C)
  if (temperature < 35 || temperature > 39) {
    return 'critical';
  }
  if (temperature < 36.1 || temperature > 37.2) {
    return 'warning';
  }
  
  // Проверка сатурации (норма: >95%)
  if (oxygenSaturation < 90) {
    return 'critical';
  }
  if (oxygenSaturation < 95) {
    return 'warning';
  }
  
  // Проверка давления (упрощенная)
  const [systolic, diastolic] = bloodPressure.split('/').map(Number);
  if (systolic > 180 || diastolic > 110 || systolic < 90 || diastolic < 60) {
    return 'critical';
  }
  if (systolic > 140 || diastolic > 90 || systolic < 100 || diastolic < 70) {
    return 'warning';
  }
  
  return 'normal';
}

// Получение цвета статуса
export function getStatusColor(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

// Получение фонового цвета статуса
export function getStatusBgColor(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'bg-green-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'critical':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
}

// Дебаунс функция
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Троттлинг функция
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Локальное хранилище с проверкой
export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  },
  
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  },
  
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }
};