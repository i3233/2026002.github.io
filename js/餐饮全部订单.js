// 餐饮全部订单页面交互逻辑 - 结合餐饮特点（桌台订单、扫码点餐等）

// 模拟餐饮订单数据（包含桌台订单、扫码点餐等类型）
let orderData = [
    {
        id: 'DD20250201001',
        orderTime: '2026-02-01 09:12:30',
        member: '张三',
        mobile: '13800000001',
        tableNo: 'A01',
        guestCount: 4,
        channel: '小程序',
        qty: 3,
        amount: 299.90,
        paid: 299.90,
        payType: '微信支付',
        status: '已完成',
        afterSale: '无',
        type: 'online'
    },
    {
        id: 'DD20250201002',
        orderTime: '2026-02-01 10:05:11',
        member: '李四',
        mobile: '13800000002',
        tableNo: 'B05',
        guestCount: 2,
        channel: '桌台扫码',
        qty: 5,
        amount: 520.00,
        paid: 520.00,
        payType: '微信支付',
        status: '已完成',
        afterSale: '无',
        type: 'table'
    },
    {
        id: 'DD20250201003',
        orderTime: '2026-02-01 11:20:45',
        member: '王五',
        mobile: '13800000003',
        tableNo: 'C08',
        guestCount: 6,
        channel: '扫码点餐',
        qty: 8,
        amount: 680.00,
        paid: 680.00,
        payType: '微信支付',
        status: '已完成',
        afterSale: '无',
        type: 'scan'
    },
    {
        id: 'DD20250201004',
        orderTime: '2026-02-01 12:15:20',
        member: '赵六',
        mobile: '13800000004',
        tableNo: 'D12',
        guestCount: 3,
        channel: '收银台',
        qty: 4,
        amount: 360.00,
        paid: 360.00,
        payType: '现金',
        status: '已完成',
        afterSale: '无',
        type: 'cashier'
    },
    {
        id: 'DD20250201005',
        orderTime: '2026-02-01 13:30:00',
        member: '钱七',
        mobile: '13800000005',
        tableNo: 'A03',
        guestCount: 2,
        channel: '小程序',
        qty: 2,
        amount: 188.00,
        paid: 0.00,
        payType: '货到付款',
        status: '待支付',
        afterSale: '无',
        type: 'online'
    },
    {
        id: 'DD20250201006',
        orderTime: '2026-02-01 14:45:33',
        member: '周八',
        mobile: '13800000006',
        tableNo: 'B10',
        guestCount: 5,
        channel: '桌台扫码',
        qty: 6,
        amount: 450.00,
        paid: 450.00,
        payType: '微信支付',
        status: '已完成',
        afterSale: '退款处理中',
        type: 'refund'
    }
];

