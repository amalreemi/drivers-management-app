class DriversVehiclesApp {
    constructor() {
        // البيانات الأساسية من المتطلبات
        this.drivers = [
            {"id":1,"name":"محمد أحمد","employeeNumber":"001","mobile":"0501234567","dateAdded":"2024-01-01"},
            {"id":2,"name":"علي حسن","employeeNumber":"002","mobile":"0509876543","dateAdded":"2024-01-02"},
            {"id":3,"name":"خالد عبدالله","employeeNumber":"003","mobile":"0507654321","dateAdded":"2024-01-03"},
            {"id":4,"name":"خالد الريمي","employeeNumber":"006","mobile":"0505555555","dateAdded":"2025-08-08"},
            {"id":5,"name":"مجدي سامي","employeeNumber":"007","mobile":"0506666666","dateAdded":"2025-08-09"}
        ];
        this.vehicles = [
            {"id":1,"vehicleNumber":"101","vehicleType":"شاحنة صغيرة","status":"متاح"},
            {"id":2,"vehicleNumber":"222","vehicleType":"شاحنة كبيرة","status":"متاح"}
        ];
        this.workEntities = [
            {"id":1,"name":"شركة البحر الأحمر","contactPerson":"أحمد","phone":"0111111111"},
            {"id":2,"name":"مؤسسة النهر","contactPerson":"سعيد","phone":"0222222222"},
            {"id":3,"name":"شركة النخيل","contactPerson":"ماجد","phone":"0333333333"}
        ];
        this.assignmentsWithSalaries = [
            {"id":1,"driverId":1,"status":"نشط","assignmentDate":"2025-08-01","salaryCalculated":true,"salaryData":[{"vehicleId":1,"workEntityId":1,"startDate":"2025-08-01","endDate":"2025-08-31","basicSalary":900,"extraAllowance":30,"workDays":31,"calculatedSalary":930,"calculatedExtra":0,"totalSalary":930}]},
            {"id":2,"driverId":4,"status":"منتهي","assignmentDate":"2025-08-01","salaryCalculated":true,"salaryData":[{"vehicleId":1,"workEntityId":3,"startDate":"2025-08-01","endDate":"2025-08-06","basicSalary":2000,"extraAllowance":0,"workDays":6,"calculatedSalary":400,"calculatedExtra":0,"totalSalary":400},{"vehicleId":2,"workEntityId":1,"startDate":"2025-08-07","endDate":"2025-08-31","basicSalary":2000,"extraAllowance":0,"workDays":25,"calculatedSalary":1666.67,"calculatedExtra":0,"totalSalary":1666.67}]},
            {"id":3,"driverId":5,"status":"نشط","assignmentDate":"2025-08-09","salaryCalculated":true,"salaryData":[{"vehicleId":2,"workEntityId":2,"startDate":"2025-08-01","endDate":"2025-08-03","basicSalary":1000,"extraAllowance":0,"workDays":3,"calculatedSalary":100,"calculatedExtra":0,"totalSalary":100}]}
        ];
        
        this.currentSection = 'drivers';
        this.selectedItems = {
            drivers: new Set(),
            vehicles: new Set(), 
            entities: new Set()
        };
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.updateStats();
        this.updateReportsStats();
        this.populateSelects();
        this.setupDriverSearch();
        
        // تحميل البيانات الأولية
        setTimeout(() => {
            this.showSection('drivers');
            this.loadDriversTable();
            this.loadVehiclesTable();
            this.loadEntitiesTable();
            this.loadAssignmentsTable();
        }, 100);
    }

    setupEventListeners() {
        this.setupNavigation();
        this.setupFormEventListeners();
        this.setupModalEventListeners();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const section = btn.getAttribute('data-section');
                if (section && section !== this.currentSection) {
                    this.showSection(section);
                }
            });
        });
    }

    setupFormEventListeners() {
        // نماذج إضافة البيانات
        const driverForm = document.getElementById('driver-form');
        if (driverForm) {
            driverForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addDriver();
            });
        }

        const vehicleForm = document.getElementById('vehicle-form');
        if (vehicleForm) {
            vehicleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addVehicle();
            });
        }

        const entityForm = document.getElementById('entity-form');
        if (entityForm) {
            entityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEntity();
            });
        }

        const assignmentForm = document.getElementById('assignment-form');
        if (assignmentForm) {
            assignmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addAssignment();
            });
        }
    }

    setupModalEventListeners() {
        // إغلاق النماذج عند الضغط على الخلفية
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // إغلاق النماذج بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                    this.closeModal(modal.id);
                });
            }
        });
    }

    setupDriverSearch() {
        const searchInput = document.getElementById('driverSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterAssignmentsByDriver(e.target.value);
            });
        }
    }

    filterAssignmentsByDriver(searchTerm) {
        const tbody = document.querySelector('#assignments-table tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        
        if (!searchTerm.trim()) {
            rows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        const searchTermLower = searchTerm.toLowerCase().trim();
        
        rows.forEach(row => {
            const driverNameCell = row.querySelector('td:nth-child(2)');
            const employeeNumber = row.getAttribute('data-employee-number') || '';
            
            if (driverNameCell) {
                const driverName = driverNameCell.textContent.toLowerCase();
                const employeeNumberLower = employeeNumber.toLowerCase();
                
                if (driverName.includes(searchTermLower) || employeeNumberLower.includes(searchTermLower)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    showSection(sectionName) {
        this.currentSection = sectionName;
        
        const allSectionNames = ['drivers', 'vehicles', 'entities', 'assignments', 'reports'];
        
        // إخفاء جميع الأقسام
        allSectionNames.forEach(name => {
            const section = document.getElementById(`${name}-section`);
            if (section) {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });

        // إزالة التنشيط من جميع أزرار التنقل
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // إخفاء جميع أشرطة الإجراءات المتعدد
        this.hideAllMultiSelectActionBars();

        // إظهار القسم المحدد
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
        }

        // تنشيط الزر المناسب
        const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // تحديث البيانات حسب القسم
        setTimeout(() => {
            switch(sectionName) {
                case 'drivers':
                    this.loadDriversTable();
                    break;
                case 'vehicles':
                    this.loadVehiclesTable();
                    break;
                case 'entities':
                    this.loadEntitiesTable();
                    break;
                case 'assignments':
                    this.loadAssignmentsTable();
                    break;
                case 'reports':
                    this.updateReportsStats();
                    break;
            }
        }, 10);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // التأكد من أن النموذج يظهر أعلى كل شيء آخر
            modal.style.zIndex = '2000';
            
            if (modalId === 'assignment-modal') {
                this.resetAssignmentForm();
                this.populateSelects();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
            if (modalId === 'assignment-modal') {
                this.resetAssignmentForm();
            }
        }
    }

    resetAssignmentForm() {
        const salarySections = document.getElementById('salary-sections');
        if (salarySections) {
            salarySections.innerHTML = `
                <div class="salary-section">
                    <div class="salary-section-header">
                        <h4>الراتب الأول</h4>
                        <button type="button" class="btn btn--sm btn--outline remove-salary-btn hidden" onclick="app.removeSalarySection(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">المركبة *</label>
                            <select class="assignment-vehicle form-control" required>
                                <option value="">اختر المركبة</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">جهة العمل *</label>
                            <select class="assignment-entity form-control" required>
                                <option value="">اختر جهة العمل</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">الراتب الأساسي *</label>
                            <input type="number" class="basic-salary form-control" required min="0" step="0.01" placeholder="أدخل الراتب الأساسي">
                        </div>
                        <div class="form-group">
                            <label class="form-label">بدل خارج الدوام</label>
                            <input type="number" class="extra-allowance form-control" min="0" step="0.01" value="0" placeholder="أدخل بدل خارج الدوام">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">تاريخ البداية *</label>
                            <input type="date" class="assignment-start-date form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">تاريخ النهاية</label>
                            <input type="date" class="assignment-end-date form-control">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">عدد أيام العمل *</label>
                        <input type="number" class="work-days form-control" required min="1" max="31" value="30">
                    </div>
                </div>
            `;
        }
    }

    addSalarySection() {
        const salarySections = document.getElementById('salary-sections');
        if (!salarySections) return;
        
        const sectionCount = salarySections.children.length;
        
        const newSection = document.createElement('div');
        newSection.className = 'salary-section';
        newSection.innerHTML = `
            <div class="salary-section-header">
                <h4>الراتب ${sectionCount + 1}</h4>
                <button type="button" class="btn btn--sm btn--outline remove-salary-btn" onclick="app.removeSalarySection(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">المركبة *</label>
                    <select class="assignment-vehicle form-control" required>
                        <option value="">اختر المركبة</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">جهة العمل *</label>
                    <select class="assignment-entity form-control" required>
                        <option value="">اختر جهة العمل</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">الراتب الأساسي *</label>
                    <input type="number" class="basic-salary form-control" required min="0" step="0.01" placeholder="أدخل الراتب الأساسي">
                </div>
                <div class="form-group">
                    <label class="form-label">بدل خارج الدوام</label>
                    <input type="number" class="extra-allowance form-control" min="0" step="0.01" value="0" placeholder="أدخل بدل خارج الدوام">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">تاريخ البداية *</label>
                    <input type="date" class="assignment-start-date form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">تاريخ النهاية</label>
                    <input type="date" class="assignment-end-date form-control">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">عدد أيام العمل *</label>
                <input type="number" class="work-days form-control" required min="1" max="31" value="30">
            </div>
        `;
        
        salarySections.appendChild(newSection);
        this.updateSalarySectionHeaders();
        this.populateSelects();
        
        this.showToast('تم إضافة قسم راتب جديد', 'success');
    }

    removeSalarySection(button) {
        const section = button.closest('.salary-section');
        const salarySections = document.getElementById('salary-sections');
        
        if (salarySections.children.length > 1) {
            section.remove();
            this.updateSalarySectionHeaders();
            this.showToast('تم حذف قسم الراتب', 'success');
        } else {
            this.showToast('لا يمكن حذف القسم الوحيد', 'error');
        }
    }

    updateSalarySectionHeaders() {
        const sections = document.querySelectorAll('.salary-section');
        sections.forEach((section, index) => {
            const header = section.querySelector('h4');
            if (header) {
                header.textContent = index === 0 ? 'الراتب الأول' : `الراتب ${index + 1}`;
            }
            
            const removeBtn = section.querySelector('.remove-salary-btn');
            if (removeBtn) {
                if (sections.length === 1) {
                    removeBtn.classList.add('hidden');
                } else {
                    removeBtn.classList.remove('hidden');
                }
            }
        });
    }

    // وظائف إدارة السائقين
    addDriver() {
        const name = document.getElementById('driver-name').value.trim();
        const employeeNumber = document.getElementById('driver-employee-number').value.trim();
        const mobile = document.getElementById('driver-mobile').value.trim();

        if (!name || !employeeNumber) {
            this.showToast('يرجى ملء الحقول المطلوبة', 'error');
            return;
        }

        if (this.drivers.find(d => d.employeeNumber === employeeNumber)) {
            this.showToast('الرقم الوظيفي موجود مسبقاً', 'error');
            return;
        }

        const newDriver = {
            id: this.getNextId('drivers'),
            name,
            employeeNumber,
            mobile,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        this.drivers.push(newDriver);
        this.saveToLocalStorage();
        this.loadDriversTable();
        this.updateStats();
        this.updateReportsStats();
        this.populateSelects();
        this.closeModal('driver-modal');
        this.showToast('تم إضافة السائق بنجاح', 'success');
    }

    deleteDriver(id) {
        if (confirm('هل أنت متأكد من حذف هذا السائق؟')) {
            this.drivers = this.drivers.filter(d => d.id !== id);
            this.selectedItems.drivers.delete(id);
            this.saveToLocalStorage();
            this.loadDriversTable();
            this.updateStats();
            this.updateReportsStats();
            this.populateSelects();
            this.updateMultiSelectActionBar('drivers');
            this.showToast('تم حذف السائق بنجاح', 'success');
        }
    }

    loadDriversTable() {
        const tbody = document.querySelector('#drivers-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.drivers.forEach(driver => {
            const row = document.createElement('tr');
            const isSelected = this.selectedItems.drivers.has(driver.id);
            if (isSelected) {
                row.classList.add('selected');
            }
            
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="item-checkbox" data-type="drivers" data-item-id="${driver.id}" 
                           ${isSelected ? 'checked' : ''}>
                </td>
                <td>${driver.id}</td>
                <td>${driver.name}</td>
                <td>${driver.employeeNumber}</td>
                <td>${driver.mobile}</td>
                <td>${driver.dateAdded}</td>
                <td>
                    <button class="action-btn action-btn--delete" onclick="app.deleteDriver(${driver.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // إضافة مستمعي الأحداث لمربعات الاختيار
        this.setupCheckboxEventListeners('drivers');
        this.updateSelectAllCheckbox('drivers');
        this.updateMultiSelectActionBar('drivers');
    }

    // وظائف إدارة المركبات
    addVehicle() {
        const vehicleNumber = document.getElementById('vehicle-number').value.trim();
        const vehicleType = document.getElementById('vehicle-type').value;
        const status = document.getElementById('vehicle-status').value;

        if (!vehicleNumber || !vehicleType) {
            this.showToast('يرجى ملء الحقول المطلوبة', 'error');
            return;
        }

        if (this.vehicles.find(v => v.vehicleNumber === vehicleNumber)) {
            this.showToast('رقم المركبة موجود مسبقاً', 'error');
            return;
        }

        const newVehicle = {
            id: this.getNextId('vehicles'),
            vehicleNumber,
            vehicleType,
            status
        };

        this.vehicles.push(newVehicle);
        this.saveToLocalStorage();
        this.loadVehiclesTable();
        this.updateStats();
        this.updateReportsStats();
        this.populateSelects();
        this.closeModal('vehicle-modal');
        this.showToast('تم إضافة المركبة بنجاح', 'success');
    }

    deleteVehicle(id) {
        if (confirm('هل أنت متأكد من حذف هذه المركبة؟')) {
            this.vehicles = this.vehicles.filter(v => v.id !== id);
            this.selectedItems.vehicles.delete(id);
            this.saveToLocalStorage();
            this.loadVehiclesTable();
            this.updateStats();
            this.updateReportsStats();
            this.populateSelects();
            this.updateMultiSelectActionBar('vehicles');
            this.showToast('تم حذف المركبة بنجاح', 'success');
        }
    }

    loadVehiclesTable() {
        const tbody = document.querySelector('#vehicles-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            const isSelected = this.selectedItems.vehicles.has(vehicle.id);
            if (isSelected) {
                row.classList.add('selected');
            }
            const statusClass = vehicle.status === 'متاح' ? 'available' : vehicle.status === 'غير متاح' ? 'unavailable' : 'maintenance';
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="item-checkbox" data-type="vehicles" data-item-id="${vehicle.id}" 
                           ${isSelected ? 'checked' : ''}>
                </td>
                <td>${vehicle.id}</td>
                <td>${vehicle.vehicleNumber}</td>
                <td>${vehicle.vehicleType}</td>
                <td><span class="status-badge status-badge--${statusClass}">${vehicle.status}</span></td>
                <td>
                    <button class="action-btn action-btn--delete" onclick="app.deleteVehicle(${vehicle.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        this.setupCheckboxEventListeners('vehicles');
        this.updateSelectAllCheckbox('vehicles');
        this.updateMultiSelectActionBar('vehicles');
    }

    // وظائف إدارة جهات العمل
    addEntity() {
        const name = document.getElementById('entity-name').value.trim();
        const contactPerson = document.getElementById('entity-contact').value.trim();
        const phone = document.getElementById('entity-phone').value.trim();

        if (!name || !contactPerson) {
            this.showToast('يرجى ملء الحقول المطلوبة', 'error');
            return;
        }

        const newEntity = {
            id: this.getNextId('workEntities'),
            name,
            contactPerson,
            phone
        };

        this.workEntities.push(newEntity);
        this.saveToLocalStorage();
        this.loadEntitiesTable();
        this.updateStats();
        this.updateReportsStats();
        this.populateSelects();
        this.closeModal('entity-modal');
        this.showToast('تم إضافة جهة العمل بنجاح', 'success');
    }

    deleteEntity(id) {
        if (confirm('هل أنت متأكد من حذف جهة العمل هذه؟')) {
            this.workEntities = this.workEntities.filter(e => e.id !== id);
            this.selectedItems.entities.delete(id);
            this.saveToLocalStorage();
            this.loadEntitiesTable();
            this.updateStats();
            this.updateReportsStats();
            this.populateSelects();
            this.updateMultiSelectActionBar('entities');
            this.showToast('تم حذف جهة العمل بنجاح', 'success');
        }
    }

    loadEntitiesTable() {
        const tbody = document.querySelector('#entities-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.workEntities.forEach(entity => {
            const row = document.createElement('tr');
            const isSelected = this.selectedItems.entities.has(entity.id);
            if (isSelected) {
                row.classList.add('selected');
            }
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="item-checkbox" data-type="entities" data-item-id="${entity.id}" 
                           ${isSelected ? 'checked' : ''}>
                </td>
                <td>${entity.id}</td>
                <td>${entity.name}</td>
                <td>${entity.contactPerson}</td>
                <td>${entity.phone}</td>
                <td>
                    <button class="action-btn action-btn--delete" onclick="app.deleteEntity(${entity.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        this.setupCheckboxEventListeners('entities');
        this.updateSelectAllCheckbox('entities');
        this.updateMultiSelectActionBar('entities');
    }

    // إعداد مستمعي الأحداث لمربعات الاختيار
    setupCheckboxEventListeners(type) {
        const checkboxes = document.querySelectorAll(`input[data-type="${type}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = parseInt(checkbox.dataset.itemId);
                this.toggleItemSelection(type, itemId);
            });
        });
    }

    // وظائف التحديد المتعدد الجديدة
    toggleItemSelection(type, itemId) {
        if (this.selectedItems[type].has(itemId)) {
            this.selectedItems[type].delete(itemId);
        } else {
            this.selectedItems[type].add(itemId);
        }
        
        this.updateItemRowSelection(type, itemId);
        this.updateSelectAllCheckbox(type);
        this.updateMultiSelectActionBar(type);
    }

    updateItemRowSelection(type, itemId) {
        const checkbox = document.querySelector(`input[data-type="${type}"][data-item-id="${itemId}"]`);
        const row = checkbox?.closest('tr');
        
        if (checkbox && row) {
            const isSelected = this.selectedItems[type].has(itemId);
            checkbox.checked = isSelected;
            
            if (isSelected) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        }
    }

    toggleSelectAll(type) {
        const selectAllCheckbox = document.getElementById(`selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`);
        const allCheckboxes = document.querySelectorAll(`input[data-type="${type}"]`);
        
        if (selectAllCheckbox.checked) {
            this[this.getArrayName(type)].forEach(item => {
                this.selectedItems[type].add(item.id);
            });
        } else {
            this.selectedItems[type].clear();
        }
        
        allCheckboxes.forEach(checkbox => {
            const itemId = parseInt(checkbox.dataset.itemId);
            const row = checkbox.closest('tr');
            checkbox.checked = selectAllCheckbox.checked;
            
            if (selectAllCheckbox.checked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });
        
        this.updateMultiSelectActionBar(type);
    }

    updateSelectAllCheckbox(type) {
        const selectAllCheckbox = document.getElementById(`selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (!selectAllCheckbox) return;
        
        const totalItems = this[this.getArrayName(type)].length;
        const selectedCount = this.selectedItems[type].size;
        
        if (selectedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCount === totalItems) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    updateMultiSelectActionBar(type) {
        const actionBar = document.getElementById(`${type}MultiSelectActionBar`);
        const selectedCount = document.getElementById(`${type}SelectedCount`);
        
        if (!actionBar || !selectedCount) return;
        
        const count = this.selectedItems[type].size;
        
        if (count > 0) {
            selectedCount.textContent = `${count} مُحدد`;
            actionBar.classList.remove('hidden');
        } else {
            actionBar.classList.add('hidden');
        }
    }

    hideAllMultiSelectActionBars() {
        const actionBars = ['driversMultiSelectActionBar', 'vehiclesMultiSelectActionBar', 'entitiesMultiSelectActionBar'];
        actionBars.forEach(barId => {
            const actionBar = document.getElementById(barId);
            if (actionBar) {
                actionBar.classList.add('hidden');
            }
        });
        
        // مسح جميع التحديدات عند تغيير القسم فقط
        if (this.currentSection) {
            Object.keys(this.selectedItems).forEach(type => {
                if (type !== this.currentSection) {
                    this.selectedItems[type].clear();
                }
            });
        }
    }

    selectAllVisible(type) {
        this[this.getArrayName(type)].forEach(item => {
            this.selectedItems[type].add(item.id);
        });
        this.loadTable(type);
        this.showToast(`تم تحديد جميع ${this.getSectionName(type)}`, 'success');
    }

    unselectAll(type) {
        this.selectedItems[type].clear();
        this.loadTable(type);
        this.showToast(`تم إلغاء تحديد جميع ${this.getSectionName(type)}`, 'success');
    }

    deleteSelected(type) {
        const count = this.selectedItems[type].size;
        
        if (count === 0) {
            this.showToast(`لم يتم تحديد أي ${this.getSectionName(type)} للحذف`, 'warning');
            return;
        }
        
        if (confirm(`هل أنت متأكد من حذف ${count} ${this.getSectionName(type)}؟`)) {
            const arrayName = this.getArrayName(type);
            this[arrayName] = this[arrayName].filter(item => !this.selectedItems[type].has(item.id));
            this.selectedItems[type].clear();
            
            this.saveToLocalStorage();
            this.loadTable(type);
            this.updateStats();
            this.updateReportsStats();
            this.populateSelects();
            
            this.showToast(`تم حذف ${count} ${this.getSectionName(type)} بنجاح`, 'success');
        }
    }

    loadTable(type) {
        switch(type) {
            case 'drivers':
                this.loadDriversTable();
                break;
            case 'vehicles':
                this.loadVehiclesTable();
                break;
            case 'entities':
                this.loadEntitiesTable();
                break;
        }
    }

    getSectionName(type) {
        const names = {
            drivers: 'سائق',
            vehicles: 'مركبة',
            entities: 'جهة عمل'
        };
        return names[type] || type;
    }

    getArrayName(type) {
        const arrayNames = {
            drivers: 'drivers',
            vehicles: 'vehicles',
            entities: 'workEntities'
        };
        return arrayNames[type] || type;
    }

    // وظائف الإضافة السريعة
    previewBulkAdd() {
        try {
            const data = document.getElementById('bulkDriverData').value.trim();
            const separator = document.getElementById('separatorType').value;
            const previewDiv = document.getElementById('bulkPreview');
            const tableDiv = document.getElementById('previewTable');
            const errorsDiv = document.getElementById('previewErrors');
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات السائقين أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const parsedData = [];
            const errors = [];
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 1 || !parts[0]) {
                    errors.push(`السطر ${index + 1}: لا يحتوي على اسم`);
                    return;
                }
                
                const employeeNumber = parts[1] || `AUTO${Date.now()}_${index}`;
                const driver = {
                    name: parts[0] || '',
                    employeeNumber: employeeNumber,
                    mobile: parts[2] || ''
                };
                
                const exists = this.drivers.find(d => d.employeeNumber === driver.employeeNumber);
                if (exists) {
                    errors.push(`السطر ${index + 1}: الرقم الوظيفي ${driver.employeeNumber} موجود مسبقاً`);
                }
                
                const duplicateInParsed = parsedData.find(d => d.employeeNumber === driver.employeeNumber);
                if (duplicateInParsed) {
                    errors.push(`السطر ${index + 1}: رقم وظيفي مكرر في البيانات المُدخلة`);
                }
                
                parsedData.push(driver);
            });
            
            let tableHTML = '<table class="preview-table"><tr><th>الاسم</th><th>الرقم الوظيفي</th><th>الجوال</th></tr>';
            parsedData.forEach(driver => {
                tableHTML += `<tr><td>${driver.name}</td><td>${driver.employeeNumber}</td><td>${driver.mobile || 'غير محدد'}</td></tr>`;
            });
            tableHTML += '</table>';
            
            if (tableDiv) tableDiv.innerHTML = tableHTML;
            if (errorsDiv) errorsDiv.innerHTML = errors.length ? '<strong>أخطاء:</strong><br>' + errors.join('<br>') : '';
            if (previewDiv) previewDiv.style.display = 'block';
            
            if (parsedData.length > 0) {
                this.showToast(`تم العثور على ${parsedData.length} سائق للمعاينة`, 'success');
            }
        } catch (error) {
            console.error('خطأ في معاينة البيانات:', error);
            this.showToast('حدث خطأ في معاينة البيانات', 'error');
        }
    }

    addBulkDrivers() {
        try {
            const data = document.getElementById('bulkDriverData').value.trim();
            const separator = document.getElementById('separatorType').value;
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات السائقين أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const newDrivers = [];
            let successCount = 0;
            let skipCount = 0;
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 1 || !parts[0]) {
                    skipCount++;
                    return;
                }
                
                const employeeNumber = parts[1] || `AUTO${Date.now()}_${Math.random().toString(36).substr(2, 3)}_${index}`;
                
                const exists = this.drivers.find(d => d.employeeNumber === employeeNumber);
                if (exists) {
                    skipCount++;
                    return;
                }
                
                const duplicateInNew = newDrivers.find(d => d.employeeNumber === employeeNumber);
                if (duplicateInNew) {
                    skipCount++;
                    return;
                }
                
                const newDriver = {
                    id: this.getNextId('drivers') + successCount,
                    name: parts[0],
                    employeeNumber: employeeNumber,
                    mobile: parts[2] || '',
                    dateAdded: new Date().toISOString().split('T')[0]
                };
                
                newDrivers.push(newDriver);
                successCount++;
            });
            
            if (successCount > 0) {
                newDrivers.forEach(driver => {
                    this.drivers.push(driver);
                });
                
                this.saveToLocalStorage();
                this.loadDriversTable();
                this.updateStats();
                this.updateReportsStats();
                this.populateSelects();
                
                const bulkDriverData = document.getElementById('bulkDriverData');
                const bulkPreview = document.getElementById('bulkPreview');
                if (bulkDriverData) bulkDriverData.value = '';
                if (bulkPreview) bulkPreview.style.display = 'none';
                
                this.showToast(`تم إضافة ${successCount} سائق بنجاح` + (skipCount > 0 ? ` (تم تخطي ${skipCount})` : ''), 'success');
            } else {
                this.showToast('لم يتم إضافة أي سائق جديد', 'warning');
            }
        } catch (error) {
            console.error('خطأ في إضافة السائقين:', error);
            this.showToast('حدث خطأ في إضافة السائقين', 'error');
        }
    }

    clearBulkData() {
        const bulkDriverData = document.getElementById('bulkDriverData');
        const bulkPreview = document.getElementById('bulkPreview');
        if (bulkDriverData) bulkDriverData.value = '';
        if (bulkPreview) bulkPreview.style.display = 'none';
        this.showToast('تم مسح البيانات', 'success');
    }

    // وظائف الإضافة السريعة للمركبات
    previewBulkAddVehicles() {
        try {
            const data = document.getElementById('bulkVehicleData').value.trim();
            const separator = document.getElementById('vehicleSeparatorType').value;
            const previewDiv = document.getElementById('bulkVehiclePreview');
            const tableDiv = document.getElementById('vehiclePreviewTable');
            const errorsDiv = document.getElementById('vehiclePreviewErrors');
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات المركبات أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const parsedData = [];
            const errors = [];
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 2 || !parts[0] || !parts[1]) {
                    errors.push(`السطر ${index + 1}: يجب أن يحتوي على رقم المركبة ونوعها على الأقل`);
                    return;
                }
                
                const vehicle = {
                    vehicleNumber: parts[0] || '',
                    vehicleType: parts[1] || '',
                    status: parts[2] || 'متاح'
                };
                
                const exists = this.vehicles.find(v => v.vehicleNumber === vehicle.vehicleNumber);
                if (exists) {
                    errors.push(`السطر ${index + 1}: رقم المركبة ${vehicle.vehicleNumber} موجود مسبقاً`);
                }
                
                const duplicateInParsed = parsedData.find(v => v.vehicleNumber === vehicle.vehicleNumber);
                if (duplicateInParsed) {
                    errors.push(`السطر ${index + 1}: رقم مركبة مكرر في البيانات المُدخلة`);
                }
                
                parsedData.push(vehicle);
            });
            
            let tableHTML = '<table class="preview-table"><tr><th>رقم المركبة</th><th>نوع المركبة</th><th>الحالة</th></tr>';
            parsedData.forEach(vehicle => {
                tableHTML += `<tr><td>${vehicle.vehicleNumber}</td><td>${vehicle.vehicleType}</td><td>${vehicle.status}</td></tr>`;
            });
            tableHTML += '</table>';
            
            if (tableDiv) tableDiv.innerHTML = tableHTML;
            if (errorsDiv) errorsDiv.innerHTML = errors.length ? '<strong>أخطاء:</strong><br>' + errors.join('<br>') : '';
            if (previewDiv) previewDiv.style.display = 'block';
            
            if (parsedData.length > 0) {
                this.showToast(`تم العثور على ${parsedData.length} مركبة للمعاينة`, 'success');
            }
        } catch (error) {
            console.error('خطأ في معاينة البيانات:', error);
            this.showToast('حدث خطأ في معاينة البيانات', 'error');
        }
    }

    addBulkVehicles() {
        try {
            const data = document.getElementById('bulkVehicleData').value.trim();
            const separator = document.getElementById('vehicleSeparatorType').value;
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات المركبات أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const newVehicles = [];
            let successCount = 0;
            let skipCount = 0;
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 2 || !parts[0] || !parts[1]) {
                    skipCount++;
                    return;
                }
                
                const exists = this.vehicles.find(v => v.vehicleNumber === parts[0]);
                if (exists) {
                    skipCount++;
                    return;
                }
                
                const duplicateInNew = newVehicles.find(v => v.vehicleNumber === parts[0]);
                if (duplicateInNew) {
                    skipCount++;
                    return;
                }
                
                const newVehicle = {
                    id: this.getNextId('vehicles') + successCount,
                    vehicleNumber: parts[0],
                    vehicleType: parts[1],
                    status: parts[2] || 'متاح'
                };
                
                newVehicles.push(newVehicle);
                successCount++;
            });
            
            if (successCount > 0) {
                newVehicles.forEach(vehicle => {
                    this.vehicles.push(vehicle);
                });
                
                this.saveToLocalStorage();
                this.loadVehiclesTable();
                this.updateStats();
                this.updateReportsStats();
                this.populateSelects();
                
                const bulkVehicleData = document.getElementById('bulkVehicleData');
                const bulkVehiclePreview = document.getElementById('bulkVehiclePreview');
                if (bulkVehicleData) bulkVehicleData.value = '';
                if (bulkVehiclePreview) bulkVehiclePreview.style.display = 'none';
                
                this.showToast(`تم إضافة ${successCount} مركبة بنجاح` + (skipCount > 0 ? ` (تم تخطي ${skipCount})` : ''), 'success');
            } else {
                this.showToast('لم يتم إضافة أي مركبة جديدة', 'warning');
            }
        } catch (error) {
            console.error('خطأ في إضافة المركبات:', error);
            this.showToast('حدث خطأ في إضافة المركبات', 'error');
        }
    }

    clearBulkVehicleData() {
        const bulkVehicleData = document.getElementById('bulkVehicleData');
        const bulkVehiclePreview = document.getElementById('bulkVehiclePreview');
        if (bulkVehicleData) bulkVehicleData.value = '';
        if (bulkVehiclePreview) bulkVehiclePreview.style.display = 'none';
        this.showToast('تم مسح البيانات', 'success');
    }

    // وظائف الإضافة السريعة لجهات العمل
    previewBulkAddEntities() {
        try {
            const data = document.getElementById('bulkEntityData').value.trim();
            const separator = document.getElementById('entitySeparatorType').value;
            const previewDiv = document.getElementById('bulkEntityPreview');
            const tableDiv = document.getElementById('entityPreviewTable');
            const errorsDiv = document.getElementById('entityPreviewErrors');
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات جهات العمل أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const parsedData = [];
            const errors = [];
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 2 || !parts[0] || !parts[1]) {
                    errors.push(`السطر ${index + 1}: يجب أن يحتوي على اسم الشركة والشخص المسؤول على الأقل`);
                    return;
                }
                
                const entity = {
                    name: parts[0] || '',
                    contactPerson: parts[1] || '',
                    phone: parts[2] || ''
                };
                
                parsedData.push(entity);
            });
            
            let tableHTML = '<table class="preview-table"><tr><th>اسم الشركة</th><th>الشخص المسؤول</th><th>الهاتف</th></tr>';
            parsedData.forEach(entity => {
                tableHTML += `<tr><td>${entity.name}</td><td>${entity.contactPerson}</td><td>${entity.phone || 'غير محدد'}</td></tr>`;
            });
            tableHTML += '</table>';
            
            if (tableDiv) tableDiv.innerHTML = tableHTML;
            if (errorsDiv) errorsDiv.innerHTML = errors.length ? '<strong>أخطاء:</strong><br>' + errors.join('<br>') : '';
            if (previewDiv) previewDiv.style.display = 'block';
            
            if (parsedData.length > 0) {
                this.showToast(`تم العثور على ${parsedData.length} جهة عمل للمعاينة`, 'success');
            }
        } catch (error) {
            console.error('خطأ في معاينة البيانات:', error);
            this.showToast('حدث خطأ في معاينة البيانات', 'error');
        }
    }

    addBulkEntities() {
        try {
            const data = document.getElementById('bulkEntityData').value.trim();
            const separator = document.getElementById('entitySeparatorType').value;
            
            if (!data) {
                this.showToast('يرجى إدخال بيانات جهات العمل أولاً', 'error');
                return;
            }
            
            const lines = data.split('\n').filter(line => line.trim());
            const newEntities = [];
            let successCount = 0;
            let skipCount = 0;
            
            lines.forEach((line, index) => {
                let parts = this.parseLine(line, separator);
                
                if (parts.length < 2 || !parts[0] || !parts[1]) {
                    skipCount++;
                    return;
                }
                
                const newEntity = {
                    id: this.getNextId('workEntities') + successCount,
                    name: parts[0],
                    contactPerson: parts[1],
                    phone: parts[2] || ''
                };
                
                newEntities.push(newEntity);
                successCount++;
            });
            
            if (successCount > 0) {
                newEntities.forEach(entity => {
                    this.workEntities.push(entity);
                });
                
                this.saveToLocalStorage();
                this.loadEntitiesTable();
                this.updateStats();
                this.updateReportsStats();
                this.populateSelects();
                
                const bulkEntityData = document.getElementById('bulkEntityData');
                const bulkEntityPreview = document.getElementById('bulkEntityPreview');
                if (bulkEntityData) bulkEntityData.value = '';
                if (bulkEntityPreview) bulkEntityPreview.style.display = 'none';
                
                this.showToast(`تم إضافة ${successCount} جهة عمل بنجاح` + (skipCount > 0 ? ` (تم تخطي ${skipCount})` : ''), 'success');
            } else {
                this.showToast('لم يتم إضافة أي جهة عمل جديدة', 'warning');
            }
        } catch (error) {
            console.error('خطأ في إضافة جهات العمل:', error);
            this.showToast('حدث خطأ في إضافة جهات العمل', 'error');
        }
    }

    clearBulkEntityData() {
        const bulkEntityData = document.getElementById('bulkEntityData');
        const bulkEntityPreview = document.getElementById('bulkEntityPreview');
        if (bulkEntityData) bulkEntityData.value = '';
        if (bulkEntityPreview) bulkEntityPreview.style.display = 'none';
        this.showToast('تم مسح البيانات', 'success');
    }

    // وظائف إدارة التخصيصات
    addAssignment() {
        const driverId = parseInt(document.getElementById('assignment-driver').value);
        
        if (!driverId) {
            this.showToast('يرجى اختيار السائق', 'error');
            return;
        }

        const salarySections = document.querySelectorAll('.salary-section');
        const salaryData = [];

        for (let section of salarySections) {
            const vehicleId = parseInt(section.querySelector('.assignment-vehicle').value);
            const workEntityId = parseInt(section.querySelector('.assignment-entity').value);
            const basicSalary = parseFloat(section.querySelector('.basic-salary').value);
            const extraAllowance = parseFloat(section.querySelector('.extra-allowance').value) || 0;
            const startDate = section.querySelector('.assignment-start-date').value;
            const endDate = section.querySelector('.assignment-end-date').value || null;
            const workDays = parseInt(section.querySelector('.work-days').value);

            if (!vehicleId || !workEntityId || !basicSalary || !startDate || !workDays) {
                this.showToast('يرجى ملء جميع الحقول المطلوبة في جميع أقسام الراتب', 'error');
                return;
            }

            const totalMonthlyPay = basicSalary + extraAllowance;
            const calculatedSalary = (totalMonthlyPay / 30) * workDays;

            salaryData.push({
                vehicleId,
                workEntityId,
                startDate,
                endDate,
                basicSalary,
                extraAllowance,
                workDays,
                calculatedSalary: Math.round(calculatedSalary * 100) / 100,
                calculatedExtra: 0,
                totalSalary: Math.round(calculatedSalary * 100) / 100
            });
        }

        const newAssignment = {
            id: this.getNextId('assignmentsWithSalaries'),
            driverId,
            status: 'نشط',
            assignmentDate: new Date().toISOString().split('T')[0],
            salaryCalculated: true,
            salaryData
        };

        this.assignmentsWithSalaries.push(newAssignment);
        this.saveToLocalStorage();
        this.loadAssignmentsTable();
        this.updateStats();
        this.updateReportsStats();
        this.closeModal('assignment-modal');
        this.showToast('تم إضافة التخصيص بنجاح', 'success');
    }

    deleteAssignment(id) {
        if (confirm('هل أنت متأكد من حذف هذا التخصيص؟')) {
            this.assignmentsWithSalaries = this.assignmentsWithSalaries.filter(a => a.id !== id);
            this.saveToLocalStorage();
            this.loadAssignmentsTable();
            this.updateStats();
            this.updateReportsStats();
            this.showToast('تم حذف التخصيص بنجاح', 'success');
        }
    }

    loadAssignmentsTable() {
        const tbody = document.querySelector('#assignments-table tbody');
        if (tbody) {
            tbody.innerHTML = '';

            this.assignmentsWithSalaries.forEach(assignment => {
                const driver = this.drivers.find(d => d.id === assignment.driverId);
                
                if (assignment.salaryData && assignment.salaryData.length > 0) {
                    assignment.salaryData.forEach((salary, index) => {
                        const vehicle = this.vehicles.find(v => v.id === salary.vehicleId);
                        const entity = this.workEntities.find(e => e.id === salary.workEntityId);
                        
                        const row = document.createElement('tr');
                        row.setAttribute('data-employee-number', driver ? driver.employeeNumber : '');
                        
                        row.innerHTML = `
                            <td>${assignment.id}${index > 0 ? `-${index + 1}` : ''}</td>
                            <td>${driver ? driver.name : 'غير موجود'}</td>
                            <td>${vehicle ? vehicle.vehicleNumber : 'غير موجود'}</td>
                            <td>${entity ? entity.name : 'غير موجود'}</td>
                            <td>${salary.totalSalary.toLocaleString('ar-SA')}</td>
                            <td>${salary.startDate}</td>
                            <td>${salary.endDate || 'غير محدد'}</td>
                            <td><span class="status-badge status-badge--available">${assignment.status}</span></td>
                            <td>
                                ${index === 0 ? `
                                    <button class="action-btn action-btn--delete" onclick="app.deleteAssignment(${assignment.id})">
                                        <i class="fas fa-trash"></i> حذف
                                    </button>
                                ` : ''}
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            });
        }
    }

    populateSelects() {
        const driverSelect = document.getElementById('assignment-driver');
        if (driverSelect) {
            driverSelect.innerHTML = '<option value="">اختر السائق</option>';
            this.drivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.id;
                option.textContent = `${driver.name} (${driver.employeeNumber})`;
                driverSelect.appendChild(option);
            });
        }

        document.querySelectorAll('.assignment-vehicle').forEach(select => {
            select.innerHTML = '<option value="">اختر المركبة</option>';
            this.vehicles.filter(v => v.status === 'متاح').forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.vehicleNumber} - ${vehicle.vehicleType}`;
                select.appendChild(option);
            });
        });

        document.querySelectorAll('.assignment-entity').forEach(select => {
            select.innerHTML = '<option value="">اختر جهة العمل</option>';
            this.workEntities.forEach(entity => {
                const option = document.createElement('option');
                option.value = entity.id;
                option.textContent = entity.name;
                select.appendChild(option);
            });
        });
    }

    updateStats() {
        const driversCount = document.getElementById('driversCount');
        const vehiclesCount = document.getElementById('vehiclesCount');
        const entitiesCount = document.getElementById('entitiesCount');
        const assignmentsCount = document.getElementById('assignmentsCount');
        
        if (driversCount) driversCount.textContent = this.drivers.length;
        if (vehiclesCount) vehiclesCount.textContent = this.vehicles.length;
        if (entitiesCount) entitiesCount.textContent = this.workEntities.length;
        if (assignmentsCount) assignmentsCount.textContent = this.assignmentsWithSalaries.filter(a => a.status === 'نشط').length;
    }

    updateReportsStats() {
        const totalSalary = this.calculateTotalSalaries();
        
        const reportDriversCount = document.getElementById('reportDriversCount');
        const reportVehiclesCount = document.getElementById('reportVehiclesCount');
        const reportAssignmentsCount = document.getElementById('reportAssignmentsCount');
        const reportTotalSalary = document.getElementById('reportTotalSalary');
        
        if (reportDriversCount) reportDriversCount.textContent = this.drivers.length;
        if (reportVehiclesCount) reportVehiclesCount.textContent = this.vehicles.length;
        if (reportAssignmentsCount) reportAssignmentsCount.textContent = this.assignmentsWithSalaries.length;
        if (reportTotalSalary) reportTotalSalary.textContent = totalSalary.toLocaleString('ar-SA');
    }

    calculateTotalSalaries() {
        let total = 0;
        this.assignmentsWithSalaries.forEach(assignment => {
            if (assignment.salaryData) {
                assignment.salaryData.forEach(salary => {
                    total += salary.totalSalary || 0;
                });
            }
        });
        return Math.round(total * 100) / 100;
    }

    exportToExcel() {
        try {
            if (!window.XLSX) {
                this.showToast('مكتبة تصدير Excel غير متاحة', 'error');
                return;
            }

            const reportType = document.getElementById('reportType').value;
            const workbook = XLSX.utils.book_new();
            
            if (reportType === 'all' || reportType === 'drivers') {
                const driversData = this.drivers.map(driver => ({
                    'الرقم': driver.id,
                    'الاسم': driver.name,
                    'الرقم الوظيفي': driver.employeeNumber,
                    'الجوال': driver.mobile,
                    'تاريخ الإضافة': driver.dateAdded
                }));
                
                const driversSheet = XLSX.utils.json_to_sheet(driversData);
                XLSX.utils.book_append_sheet(workbook, driversSheet, 'السائقون');
            }
            
            if (reportType === 'all') {
                const vehiclesData = this.vehicles.map(vehicle => ({
                    'الرقم': vehicle.id,
                    'رقم المركبة': vehicle.vehicleNumber,
                    'نوع المركبة': vehicle.vehicleType,
                    'الحالة': vehicle.status
                }));
                
                const vehiclesSheet = XLSX.utils.json_to_sheet(vehiclesData);
                XLSX.utils.book_append_sheet(workbook, vehiclesSheet, 'المركبات');
                
                const entitiesData = this.workEntities.map(entity => ({
                    'الرقم': entity.id,
                    'اسم الشركة': entity.name,
                    'الشخص المسؤول': entity.contactPerson,
                    'الهاتف': entity.phone
                }));
                
                const entitiesSheet = XLSX.utils.json_to_sheet(entitiesData);
                XLSX.utils.book_append_sheet(workbook, entitiesSheet, 'جهات العمل');
            }
            
            if (reportType === 'all' || reportType === 'assignments' || reportType === 'salaries') {
                const assignmentsData = [];
                this.assignmentsWithSalaries.forEach(assignment => {
                    const driver = this.drivers.find(d => d.id === assignment.driverId);
                    
                    if (assignment.salaryData) {
                        assignment.salaryData.forEach((salary, index) => {
                            const vehicle = this.vehicles.find(v => v.id === salary.vehicleId);
                            const entity = this.workEntities.find(e => e.id === salary.workEntityId);
                            
                            assignmentsData.push({
                                'رقم التخصيص': assignment.id + (index > 0 ? `-${index + 1}` : ''),
                                'السائق': driver ? driver.name : 'غير موجود',
                                'المركبة': vehicle ? vehicle.vehicleNumber : 'غير موجود',
                                'جهة العمل': entity ? entity.name : 'غير موجود',
                                'الراتب الأساسي': salary.basicSalary,
                                'بدل خارج الدوام': salary.extraAllowance,
                                'عدد أيام العمل': salary.workDays,
                                'إجمالي الراتب': salary.totalSalary,
                                'تاريخ البداية': salary.startDate,
                                'تاريخ النهاية': salary.endDate || 'غير محدد',
                                'الحالة': assignment.status
                            });
                        });
                    }
                });
                
                const assignmentsSheet = XLSX.utils.json_to_sheet(assignmentsData);
                XLSX.utils.book_append_sheet(workbook, assignmentsSheet, 'التخصيصات والرواتب');
            }
            
            const fileName = `تقرير_النظام_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            this.showToast('تم تصدير التقرير بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في تصدير Excel:', error);
            this.showToast('حدث خطأ في تصدير التقرير', 'error');
        }
    }

    backupData() {
        try {
            const backupData = {
                drivers: this.drivers,
                vehicles: this.vehicles,
                workEntities: this.workEntities,
                assignmentsWithSalaries: this.assignmentsWithSalaries,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `نسخة_احتياطية_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showToast('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
            this.showToast('حدث خطأ في إنشاء النسخة الاحتياطية', 'error');
        }
    }

    // وظائف مساعدة
    parseLine(line, separator) {
        try {
            if (separator === '|') {
                return line.split('|').map(part => part.trim());
            } else if (separator === ',') {
                return line.split(',').map(part => part.trim());
            } else if (separator === 'tab') {
                return line.split('\t').map(part => part.trim());
            } else if (separator === 'space') {
                let parts = line.split(/\s{2,}/).map(part => part.trim());
                if (parts.length === 1) {
                    parts = line.split(' ').filter(part => part.trim()).map(part => part.trim());
                }
                return parts;
            } else {
                return line.split(separator).map(part => part.trim());
            }
        } catch (err) {
            return [];
        }
    }

    getNextId(arrayName) {
        const array = this[arrayName];
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    }

    saveToLocalStorage() {
        try {
            const data = {
                drivers: this.drivers,
                vehicles: this.vehicles,
                workEntities: this.workEntities,
                assignmentsWithSalaries: this.assignmentsWithSalaries
            };
            localStorage.setItem('driversVehiclesApp', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('driversVehiclesApp');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.drivers = data.drivers || this.drivers;
                this.vehicles = data.vehicles || this.vehicles;
                this.workEntities = data.workEntities || this.workEntities;
                this.assignmentsWithSalaries = data.assignmentsWithSalaries || this.assignmentsWithSalaries;
            }
        } catch (error) {
            console.error('خطأ في تحميل البيانات من التخزين المحلي:', error);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// تشغيل التطبيق
let app;

function initializeApp() {
    if (!app) {
        app = new DriversVehiclesApp();
    }
}

// تشغيل التطبيق عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}