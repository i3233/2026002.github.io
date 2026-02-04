// 导购业绩页面交互逻辑

// 业绩数据
let performanceData = [
    {
        id: 1,
        guideId: 1,
        guideName: '王小明',
        guideCode: 'G001',
        orderCount: 125,
        totalAmount: 15680.50,
        avgOrderAmount: 125.44,
        commission: 784.03,
        commissionRate: 5.0
    },
    {
        id: 2,
        guideId: 2,
        guideName: '赵小刚',
        guideCode: 'G002',
        orderCount: 98,
        totalAmount: 12450.00,
        avgOrderAmount: 127.04,
        commission: 622.50,
        commissionRate: 5.0
    },
    {
        id: 3,
        guideId: 3,
        guideName: '张小华',
        guideCode: 'G003',
        orderCount: 156,
        totalAmount: 18920.00,
        avgOrderAmount: 121.28,
        commission: 946.00,
        commissionRate: 5.0
    },
    {
        id: 4,
        guideId: 4,
        guideName: '李小红',
        guideCode: 'G004',
        orderCount: 87,
        totalAmount: 10890.00,
        avgOrderAmount: 125.17,
        commission: 544.50,
        commissionRate: 5.0
    },
];

// 筛选条件
let filters = {
    startDate: '',
    endDate: '',
    guideId: ''
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    setDefaultDates();
    renderPerformanceTable();
    updateSummary();
});

// 初始化事件监听
function initEventListeners() {
    // 查询按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            applyFilters();
        });
    }

    // 导出报表按钮
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportReport();
        });
    }
}

// 设置默认日期
function setDefaultDates() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 7);
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.value = yesterday.toISOString().split('T')[0];
    }
    if (endDateInput) {
        endDateInput.value = today.toISOString().split('T')[0];
    }
}

// 应用筛选
function applyFilters() {
    filters.startDate = document.getElementById('startDate').value;
    filters.endDate = document.getElementById('endDate').value;
    filters.guideId = document.getElementById('guideFilter').value;
    
    renderPerformanceTable();
    updateSummary();
}

// 渲染业绩表格
function renderPerformanceTable() {
    const tableBody = document.getElementById('performanceTableBody');
    if (!tableBody) return;

    // 过滤数据
    let filteredData = performanceData;

    if (filters.guideId) {
        filteredData = filteredData.filter(p => p.guideId == filters.guideId);
    }

    // 按销售额排序
    filteredData.sort((a, b) => b.totalAmount - a.totalAmount);

    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无业绩数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = filteredData.map((data, index) => {
        const rank = index + 1;
        let rankClass = 'performance-rank';
        if (rank === 1) rankClass += ' performance-rank-top1';
        else if (rank === 2) rankClass += ' performance-rank-top2';
        else if (rank === 3) rankClass += ' performance-rank-top3';

        return `
            <tr>
                <td>
                    <span class="${rankClass}">${rank}</span>
                </td>
                <td>${data.guideName}</td>
                <td>${data.guideCode}</td>
                <td>${data.orderCount}</td>
                <td class="performance-amount">¥${data.totalAmount.toFixed(2)}</td>
                <td>¥${data.avgOrderAmount.toFixed(2)}</td>
                <td class="performance-commission">¥${data.commission.toFixed(2)}</td>
                <td>
                    <span class="performance-percentage">${data.commissionRate}%</span>
                </td>
                <td>
                    <button class="performance-btn performance-btn-text" onclick="viewPerformanceDetail(${data.id})">详情</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新汇总数据
function updateSummary() {
    let filteredData = performanceData;

    if (filters.guideId) {
        filteredData = filteredData.filter(p => p.guideId == filters.guideId);
    }

    const guideCount = new Set(filteredData.map(p => p.guideId)).size;
    const totalOrderCount = filteredData.reduce((sum, p) => sum + p.orderCount, 0);
    const totalAmount = filteredData.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCommission = filteredData.reduce((sum, p) => sum + p.commission, 0);

    document.getElementById('summaryGuideCount').textContent = guideCount;
    document.getElementById('summaryOrderCount').textContent = totalOrderCount;
    document.getElementById('summaryTotalAmount').textContent = `¥${totalAmount.toFixed(2)}`;
    document.getElementById('summaryCommission').textContent = `¥${totalCommission.toFixed(2)}`;
}

// 查看业绩详情
function viewPerformanceDetail(performanceId) {
    const performance = performanceData.find(p => p.id === performanceId);
    if (!performance) return;

    const detailInfo = document.getElementById('performanceDetailInfo');
    const detailTitle = document.getElementById('performanceDetailTitle');
    
    if (detailTitle) {
        detailTitle.textContent = `${performance.guideName} - 业绩详情`;
    }

    if (detailInfo) {
        detailInfo.innerHTML = `
            <div class="performance-detail-section">
                <div class="performance-detail-section-title">基本信息</div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">导购员：</div>
                    <div class="performance-detail-value">${performance.guideName} (${performance.guideCode})</div>
                </div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">统计时间：</div>
                    <div class="performance-detail-value">${filters.startDate || '全部'} 至 ${filters.endDate || '全部'}</div>
                </div>
            </div>

            <div class="performance-detail-section">
                <div class="performance-detail-section-title">业绩统计</div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">订单数量：</div>
                    <div class="performance-detail-value">${performance.orderCount} 单</div>
                </div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">销售额：</div>
                    <div class="performance-detail-value" style="color: var(--color-primary); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">¥${performance.totalAmount.toFixed(2)}</div>
                </div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">平均客单价：</div>
                    <div class="performance-detail-value">¥${performance.avgOrderAmount.toFixed(2)}</div>
                </div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">提成比例：</div>
                    <div class="performance-detail-value">${performance.commissionRate}%</div>
                </div>
                <div class="performance-detail-row">
                    <div class="performance-detail-label">提成金额：</div>
                    <div class="performance-detail-value" style="color: var(--color-success); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">¥${performance.commission.toFixed(2)}</div>
                </div>
            </div>

            <div class="performance-detail-section">
                <div class="performance-detail-section-title">订单明细</div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm); padding: var(--spacing-md);">
                    订单明细功能待实现
                </div>
            </div>
        `;
    }

    // 保存当前查看的业绩ID
    window.currentViewPerformanceId = performanceId;

    const modal = document.getElementById('performanceDetailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭业绩详情弹窗
function closePerformanceDetailModal() {
    const modal = document.getElementById('performanceDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 导出报表
function exportReport() {
    console.log('导出业绩报表');
    
    // 生成CSV内容
    let csvContent = '排名,导购员,工号,订单数,销售额,平均客单价,提成金额,提成比例\n';
    
    let filteredData = performanceData;
    if (filters.guideId) {
        filteredData = filteredData.filter(p => p.guideId == filters.guideId);
    }
    
    filteredData.sort((a, b) => b.totalAmount - a.totalAmount);
    
    filteredData.forEach((data, index) => {
        csvContent += `${index + 1},${data.guideName},${data.guideCode},${data.orderCount},${data.totalAmount.toFixed(2)},${data.avgOrderAmount.toFixed(2)},${data.commission.toFixed(2)},${data.commissionRate}%\n`;
    });

    // 创建下载链接
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `导购业绩报表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('报表导出成功！');
}

// 全局函数
window.closePerformanceDetailModal = closePerformanceDetailModal;
window.viewPerformanceDetail = viewPerformanceDetail;
