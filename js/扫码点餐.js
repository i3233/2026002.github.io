// 扫码点餐页面交互逻辑

// 订单状态映射
const orderStatusMap = {
    'pendingPay': { text: '待支付', class: 'status-pendingPay' },
    'pendingMake': { text: '待制作', class: 'status-pendingMake' },
    'making': { text: '制作中', class: 'status-making' },
    'completed': { text: '已完成', class: 'status-completed' },
    'closed': { text: '已关闭', class: 'status-closed' }
};

// 扫码点餐订单数据
let scanOrderData = [
    {
        id: 'DD20250201003',
        orderTime: '2026-02-01 11:20:45',
        member: '王五',
        mobile: '13800000003',
        tableNo: 'C08',
        guestCount: 6,
        qty: 8,
        amount: 680.00,
        paid: 680.00,
        payType: '微信支付',
        status: 'completed',
        statusKey: 'completed'
    },
    {
        id: 'DD20250201006',
        orderTime: '2026-02-01 14:30:20',
        member: '孙七',
        mobile: '13800000006',
        tableNo: 'A05',
        guestCount: 2,
        qty: 3,
        amount: 198.00,
        paid: 0.00,
        payType: '-',
        status: '待支付',
        statusKey: 'pendingPay'
    },
    {
        id: 'DD20250201007',
        orderTime: '2026-02-01 15:15:30',
        member: '周八',
        mobile: '13800000007',
        tableNo: 'B03',
        guestCount: 4,
        qty: 5,
        amount: 450.00,
        paid: 450.00,
        payType: '支付宝',
        status: '待制作',
        statusKey: 'pendingMake'
    },
    {
        id: 'DD20250201008',
        orderTime: '2026-02-01 16:00:10',
        member: '吴九',
        mobile: '13800000008',
        tableNo: 'A07',
        guestCount: 3,
        qty: 4,
        amount: 320.00,
        paid: 320.00,
        payType: '微信支付',
        status: '制作中',
        statusKey: 'making'
    },
    {
        id: 'DD20250201009',
        orderTime: '2026-02-01 17:20:00',
        member: '郑十',
        mobile: '13800000009',
        tableNo: 'C05',
        guestCount: 5,
        qty: 6,
        amount: 520.00,
        paid: 0.00,
        payType: '-',
        status: '已关闭',
        statusKey: 'closed'
    },
    {
        id: 'DD20250202001',
        orderTime: '2026-02-02 09:30:15',
        member: '钱一',
        mobile: '13800000010',
        tableNo: 'A02',
        guestCount: 2,
        qty: 3,
        amount: 180.00,
        paid: 180.00,
        payType: '微信支付',
        status: '已完成',
        statusKey: 'completed'
    },
    {
        id: 'DD20250202002',
        orderTime: '2026-02-02 10:45:30',
        member: '李二',
        mobile: '13800000011',
        tableNo: 'B04',
        guestCount: 4,
        qty: 5,
        amount: 420.00,
        paid: 0.00,
        payType: '-',
        status: '待支付',
        statusKey: 'pendingPay'
    },
    {
        id: 'DD20250202003',
        orderTime: '2026-02-02 11:30:45',
        member: '王三',
        mobile: '13800000012',
        tableNo: 'C03',
        guestCount: 6,
        qty: 7,
        amount: 580.00,
        paid: 580.00,
        payType: '支付宝',
        status: '待制作',
        statusKey: 'pendingMake'
    }
];

