// 收银员管理页面交互逻辑

// 收银员数据
let cashiers = [
    {
        id: 1,
        code: 'C001',
        name: '张三',
        phone: '13800138001',
        role: 'cashier',
        permissions: ['order', 'refund'],
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 2,
        code: 'C002',
        name: '李四',
        phone: '13800138002',
        role: 'manager',
        permissions: ['order', 'refund', 'discount', 'delete', 'report', 'settings'],
        status: 'active',
        createTime: '2024-01-16 14:30:00'
    },
    {
        id: 3,
        code: 'C003',
        name: '王五',
        phone: '13800138003',
        role: 'supervisor',
        permissions: ['order', 'refund', 'discount', 'report'],
        status: 'inactive',
        createTime: '2024-01-17 09:15:00'
    },
];

// 当前编辑的收银员ID
let editingCashierId = null;

// 当前筛选条件
let currentStatus = 'all';
let searchKeyword = '';

// 角色映射
const roleMap = {
    'cashier': '收银员',
    'manager': '店长',
    'supervisor': '主管'
};

// 权限映射
const permissionMap = {
    'order': '订单管理',
    'refund': '退单权限',
    'discount': '折扣权限',
    'delete': '删除订单',
    'report': '查看报表',
    'settings': '系统设置'
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderCashierTable();
});

// 初始化事件监听
function initEventListeners() {
    // 添加收银员按钮
    const addCashierBtn = document.getElementById('addCashierBtn');
    if (addCashierBtn) {
        addCashierBtn.addEventListener('click', function() {
            showCashierModal();
        });
    }

    // 状态筛选
    document.querySelectorAll('.cashier-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cashier-filter-btn').forEach(b => b.classList.remove('cashier-filter-btn-active'));
            this.classList.add('cashier-filter-btn-active');
            currentStatus = this.dataset.status;
            renderCashierTable();
        });
    });

    // 搜索
    const searchInput = document.getElementById('cashierSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            renderCashierTable();
        });
    }
}

