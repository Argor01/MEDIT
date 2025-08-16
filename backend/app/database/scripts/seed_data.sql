-- Заполнение таблицы Users
INSERT INTO Users (email, password_hash, age, phone) VALUES
('admin@clinic.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 35, '+79161234567'),
('doctor1@clinic.com', '$2a$10$yKwM6v6Kz6V6Z6V6Z6V6Zf', 42, '+79162345678'),
('doctor2@clinic.com', '$2a$10$zLxN7w7Lz7W7Z7Z7Z7Z7Zg', 38, '+79163456789'),
('patient1@example.com', '$2a$10$aMbN8x8Mz8X8Z8Z8Z8Z8Zh', 28, '+79164567890'),
('patient2@example.com', '$2a$10$bNcO9y9Nz9Y9Z9Z9Z9Z9Zi', 45, '+79165678901'),
('patient3@example.com', '$2a$10$cPdP0z0Oz0Z0Z0Z0Z0Z0Zj', 32, '+79166789012');

-- Заполнение таблицы Patients
INSERT INTO Patients (user_id, name_patient, insurance_number) VALUES
(4, 'Иванов Иван Иванович', 'IN-123456789'),
(5, 'Петрова Мария Сергеевна', 'IN-987654321'),
(6, 'Сидоров Алексей Владимирович', 'IN-456789123');

-- Заполнение таблицы Doctors
INSERT INTO Doctors (user_id, name_doctor, specialization, license_number, years_of_experience, education) VALUES
(2, 'Смирнова Ольга Николаевна', 'Терапевт', 'LIC-12345', 15, 'МГМУ им. И.М. Сеченова'),
(3, 'Козлов Дмитрий Александрович', 'Хирург', 'LIC-54321', 10, 'РНИМУ им. Н.И. Пирогова');

-- Заполнение таблицы Medical_facilities
INSERT INTO Medical_facilities (name, address, phone, email, facility_type, doctor_id, patient_id) VALUES
('Городская больница №1', 'ул. Ленина, 10, Москва', '+74951234567', 'info@gb1.ru', 'Государственная', 1, 1),
('Медицинский центр "Здоровье"', 'ул. Пушкина, 5, Москва', '+74957654321', 'info@healthclinic.ru', 'Частная', 2, 2),
('Поликлиника №3', 'пр. Мира, 15, Москва', '+74959876543', 'info@polyclinic3.ru', 'Государственная', 1, 3);