// 筛选条件
let currentStatus = 'all';
let searchKeyword = '';
let selectedOrders = [];

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// DOM 元素
const orderTableBody = document.getElementById('orderTableBody');
const selectAllCheckbox = document.getElementById('selectAll');
const bottomSelectAllCheckbox = document.getElementById('bottomSelectAll');
const quickSearchInput = document.getElementById('quickSearchInput');
const quickSearchBtn = document.getElementById('quickSearchBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationPages = document.getElementById('paginationPages');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderTable();
    updateSummary();
    updateTableFooter();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 状态Tab切换
    document.querySelectorAll('.scan-order-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.scan-order-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStatus = this.dataset.status || 'all';
            pagination.currentPage = 1;
            renderTable();
            updateSummary();
            updateTableFooter();
            updatePagination();
        });
    });

    // 搜索
    quickSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            doQuickSearch();
        }
    });
    quickSearchBtn.addEventListener('click', doQuickSearch);

    // 全选
    selectAllCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        bottomSelectAllCheckbox.checked = checked;
        document.querySelectorAll('.order-checkbox').forEach(cb => {
            cb.checked = checked;
            if (checked) {
                const orderId = cb.dataset.orderId;
                if (!selectedOrders.includes(orderId)) {
                    selectedOrders.push(orderId);
                }
            } else {
                selectedOrders = [];
            }
        });
        updateSelectedInfo();
    });

    bottomSelectAllCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        selectAllCheckbox.checked = checked;
        document.querySelectorAll('.order-checkbox').forEach(cb => {
            cb.checked = checked;
            if (checked) {
                const orderId = cb.dataset.orderId;
                if (!selectedOrders.includes(orderId)) {
                    selectedOrders.push(orderId);
                }
            } else {
                selectedOrders = [];
            }
        });
        updateSelectedInfo();
    });

    // 行复选框
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('order-checkbox')) {
            const orderId = e.target.dataset.orderId;
            if (e.target.checked) {
                if (!selectedOrders.includes(orderId)) {
                    selectedOrders.push(orderId);
                }
            } else {
                selectedOrders = selectedOrders.filter(id => id !== orderId);
            }
            syncSelectAll();
            updateSelectedInfo();
        }
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
    });

    // 新增订单
    document.getElementById('addOrderBtn').addEventListener('click', function() {
        alert('新增扫码点餐订单（示例）');
    });

    // 导出
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportOrders();
    });

    document.getElementById('exportDetailBtn').addEventListener('click', function() {
        exportOrderDetails();
    });

    // 批量操作
    document.getElementById('batchExportBtn').addEventListener('click', function() {
        if (selectedOrders.length === 0) {
            alert('请先选择要导出的订单');
            return;
        }
        exportOrders(true);
    });

    document.getElementById('batchCloseBtn').addEventListener('click', function() {
        if (selectedOrders.length === 0) {
            alert('请先选择要关闭的订单');
            return;
        }
        if (confirm(`确定要关闭选中的 ${selectedOrders.length} 个订单吗？`)) {
            selectedOrders.forEach(orderId => {
                const order = scanOrderData.find(o => o.id === orderId);
                if (order && order.statusKey !== 'closed' && order.statusKey !== 'completed') {
                    order.statusKey = 'closed';
                    order.status = '已关闭';
                }
            });
            renderTable();
            updateSummary();
            updateTableFooter();
            selectedOrders = [];
            syncSelectAll();
            updateSelectedInfo();
            alert('批量关闭成功！');
        }
    });

    // 更多搜索
    document.getElementById('moreSearchBtn').addEventListener('click', function() {
        alert('更多搜索功能（示例）');
    });
}

// 执行快速搜索
function doQuickSearch() {
    searchKeyword = quickSearchInput.value.trim();
    pagination.currentPage = 1;
    renderTable();
    updateSummary();
    updateTableFooter();
    updatePagination();
}