// 筛选和分页
let filteredOrders = [...orderData];
let currentType = 'all';
let sortColumn = null;
let sortDirection = 'asc';
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// DOM 元素
const tbody = document.getElementById('orderTableBody');
const selectAll = document.getElementById('selectAll');
const bottomSelectAll = document.getElementById('bottomSelectAll');
const quickSearchInput = document.getElementById('quickSearchInput');
const quickSearchBtn = document.getElementById('quickSearchBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const jumpToPage = document.getElementById('jumpToPage');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    filterByType();
    updateStatistics();
    renderTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // Tab 点击
    document.querySelectorAll('.order-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type || 'all';
            filterByType();
        });
    });

    // 快捷搜索
    quickSearchBtn.addEventListener('click', doQuickSearch);
    quickSearchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            doQuickSearch();
        }
    });

    // 全选
    selectAll.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.row-checkbox').forEach(cb => (cb.checked = checked));
        bottomSelectAll.checked = checked;
        updateSelectedInfo();
    });

    bottomSelectAll.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.row-checkbox').forEach(cb => (cb.checked = checked));
        selectAll.checked = checked;
        updateSelectedInfo();
    });

    // 行复选框变化
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('row-checkbox')) {
            syncSelectAll();
        }
    });

    // 排序
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const col = th.dataset.sort;
            sortData(col);
        });
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
    });

    jumpToPage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const page = parseInt(this.value);
            if (page >= 1 && page <= Math.ceil(pagination.total / pagination.pageSize)) {
                pagination.currentPage = page;
                renderTable();
                updatePagination();
            }
        }
    });

    // 批量操作
    document.getElementById('batchExportBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要导出的订单。');
            return;
        }
        alert('批量导出（示例）：共选择 ' + ids.length + ' 条，订单号：\n' + ids.join('\n'));
    });

    document.getElementById('batchCloseBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要关闭的订单。');
            return;
        }
        alert('批量关闭订单（示例）：共选择 ' + ids.length + ' 条。');
    });

    document.getElementById('batchDeleteBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要删除的订单。');
            return;
        }
        if (!confirm('确定要删除选中的订单吗？当前仅为前端示例，不会真实删除数据。')) {
            return;
        }
        alert('已模拟删除 ' + ids.length + ' 条记录（示例）。');
    });

    // 可点击元素
    document.addEventListener('click', function(e) {
        const orderLink = e.target.closest('.order-link');
        const statusLink = e.target.closest('.status-link');
        const afterSaleLink = e.target.closest('.aftersale-link');
        const viewBtn = e.target.closest('.view-btn');

        if (orderLink) {
            const id = orderLink.dataset.id;
            alert('查看订单详情（示例）\n订单号：' + id);
        }

        if (statusLink) {
            const id = statusLink.dataset.id;
            alert('订单状态操作（示例）\n订单号：' + id);
        }

        if (afterSaleLink) {
            const id = afterSaleLink.dataset.id;
            alert('售后状态处理（示例）\n订单号：' + id);
        }

        if (viewBtn) {
            const id = viewBtn.dataset.id;
            alert('查看订单详细信息（示例）\n订单号：' + id);
        }
    });

    // 更多搜索
    document.getElementById('moreSearchBtn').addEventListener('click', function() {
        alert('更多搜索（示例）：这里可以展开高级筛选条件，如下单时间、订单状态、支付方式、来源渠道、桌台号等。');
    });

    // 其他按钮（示例）
    document.getElementById('addOrderBtn').addEventListener('click', function() {
        alert('新增订单（示例）');
    });

    document.getElementById('exportBtn').addEventListener('click', function() {
        exportOrders();
    });

    document.getElementById('exportDetailBtn').addEventListener('click', function() {
        alert('导出订单详情（示例）');
    });

    document.getElementById('statisticsBtn').addEventListener('click', function() {
        alert('统计功能（示例）');
    });
}

// 按订单类型过滤
function filterByType() {
    if (currentType === 'all') {
        filteredOrders = [...orderData];
    } else {
        filteredOrders = orderData.filter(o => o.type === currentType);
    }
    applySearchOnly();
}

// 快捷搜索（保持现有类型筛选）
function applySearchOnly() {
    const kw = quickSearchInput.value.trim().toLowerCase();
    let base = currentType === 'all' ? [...orderData] : orderData.filter(o => o.type === currentType);
    if (kw) {
        base = base.filter(o => {
            return (
                o.id.toLowerCase().includes(kw) ||
                (o.member && o.member.toLowerCase().includes(kw)) ||
                (o.mobile && o.mobile.toLowerCase().includes(kw)) ||
                (o.tableNo && o.tableNo.toLowerCase().includes(kw))
            );
        });
    }
    filteredOrders = base;
    // 排序保持
    if (sortColumn) {
        sortData(sortColumn, true);
    } else {
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
        updateStatistics();
    }
}

function doQuickSearch() {
    applySearchOnly();
}

// 排序
function sortData(column, keepRenderOnly = false) {
    if (!keepRenderOnly) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
    }

    if (column === 'orderTime') {
        filteredOrders.sort((a, b) => {
            const aVal = a.orderTime;
            const bVal = b.orderTime;
            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    if (!keepRenderOnly) {
        document.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('asc', 'desc');
        });
        const th = document.querySelector('th.sortable[data-sort="' + column + '"]');
        if (th) {
            th.classList.add(sortDirection);
        }
    }

    pagination.currentPage = 1;
    renderTable();
    updatePagination();
}

