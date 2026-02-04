// 餐饮采购退货记录页面交互逻辑

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

// 模拟餐饮采购退货数据（结合餐饮商品特点）
let purchaseReturnData = [
    {
        id: 'TH20250201001',
        date: '2026-02-01',
        partner: '雅安本地供应商A',
        productType: 'normal',
        productCategory: 'chinese',
        productName: '锅巴肉片',
        staff: '张三',
        remark: '质量问题退货',
        qty: 5.00,
        amount: 340.00,
        payable: -340.00,
        status: 'completed',
        attachment: '1',
        recorder: '系统管理员',
        recordTime: '2026-02-01 10:25:00'
    },
    {
        id: 'TH20250201002',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        productCategory: 'rainbow',
        productName: '彩虹斗酒套装41支',
        staff: '李四',
        remark: '',
        qty: 2.00,
        amount: 356.00,
        payable: -356.00,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-01 11:10:12'
    },
    {
        id: 'TH20250201003',
        date: '2026-02-02',
        partner: '套餐供应商D',
        productType: 'package',
        productCategory: 'package',
        productName: '彩虹斗酒套餐41支',
        staff: '赵六',
        remark: '套餐商品退货',
        qty: 1.00,
        amount: 178.00,
        payable: -178.00,
        status: 'pending',
        attachment: '0',
        recorder: '系统管理员',
        recordTime: '2026-02-02 09:15:00'
    },
    {
        id: 'TH20250201004',
        date: '2026-02-02',
        partner: '食材供应商E',
        productType: 'weight',
        productCategory: 'snack',
        productName: '小吃系列（称重）',
        staff: '钱七',
        remark: '',
        qty: 10.50,
        amount: 156.75,
        payable: -156.75,
        status: 'completed',
        attachment: '0',
        recorder: '王五',
        recordTime: '2026-02-02 10:30:00'
    }
];

// 筛选和分页
let filteredReturns = [...purchaseReturnData];
let sortColumn = null;
let sortDirection = 'asc';
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// DOM 元素
const tbody = document.getElementById('returnTableBody');
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
            alert('请先勾选需要处理的退货订单。');
            return;
        }
        alert('财务处理（示例）：共选择 ' + ids.length + ' 条，单号：\n' + ids.join('\n'));
    });

    document.getElementById('batchDeleteBtn').addEventListener('click', function() {
        const ids = getSelectedIds();
        if (!ids.length) {
            alert('请先勾选需要删除的退货订单。');
            return;
        }
        if (!confirm('确定要删除选中的订单吗？当前仅为前端示例，不会真实删除数据。')) {
            return;
        }
        // 模拟删除
        purchaseReturnData = purchaseReturnData.filter(order => !ids.includes(order.id));
        filteredReturns = filteredReturns.filter(order => !ids.includes(order.id));
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
            alert('查看退货单详情（示例）\n单号：' + id);
        }

        if (statusLink) {
            const id = statusLink.dataset.id;
            const order = purchaseReturnData.find(o => o.id === id);
            alert('订单状态操作（示例）\n单号：' + id + '\n当前状态：' + orderStatusMap[order.status].text);
        }

        if (viewBtn) {
            const id = viewBtn.dataset.id;
            alert('查看退货记录详细信息（示例）\n单号：' + id);
        }
    });

    // 更多搜索
    document.getElementById('moreSearchBtn').addEventListener('click', function() {
        alert('更多搜索（示例）：这里可以展开高级筛选条件，如退货日期范围、往来单位、商品类型、商品分类、状态等。');
    });

    // 其他按钮（示例）
    document.getElementById('addReturnBtn').addEventListener('click', function() {
        alert('新增采购退货（示例）');
    });

    document.getElementById('exportBtn').addEventListener('click', function() {
        exportReturns();
    });

    document.getElementById('exportDetailBtn').addEventListener('click', function() {
        alert('导出退货详情（示例）');
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
    const pageData = filteredReturns.slice(start, end);

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
    const totalQty = filteredReturns.reduce((sum, order) => sum + order.qty, 0);
    const totalAmount = filteredReturns.reduce((sum, order) => sum + order.amount, 0);
    const totalPayable = filteredReturns.reduce((sum, order) => sum + order.payable, 0);
    
    document.getElementById('totalQtyCell').textContent = totalQty.toFixed(2);
    document.getElementById('totalAmountCell').textContent = totalAmount.toFixed(2);
    document.getElementById('totalPayableCell').textContent = totalPayable.toFixed(2);
}

// 更新统计卡片
function updateStatistics() {
    const totalQty = purchaseReturnData.reduce((sum, order) => sum + order.qty, 0);
    const totalAmount = purchaseReturnData.reduce((sum, order) => sum + order.amount, 0);
    const totalPayable = purchaseReturnData.reduce((sum, order) => sum + order.payable, 0);
    
    document.getElementById('totalReturnQtyValue').textContent = totalQty.toFixed(2);
    document.getElementById('totalReturnAmountValue').textContent = totalAmount.toFixed(2);
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
        filteredReturns.sort((a, b) => {
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
        filteredReturns = [...purchaseReturnData];
    } else {
        filteredReturns = purchaseReturnData.filter(order => {
            return (
                order.id.toLowerCase().includes(kw) ||
                order.partner.toLowerCase().includes(kw) ||
                order.productName.toLowerCase().includes(kw) ||
                (order.staff && order.staff.toLowerCase().includes(kw))
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
    pagination.total = filteredReturns.length;
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

// 导出退货
function exportReturns() {
    const csv = [
        ['单号', '日期', '往来单位', '商品类型', '商品分类', '商品名称', '数量', '退货金额', '应付余额', '订单状态'].join(','),
        ...filteredReturns.map(order => {
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
    link.download = `采购退货记录_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}
