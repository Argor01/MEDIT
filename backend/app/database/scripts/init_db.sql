
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER,
    phone VARCHAR(20)
);

CREATE TABLE Patients (
    patient_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    name_patient VARCHAR(100) NOT NULL,
    insurance_number VARCHAR(50) UNIQUE
);


CREATE TABLE Doctors (
    doctor_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    name_doctor VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    years_of_experience INTEGER,
    education TEXT
);


CREATE TABLE Medical_facilities (
    facility_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    facility_type VARCHAR(100) NOT NULL,
    doctor_id INTEGER REFERENCES Doctors(doctor_id),
    patient_id INTEGER REFERENCES Patients(patient_id)
);