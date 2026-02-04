// 餐饮收银台订单页面交互逻辑 - 结合餐饮桌台管理

// 模拟收银台数据
const cashiers = [
    { id: 'CS001', name: '1号收银台', code: 'CS001', staff: '张三', status: 'online', location: '一楼大厅' },
    { id: 'CS002', name: '2号收银台', code: 'CS002', staff: '李四', status: 'online', location: '一楼大厅' },
    { id: 'CS003', name: '3号收银台', code: 'CS003', staff: '王五', status: 'offline', location: '二楼' },
    { id: 'CS004', name: '4号收银台', code: 'CS004', staff: '赵六', status: 'online', location: '二楼' }
];

// 模拟餐饮收银台订单数据（结合桌台管理）
const cashierOrders = [
    {
        id: 'SY20250201001',
        cashierId: 'CS001',
        orderTime: '2026-02-01 09:12:30',
        member: '张三',
        mobile: '13800000001',
        tableNo: 'A01',
        guestCount: 4,
        qty: 3,
        amount: 299.90,
        paid: 299.90,
        payType: '现金',
        status: '已完成',
        outboundStatus: '已出库',
        outboundTime: '2026-02-01 09:13:00'
    },
    {
        id: 'SY20250201002',
        cashierId: 'CS001',
        orderTime: '2026-02-01 10:05:11',
        member: '李四',
        mobile: '13800000002',
        tableNo: 'B05',
        guestCount: 2,
        qty: 5,
        amount: 520.00,
        paid: 520.00,
        payType: '刷卡',
        status: '已完成',
        outboundStatus: '已出库',
        outboundTime: '2026-02-01 10:05:30'
    },
    {
        id: 'SY20250201003',
        cashierId: 'CS002',
        orderTime: '2026-02-01 11:20:45',
        member: '王五',
        mobile: '13800000003',
        tableNo: 'C08',
        guestCount: 6,
        qty: 8,
        amount: 680.00,
        paid: 680.00,
        payType: '微信支付',
        status: '已完成',
        outboundStatus: '待出库',
        outboundTime: null
    },
    {
        id: 'SY20250201004',
        cashierId: 'CS001',
        orderTime: '2026-02-01 12:15:20',
        member: '赵六',
        mobile: '13800000004',
        tableNo: 'D12',
        guestCount: 3,
        qty: 4,
        amount: 360.00,
        paid: 360.00,
        payType: '现金',
        status: '已完成',
        outboundStatus: '待出库',
        outboundTime: null
    },
    {
        id: 'SY20250201005',
        cashierId: 'CS002',
        orderTime: '2026-02-01 13:30:00',
        member: '钱七',
        mobile: '13800000005',
        tableNo: 'A03',
        guestCount: 2,
        qty: 2,
        amount: 188.00,
        paid: 188.00,
        payType: '刷卡',
        status: '已完成',
        outboundStatus: '已出库',
        outboundTime: '2026-02-01 13:31:00'
    },
    {
        id: 'SY20250201006',
        cashierId: 'CS001',
        orderTime: '2026-02-01 14:45:33',
        member: '周八',
        mobile: '13800000006',
        tableNo: 'B10',
        guestCount: 5,
        qty: 6,
        amount: 450.00,
        paid: 450.00,
        payType: '微信支付',
        status: '已完成',
        outboundStatus: '待出库',
        outboundTime: null
    }
];

// 当前状态
let currentCashier = null;
let filteredOrders = [];
let currentStatus = 'all';
let currentPage = 1;
let pageSize = 20;
let sortColumn = null;
let sortDirection = 'asc';

// 初始化收银台选择器
function initCashierSelect() {
    const select = document.getElementById('cashierSelect');
    select.innerHTML = '<option value="">请选择收银台</option>';
    cashiers.forEach(cashier => {
        const option = document.createElement('option');
        option.value = cashier.id;
        option.textContent = `${cashier.name} (${cashier.code}) - ${cashier.staff}`;
        option.dataset.cashier = JSON.stringify(cashier);
        select.appendChild(option);
    });
}

// 绑定收银台
function bindCashier() {
    const select = document.getElementById('cashierSelect');
    const cashierId = select.value;
    
    if (!cashierId) {
        alert('请选择收银台');
        return;
    }

    const option = select.options[select.selectedIndex];
    currentCashier = JSON.parse(option.dataset.cashier);
    currentCashier.bindTime = new Date().toLocaleString('zh-CN');

    // 显示收银台信息
    document.getElementById('cashierNameDisplay').textContent = currentCashier.name;
    document.getElementById('cashierCodeDisplay').textContent = currentCashier.code;
    document.getElementById('cashierStaffDisplay').textContent = currentCashier.staff;
    document.getElementById('cashierStatusDisplay').textContent = currentCashier.status === 'online' ? '在线' : '离线';
    document.getElementById('cashierStatusDisplay').className = `cashier-status-badge ${currentCashier.status}`;
    document.getElementById('cashierBindTimeDisplay').textContent = currentCashier.bindTime;
    document.getElementById('cashierInfo').classList.remove('hidden');
    document.getElementById('bindInfoAlert').style.display = 'block';
    document.getElementById('unbindCashierBtn').style.display = 'inline-block';

    // 显示订单相关区域
    document.getElementById('toolbarCard').style.display = 'flex';
    document.getElementById('orderTabs').style.display = 'flex';
    document.getElementById('summaryRow').style.display = 'flex';
    document.getElementById('tableContainer').style.display = 'block';

    // 加载订单
    loadOrders();
}