// 渲染表格
function renderTable() {
    tbody.innerHTML = '';
    
    // 计算分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredOrders.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无订单数据</td></tr>';
        updateTableFooter();
        return;
    }

    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        
        const statusClass = item.status === '已完成' 
            ? 'status-pill status-pill--success'
            : item.status === '待支付' || item.status === '待处理'
                ? 'status-pill status-pill--warning'
                : 'status-pill status-pill--primary';

        const afterSaleClass = item.afterSale === '无'
            ? 'status-pill status-pill--success'
            : 'status-pill status-pill--primary';
        
        tr.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox" class="row-checkbox" data-id="${item.id}">
            </td>
            <td>
                <span class="link-text order-link" data-id="${item.id}">${item.id}</span>
            </td>
            <td>${item.orderTime}</td>
            <td>${item.member || '-'}</td>
            <td>${item.mobile || '-'}</td>
            <td>${item.tableNo || '-'}</td>
            <td>${item.guestCount || '-'}</td>
            <td>${item.channel}</td>
            <td class="text-right">${item.qty}</td>
            <td class="text-right">${item.amount.toFixed(2)}</td>
            <td class="text-right">${item.paid.toFixed(2)}</td>
            <td>${item.payType}</td>
            <td>
                <span class="${statusClass} status-link" data-id="${item.id}">${item.status}</span>
            </td>
            <td>
                <span class="${afterSaleClass} aftersale-link" data-id="${item.id}">${item.afterSale}</span>
            </td>
            <td>
                <button class="btn-link view-btn" data-id="${item.id}">查看</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateSelectedInfo();
    updateTableFooter();
}

// 更新表格合计行
function updateTableFooter() {
    const totalQty = filteredOrders.reduce((sum, order) => sum + order.qty, 0);
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalPaid = filteredOrders.reduce((sum, order) => sum + order.paid, 0);
    
    document.getElementById('totalQtyCell').textContent = totalQty;
    document.getElementById('totalAmountCell').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPaidCell').textContent = totalPaid.toFixed(2);
}

// 更新统计卡片
function updateStatistics() {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalPaid = filteredOrders.reduce((sum, order) => sum + order.paid, 0);
    const orderCount = filteredOrders.length;
    
    document.getElementById('summaryTotalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('summaryPaidAmount').textContent = totalPaid.toFixed(2);
    document.getElementById('summaryOrderCount').textContent = orderCount;
}

// 全选同步
function syncSelectAll() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
    const allChecked = checkedCount > 0 && checkedCount === checkboxes.length;
    selectAll.checked = allChecked;
    bottomSelectAll.checked = allChecked;
    updateSelectedInfo();
}

// 获取选中的ID
function getSelectedIds() {
    const ids = [];
    document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
        ids.push(cb.dataset.id);
    });
    return ids;
}

// 更新选中信息
function updateSelectedInfo() {
    const ids = getSelectedIds();
    document.getElementById('selectedInfo').textContent = '已选择 ' + ids.length + ' 条记录';
}

// 更新分页
function updatePagination() {
    pagination.total = filteredOrders.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('paginationInfo').textContent = `共 ${pagination.total} 条记录`;
    
    const paginationPages = document.getElementById('paginationPages');
    paginationPages.innerHTML = '';
    
    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-page-btn';
    prevBtn.textContent = '上一页';
    prevBtn.disabled = pagination.currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderTable();
            updatePagination();
        }
    });
    paginationPages.appendChild(prevBtn);
    
    // 页码按钮
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, pagination.currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
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
        pageBtn.className = 'pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
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
            ellipsis.className = 'pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
    
    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-page-btn';
    nextBtn.textContent = '下一页';
    nextBtn.disabled = pagination.currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderTable();
            updatePagination();
        }
    });
    paginationPages.appendChild(nextBtn);
    
    jumpToPage.value = pagination.currentPage;
}

// 导出订单
function exportOrders() {
    const csv = [
        ['订单号', '下单时间', '会员', '手机号', '桌台号', '用餐人数', '来源渠道', '商品数量', '订单金额', '实收金额', '支付方式', '订单状态', '售后状态'].join(','),
        ...filteredOrders.map(order => {
            return [
                order.id,
                order.orderTime,
                order.member || '',
                order.mobile || '',
                order.tableNo || '',
                order.guestCount || '',
                order.channel,
                order.qty,
                order.amount.toFixed(2),
                order.paid.toFixed(2),
                order.payType,
                order.status,
                order.afterSale
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `餐饮全部订单_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}