// 渲染表格
function renderTable() {
    orderTableBody.innerHTML = '';

    // 筛选数据
    let filteredData = scanOrderData.filter(order => {
        // 状态筛选
        if (currentStatus !== 'all' && order.statusKey !== currentStatus) {
            return false;
        }
        // 搜索筛选
        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            if (!order.id.toLowerCase().includes(keyword) &&
                !order.member.toLowerCase().includes(keyword) &&
                !order.mobile.includes(keyword) &&
                !order.tableNo.toLowerCase().includes(keyword)) {
                return false;
            }
        }
        return true;
    });

    pagination.total = filteredData.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        orderTableBody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
        return;
    }

    pageData.forEach(order => {
        const tr = document.createElement('tr');
        tr.dataset.orderId = order.id;
        
        const statusInfo = orderStatusMap[order.statusKey] || { text: order.status, class: '' };
        
        tr.innerHTML = `
            <td>
                <input type="checkbox" class="order-checkbox" data-order-id="${order.id}">
            </td>
            <td>${order.id}</td>
            <td>${order.orderTime}</td>
            <td>${order.member}</td>
            <td>${order.mobile}</td>
            <td>${order.tableNo}</td>
            <td>${order.guestCount} 人</td>
            <td class="text-right">${order.qty}</td>
            <td class="text-right">¥${order.amount.toFixed(2)}</td>
            <td class="text-right">¥${order.paid.toFixed(2)}</td>
            <td>${order.payType}</td>
            <td>
                <span class="scan-order-status-badge ${statusInfo.class}">${statusInfo.text}</span>
            </td>
            <td>
                <button class="scan-order-action-btn view-order-btn" data-order-id="${order.id}">查看</button>
                ${order.statusKey === 'pendingPay' ? `
                    <button class="scan-order-action-btn confirm-pay-btn" data-order-id="${order.id}">确认支付</button>
                ` : ''}
                ${order.statusKey === 'pendingMake' ? `
                    <button class="scan-order-action-btn start-make-btn" data-order-id="${order.id}">开始制作</button>
                ` : ''}
                ${order.statusKey === 'making' ? `
                    <button class="scan-order-action-btn complete-order-btn" data-order-id="${order.id}">完成订单</button>
                ` : ''}
                ${order.statusKey !== 'closed' && order.statusKey !== 'completed' ? `
                    <button class="scan-order-action-btn scan-order-action-btn-danger close-order-btn" data-order-id="${order.id}">关闭</button>
                ` : ''}
            </td>
        `;
        orderTableBody.appendChild(tr);
    });

    // 绑定操作按钮事件
    bindTableEvents();
    syncSelectAll();
}

// 绑定表格事件
function bindTableEvents() {
    // 查看订单
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            alert(`查看订单详情：${orderId}（示例）`);
        });
    });

    // 确认支付
    document.querySelectorAll('.confirm-pay-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const order = scanOrderData.find(o => o.id === orderId);
            if (order && confirm(`确认订单 ${orderId} 已支付？`)) {
                order.paid = order.amount;
                order.payType = '微信支付';
                order.statusKey = 'pendingMake';
                order.status = '待制作';
                renderTable();
                updateSummary();
                updateTableFooter();
                alert('支付确认成功！');
            }
        });
    });

    // 开始制作
    document.querySelectorAll('.start-make-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const order = scanOrderData.find(o => o.id === orderId);
            if (order && confirm(`确认开始制作订单 ${orderId}？`)) {
                order.statusKey = 'making';
                order.status = '制作中';
                renderTable();
                updateSummary();
                alert('已开始制作！');
            }
        });
    });

    // 完成订单
    document.querySelectorAll('.complete-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const order = scanOrderData.find(o => o.id === orderId);
            if (order && confirm(`确认完成订单 ${orderId}？`)) {
                order.statusKey = 'completed';
                order.status = '已完成';
                renderTable();
                updateSummary();
                updateTableFooter();
                alert('订单已完成！');
            }
        });
    });

    // 关闭订单
    document.querySelectorAll('.close-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const order = scanOrderData.find(o => o.id === orderId);
            if (order && confirm(`确认关闭订单 ${orderId}？`)) {
                order.statusKey = 'closed';
                order.status = '已关闭';
                renderTable();
                updateSummary();
                updateTableFooter();
                alert('订单已关闭！');
            }
        });
    });
}