// 渲染收银员表格
function renderCashierTable() {
    const tableBody = document.getElementById('cashierTableBody');
    if (!tableBody) return;

    // 过滤收银员
    let filteredCashiers = cashiers;

    // 按状态过滤
    if (currentStatus !== 'all') {
        filteredCashiers = filteredCashiers.filter(c => c.status === currentStatus);
    }

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredCashiers = filteredCashiers.filter(c =>
            c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            c.code.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    if (filteredCashiers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无收银员数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = filteredCashiers.map(cashier => {
        const roleClass = `cashier-role-badge-${cashier.role}`;
        const statusClass = cashier.status === 'active' ? 'cashier-status-badge-active' : 'cashier-status-badge-inactive';
        const statusText = cashier.status === 'active' ? '在职' : '离职';

        return `
            <tr>
                <td>${cashier.code}</td>
                <td>${cashier.name}</td>
                <td>${cashier.phone}</td>
                <td>
                    <span class="cashier-role-badge ${roleClass}">${roleMap[cashier.role]}</span>
                </td>
                <td>
                    <div class="cashier-permissions-display">
                        ${cashier.permissions.map(p => `<span class="cashier-permission-tag">${permissionMap[p]}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <span class="cashier-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>${cashier.createTime}</td>
                <td>
                    <div class="cashier-action-buttons">
                        <button class="cashier-btn cashier-btn-outline" onclick="editCashier(${cashier.id})">编辑</button>
                        <button class="cashier-btn cashier-btn-danger" onclick="deleteCashier(${cashier.id})">删除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 显示收银员弹窗
function showCashierModal(cashierId = null) {
    editingCashierId = cashierId;
    const modal = document.getElementById('cashierModal');
    const modalTitle = document.getElementById('cashierModalTitle');
    const form = document.getElementById('cashierForm');
    const passwordRequired = document.getElementById('passwordRequired');
    const passwordTip = document.getElementById('passwordTip');

    if (modalTitle) {
        modalTitle.textContent = cashierId ? '编辑收银员' : '添加收银员';
    }

    if (cashierId) {
        // 编辑模式
        const cashier = cashiers.find(c => c.id === cashierId);
        if (cashier) {
            document.getElementById('cashierCode').value = cashier.code;
            document.getElementById('cashierName').value = cashier.name;
            document.getElementById('cashierPhone').value = cashier.phone;
            document.getElementById('cashierRole').value = cashier.role;
            document.getElementById('cashierStatus').checked = cashier.status === 'active';
            document.getElementById('cashierPassword').value = '';
            document.getElementById('cashierPassword').required = false;
            
            if (passwordRequired) passwordRequired.style.display = 'none';
            if (passwordTip) passwordTip.style.display = 'block';

            // 设置权限
            document.querySelectorAll('.cashier-permissions input[type="checkbox"]').forEach(cb => {
                cb.checked = cashier.permissions.includes(cb.value);
            });
        }
    } else {
        // 添加模式
        form.reset();
        document.getElementById('cashierStatus').checked = true;
        document.getElementById('cashierPassword').required = true;
        
        if (passwordRequired) passwordRequired.style.display = 'inline';
        if (passwordTip) passwordTip.style.display = 'none';

        // 默认权限
        document.querySelectorAll('.cashier-permissions input[type="checkbox"]').forEach(cb => {
            cb.checked = ['order', 'refund'].includes(cb.value);
        });
    }

    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭收银员弹窗
function closeCashierModal() {
    const modal = document.getElementById('cashierModal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingCashierId = null;
    document.getElementById('cashierForm').reset();
}

// 保存收银员
function saveCashier() {
    const form = document.getElementById('cashierForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const code = document.getElementById('cashierCode').value;
    const name = document.getElementById('cashierName').value;
    const phone = document.getElementById('cashierPhone').value;
    const role = document.getElementById('cashierRole').value;
    const password = document.getElementById('cashierPassword').value;
    const status = document.getElementById('cashierStatus').checked ? 'active' : 'inactive';
    const permissions = Array.from(document.querySelectorAll('.cashier-permissions input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号');
        return;
    }

    if (editingCashierId) {
        // 更新收银员
        const cashier = cashiers.find(c => c.id === editingCashierId);
        if (cashier) {
            // 检查工号是否重复（排除当前编辑的）
            if (cashiers.some(c => c.code === code && c.id !== editingCashierId)) {
                alert('工号已存在');
                return;
            }

            cashier.code = code;
            cashier.name = name;
            cashier.phone = phone;
            cashier.role = role;
            cashier.status = status;
            cashier.permissions = permissions;
            
            if (password) {
                // 更新密码（实际应用中应该加密）
                console.log('更新密码');
            }

            alert('收银员更新成功');
        }
    } else {
        // 添加收银员
        // 检查工号是否重复
        if (cashiers.some(c => c.code === code)) {
            alert('工号已存在');
            return;
        }

        if (!password) {
            alert('请设置登录密码');
            return;
        }

        const newCashier = {
            id: cashiers.length + 1,
            code: code,
            name: name,
            phone: phone,
            role: role,
            permissions: permissions,
            status: status,
            createTime: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        cashiers.push(newCashier);
        alert('收银员添加成功');
    }

    renderCashierTable();
    closeCashierModal();
}

// 编辑收银员
function editCashier(cashierId) {
    showCashierModal(cashierId);
}

// 删除收银员
function deleteCashier(cashierId) {
    const cashier = cashiers.find(c => c.id === cashierId);
    if (!cashier) return;

    if (confirm(`确定要删除收银员"${cashier.name}"吗？`)) {
        cashiers = cashiers.filter(c => c.id !== cashierId);
        renderCashierTable();
        alert('收银员已删除');
    }
}

// 全局函数
window.closeCashierModal = closeCashierModal;
window.editCashier = editCashier;
window.deleteCashier = deleteCashier;
