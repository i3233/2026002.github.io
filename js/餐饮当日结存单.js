// 餐饮当日结存单页面交互逻辑

// 商品分类映射
const categoryMap = {
    'chinese': '中餐',
    'rainbow': '彩虹斗酒',
    'special': '特色斗酒',
    'wine': '洋酒香槟',
    'beer': '啤酒',
    'snack': '小吃系列',
    'other': '其他系列',
    'package': '优惠套餐'
};

// 商品类型映射
const productTypeMap = {
    'normal': '普通商品',
    'package': '套餐商品',
    'weight': '称重商品'
};

// 模拟当日结存数据（餐饮商品）
const dailyStatementData = [
    {
        id: 1,
        name: '锅巴肉片',
        type: 'normal',
        category: 'chinese',
        categoryName: '中餐',
        unit: '份',
        beginningQty: 50,
        beginningAmount: 3400.00,
        inQty: 30,
        outQty: 45,
        endingQty: 35,
        avgCost: 68.00,
        inventoryAmount: 2380.00
    },
    {
        id: 2,
        name: '肥肠血旺',
        type: 'normal',
        category: 'chinese',
        categoryName: '中餐',
        unit: '份',
        beginningQty: 40,
        beginningAmount: 1800.00,
        inQty: 25,
        outQty: 35,
        endingQty: 30,
        avgCost: 45.00,
        inventoryAmount: 1350.00
    },
    {
        id: 3,
        name: '彩虹斗酒套装41支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 20,
        beginningAmount: 3560.00,
        inQty: 15,
        outQty: 12,
        endingQty: 23,
        avgCost: 178.00,
        inventoryAmount: 4094.00
    },
    {
        id: 4,
        name: '红尘玫瑰17支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 30,
        beginningAmount: 3540.00,
        inQty: 20,
        outQty: 25,
        endingQty: 25,
        avgCost: 118.00,
        inventoryAmount: 2950.00
    },
    {
        id: 5,
        name: '猕猴蓝17支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 25,
        beginningAmount: 2950.00,
        inQty: 18,
        outQty: 20,
        endingQty: 23,
        avgCost: 118.00,
        inventoryAmount: 2714.00
    },
    {
        id: 6,
        name: '草莓蜜酒17支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 28,
        beginningAmount: 3304.00,
        inQty: 15,
        outQty: 18,
        endingQty: 25,
        avgCost: 118.00,
        inventoryAmount: 2950.00
    },
    {
        id: 7,
        name: '特色套餐A',
        type: 'package',
        category: 'package',
        categoryName: '优惠套餐',
        unit: '份',
        beginningQty: 15,
        beginningAmount: 1200.00,
        inQty: 10,
        outQty: 12,
        endingQty: 13,
        avgCost: 80.00,
        inventoryAmount: 1040.00
    },
    {
        id: 8,
        name: '特色套餐B',
        type: 'package',
        category: 'package',
        categoryName: '优惠套餐',
        unit: '份',
        beginningQty: 12,
        beginningAmount: 1080.00,
        inQty: 8,
        outQty: 10,
        endingQty: 10,
        avgCost: 90.00,
        inventoryAmount: 900.00
    }
];

// 当前状态
let filteredData = [...dailyStatementData];
let currentPage = 1;
let pageSize = 20;
let sortColumn = null;
let sortDirection = 'asc';
let currentProductType = '';
let currentCategory = '';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('statementDate').value = today;

    // 绑定事件
    document.getElementById('queryBtn').addEventListener('click', loadStatementData);
    document.getElementById('printBtn').addEventListener('click', printStatement);
    document.getElementById('exportBtn').addEventListener('click', exportStatement);
    document.getElementById('refreshBtn').addEventListener('click', loadStatementData);
    document.getElementById('pageSizeSelect').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        renderTable();
    });

    // 排序
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.dataset.sort;
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            updateSortUI();
            sortData();
            renderTable();
        });
    });

    // 加载数据
    loadStatementData();
}

// 加载结存数据
function loadStatementData() {
    // 获取筛选条件
    currentProductType = document.getElementById('productTypeSelect').value;
    currentCategory = document.getElementById('categorySelect').value;

    // 筛选数据
    filteredData = dailyStatementData.filter(item => {
        if (currentProductType && item.type !== currentProductType) {
            return false;
        }
        if (currentCategory && item.category !== currentCategory) {
            return false;
        }
        return true;
    });

    // 计算统计数据
    calculateStatistics();
    
    // 渲染表格
    renderTable();
}