// 解绑收银台
function unbindCashier() {
    if (!confirm('确定要解绑当前收银台吗？')) {
        return;
    }

    currentCashier = null;
    document.getElementById('cashierSelect').value = '';
    document.getElementById('cashierInfo').classList.add('hidden');
    document.getElementById('bindInfoAlert').style.display = 'none';
    document.getElementById('unbindCashierBtn').style.display = 'none';
    document.getElementById('toolbarCard').style.display = 'none';
    document.getElementById('orderTabs').style.display = 'none';
    document.getElementById('summaryRow').style.display = 'none';
    document.getElementById('tableContainer').style.display = 'none';
    
    filteredOrders = [];
}

// 加载订单
function loadOrders() {
    if (!currentCashier) {
        return;
    }

    // 筛选当前收银台的订单
    filteredOrders = cashierOrders.filter(order => order.cashierId === currentCashier.id);

    // 按状态筛选
    if (currentStatus !== 'all') {
        if (currentStatus === 'pending') {
            filteredOrders = filteredOrders.filter(order => order.outboundStatus === '待出库');
        } else if (currentStatus === 'outbound') {
            filteredOrders = filteredOrders.filter(order => order.outboundStatus === '已出库');
        } else if (currentStatus === 'completed') {
            filteredOrders = filteredOrders.filter(order => order.status === '已完成' && order.outboundStatus === '已出库');
        }
    }

    // 应用搜索
    applySearch();

    // 更新统计
    updateSummary();

    // 渲染表格
    renderTable();
    updatePagination();
}

// 应用搜索
function applySearch() {
    const keyword = document.getElementById('quickSearchInput').value.trim().toLowerCase();
    if (keyword) {
        filteredOrders = filteredOrders.filter(order => {
            return (
                order.id.toLowerCase().includes(keyword) ||
                (order.member && order.member.toLowerCase().includes(keyword)) ||
                (order.mobile && order.mobile.toLowerCase().includes(keyword)) ||
                (order.tableNo && order.tableNo.toLowerCase().includes(keyword))
            );
        });
    }
}