// 同步全选状态
function syncSelectAll() {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    const checkedCount = document.querySelectorAll('.order-checkbox:checked').length;
    const allChecked = checkedCount > 0 && checkedCount === checkboxes.length;
    selectAllCheckbox.checked = allChecked;
    bottomSelectAllCheckbox.checked = allChecked;
}

// 更新选中信息
function updateSelectedInfo() {
    document.getElementById('selectedInfo').textContent = `已选择 ${selectedOrders.length} 条记录`;
}

// 更新统计
function updateSummary() {
    let filteredData = scanOrderData.filter(order => {
        if (currentStatus !== 'all' && order.statusKey !== currentStatus) {
            return false;
        }
        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            if (!order.id.toLowerCase().includes(keyword) &&
                !order.member.toLowerCase().includes(keyword) &&
                !order.mobile.includes(keyword) &&
                !order.tableNo.toLowerCase().includes(keyword)) {
                return false;
            }
        }
        return true;
    });

    const orderCount = filteredData.length;
    const totalAmount = filteredData.reduce((sum, o) => sum + o.amount, 0);
    const paidAmount = filteredData.reduce((sum, o) => sum + o.paid, 0);
    const pendingMakeCount = filteredData.filter(o => o.statusKey === 'pendingMake').length;

    document.getElementById('summaryOrderCount').textContent = orderCount;
    document.getElementById('summaryTotalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('summaryPaidAmount').textContent = paidAmount.toFixed(2);
    document.getElementById('summaryPendingMakeCount').textContent = pendingMakeCount;
}

// 更新表格底部合计
function updateTableFooter() {
    let filteredData = scanOrderData.filter(order => {
        if (currentStatus !== 'all' && order.statusKey !== currentStatus) {
            return false;
        }
        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            if (!order.id.toLowerCase().includes(keyword) &&
                !order.member.toLowerCase().includes(keyword) &&
                !order.mobile.includes(keyword) &&
                !order.tableNo.toLowerCase().includes(keyword)) {
                return false;
            }
        }
        return true;
    });

    const totalQty = filteredData.reduce((sum, o) => sum + o.qty, 0);
    const totalAmount = filteredData.reduce((sum, o) => sum + o.amount, 0);
    const totalPaid = filteredData.reduce((sum, o) => sum + o.paid, 0);

    document.getElementById('totalQtyCell').textContent = totalQty;
    document.getElementById('totalAmountCell').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPaidCell').textContent = totalPaid.toFixed(2);
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
        firstBtn.className = 'scan-order-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'scan-order-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'scan-order-pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
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
            ellipsis.className = 'scan-order-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'scan-order-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 导出订单
function exportOrders(batch = false) {
    let dataToExport = batch ? 
        scanOrderData.filter(o => selectedOrders.includes(o.id)) : 
        scanOrderData.filter(order => {
            if (currentStatus !== 'all' && order.statusKey !== currentStatus) {
                return false;
            }
            if (searchKeyword) {
                const keyword = searchKeyword.toLowerCase();
                if (!order.id.toLowerCase().includes(keyword) &&
                    !order.member.toLowerCase().includes(keyword) &&
                    !order.mobile.includes(keyword) &&
                    !order.tableNo.toLowerCase().includes(keyword)) {
                    return false;
                }
            }
            return true;
        });

    const csv = [
        ['订单号', '下单时间', '会员', '手机号', '桌台号', '用餐人数', '商品数量', '订单金额', '实收金额', '支付方式', '订单状态'].join(','),
        ...dataToExport.map(order => {
            return [
                order.id,
                order.orderTime,
                order.member,
                order.mobile,
                order.tableNo,
                order.guestCount,
                order.qty,
                order.amount.toFixed(2),
                order.paid.toFixed(2),
                order.payType,
                order.status
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `扫码点餐订单_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 导出订单详情
function exportOrderDetails() {
    alert('导出订单详情（示例）');
}