// 计算统计数据
function calculateStatistics() {
    // 今日进货统计（模拟数据）
    const purchaseOrderCount = 5;
    const purchaseQty = filteredData.reduce((sum, item) => sum + item.inQty, 0);
    const purchaseAmount = filteredData.reduce((sum, item) => sum + (item.inQty * item.avgCost), 0);
    const returnOrderCount = 1;
    const returnQty = 5;
    const returnAmount = 340.00;
    const netPurchaseAmount = purchaseAmount - returnAmount;

    // 今日销售统计（模拟数据）
    const salesOrderCount = 28;
    const salesQty = filteredData.reduce((sum, item) => sum + item.outQty, 0);
    const salesAmount = filteredData.reduce((sum, item) => sum + (item.outQty * item.avgCost * 1.5), 0); // 销售价假设是成本价的1.5倍
    const salesReturnOrderCount = 1;
    const salesReturnQty = 2;
    const salesReturnAmount = 150.00;
    const netSalesAmount = salesAmount - salesReturnAmount;

    // 库存统计
    const beginningInventoryQty = filteredData.reduce((sum, item) => sum + item.beginningQty, 0);
    const beginningInventoryAmount = filteredData.reduce((sum, item) => sum + item.beginningAmount, 0);
    const currentInQty = filteredData.reduce((sum, item) => sum + item.inQty, 0);
    const currentOutQty = filteredData.reduce((sum, item) => sum + item.outQty, 0);
    const endingInventoryQty = filteredData.reduce((sum, item) => sum + item.endingQty, 0);
    const endingInventoryAmount = filteredData.reduce((sum, item) => sum + item.inventoryAmount, 0);

    // 更新统计摘要
    document.getElementById('todayPurchaseAmount').textContent = '¥' + purchaseAmount.toFixed(2);
    document.getElementById('todayPurchaseChange').textContent = '较昨日: +' + (purchaseAmount * 0.1).toFixed(2);
    document.getElementById('todaySalesAmount').textContent = '¥' + salesAmount.toFixed(2);
    document.getElementById('todaySalesChange').textContent = '较昨日: +' + (salesAmount * 0.15).toFixed(2);
    document.getElementById('currentInventoryQty').textContent = endingInventoryQty;
    document.getElementById('currentInventoryChange').textContent = '库存金额: ¥' + endingInventoryAmount.toFixed(2);
    document.getElementById('currentInventoryAmount').textContent = '¥' + endingInventoryAmount.toFixed(2);
    document.getElementById('currentInventoryAmountChange').textContent = '较昨日: +' + ((endingInventoryAmount - beginningInventoryAmount) * 0.05).toFixed(2);

    // 更新进存销统计
    document.getElementById('purchaseOrderCount').textContent = purchaseOrderCount;
    document.getElementById('purchaseQty').textContent = purchaseQty;
    document.getElementById('purchaseAmount').textContent = '¥' + purchaseAmount.toFixed(2);
    document.getElementById('returnOrderCount').textContent = returnOrderCount;
    document.getElementById('returnQty').textContent = returnQty;
    document.getElementById('returnAmount').textContent = '¥' + returnAmount.toFixed(2);
    document.getElementById('netPurchaseAmount').textContent = '¥' + netPurchaseAmount.toFixed(2);

    document.getElementById('salesOrderCount').textContent = salesOrderCount;
    document.getElementById('salesQty').textContent = salesQty;
    document.getElementById('salesAmount').textContent = '¥' + salesAmount.toFixed(2);
    document.getElementById('salesReturnOrderCount').textContent = salesReturnOrderCount;
    document.getElementById('salesReturnQty').textContent = salesReturnQty;
    document.getElementById('salesReturnAmount').textContent = '¥' + salesReturnAmount.toFixed(2);
    document.getElementById('netSalesAmount').textContent = '¥' + netSalesAmount.toFixed(2);

    document.getElementById('beginningInventoryQty').textContent = beginningInventoryQty;
    document.getElementById('beginningInventoryAmount').textContent = '¥' + beginningInventoryAmount.toFixed(2);
    document.getElementById('currentInQty').textContent = currentInQty;
    document.getElementById('currentOutQty').textContent = currentOutQty;
    document.getElementById('endingInventoryQty').textContent = endingInventoryQty;
    document.getElementById('endingInventoryAmount').textContent = '¥' + endingInventoryAmount.toFixed(2);
}

