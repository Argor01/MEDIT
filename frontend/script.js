// Health+ Medical Dashboard JavaScript

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const recordItems = document.querySelectorAll('.record-item');
const calendarDays = document.querySelectorAll('.calendar-day');
const indicatorCards = document.querySelectorAll('.indicator-card');
const addBtns = document.querySelectorAll('.add-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeNavigation();
    initializeRecords();
    initializeCalendar();
    initializeIndicators();
    initializeAddButtons();
    startHealthMonitoring();
    initializeOrganInteractions();
});

// Tab functionality
function initializeTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter content based on tab
            filterContent(this.textContent.toLowerCase());
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(n => n.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Medical records functionality
function initializeRecords() {
    recordItems.forEach(record => {
        record.addEventListener('click', function() {
            // Add selection effect
            recordItems.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show record details (placeholder)
            showRecordDetails(this);
        });
        
        // Add hover effect
        record.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        record.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Calendar functionality
function initializeCalendar() {
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove active class from all days
            calendarDays.forEach(d => d.classList.remove('active'));
            // Add active class to clicked day
            this.classList.add('active');
            
            // Show appointments for selected day
            showDayAppointments(this.textContent);
        });
    });
}

// Health indicators functionality
function initializeIndicators() {
    indicatorCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show detailed view
            showIndicatorDetails(card);
        });
    });
}

// Add buttons functionality
function initializeAddButtons() {
    addBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.9) rotate(90deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Show add dialog
            showAddDialog(this);
        });
    });
}

// Organ interaction functionality
function initializeOrganInteractions() {
    const organOverlays = document.querySelectorAll('.organ-overlay');
    
    organOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const organName = this.getAttribute('data-organ');
            showOrganInfo(organName);
            highlightOrgan(this);
        });
        
        overlay.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.4)';
        });
        
        overlay.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// Show organ information
function showOrganInfo(organName, element) {
    const organInfo = {
        heart: 'Сердце: Насосная функция в норме. ЧСС: 95 уд/мин',
        lungs: 'Легкие: Дыхательная функция в норме. Объем: 4.2л',
        liver: 'Печень: Функция детоксикации в норме',
        stomach: 'Желудок: Пищеварительная функция в норме',
        brain: 'Мозг: Нейронная активность в норме. 16 операций/сек'
    };

    showNotification(organInfo[organName] || `${organName}: Информация недоступна`);
    
    // Add pulse effect
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// Highlight organ on hover
function highlightOrgan(element) {
    // Remove previous highlights
    document.querySelectorAll('.organ-overlay').forEach(overlay => {
        overlay.classList.remove('active');
        overlay.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    // Add highlight to clicked organ
    element.classList.add('active');
    element.style.background = 'rgba(0, 123, 255, 0.3)';
}

// Remove highlight
function unhighlightOrgan(element) {
    element.classList.remove('active');
    element.style.background = 'rgba(255, 255, 255, 0.1)';
}

// Filter content based on selected tab
function filterContent(filter) {
    console.log(`Filtering content by: ${filter}`);
    
    // Animate tab change
    const recordsContainer = document.querySelector('.medical-records');
    recordsContainer.style.opacity = '0.5';
    
    setTimeout(() => {
        // Here you would filter the actual content
        // For now, just restore opacity
        recordsContainer.style.opacity = '1';
    }, 300);
}

// Show record details
function showRecordDetails(record) {
    const recordTitle = record.querySelector('h4').textContent;
    console.log(`Showing details for: ${recordTitle}`);
    
    // Create a simple notification
    showNotification(`Открыты детали: ${recordTitle}`);
}

// Show day appointments
function showDayAppointments(day) {
    console.log(`Showing appointments for day: ${day}`);
    showNotification(`Выбран день: ${day}`);
}

// Show indicator details
function showIndicatorDetails(card) {
    const label = card.querySelector('.indicator-label').textContent;
    const value = card.querySelector('.indicator-value').textContent;
    
    console.log(`Showing details for: ${label} - ${value}`);
    showNotification(`Показатель: ${label} - ${value}`);
}

// Show add dialog
function showAddDialog(btn) {
    console.log('Showing add dialog');
    showNotification('Добавление нового элемента...');
}

// Health monitoring simulation
function startHealthMonitoring() {
    // Simulate real-time heart rate updates
    setInterval(() => {
        updateHeartRate();
    }, 3000);
    
    // Simulate brain activity updates
    setInterval(() => {
        updateBrainActivity();
    }, 5000);
    
    // Animate the 3D model components
    animate3DModel();
}

// Update heart rate
function updateHeartRate() {
    const heartRateElement = document.querySelector('.cardiac .indicator-value');
    if (heartRateElement) {
        const currentRate = parseInt(heartRateElement.textContent);
        const newRate = currentRate + Math.floor(Math.random() * 6) - 3; // ±3 bpm
        const clampedRate = Math.max(60, Math.min(120, newRate)); // Keep between 60-120
        
        heartRateElement.textContent = `${clampedRate} bpm`;
        
        // Add pulse animation
        heartRateElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            heartRateElement.style.transform = '';
        }, 200);
    }
}

// Update brain activity
function updateBrainActivity() {
    const brainActivityElement = document.querySelector('.activity .indicator-value');
    if (brainActivityElement) {
        const currentActivity = parseInt(brainActivityElement.textContent);
        const newActivity = currentActivity + Math.floor(Math.random() * 4) - 2; // ±2 ops
        const clampedActivity = Math.max(10, Math.min(25, newActivity)); // Keep between 10-25
        
        brainActivityElement.textContent = `${clampedActivity} ops`;
    }
}

// Animate 3D model components
function animate3DModel() {
    const lungs = document.querySelector('.lungs');
    const ribs = document.querySelectorAll('.rib');
    
    if (lungs) {
        // Breathing animation for lungs
        setInterval(() => {
            lungs.style.transform = 'translateX(-50%) scale(1.02)';
            setTimeout(() => {
                lungs.style.transform = 'translateX(-50%) scale(1)';
            }, 1000);
        }, 2000);
    }
    
    // Subtle rib movement
    if (ribs.length > 0) {
        setInterval(() => {
            ribs.forEach((rib, index) => {
                setTimeout(() => {
                    rib.style.transform = `translateX(-50%) translateY(calc(var(--index)*18px)) scaleX(1.01)`;
                    setTimeout(() => {
                        rib.style.transform = `translateX(-50%) translateY(calc(var(--index)*18px))`;
                    }, 500);
                }, index * 100);
            });
        }, 3000);
    }
}

// Utility function to show notifications
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .record-item.selected {
        background: #e3f2fd !important;
        border-left: 4px solid #2196f3;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
    }
    
    .indicator-card {
        cursor: pointer;
    }
    
    .human-figure .heart,
    .human-figure .lungs,
    .human-figure .liver,
    .human-figure .stomach,
    .human-figure .brain {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .human-figure .heart:hover,
    .human-figure .lungs:hover,
    .human-figure .liver:hover,
    .human-figure .stomach:hover,
    .human-figure .brain:hover {
        filter: brightness(1.2) saturate(1.3);
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('.tab').click();
                break;
            case '2':
                e.preventDefault();
                const visitTab = Array.from(tabs).find(tab => tab.textContent.toLowerCase().includes('visit'));
                if (visitTab) visitTab.click();
                break;
            case 'n':
                e.preventDefault();
                showNotification('Новая запись добавлена');
                break;
        }
    }
});

console.log('Health+ Medical Dashboard initialized successfully!');