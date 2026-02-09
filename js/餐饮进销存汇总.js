// 餐饮进销存汇总页面交互逻辑

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

// 模拟进销存汇总数据
const inventorySummaryData = [
    {
        id: 1,
        name: '锅巴肉片',
        type: 'normal',
        category: 'chinese',
        categoryName: '中餐',
        unit: '份',
        beginningQty: 50,
        purchaseQty: 150,
        purchaseAmount: 10200.00,
        salesQty: 180,
        salesAmount: 18360.00,
        returnQty: 5,
        returnAmount: 340.00,
        endingQty: 15
    },
    {
        id: 2,
        name: '肥肠血旺',
        type: 'normal',
        category: 'chinese',
        categoryName: '中餐',
        unit: '份',
        beginningQty: 40,
        purchaseQty: 120,
        purchaseAmount: 5400.00,
        salesQty: 140,
        salesAmount: 9450.00,
        returnQty: 3,
        returnAmount: 135.00,
        endingQty: 17
    },
    {
        id: 3,
        name: '彩虹斗酒套装41支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 20,
        purchaseQty: 60,
        purchaseAmount: 10680.00,
        salesQty: 55,
        salesAmount: 14685.00,
        returnQty: 2,
        returnAmount: 356.00,
        endingQty: 23
    },
    {
        id: 4,
        name: '红尘玫瑰17支',
        type: 'normal',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        unit: '套',
        beginningQty: 30,
        purchaseQty: 80,
        purchaseAmount: 9440.00,
        salesQty: 95,
        salesAmount: 16815.00,
        returnQty: 1,
        returnAmount: 118.00,
        endingQty: 14
    },
    {
        id: 5,
        name: '优惠套餐A',
        type: 'package',
        category: 'package',
        categoryName: '优惠套餐',
        unit: '份',
        beginningQty: 15,
        purchaseQty: 50,
        purchaseAmount: 4000.00,
        salesQty: 48,
        salesAmount: 5760.00,
        returnQty: 1,
        returnAmount: 80.00,
        endingQty: 16
    }
];

// 当前状态
let filteredData = [...inventorySummaryData];
let currentPage = 1;
let pageSize = 20;
let currentProductType = '';
let currentCategory = '';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // 设置默认日期（最近30天）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];

    // 绑定事件
    document.getElementById('queryBtn').addEventListener('click', loadSummaryData);
    document.getElementById('printBtn').addEventListener('click', printSummary);
    document.getElementById('exportBtn').addEventListener('click', exportSummary);
    document.getElementById('refreshBtn').addEventListener('click', loadSummaryData);
    document.getElementById('pageSizeSelect').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        renderTable();
    });

    // 加载数据
    loadSummaryData();
}

// 加载汇总数据
function loadSummaryData() {
    // 获取筛选条件
    currentProductType = document.getElementById('productTypeSelect').value;
    currentCategory = document.getElementById('categorySelect').value;

    // 筛选数据
    filteredData = inventorySummaryData.filter(item => {
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
    const totalPurchaseAmount = filteredData.reduce((sum, item) => sum + item.purchaseAmount, 0);
    const totalSalesAmount = filteredData.reduce((sum, item) => sum + item.salesAmount, 0);
    const totalReturnAmount = filteredData.reduce((sum, item) => sum + item.returnAmount, 0);
    const netProfit = totalSalesAmount - totalPurchaseAmount - totalReturnAmount;

    document.getElementById('totalPurchaseAmount').textContent = '¥' + totalPurchaseAmount.toFixed(2);
    document.getElementById('totalSalesAmount').textContent = '¥' + totalSalesAmount.toFixed(2);
    document.getElementById('totalReturnAmount').textContent = '¥' + totalReturnAmount.toFixed(2);
    document.getElementById('netProfit').textContent = '¥' + netProfit.toFixed(2);
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('summaryTableBody');
    tbody.innerHTML = '';

    // 分页
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
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
            <td class="text-right">${item.purchaseQty}</td>
            <td class="text-right">¥${item.purchaseAmount.toFixed(2)}</td>
            <td class="text-right">${item.salesQty}</td>
            <td class="text-right">¥${item.salesAmount.toFixed(2)}</td>
            <td class="text-right">${item.returnQty}</td>
            <td class="text-right">¥${item.returnAmount.toFixed(2)}</td>
            <td class="text-right">${item.endingQty}</td>
            <td class="text-right">${item.unit}</td>
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
    const totalPurchaseQty = filteredData.reduce((sum, item) => sum + item.purchaseQty, 0);
    const totalPurchaseAmount = filteredData.reduce((sum, item) => sum + item.purchaseAmount, 0);
    const totalSalesQty = filteredData.reduce((sum, item) => sum + item.salesQty, 0);
    const totalSalesAmount = filteredData.reduce((sum, item) => sum + item.salesAmount, 0);
    const totalReturnQty = filteredData.reduce((sum, item) => sum + item.returnQty, 0);
    const totalReturnAmount = filteredData.reduce((sum, item) => sum + item.returnAmount, 0);
    const totalEndingQty = filteredData.reduce((sum, item) => sum + item.endingQty, 0);

    document.getElementById('totalBeginningQty').textContent = totalBeginningQty;
    document.getElementById('totalPurchaseQty').textContent = totalPurchaseQty;
    document.getElementById('totalPurchaseAmount').textContent = '¥' + totalPurchaseAmount.toFixed(2);
    document.getElementById('totalSalesQty').textContent = totalSalesQty;
    document.getElementById('totalSalesAmount').textContent = '¥' + totalSalesAmount.toFixed(2);
    document.getElementById('totalReturnQty').textContent = totalReturnQty;
    document.getElementById('totalReturnAmount').textContent = '¥' + totalReturnAmount.toFixed(2);
    document.getElementById('totalEndingQty').textContent = totalEndingQty;
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
        firstBtn.className = 'inventory-summary-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            renderTable();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'inventory-summary-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'inventory-summary-pagination-page-btn' + (i === currentPage ? ' active' : '');
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
            ellipsis.className = 'inventory-summary-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'inventory-summary-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            renderTable();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 打印报表
function printSummary() {
    window.print();
}

// 导出报表
function exportSummary() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const csv = [
        ['商品名称', '商品类型', '分类', '期初库存', '进货数量', '进货金额', '销售数量', '销售金额', '退货数量', '退货金额', '期末库存', '单位'].join(','),
        ...filteredData.map(item => {
            return [
                item.name,
                productTypeMap[item.type] || item.type,
                item.categoryName,
                item.beginningQty,
                item.purchaseQty,
                item.purchaseAmount.toFixed(2),
                item.salesQty,
                item.salesAmount.toFixed(2),
                item.returnQty,
                item.returnAmount.toFixed(2),
                item.endingQty,
                item.unit
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `进销存汇总_${startDate}_${endDate}.csv`;
    link.click();
}