// 更新统计
function updateSummary() {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const outboundCount = filteredOrders.filter(order => order.outboundStatus === '已出库').length;
    const pendingCount = filteredOrders.filter(order => order.outboundStatus === '待出库').length;

    document.getElementById('summaryTotalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('summaryOutboundCount').textContent = outboundCount;
    document.getElementById('summaryPendingCount').textContent = pendingCount;
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = '';

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无订单数据</td></tr>';
        updateTotals();
        return;
    }

    // 计算分页
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredOrders.slice(start, end);

    pageData.forEach(order => {
        const statusClass = order.status === '已完成' 
            ? 'status-pill status-pill--success'
            : 'status-pill status-pill--warning';

        const outboundClass = order.outboundStatus === '已出库'
            ? 'status-pill status-pill--success'
            : 'status-pill status-pill--warning';

        const tr = document.createElement('tr');
        tr.dataset.id = order.id;
        tr.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox" class="row-checkbox" data-id="${order.id}">
            </td>
            <td>
                <span class="link-text order-link" data-id="${order.id}">${order.id}</span>
            </td>
            <td>${order.orderTime}</td>
            <td>${order.member || '-'}</td>
            <td>${order.mobile || '-'}</td>
            <td>${order.tableNo || '-'}</td>
            <td>${order.guestCount || '-'}</td>
            <td class="text-right">${order.qty}</td>
            <td class="text-right">${order.amount.toFixed(2)}</td>
            <td class="text-right">${order.paid.toFixed(2)}</td>
            <td>${order.payType}</td>
            <td>
                <span class="${statusClass}">${order.status}</span>
            </td>
            <td>
                <span class="${outboundClass}">${order.outboundStatus}</span>
            </td>
            <td>
                <button class="btn-link view-btn" data-id="${order.id}">查看</button>
                ${order.outboundStatus === '待出库' ? `<button class="btn-link outbound-btn" data-id="${order.id}">出库</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateTotals();
    updateSelectedInfo();
    bindTableEvents();
}

// 更新合计
function updateTotals() {
    const totalQty = filteredOrders.reduce((sum, order) => sum + order.qty, 0);
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalPaid = filteredOrders.reduce((sum, order) => sum + order.paid, 0);

    document.getElementById('totalQtyCell').textContent = totalQty;
    document.getElementById('totalAmountCell').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPaidCell').textContent = totalPaid.toFixed(2);
}

// 绑定表格事件
function bindTableEvents() {
    // 查看订单
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            const order = cashierOrders.find(o => o.id === orderId);
            alert(`订单详情（示例）\n订单号：${order.id}\n会员：${order.member}\n桌台号：${order.tableNo}\n金额：¥${order.amount.toFixed(2)}\n出库状态：${order.outboundStatus}`);
        });
    });

    // 出库操作
    document.querySelectorAll('.outbound-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            doOutbound([orderId]);
        });
    });

    // 订单号点击
    document.querySelectorAll('.order-link').forEach(link => {
        link.addEventListener('click', function() {
            const orderId = this.dataset.id;
            const order = cashierOrders.find(o => o.id === orderId);
            alert(`订单详情（示例）\n订单号：${order.id}\n会员：${order.member}\n桌台号：${order.tableNo}\n金额：¥${order.amount.toFixed(2)}\n出库状态：${order.outboundStatus}`);
        });
    });
}

// 执行出库
function doOutbound(orderIds) {
    if (!orderIds || orderIds.length === 0) {
        alert('请选择要出库的订单');
        return;
    }

    if (!confirm(`确定要对 ${orderIds.length} 个订单执行出库操作吗？出库后将自动更新库存。`)) {
        return;
    }

    // 更新订单出库状态
    orderIds.forEach(orderId => {
        const order = cashierOrders.find(o => o.id === orderId);
        if (order && order.outboundStatus === '待出库') {
            order.outboundStatus = '已出库';
            order.outboundTime = new Date().toLocaleString('zh-CN');
        }
    });

    // 重新加载订单
    loadOrders();

    alert(`成功出库 ${orderIds.length} 个订单！库存已自动更新。`);
}

// 全选/反选
function getSelectedIds() {
    const ids = [];
    document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
        ids.push(cb.dataset.id);
    });
    return ids;
}

function updateSelectedInfo() {
    const ids = getSelectedIds();
    document.getElementById('selectedInfo').textContent = `已选择 ${ids.length} 条记录`;
}

function syncSelectAll() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
    const allChecked = checkedCount > 0 && checkedCount === checkboxes.length;
    document.getElementById('selectAll').checked = allChecked;
    document.getElementById('bottomSelectAll').checked = allChecked;
    updateSelectedInfo();
}

// 更新分页
function updatePagination() {
    const totalRecords = filteredOrders.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    document.getElementById('totalRecords').textContent = totalRecords;
    
    const paginationPages = document.getElementById('paginationPages');
    paginationPages.innerHTML = '';
    
    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-page-btn';
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    });
    paginationPages.appendChild(prevBtn);
    
    // 页码按钮
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-page-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
    
    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-page-btn';
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    });
    paginationPages.appendChild(nextBtn);
    
    document.getElementById('jumpToPage').value = currentPage;
}

// 事件绑定
document.addEventListener('DOMContentLoaded', function() {
    initCashierSelect();

    document.getElementById('bindCashierBtn').addEventListener('click', bindCashier);
    document.getElementById('unbindCashierBtn').addEventListener('click', unbindCashier);
    document.getElementById('refreshOrdersBtn')?.addEventListener('click', loadOrders);
    document.getElementById('quickSearchBtn')?.addEventListener('click', loadOrders);
    document.getElementById('quickSearchInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadOrders();
        }
    });

    // Tab切换
    document.querySelectorAll('.order-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStatus = this.dataset.status || 'all';
            loadOrders();
        });
    });

    // 批量出库
    document.getElementById('batchOutboundBtn')?.addEventListener('click', function() {
        const ids = getSelectedIds();
        if (ids.length === 0) {
            alert('请先选择要出库的订单');
            return;
        }
        
        // 只选择待出库的订单
        const pendingIds = ids.filter(id => {
            const order = cashierOrders.find(o => o.id === id);
            return order && order.outboundStatus === '待出库';
        });

        if (pendingIds.length === 0) {
            alert('所选订单中没有待出库的订单');
            return;
        }

        doOutbound(pendingIds);
    });

    // 全选
    document.getElementById('selectAll')?.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = checked);
        document.getElementById('bottomSelectAll').checked = checked;
        updateSelectedInfo();
    });

    document.getElementById('bottomSelectAll')?.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = checked);
        document.getElementById('selectAll').checked = checked;
        updateSelectedInfo();
    });

    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('row-checkbox')) {
            syncSelectAll();
        }
    });

    // 更多搜索
    document.getElementById('moreSearchBtn')?.addEventListener('click', function() {
        alert('更多搜索（示例）：这里可以展开高级筛选条件，如下单时间、订单状态、支付方式、桌台号等。');
    });

    // 分页
    document.getElementById('pageSizeSelect')?.addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        renderTable();
        updatePagination();
    });

    document.getElementById('jumpToPage')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const page = parseInt(this.value);
            if (page >= 1 && page <= Math.ceil(filteredOrders.length / pageSize)) {
                currentPage = page;
                renderTable();
                updatePagination();
            }
        }
    });
});
