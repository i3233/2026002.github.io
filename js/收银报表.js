// 收银报表页面交互逻辑

// 订单数据
let orderReportData = [
    {
        id: 1,
        orderNo: 'ORD20240115001',
        orderTime: '2024-01-15 10:30:25',
        cashierId: 1,
        cashierName: '张三',
        orderAmount: 158.00,
        paymentMethod: 'wechat',
        paidAmount: 158.00,
        items: [
            { name: '红牛', quantity: 2, price: 15 },
            { name: '百威经典（半打）', quantity: 1, price: 108 },
            { name: '小吃拼盘', quantity: 1, price: 20 }
        ]
    },
    {
        id: 2,
        orderNo: 'ORD20240115002',
        orderTime: '2024-01-15 11:15:10',
        cashierId: 1,
        cashierName: '张三',
        orderAmount: 298.00,
        paymentMethod: 'alipay',
        paidAmount: 298.00,
        items: [
            { name: '百威经典（一打）', quantity: 1, price: 198 },
            { name: '科罗娜（半打）', quantity: 1, price: 100 }
        ]
    },
    {
        id: 3,
        orderNo: 'ORD20240115003',
        orderTime: '2024-01-15 12:00:45',
        cashierId: 2,
        cashierName: '李四',
        orderAmount: 500.00,
        paymentMethod: 'cash',
        paidAmount: 500.00,
        items: [
            { name: '套餐A', quantity: 2, price: 198 },
            { name: '饮料', quantity: 4, price: 26 }
        ]
    },
    {
        id: 4,
        orderNo: 'ORD20240115004',
        orderTime: '2024-01-15 14:20:30',
        cashierId: 1,
        cashierName: '张三',
        orderAmount: 88.00,
        paymentMethod: 'wechat',
        paidAmount: 88.00,
        items: [
            { name: '特色斗酒', quantity: 1, price: 88 }
        ]
    },
    {
        id: 5,
        orderNo: 'ORD20240115005',
        orderTime: '2024-01-15 16:45:15',
        cashierId: 2,
        cashierName: '李四',
        orderAmount: 256.00,
        paymentMethod: 'alipay',
        paidAmount: 256.00,
        items: [
            { name: '彩虹斗酒', quantity: 2, price: 118 },
            { name: '小食', quantity: 1, price: 20 }
        ]
    },
];

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// 筛选条件
let filters = {
    date: '',
    cashierId: ''
};

// 支付方式映射
const paymentMethodMap = {
    'cash': '现金',
    'wechat': '微信',
    'alipay': '支付宝',
    'other': '其他'
};

// 当前查看的订单ID
let currentViewOrderId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    setDefaultDate();
    renderReportTable();
    updateSummary();
    updatePagination();
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

    // 快捷日期按钮
    const todayBtn = document.getElementById('todayBtn');
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            const today = new Date();
            document.getElementById('reportDate').value = today.toISOString().split('T')[0];
            applyFilters();
        });
    }

    const yesterdayBtn = document.getElementById('yesterdayBtn');
    if (yesterdayBtn) {
        yesterdayBtn.addEventListener('click', function() {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            document.getElementById('reportDate').value = yesterday.toISOString().split('T')[0];
            applyFilters();
        });
    }

    const thisWeekBtn = document.getElementById('thisWeekBtn');
    if (thisWeekBtn) {
        thisWeekBtn.addEventListener('click', function() {
            // 本周功能可以设置为本周第一天
            const today = new Date();
            const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
            document.getElementById('reportDate').value = firstDay.toISOString().split('T')[0];
            applyFilters();
        });
    }

    // 打印报表按钮
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            printReport();
        });
    }

    // 导出报表按钮
    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            exportReport();
        });
    }

    // 分页按钮
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (pagination.currentPage > 1) {
                pagination.currentPage--;
                renderReportTable();
                updatePagination();
            }
        });
    }

    const nextPageBtn = document.getElementById('nextPageBtn');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(pagination.total / pagination.pageSize);
            if (pagination.currentPage < totalPages) {
                pagination.currentPage++;
                renderReportTable();
                updatePagination();
            }
        });
    }
}

