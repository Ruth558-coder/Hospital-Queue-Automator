// Smart Queue Dashboard JavaScript

class QueueManager {
    constructor() {
        this.patients = [];
        this.queueCounter = 1;
        this.autoAdvanceEnabled = false;
        this.currentFilter = 'all';
        this.serviceFilter = '';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateDateTime();
        this.render();
        this.updateStatistics();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('addPatientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPatient();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Service filter
        document.getElementById('serviceFilter').addEventListener('change', (e) => {
            this.serviceFilter = e.target.value;
            this.render();
        });

        // Quick actions
        document.getElementById('autoAdvance').addEventListener('click', () => {
            this.toggleAutoAdvance();
        });

        document.getElementById('clearDone').addEventListener('click', () => {
            this.clearCompletedPatients();
        });

        document.getElementById('exportData').addEventListener('click', () => {
            this.exportQueueData();
        });
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
    }

    addPatient() {
        const nameInput = document.getElementById('patientName');
        const serviceInput = document.getElementById('serviceType');
        
        const name = nameInput.value.trim();
        const service = serviceInput.value;

        // Validation
        if (!name) {
            nameInput.classList.add('is-invalid');
            return;
        }
        if (!service) {
            serviceInput.classList.add('is-invalid');
            return;
        }

        // Clear validation states
        nameInput.classList.remove('is-invalid');
        serviceInput.classList.remove('is-invalid');

        // Create new patient
        const patient = {
            id: Date.now(),
            name: name,
            service: service,
            queueNumber: this.queueCounter++,
            status: 'waiting',
            timestamp: new Date().toISOString()
        };

        this.patients.push(patient);
        this.saveToStorage();
        this.render();
        this.updateStatistics();

        // Reset form
        nameInput.value = '';
        serviceInput.value = '';

        // Show success feedback
        this.showNotification('Patient added successfully!', 'success');
    }

    updatePatientStatus(patientId, newStatus) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        const oldStatus = patient.status;
        patient.status = newStatus;

        // Auto-advance logic
        if (newStatus === 'done' && this.autoAdvanceEnabled) {
            this.autoAdvanceNextPatient();
        }

        // If marking as serving, mark others as waiting
        if (newStatus === 'serving') {
            this.patients.forEach(p => {
                if (p.id !== patientId && p.status === 'serving') {
                    p.status = 'waiting';
                }
            });
        }

        this.saveToStorage();
        this.render();
        this.updateStatistics();

        // Log action
        console.log(`Patient ${patient.name} status changed from ${oldStatus} to ${newStatus}`);
    }

    autoAdvanceNextPatient() {
        const waitingPatients = this.patients.filter(p => p.status === 'waiting');
        if (waitingPatients.length > 0) {
            const nextPatient = waitingPatients[0];
            this.updatePatientStatus(nextPatient.id, 'serving');
            this.showNotification(`Auto-advanced: ${nextPatient.name} is now serving`, 'info');
        }
    }

    toggleAutoAdvance() {
        this.autoAdvanceEnabled = !this.autoAdvanceEnabled;
        const btn = document.getElementById('autoAdvance');
        
        if (this.autoAdvanceEnabled) {
            btn.classList.add('auto-advance-active');
            btn.innerHTML = '<i class="bi bi-pause-fill me-2"></i>Stop Auto-Advance';
            this.showNotification('Auto-advance enabled', 'success');
        } else {
            btn.classList.remove('auto-advance-active');
            btn.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Auto-Advance Queue';
            this.showNotification('Auto-advance disabled', 'warning');
        }
    }

    clearCompletedPatients() {
        const completedCount = this.patients.filter(p => p.status === 'done').length;
        if (completedCount === 0) {
            this.showNotification('No completed patients to clear', 'info');
            return;
        }

        if (confirm(`Clear ${completedCount} completed patient(s)?`)) {
            this.patients = this.patients.filter(p => p.status !== 'done');
            this.saveToStorage();
            this.render();
            this.updateStatistics();
            this.showNotification(`Cleared ${completedCount} completed patients`, 'success');
        }
    }