// 排序数据
function sortData() {
    if (!sortColumn) return;

    filteredData.sort((a, b) => {
        let valueA, valueB;
        if (sortColumn === 'inventory') {
            valueA = a.endingQty;
            valueB = b.endingQty;
        } else {
            valueA = a[sortColumn];
            valueB = b[sortColumn];
        }

        if (typeof valueA === 'string') {
            return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
    });
}

// 更新排序UI
function updateSortUI() {
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
        if (th.dataset.sort === sortColumn) {
            th.classList.add(sortDirection);
        }
    });
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('statementTableBody');
    tbody.innerHTML = '';

    // 排序
    if (sortColumn) {
        sortData();
    }

    // 分页
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
        updatePagination(totalPages);
        updateTableFooter();
        return;
    }

    pageData.forEach((item, index) => {
        const tr = document.createElement('tr');
        const typeClass = item.type === 'normal' ? 'type-normal' : item.type === 'package' ? 'type-package' : 'type-weight';
        
        tr.innerHTML = `
            <td class="text-center">${start + index + 1}</td>
            <td>${item.name}</td>
            <td><span class="product-type-badge ${typeClass}">${productTypeMap[item.type] || item.type}</span></td>
            <td><span class="category-badge">${item.categoryName}</span></td>
            <td class="text-right">${item.beginningQty}</td>
            <td class="text-right">${item.inQty}</td>
            <td class="text-right">${item.outQty}</td>
            <td class="text-right">${item.endingQty}</td>
            <td class="text-right">${item.unit}</td>
            <td class="text-right">¥${item.avgCost.toFixed(2)}</td>
            <td class="text-right">¥${item.inventoryAmount.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    // 更新合计
    updateTableFooter();
    
    // 更新分页
    updatePagination(totalPages);
}

// 更新表格底部合计
function updateTableFooter() {
    const totalBeginningQty = filteredData.reduce((sum, item) => sum + item.beginningQty, 0);
    const totalInQty = filteredData.reduce((sum, item) => sum + item.inQty, 0);
    const totalOutQty = filteredData.reduce((sum, item) => sum + item.outQty, 0);
    const totalEndingQty = filteredData.reduce((sum, item) => sum + item.endingQty, 0);
    const totalInventoryAmount = filteredData.reduce((sum, item) => sum + item.inventoryAmount, 0);

    document.getElementById('totalBeginningQty').textContent = totalBeginningQty;
    document.getElementById('totalInQty').textContent = totalInQty;
    document.getElementById('totalOutQty').textContent = totalOutQty;
    document.getElementById('totalEndingQty').textContent = totalEndingQty;
    document.getElementById('totalInventoryAmount').textContent = '¥' + totalInventoryAmount.toFixed(2);
}

// 更新分页
function updatePagination(totalPages) {
    document.getElementById('totalRecords').textContent = filteredData.length;
    
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    prevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    };

    nextBtn.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    };

    // 页码按钮
    const paginationPages = document.getElementById('paginationPages');
    paginationPages.innerHTML = '';
    
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'daily-settlement-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            renderTable();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'daily-settlement-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'daily-settlement-pagination-page-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        paginationPages.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'daily-settlement-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'daily-settlement-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            renderTable();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 打印报表
function printStatement() {
    window.print();
}

// 导出报表
function exportStatement() {
    const csv = [
        ['商品名称', '商品类型', '分类', '期初库存', '本期入库', '本期出库', '期末库存', '单位', '平均成本', '库存金额'].join(','),
        ...filteredData.map(item => {
            return [
                item.name,
                productTypeMap[item.type] || item.type,
                item.categoryName,
                item.beginningQty,
                item.inQty,
                item.outQty,
                item.endingQty,
                item.unit,
                item.avgCost.toFixed(2),
                item.inventoryAmount.toFixed(2)
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const date = document.getElementById('statementDate').value || new Date().toISOString().split('T')[0];
    link.download = `当日结存单_${date}.csv`;
    link.click();
}
