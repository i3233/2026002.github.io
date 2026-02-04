// 桌台管理页面交互逻辑

// 状态映射
const statusMap = {
    'available': { text: '空闲', class: 'status-available' },
    'occupied': { text: '使用中', class: 'status-occupied' },
    'reserved': { text: '已预订', class: 'status-reserved' },
    'disabled': { text: '已禁用', class: 'status-disabled' }
};

// 桌台数据
let tableData = [
    {
        id: 1,
        tableNo: 'A01',
        area: '大厅',
        capacity: 4,
        status: 'available',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 2,
        tableNo: 'A02',
        area: '大厅',
        capacity: 4,
        status: 'occupied',
        currentOrder: 'DD20250201001',
        guestCount: 4,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 3,
        tableNo: 'A03',
        area: '大厅',
        capacity: 6,
        status: 'available',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 4,
        tableNo: 'B01',
        area: '包间',
        capacity: 8,
        status: 'reserved',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: 'VIP客户专用'
    },
    {
        id: 5,
        tableNo: 'B02',
        area: '包间',
        capacity: 10,
        status: 'available',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 6,
        tableNo: 'C01',
        area: 'VIP区',
        capacity: 6,
        status: 'occupied',
        currentOrder: 'DD20250201002',
        guestCount: 6,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 7,
        tableNo: 'C02',
        area: 'VIP区',
        capacity: 8,
        status: 'available',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: ''
    },
    {
        id: 8,
        tableNo: 'D01',
        area: '露台',
        capacity: 4,
        status: 'disabled',
        currentOrder: null,
        guestCount: 0,
        createTime: '2026-01-15 10:00:00',
        remark: '维修中'
    }
];

// 筛选条件
let currentStatus = 'all';
let searchKeyword = '';
let selectedTables = [];

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// 当前编辑的桌台ID
let currentEditTableId = null;

// DOM 元素
const tableTableBody = document.getElementById('tableTableBody');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const tableSearchInput = document.getElementById('tableSearchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationPages = document.getElementById('paginationPages');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderTable();
    updateSummary();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 状态筛选
    document.querySelectorAll('.table-management-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.table-management-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStatus = this.dataset.status || 'all';
            pagination.currentPage = 1;
            renderTable();
            updateSummary();
            updatePagination();
        });
    });

    // 搜索
    tableSearchInput.addEventListener('input', function() {
        searchKeyword = this.value.trim();
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
    });

    // 全选
    selectAllCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.table-checkbox').forEach(cb => {
            cb.checked = checked;
            if (checked) {
                if (!selectedTables.includes(parseInt(cb.dataset.tableId))) {
                    selectedTables.push(parseInt(cb.dataset.tableId));
                }
            } else {
                selectedTables = [];
            }
        });
    });

    // 行复选框
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('table-checkbox')) {
            const tableId = parseInt(e.target.dataset.tableId);
            if (e.target.checked) {
                if (!selectedTables.includes(tableId)) {
                    selectedTables.push(tableId);
                }
            } else {
                selectedTables = selectedTables.filter(id => id !== tableId);
            }
            syncSelectAll();
        }
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
    });

    // 新增桌台
    document.getElementById('addTableBtn').addEventListener('click', function() {
        showTableModal();
    });

    // 编辑桌台
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-table-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            showTableModal(tableId);
        }
        if (e.target.classList.contains('delete-table-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            deleteTable(tableId);
        }
    });

    // 保存桌台
    document.getElementById('saveTableBtn').addEventListener('click', function() {
        saveTable();
    });

    // 批量设置
    document.getElementById('batchSetBtn').addEventListener('click', function() {
        if (selectedTables.length === 0) {
            alert('请先选择要设置的桌台');
            return;
        }
        alert('批量设置桌台（示例）：共选择 ' + selectedTables.length + ' 个桌台');
    });

    // 导出
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportTables();
    });

    // 导入
    document.getElementById('importBtn').addEventListener('click', function() {
        alert('导入桌台（示例）');
    });
}

// 渲染表格
function renderTable() {
    tableTableBody.innerHTML = '';

    // 筛选数据
    let filteredData = tableData.filter(table => {
        // 状态筛选
        if (currentStatus !== 'all' && table.status !== currentStatus) {
            return false;
        }
        // 搜索筛选
        if (searchKeyword && 
            !table.tableNo.toLowerCase().includes(searchKeyword.toLowerCase()) &&
            !table.area.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return false;
        }
        return true;
    });

    pagination.total = filteredData.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        tableTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
        return;
    }

    pageData.forEach(table => {
        const tr = document.createElement('tr');
        tr.dataset.tableId = table.id;
        
        const statusInfo = statusMap[table.status] || statusMap['available'];
        
        tr.innerHTML = `
            <td>
                <label class="table-management-checkbox-label">
                    <input type="checkbox" class="table-checkbox" data-table-id="${table.id}">
                </label>
            </td>
            <td>
                <span class="table-management-table-no">${table.tableNo}</span>
            </td>
            <td>
                <span class="table-management-area-badge">${table.area}</span>
            </td>
            <td>${table.capacity} 人</td>
            <td>
                <span class="table-management-status-badge ${statusInfo.class}">${statusInfo.text}</span>
            </td>
            <td>${table.currentOrder || '-'}</td>
            <td>${table.guestCount || '-'}</td>
            <td>${table.createTime}</td>
            <td>
                <button class="table-management-action-btn edit-table-btn" data-table-id="${table.id}">编辑</button>
                <button class="table-management-action-btn table-management-action-btn-danger delete-table-btn" data-table-id="${table.id}">删除</button>
            </td>
        `;
        tableTableBody.appendChild(tr);
    });

    syncSelectAll();
}

