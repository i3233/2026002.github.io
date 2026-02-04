// 餐饮采购订单列表页面交互逻辑

// 餐饮商品分类映射
const categoryMap = {
    'chinese': '中餐',
    'rainbow': '彩虹斗酒',
    'special': '特色斗酒',
    'wine': '洋酒香槟',
    'beer': '啤酒',
    'snack': '小吃系列',
    'other': '其他系列',
    'package': '优惠套餐',
    'department': '百货',
    'housekeeping': '家政',
    'soft-drink': '软饮系列'
};

// 商品类型映射
const productTypeMap = {
    'normal': { text: '普通商品', class: 'type-normal' },
    'package': { text: '套餐商品', class: 'type-package' },
    'weight': { text: '称重商品', class: 'type-weight' }
};

// 订单状态映射
const orderStatusMap = {
    'completed': { text: '已成交', class: 'status-completed' },
    'pending': { text: '待处理', class: 'status-pending' },
    'cancelled': { text: '已取消', class: 'status-cancelled' }
};

// 模拟餐饮采购订单数据（结合餐饮商品特点）
let purchaseOrderData = [
    {
        id: 'CG20250201001',
        date: '2026-02-01',
        partner: '雅安本地供应商A',
        productType: 'normal',
        productCategory: 'chinese',
        productName: '锅巴肉片',
        staff: '张三',
        remark: '中餐食材采购',
        qty: 50.00,
        amount: 3400.00,
        payable: 3400.00,
        status: 'completed',
        attachment: '1',
        recorder: '系统管理员',
        recordTime: '2026-02-01 10:25:00'
    },
    {
        id: 'CG20250201002',
        date: '2026-02-01',
        partner: '成都批发商B',
        productType: 'normal',
        productCategory: 'chinese',
        productName: '肥肠血旺',
        staff: '李四',
        remark: '',
        qty: 30.00,
        amount: 1350.00,
        payable: 1350.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-01 11:10:12'
    },
    {
        id: 'CG20250201003',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        productCategory: 'rainbow',
        productName: '彩虹斗酒套装41支',
        staff: '赵六',
        remark: '彩虹斗酒补货',
        qty: 20.00,
        amount: 3560.00,
        payable: 3000.00,
        status: 'pending',
        attachment: '2',
        recorder: '系统管理员',
        recordTime: '2026-02-01 14:05:30'
    },
    {
        id: 'CG20250201004',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        productCategory: 'rainbow',
        productName: '红尘玫瑰17支',
        staff: '钱七',
        remark: '',
        qty: 50.00,
        amount: 5900.00,
        payable: 5900.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-01 15:22:09'
    },
    {
        id: 'CG20250201005',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        productCategory: 'rainbow',
        productName: '猕猴蓝17支',
        staff: '钱七',
        remark: '',
        qty: 50.00,
        amount: 5900.00,
        payable: 5900.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-01 15:22:15'
    },
    {
        id: 'CG20250201006',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        productCategory: 'rainbow',
        productName: '草莓蜜酒17支',
        staff: '钱七',
        remark: '',
        qty: 50.00,
        amount: 5900.00,
        payable: 5900.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-01 15:22:20'
    },
    {
        id: 'CG20250201007',
        date: '2026-02-02',
        partner: '套餐供应商D',
        productType: 'package',
        productCategory: 'package',
        productName: '彩虹斗酒套餐41支',
        staff: '张三',
        remark: '套餐商品采购',
        qty: 15.00,
        amount: 2670.00,
        payable: 2500.00,
        status: 'pending',
        attachment: '1',
        recorder: '系统管理员',
        recordTime: '2026-02-02 09:15:00'
    },
    {
        id: 'CG20250201008',
        date: '2026-02-02',
        partner: '食材供应商E',
        productType: 'weight',
        productCategory: 'snack',
        productName: '小吃系列（称重）',
        staff: '李四',
        remark: '称重商品采购',
        qty: 100.50,
        amount: 1500.75,
        payable: 1500.75,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-02 10:30:00'
    },
    {
        id: 'CG20250201009',
        date: '2026-02-02',
        partner: '啤酒供应商F',
        productType: 'normal',
        productCategory: 'beer',
        productName: '啤酒系列',
        staff: '赵六',
        remark: '',
        qty: 200.00,
        amount: 4000.00,
        payable: 4000.00,
        status: 'completed',
        attachment: '0',
        recorder: '系统管理员',
        recordTime: '2026-02-02 11:45:00'
    },
    {
        id: 'CG20250201010',
        date: '2026-02-02',
        partner: '软饮供应商G',
        productType: 'normal',
        productCategory: 'soft-drink',
        productName: '软饮系列',
        staff: '钱七',
        remark: '',
        qty: 150.00,
        amount: 2250.00,
        payable: 2250.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-02 13:20:00'
    }
];