// 设置默认日期
function setDefaultDate() {
    const today = new Date();
    const dateInput = document.getElementById('reportDate');
    if (dateInput) {
        dateInput.value = today.toISOString().split('T')[0];
    }
}

// 应用筛选
function applyFilters() {
    filters.date = document.getElementById('reportDate').value;
    filters.cashierId = document.getElementById('cashierFilter').value;
    
    pagination.currentPage = 1;
    renderReportTable();
    updateSummary();
    updatePagination();
}

// 渲染报表表格
function renderReportTable() {
    const tableBody = document.getElementById('reportTableBody');
    if (!tableBody) return;

    // 过滤数据
    let filteredData = orderReportData;

    if (filters.date) {
        filteredData = filteredData.filter(o => o.orderTime.startsWith(filters.date));
    }
    if (filters.cashierId) {
        filteredData = filteredData.filter(o => o.cashierId == filters.cashierId);
    }

    // 按时间倒序排序
    filteredData.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

    // 更新总数
    pagination.total = filteredData.length;

    // 分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pagedData = filteredData.slice(start, end);

    if (pagedData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无订单数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = pagedData.map(order => {
        const paymentClass = `report-payment-badge-${order.paymentMethod}`;
        return `
            <tr>
                <td>${order.orderTime}</td>
                <td>${order.cashierName}</td>
                <td>${order.orderNo}</td>
                <td class="report-amount">¥${order.orderAmount.toFixed(2)}</td>
                <td>
                    <span class="report-payment-badge ${paymentClass}">${paymentMethodMap[order.paymentMethod]}</span>
                </td>
                <td class="report-amount">¥${order.paidAmount.toFixed(2)}</td>
                <td>
                    <button class="report-btn report-btn-text" onclick="viewOrderDetail(${order.id})">详情</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新汇总数据
function updateSummary() {
    let filteredData = orderReportData;

    if (filters.date) {
        filteredData = filteredData.filter(o => o.orderTime.startsWith(filters.date));
    }
    if (filters.cashierId) {
        filteredData = filteredData.filter(o => o.cashierId == filters.cashierId);
    }

    const orderCount = filteredData.length;
    const totalAmount = filteredData.reduce((sum, o) => sum + o.paidAmount, 0);
    const cash = filteredData.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.paidAmount, 0);
    const wechat = filteredData.filter(o => o.paymentMethod === 'wechat').reduce((sum, o) => sum + o.paidAmount, 0);
    const alipay = filteredData.filter(o => o.paymentMethod === 'alipay').reduce((sum, o) => sum + o.paidAmount, 0);
    const other = filteredData.filter(o => o.paymentMethod === 'other').reduce((sum, o) => sum + o.paidAmount, 0);

    document.getElementById('summaryOrderCount').textContent = orderCount;
    document.getElementById('summaryTotalAmount').textContent = `¥${totalAmount.toFixed(2)}`;
    document.getElementById('summaryCash').textContent = `¥${cash.toFixed(2)}`;
    document.getElementById('summaryWechat').textContent = `¥${wechat.toFixed(2)}`;
    document.getElementById('summaryAlipay').textContent = `¥${alipay.toFixed(2)}`;
    document.getElementById('summaryOther').textContent = `¥${other.toFixed(2)}`;
}

// 更新分页信息
function updatePagination() {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('totalRecords').textContent = pagination.total;
    document.getElementById('currentPage').textContent = pagination.currentPage;
    document.getElementById('totalPages').textContent = totalPages || 1;

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.disabled = pagination.currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = pagination.currentPage >= totalPages;
    }
}

// 查看订单详情
function viewOrderDetail(orderId) {
    const order = orderReportData.find(o => o.id === orderId);
    if (!order) return;

    currentViewOrderId = orderId;

    const detailInfo = document.getElementById('orderDetailInfo');
    if (detailInfo) {
        const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        detailInfo.innerHTML = `
            <div class="report-detail-section">
                <div class="report-detail-section-title">订单信息</div>
                <div class="report-detail-row">
                    <div class="report-detail-label">订单号：</div>
                    <div class="report-detail-value">${order.orderNo}</div>
                </div>
                <div class="report-detail-row">
                    <div class="report-detail-label">订单时间：</div>
                    <div class="report-detail-value">${order.orderTime}</div>
                </div>
                <div class="report-detail-row">
                    <div class="report-detail-label">收银员：</div>
                    <div class="report-detail-value">${order.cashierName}</div>
                </div>
                <div class="report-detail-row">
                    <div class="report-detail-label">支付方式：</div>
                    <div class="report-detail-value">
                        <span class="report-payment-badge report-payment-badge-${order.paymentMethod}">${paymentMethodMap[order.paymentMethod]}</span>
                    </div>
                </div>
            </div>

            <div class="report-detail-section">
                <div class="report-detail-section-title">商品明细</div>
                <div class="report-order-items">
                    ${order.items.map(item => `
                        <div class="report-order-item">
                            <div class="report-order-item-name">${item.name}</div>
                            <div class="report-order-item-quantity">×${item.quantity}</div>
                            <div class="report-order-item-price">¥${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-detail-section">
                <div class="report-detail-section-title">金额信息</div>
                <div class="report-detail-row">
                    <div class="report-detail-label">商品总额：</div>
                    <div class="report-detail-value">¥${itemsTotal.toFixed(2)}</div>
                </div>
                <div class="report-detail-row">
                    <div class="report-detail-label">订单金额：</div>
                    <div class="report-detail-value" style="color: var(--color-primary); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">¥${order.orderAmount.toFixed(2)}</div>
                </div>
                <div class="report-detail-row">
                    <div class="report-detail-label">实收金额：</div>
                    <div class="report-detail-value" style="color: var(--color-success); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">¥${order.paidAmount.toFixed(2)}</div>
                </div>
            </div>
        `;
    }

    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭订单详情弹窗
function closeOrderDetailModal() {
    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentViewOrderId = null;
}

// 打印报表
function printReport() {
    const printContent = generatePrintContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// 生成打印内容
function generatePrintContent() {
    let filteredData = orderReportData;

    if (filters.date) {
        filteredData = filteredData.filter(o => o.orderTime.startsWith(filters.date));
    }
    if (filters.cashierId) {
        filteredData = filteredData.filter(o => o.cashierId == filters.cashierId);
    }

    const orderCount = filteredData.length;
    const totalAmount = filteredData.reduce((sum, o) => sum + o.paidAmount, 0);
    const cash = filteredData.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.paidAmount, 0);
    const wechat = filteredData.filter(o => o.paymentMethod === 'wechat').reduce((sum, o) => sum + o.paidAmount, 0);
    const alipay = filteredData.filter(o => o.paymentMethod === 'alipay').reduce((sum, o) => sum + o.paidAmount, 0);
    const other = filteredData.filter(o => o.paymentMethod === 'other').reduce((sum, o) => sum + o.paidAmount, 0);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>收银报表 - ${filters.date || '全部'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .print-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .print-date {
            font-size: 14px;
        }
        .print-summary {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
        .print-summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dashed #ccc;
        }
        .print-summary-row:last-child {
            border-bottom: none;
        }
        .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .print-table th,
        .print-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }
        .print-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .print-footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #000;
            text-align: center;
            font-size: 12px;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <div class="print-title">收银报表</div>
        <div class="print-date">日期：${filters.date || '全部'}</div>
    </div>
    
    <div class="print-summary">
        <div class="print-summary-row">
            <span>订单总数：</span>
            <span><strong>${orderCount}</strong></span>
        </div>
        <div class="print-summary-row">
            <span>收款总额：</span>
            <span><strong>¥${totalAmount.toFixed(2)}</strong></span>
        </div>
        <div class="print-summary-row">
            <span>现金：</span>
            <span>¥${cash.toFixed(2)}</span>
        </div>
        <div class="print-summary-row">
            <span>微信：</span>
            <span>¥${wechat.toFixed(2)}</span>
        </div>
        <div class="print-summary-row">
            <span>支付宝：</span>
            <span>¥${alipay.toFixed(2)}</span>
        </div>
        <div class="print-summary-row">
            <span>其他：</span>
            <span>¥${other.toFixed(2)}</span>
        </div>
    </div>
    
    <table class="print-table">
        <thead>
            <tr>
                <th>时间</th>
                <th>收银员</th>
                <th>订单号</th>
                <th>金额</th>
                <th>支付方式</th>
            </tr>
        </thead>
        <tbody>
            ${filteredData.map(order => `
                <tr>
                    <td>${order.orderTime}</td>
                    <td>${order.cashierName}</td>
                    <td>${order.orderNo}</td>
                    <td>¥${order.paidAmount.toFixed(2)}</td>
                    <td>${paymentMethodMap[order.paymentMethod]}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="print-footer">
        <div>打印时间：${new Date().toLocaleString('zh-CN')}</div>
    </div>
</body>
</html>
    `;
}

// 导出报表
function exportReport() {
    let filteredData = orderReportData;

    if (filters.date) {
        filteredData = filteredData.filter(o => o.orderTime.startsWith(filters.date));
    }
    if (filters.cashierId) {
        filteredData = filteredData.filter(o => o.cashierId == filters.cashierId);
    }

    // 生成CSV内容
    let csvContent = '时间,收银员,订单号,订单金额,支付方式,实收金额\n';
    
    filteredData.forEach(order => {
        csvContent += `${order.orderTime},${order.cashierName},${order.orderNo},${order.orderAmount.toFixed(2)},${paymentMethodMap[order.paymentMethod]},${order.paidAmount.toFixed(2)}\n`;
    });

    // 创建下载链接
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `收银报表_${filters.date || '全部'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('报表导出成功！');
}

// 打印订单详情
function printOrderDetail() {
    if (!currentViewOrderId) return;
    
    const order = orderReportData.find(o => o.id === currentViewOrderId);
    if (!order) return;

    const printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>订单详情 - ${order.orderNo}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 300px;
            margin: 0 auto;
        }
        .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .print-title {
            font-size: 20px;
            font-weight: bold;
        }
        .print-section {
            margin: 15px 0;
        }
        .print-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dashed #ccc;
        }
        .print-label {
            font-weight: bold;
        }
        .print-items {
            margin: 10px 0;
        }
        .print-item {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
        }
        .print-total {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <div class="print-title">订单详情</div>
        <div>${order.orderNo}</div>
    </div>
    
    <div class="print-section">
        <div class="print-row">
            <span class="print-label">时间：</span>
            <span>${order.orderTime}</span>
        </div>
        <div class="print-row">
            <span class="print-label">收银员：</span>
            <span>${order.cashierName}</span>
        </div>
        <div class="print-row">
            <span class="print-label">支付方式：</span>
            <span>${paymentMethodMap[order.paymentMethod]}</span>
        </div>
    </div>
    
    <div class="print-section">
        <div class="print-label" style="margin-bottom: 10px;">商品明细：</div>
        <div class="print-items">
            ${order.items.map(item => `
                <div class="print-item">
                    <span>${item.name} ×${item.quantity}</span>
                    <span>¥${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="print-row print-total">
            <span>合计：</span>
            <span>¥${order.paidAmount.toFixed(2)}</span>
        </div>
    </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// 全局函数
window.closeOrderDetailModal = closeOrderDetailModal;
window.viewOrderDetail = viewOrderDetail;
window.printOrderDetail = printOrderDetail;