// 同步全选状态
function syncSelectAll() {
    const checkboxes = document.querySelectorAll('.table-checkbox');
    const checkedCount = document.querySelectorAll('.table-checkbox:checked').length;
    selectAllCheckbox.checked = checkedCount > 0 && checkedCount === checkboxes.length;
}

// 更新统计
function updateSummary() {
    const totalCount = tableData.length;
    const availableCount = tableData.filter(t => t.status === 'available').length;
    const occupiedCount = tableData.filter(t => t.status === 'occupied').length;
    const reservedCount = tableData.filter(t => t.status === 'reserved').length;

    document.getElementById('summaryTotalCount').textContent = totalCount;
    document.getElementById('summaryAvailableCount').textContent = availableCount;
    document.getElementById('summaryOccupiedCount').textContent = occupiedCount;
    document.getElementById('summaryReservedCount').textContent = reservedCount;
}

// 显示桌台弹窗
function showTableModal(tableId) {
    currentEditTableId = tableId;
    
    if (tableId) {
        // 编辑模式
        const table = tableData.find(t => t.id === tableId);
        if (!table) {
            alert('未找到该桌台');
            return;
        }
        document.getElementById('tableModalTitle').textContent = '编辑桌台';
        document.getElementById('tableNoInput').value = table.tableNo;
        document.getElementById('areaSelect').value = table.area;
        document.getElementById('capacityInput').value = table.capacity;
        document.getElementById('statusSelect').value = table.status;
        document.getElementById('remarkInput').value = table.remark || '';
    } else {
        // 新增模式
        document.getElementById('tableModalTitle').textContent = '新增桌台';
        document.getElementById('tableNoInput').value = '';
        document.getElementById('areaSelect').value = '';
        document.getElementById('capacityInput').value = '';
        document.getElementById('statusSelect').value = 'available';
        document.getElementById('remarkInput').value = '';
    }

    document.getElementById('tableModal').style.display = 'block';
}

// 关闭桌台弹窗
function closeTableModal() {
    document.getElementById('tableModal').style.display = 'none';
    currentEditTableId = null;
}

// 保存桌台
function saveTable() {
    const tableNo = document.getElementById('tableNoInput').value.trim();
    const area = document.getElementById('areaSelect').value;
    const capacity = parseInt(document.getElementById('capacityInput').value);
    const status = document.getElementById('statusSelect').value;
    const remark = document.getElementById('remarkInput').value.trim();

    if (!tableNo) {
        alert('请输入桌台号');
        return;
    }
    if (!area) {
        alert('请选择区域');
        return;
    }
    if (!capacity || capacity <= 0) {
        alert('请输入有效的容纳人数');
        return;
    }

    if (currentEditTableId) {
        // 编辑
        const table = tableData.find(t => t.id === currentEditTableId);
        if (table) {
            // 检查桌台号是否重复
            const duplicate = tableData.find(t => t.id !== currentEditTableId && t.tableNo === tableNo);
            if (duplicate) {
                alert('桌台号已存在');
                return;
            }
            table.tableNo = tableNo;
            table.area = area;
            table.capacity = capacity;
            table.status = status;
            table.remark = remark;
        }
    } else {
        // 新增
        // 检查桌台号是否重复
        const duplicate = tableData.find(t => t.tableNo === tableNo);
        if (duplicate) {
            alert('桌台号已存在');
            return;
        }
        const newTable = {
            id: Date.now(),
            tableNo: tableNo,
            area: area,
            capacity: capacity,
            status: status,
            currentOrder: null,
            guestCount: 0,
            createTime: new Date().toLocaleString('zh-CN'),
            remark: remark
        };
        tableData.push(newTable);
    }

    renderTable();
    updateSummary();
    updatePagination();
    closeTableModal();
    alert(currentEditTableId ? '桌台更新成功！' : '桌台添加成功！');
}

// 删除桌台
function deleteTable(tableId) {
    const table = tableData.find(t => t.id === tableId);
    if (!table) {
        alert('未找到该桌台');
        return;
    }

    if (table.status === 'occupied') {
        alert('该桌台正在使用中，无法删除');
        return;
    }

    if (confirm(`确定要删除桌台 ${table.tableNo} 吗？`)) {
        tableData = tableData.filter(t => t.id !== tableId);
        renderTable();
        updateSummary();
        updatePagination();
        alert('删除成功！');
    }
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('totalRecords').textContent = pagination.total;
    
    // 上一页/下一页按钮
    prevPageBtn.disabled = pagination.currentPage === 1;
    nextPageBtn.disabled = pagination.currentPage === totalPages || totalPages === 0;

    prevPageBtn.onclick = function() {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderTable();
            updatePagination();
        }
    };

    nextPageBtn.onclick = function() {
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderTable();
            updatePagination();
        }
    };

    // 页码按钮
    paginationPages.innerHTML = '';
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, pagination.currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'table-management-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'table-management-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'table-management-pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            pagination.currentPage = i;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'table-management-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'table-management-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 导出桌台
function exportTables() {
    const csv = [
        ['桌台号', '区域', '容纳人数', '状态', '当前订单', '用餐人数', '创建时间', '备注'].join(','),
        ...tableData.map(table => {
            const statusInfo = statusMap[table.status] || statusMap['available'];
            return [
                table.tableNo,
                table.area,
                table.capacity,
                statusInfo.text,
                table.currentOrder || '',
                table.guestCount || '',
                table.createTime,
                table.remark || ''
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `桌台管理_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 全局函数
window.closeTableModal = closeTableModal;