// 筛选和分页
let filteredOrders = [...purchaseOrderData];
let sortColumn = null;
let sortDirection = 'asc';
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// DOM 元素
const tbody = document.getElementById('purchaseTableBody');
const selectAll = document.getElementById('selectAll');
const bottomSelectAll = document.getElementById('bottomSelectAll');
const quickSearchInput = document.getElementById('quickSearchInput');
const quickSearchBtn = document.getElementById('quickSearchBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const jumpToPage = document.getElementById('jumpToPage');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    updateStatistics();
    renderTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
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
    document.getElementById('batchFinanceBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要处理的采购订单。');
            return;
        }
        alert('财务处理（示例）：共选择 ' + ids.length + ' 条，单号：\n' + ids.join('\n'));
    });

    document.getElementById('batchDeleteBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要删除的采购订单。');
            return;
        }
        if (!confirm('确定要删除选中的订单吗？当前仅为前端示例，不会真实删除数据。')) {
            return;
        }
        // 模拟删除
        purchaseOrderData = purchaseOrderData.filter(order => !ids.includes(order.id));
        filteredOrders = filteredOrders.filter(order => !ids.includes(order.id));
        renderTable();
        updateStatistics();
        updatePagination();
        alert('已模拟删除 ' + ids.length + ' 条记录（示例）。');
    });

    // 可点击元素
    document.addEventListener('click', function(e) {
        const orderLink = e.target.closest('.order-link');
        const statusLink = e.target.closest('.status-link');
        const viewBtn = e.target.closest('.view-btn');

        if (orderLink) {
            const id = orderLink.dataset.id;
            alert('查看订单详情（示例）\n单号：' + id);
        }

        if (statusLink) {
            const id = statusLink.dataset.id;
            const order = purchaseOrderData.find(o => o.id === id);
            alert('订单状态操作（示例）\n单号：' + id + '\n当前状态：' + orderStatusMap[order.status].text);
        }

        if (viewBtn) {
            const id = viewBtn.dataset.id;
            alert('查看订单详细信息（示例）\n单号：' + id);
        }
    });

    // 更多搜索
    document.getElementById('moreSearchBtn').addEventListener('click', function() {
        alert('更多搜索（示例）：这里可以展开高级筛选条件，如日期范围、往来单位、商品类型、商品分类、状态等。');
    });

    // 其他按钮（示例）
    document.getElementById('addOrderBtn').addEventListener('click', function() {
        alert('新增采购订单（示例）');
    });

    document.getElementById('importBtn').addEventListener('click', function() {
        alert('导入采购订单（示例）');
    });

    document.getElementById('exportBtn').addEventListener('click', function() {
        exportOrders();
    });

    document.getElementById('exportDetailBtn').addEventListener('click', function() {
        exportOrderDetails();
    });

    document.getElementById('statisticsBtn').addEventListener('click', function() {
        alert('统计功能（示例）');
    });
}

