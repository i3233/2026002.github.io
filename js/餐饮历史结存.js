// 餐饮历史结存页面交互逻辑

// 模拟历史结存数据
const historySettlementData = [
    {
        date: '2026-02-01',
        productCount: 8,
        beginningAmount: 25000.00,
        inAmount: 12500.00,
        outAmount: 18500.00,
        endingAmount: 19000.00
    },
    {
        date: '2026-01-31',
        productCount: 8,
        beginningAmount: 22000.00,
        inAmount: 11000.00,
        outAmount: 16000.00,
        endingAmount: 17000.00
    },
    {
        date: '2026-01-30',
        productCount: 8,
        beginningAmount: 20000.00,
        inAmount: 10000.00,
        outAmount: 15000.00,
        endingAmount: 15000.00
    },
    {
        date: '2026-01-29',
        productCount: 7,
        beginningAmount: 18000.00,
        inAmount: 9000.00,
        outAmount: 14000.00,
        endingAmount: 13000.00
    },
    {
        date: '2026-01-28',
        productCount: 7,
        beginningAmount: 16000.00,
        inAmount: 8000.00,
        outAmount: 12000.00,
        endingAmount: 12000.00
    }
];

// 当前状态
let filteredData = [...historySettlementData];
let currentPage = 1;
let pageSize = 20;
let sortColumn = null;
let sortDirection = 'asc';

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
    document.getElementById('queryBtn').addEventListener('click', loadHistoryData);
    document.getElementById('exportBtn').addEventListener('click', exportHistory);
    document.getElementById('refreshBtn').addEventListener('click', loadHistoryData);
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
    loadHistoryData();
}

// 加载历史数据
function loadHistoryData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // 筛选数据
    filteredData = historySettlementData.filter(item => {
        if (startDate && item.date < startDate) {
            return false;
        }
        if (endDate && item.date > endDate) {
            return false;
        }
        return true;
    });

    // 渲染表格
    renderTable();
}

// 排序数据
function sortData() {
    if (!sortColumn) return;

    filteredData.sort((a, b) => {
        let valueA, valueB;
        if (sortColumn === 'date') {
            valueA = new Date(a.date);
            valueB = new Date(b.date);
        } else {
            valueA = a[sortColumn];
            valueB = b[sortColumn];
        }

        if (sortColumn === 'date') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
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
    const tbody = document.getElementById('historyTableBody');
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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
        updatePagination(totalPages);
        updateTableFooter();
        return;
    }

    pageData.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="text-center">${start + index + 1}</td>
            <td>${item.date}</td>
            <td class="text-right">${item.productCount}</td>
            <td class="text-right">¥${item.beginningAmount.toFixed(2)}</td>
            <td class="text-right">¥${item.inAmount.toFixed(2)}</td>
            <td class="text-right">¥${item.outAmount.toFixed(2)}</td>
            <td class="text-right">¥${item.endingAmount.toFixed(2)}</td>
            <td>
                <button class="history-settlement-action-btn view-detail-btn" data-date="${item.date}">查看详情</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 绑定查看详情事件
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const date = this.dataset.date;
            showDetail(date);
        });
    });

    // 更新合计
    updateTableFooter();
    
    // 更新分页
    updatePagination(totalPages);
}

// 显示详情
function showDetail(date) {
    const item = historySettlementData.find(d => d.date === date);
    if (!item) {
        alert('未找到该日期的结存记录');
        return;
    }

    document.getElementById('detailModalTitle').textContent = `结存详情 - ${date}`;
    
    // 生成详情内容（这里可以显示该日期的商品明细）
    const detailHtml = `
        <div style="margin-bottom: var(--spacing-lg);">
            <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">结存汇总</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">结存日期</td>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">${item.date}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">商品总数</td>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">${item.productCount}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">期初库存金额</td>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">¥${item.beginningAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">本期入库金额</td>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">¥${item.inAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">本期出库金额</td>
                    <td style="padding: var(--spacing-sm); border-bottom: 1px solid var(--color-neutral-200);">¥${item.outAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: var(--spacing-sm);">期末库存金额</td>
                    <td style="padding: var(--spacing-sm);">¥${item.endingAmount.toFixed(2)}</td>
                </tr>
            </table>
        </div>
        <div>
            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">注：商品明细数据需要从当日结存单中查询</p>
        </div>
    `;

    document.getElementById('detailModalContent').innerHTML = detailHtml;
    document.getElementById('detailModal').style.display = 'block';
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 更新表格底部合计
function updateTableFooter() {
    const totalProductCount = filteredData.reduce((sum, item) => sum + item.productCount, 0);
    const totalBeginningAmount = filteredData.reduce((sum, item) => sum + item.beginningAmount, 0);
    const totalInAmount = filteredData.reduce((sum, item) => sum + item.inAmount, 0);
    const totalOutAmount = filteredData.reduce((sum, item) => sum + item.outAmount, 0);
    const totalEndingAmount = filteredData.reduce((sum, item) => sum + item.endingAmount, 0);

    document.getElementById('totalProductCount').textContent = totalProductCount;
    document.getElementById('totalBeginningAmount').textContent = '¥' + totalBeginningAmount.toFixed(2);
    document.getElementById('totalInAmount').textContent = '¥' + totalInAmount.toFixed(2);
    document.getElementById('totalOutAmount').textContent = '¥' + totalOutAmount.toFixed(2);
    document.getElementById('totalEndingAmount').textContent = '¥' + totalEndingAmount.toFixed(2);
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
        firstBtn.className = 'history-settlement-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            renderTable();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'history-settlement-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'history-settlement-pagination-page-btn' + (i === currentPage ? ' active' : '');
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
            ellipsis.className = 'history-settlement-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'history-settlement-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            renderTable();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 导出历史记录
function exportHistory() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const csv = [
        ['结存日期', '商品总数', '期初库存金额', '本期入库金额', '本期出库金额', '期末库存金额'].join(','),
        ...filteredData.map(item => {
            return [
                item.date,
                item.productCount,
                item.beginningAmount.toFixed(2),
                item.inAmount.toFixed(2),
                item.outAmount.toFixed(2),
                item.endingAmount.toFixed(2)
            ].join(',');
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `历史结存_${startDate}_${endDate}.csv`;
    link.click();
}

// 全局函数
window.closeDetailModal = closeDetailModal;