    exportQueueData() {
        const data = {
            exportDate: new Date().toISOString(),
            patients: this.patients,
            statistics: {
                total: this.patients.length,
                waiting: this.patients.filter(p => p.status === 'waiting').length,
                serving: this.patients.filter(p => p.status === 'serving').length,
                done: this.patients.filter(p => p.status === 'done').length
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `queue-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Queue data exported successfully', 'success');
    }

    getFilteredPatients() {
        let filtered = this.patients;

        // Filter by status
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.status === this.currentFilter);
        }

        // Filter by service
        if (this.serviceFilter) {
            filtered = filtered.filter(p => p.service === this.serviceFilter);
        }

        // Sort by queue number
        return filtered.sort((a, b) => a.queueNumber - b.queueNumber);
    }

    render() {
        const queueList = document.getElementById('queueList');
        const emptyQueue = document.getElementById('emptyQueue');
        const filteredPatients = this.getFilteredPatients();

        if (filteredPatients.length === 0) {
            queueList.innerHTML = '';
            emptyQueue.style.display = 'block';
            return;
        }

        emptyQueue.style.display = 'none';
        
        queueList.innerHTML = filteredPatients.map(patient => `
            <div class="col-md-6 col-lg-4">
                <div class="card patient-card ${patient.status} new-patient">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="queue-number ${patient.status} me-3">
                                ${patient.queueNumber}
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="card-title mb-1">${this.escapeHtml(patient.name)}</h6>
                                <span class="service-badge ${patient.service}">${patient.service}</span>
                            </div>
                            <span class="status-badge ${patient.status}">${patient.status}</span>
                        </div>
                        <div class="d-flex gap-2">
                            ${patient.status === 'waiting' ? `
                                <button class="btn btn-info btn-sm action-btn flex-fill" onclick="queueManager.updatePatientStatus(${patient.id}, 'serving')">
                                    <i class="bi bi-play-fill me-1"></i>Start
                                </button>
                            ` : ''}
                            ${patient.status === 'serving' ? `
                                <button class="btn btn-success btn-sm action-btn flex-fill" onclick="queueManager.updatePatientStatus(${patient.id}, 'done')">
                                    <i class="bi bi-check-circle me-1"></i>Complete
                                </button>
                            ` : ''}
                            <button class="btn btn-outline-danger btn-sm action-btn" onclick="queueManager.removePatient(${patient.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Remove animation class after animation completes
        setTimeout(() => {
            document.querySelectorAll('.new-patient').forEach(el => {
                el.classList.remove('new-patient');
            });
        }, 500);
    }

    removePatient(patientId) {
        if (confirm('Remove this patient from the queue?')) {
            this.patients = this.patients.filter(p => p.id !== patientId);
            this.saveToStorage();
            this.render();
            this.updateStatistics();
            this.showNotification('Patient removed from queue', 'warning');
        }
    }

    updateStatistics() {
        const waiting = this.patients.filter(p => p.status === 'waiting').length;
        const serving = this.patients.filter(p => p.status === 'serving').length;
        const done = this.patients.filter(p => p.status === 'done').length;

        document.getElementById('waitingCount').textContent = waiting;
        document.getElementById('servingCount').textContent = serving;
        document.getElementById('doneCount').textContent = done;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        notification.style.zIndex = '9999';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        const data = {
            patients: this.patients,
            queueCounter: this.queueCounter,
            autoAdvanceEnabled: this.autoAdvanceEnabled
        };
        localStorage.setItem('hospitalQueue', JSON.stringify(data));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('hospitalQueue');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.patients = data.patients || [];
                this.queueCounter = data.queueCounter || 1;
                this.autoAdvanceEnabled = data.autoAdvanceEnabled || false;
                
                // Update auto-advance button state
                if (this.autoAdvanceEnabled) {
                    const btn = document.getElementById('autoAdvance');
                    btn.classList.add('auto-advance-active');
                    btn.innerHTML = '<i class="bi bi-pause-fill me-2"></i>Stop Auto-Advance';
                }
            } catch (e) {
                console.error('Error loading data from storage:', e);
            }
        }
    }
}

// Initialize the queue manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.queueManager = new QueueManager();
    console.log('Smart Queue Dashboard initialized');
});