// 渲染表格
function renderTable() {
    tbody.innerHTML = '';
    
    // 计算分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredOrders.slice(start, end);

    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        
        const productType = productTypeMap[item.productType] || productTypeMap['normal'];
        const categoryName = categoryMap[item.productCategory] || item.productCategory;
        const status = orderStatusMap[item.status] || orderStatusMap['pending'];
        
        tr.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox" class="row-checkbox" data-id="${item.id}">
            </td>
            <td>
                <span class="link-text order-link" data-id="${item.id}">${item.id}</span>
            </td>
            <td>${item.date}</td>
            <td>${item.partner}</td>
            <td>
                <span class="product-type-badge ${productType.class}">${productType.text}</span>
            </td>
            <td>
                <span class="category-badge">${categoryName}</span>
            </td>
            <td>${item.productName}</td>
            <td>${item.staff}</td>
            <td>${item.remark || '-'}</td>
            <td class="text-right">${item.qty.toFixed(2)}</td>
            <td class="text-right">${item.amount.toFixed(2)}</td>
            <td class="text-right">${item.payable.toFixed(2)}</td>
            <td>
                <span class="status-pill ${status.class} status-link" data-id="${item.id}">${status.text}</span>
            </td>
            <td>${item.attachment === '0' ? '-' : item.attachment + ' 个'}</td>
            <td>${item.recorder}</td>
            <td>${item.recordTime}</td>
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
    const totalPayable = filteredOrders.reduce((sum, order) => sum + order.payable, 0);
    
    document.getElementById('totalQtyCell').textContent = totalQty.toFixed(2);
    document.getElementById('totalAmountCell').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPayableCell').textContent = totalPayable.toFixed(2);
}

// 更新统计卡片
function updateStatistics() {
    const totalQty = purchaseOrderData.reduce((sum, order) => sum + order.qty, 0);
    const totalAmount = purchaseOrderData.reduce((sum, order) => sum + order.amount, 0);
    const totalPayable = purchaseOrderData.reduce((sum, order) => sum + order.payable, 0);
    
    document.getElementById('totalQtyValue').textContent = totalQty.toFixed(2);
    document.getElementById('totalAmountValue').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPayableValue').textContent = totalPayable.toFixed(2);
}

// 排序
function sortData(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    if (column === 'date') {
        filteredOrders.sort((a, b) => {
            if (sortDirection === 'asc') {
                return a.date > b.date ? 1 : -1;
            } else {
                return a.date < b.date ? 1 : -1;
            }
        });
    }

    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
    const th = document.querySelector('th.sortable[data-sort="' + column + '"]');
    if (th) {
        th.classList.add(sortDirection);
    }

    pagination.currentPage = 1;
    renderTable();
    updatePagination();
}

// 快捷搜索
function doQuickSearch() {
    const kw = quickSearchInput.value.trim().toLowerCase();
    if (!kw) {
        filteredOrders = [...purchaseOrderData];
    } else {
        filteredOrders = purchaseOrderData.filter(order => {
            return (
                order.id.toLowerCase().includes(kw) ||
                order.partner.toLowerCase().includes(kw) ||
                order.productName.toLowerCase().includes(kw) ||
                order.staff.toLowerCase().includes(kw)
            );
        });
    }
    pagination.currentPage = 1;
    renderTable();
    updatePagination();
    updateStatistics();
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
        ['单号', '日期', '往来单位', '商品类型', '商品分类', '商品名称', '员工', '数量', '进货金额', '应付余额', '订单状态'].join(','),
        ...filteredOrders.map(order => {
            const productType = productTypeMap[order.productType] || productTypeMap['normal'];
            const categoryName = categoryMap[order.productCategory] || order.productCategory;
            const status = orderStatusMap[order.status] || orderStatusMap['pending'];
            return [
                order.id,
                order.date,
                order.partner,
                productType.text,
                categoryName,
                order.productName,
                order.staff,
                order.qty.toFixed(2),
                order.amount.toFixed(2),
                order.payable.toFixed(2),
                status.text
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `采购订单列表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 导出订单详情
function exportOrderDetails() {
    alert('导出订单详情（示例）：包含更详细的订单信息。');
}
