// 交班管理页面交互逻辑

// 交班数据
let shifts = [
    {
        id: 1,
        shiftNo: 'SH20240115001',
        shiftTime: '2024-01-15 18:00:00',
        cashierId: 1,
        cashierName: '张三',
        orderCount: 45,
        totalAmount: 5680.50,
        cash: 1200.00,
        wechat: 2800.00,
        alipay: 1500.00,
        other: 180.50,
        remark: '正常交班',
        nextCashierId: 2,
        nextCashierName: '李四'
    },
    {
        id: 2,
        shiftNo: 'SH20240116001',
        shiftTime: '2024-01-16 18:00:00',
        cashierId: 2,
        cashierName: '李四',
        orderCount: 52,
        totalAmount: 6890.00,
        cash: 1500.00,
        wechat: 3200.00,
        alipay: 2000.00,
        other: 190.00,
        remark: '',
        nextCashierId: 1,
        nextCashierName: '张三'
    },
    {
        id: 3,
        shiftNo: 'SH20240117001',
        shiftTime: '2024-01-17 18:00:00',
        cashierId: 1,
        cashierName: '张三',
        orderCount: 38,
        totalAmount: 4520.00,
        cash: 800.00,
        wechat: 2200.00,
        alipay: 1400.00,
        other: 120.00,
        remark: '有退款订单',
        nextCashierId: 3,
        nextCashierName: '王五'
    },
];

// 当前班次数据（用于创建交班）
let currentShiftData = {
    orderCount: 0,
    totalAmount: 0,
    cash: 0,
    wechat: 0,
    alipay: 0,
    other: 0
};

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
};

// 筛选条件
let filters = {
    startDate: '',
    endDate: '',
    cashierId: '',
    searchKeyword: ''
};

// 选中的交班记录
let selectedShifts = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadCurrentShiftData();
    renderShiftTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 创建交班按钮
    const createShiftBtn = document.getElementById('createShiftBtn');
    if (createShiftBtn) {
        createShiftBtn.addEventListener('click', function() {
            showCreateShiftModal();
        });
    }

    // 批量打印按钮
    const printAllBtn = document.getElementById('printAllBtn');
    if (printAllBtn) {
        printAllBtn.addEventListener('click', function() {
            batchPrint();
        });
    }

    // 查询按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            applyFilters();
        });
    }

    // 全选复选框
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }

    // 分页按钮
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (pagination.currentPage > 1) {
                pagination.currentPage--;
                renderShiftTable();
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
                renderShiftTable();
                updatePagination();
            }
        });
    }

    // 设置默认日期
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

// 加载当前班次数据
function loadCurrentShiftData() {
    // 模拟加载当前班次数据
    currentShiftData = {
        orderCount: 25,
        totalAmount: 3250.00,
        cash: 500.00,
        wechat: 1500.00,
        alipay: 1200.00,
        other: 50.00
    };
}

// 渲染交班表格
function renderShiftTable() {
    const tableBody = document.getElementById('shiftTableBody');
    if (!tableBody) return;

    // 应用筛选
    let filteredShifts = shifts;

    if (filters.startDate) {
        filteredShifts = filteredShifts.filter(s => s.shiftTime >= filters.startDate);
    }
    if (filters.endDate) {
        filteredShifts = filteredShifts.filter(s => s.shiftTime <= filters.endDate + ' 23:59:59');
    }
    if (filters.cashierId) {
        filteredShifts = filteredShifts.filter(s => s.cashierId == filters.cashierId);
    }
    if (filters.searchKeyword) {
        filteredShifts = filteredShifts.filter(s =>
            s.shiftNo.toLowerCase().includes(filters.searchKeyword.toLowerCase())
        );
    }

    // 更新总数
    pagination.total = filteredShifts.length;

    // 分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pagedShifts = filteredShifts.slice(start, end);

    if (pagedShifts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无交班记录
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = pagedShifts.map(shift => {
        const isSelected = selectedShifts.includes(shift.id);
        return `
            <tr>
                <td>
                    <label class="shift-checkbox-label">
                        <input type="checkbox" class="shift-checkbox" value="${shift.id}" ${isSelected ? 'checked' : ''} onchange="toggleShiftSelection(${shift.id})">
                    </label>
                </td>
                <td>${shift.shiftNo}</td>
                <td>${shift.shiftTime}</td>
                <td>${shift.cashierName}</td>
                <td>${shift.orderCount}</td>
                <td class="shift-amount">¥${shift.totalAmount.toFixed(2)}</td>
                <td>¥${shift.cash.toFixed(2)}</td>
                <td>¥${shift.wechat.toFixed(2)}</td>
                <td>¥${shift.alipay.toFixed(2)}</td>
                <td>¥${shift.other.toFixed(2)}</td>
                <td>
                    <div class="shift-action-buttons">
                        <button class="shift-btn shift-btn-text" onclick="viewShiftDetail(${shift.id})">详情</button>
                        <button class="shift-btn shift-btn-text" onclick="printSingleShift(${shift.id})">打印</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
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

// 应用筛选
function applyFilters() {
    filters.startDate = document.getElementById('startDate').value;
    filters.endDate = document.getElementById('endDate').value;
    filters.cashierId = document.getElementById('cashierFilter').value;
    filters.searchKeyword = document.getElementById('shiftSearchInput').value.trim();
    
    pagination.currentPage = 1;
    renderShiftTable();
    updatePagination();
}

// 切换全选
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.shift-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const shiftId = parseInt(cb.value);
        if (checked) {
            if (!selectedShifts.includes(shiftId)) {
                selectedShifts.push(shiftId);
            }
        } else {
            selectedShifts = selectedShifts.filter(id => id !== shiftId);
        }
    });
}

// 切换单个选择
function toggleShiftSelection(shiftId) {
    const index = selectedShifts.indexOf(shiftId);
    if (index > -1) {
        selectedShifts.splice(index, 1);
    } else {
        selectedShifts.push(shiftId);
    }
    
    // 更新全选状态
    const checkboxes = document.querySelectorAll('.shift-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

// 显示创建交班弹窗
function showCreateShiftModal() {
    // 更新汇总数据
    document.getElementById('summaryOrderCount').textContent = currentShiftData.orderCount;
    document.getElementById('summaryTotalAmount').textContent = `¥${currentShiftData.totalAmount.toFixed(2)}`;
    document.getElementById('summaryCash').textContent = `¥${currentShiftData.cash.toFixed(2)}`;
    document.getElementById('summaryWechat').textContent = `¥${currentShiftData.wechat.toFixed(2)}`;
    document.getElementById('summaryAlipay').textContent = `¥${currentShiftData.alipay.toFixed(2)}`;
    document.getElementById('summaryOther').textContent = `¥${currentShiftData.other.toFixed(2)}`;

    // 重置表单
    document.getElementById('shiftRemark').value = '';
    document.getElementById('nextCashier').value = '';

    const modal = document.getElementById('createShiftModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭创建交班弹窗
function closeCreateShiftModal() {
    const modal = document.getElementById('createShiftModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 预览交班单
function previewShift() {
    console.log('预览交班单');
    alert('预览功能待实现');
}

// 确认创建交班
function confirmCreateShift() {
    const remark = document.getElementById('shiftRemark').value;
    const nextCashierId = document.getElementById('nextCashier').value;

    if (!nextCashierId) {
        alert('请选择接班收银员');
        return;
    }

    // 生成交班单号
    const now = new Date();
    const shiftNo = 'SH' + now.getFullYear() + 
        String(now.getMonth() + 1).padStart(2, '0') + 
        String(now.getDate()).padStart(2, '0') + 
        String(shifts.length + 1).padStart(3, '0');

    // 创建交班记录
    const newShift = {
        id: shifts.length + 1,
        shiftNo: shiftNo,
        shiftTime: now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        cashierId: 1, // 当前收银员ID
        cashierName: '张三', // 当前收银员名称
        orderCount: currentShiftData.orderCount,
        totalAmount: currentShiftData.totalAmount,
        cash: currentShiftData.cash,
        wechat: currentShiftData.wechat,
        alipay: currentShiftData.alipay,
        other: currentShiftData.other,
        remark: remark,
        nextCashierId: parseInt(nextCashierId),
        nextCashierName: document.getElementById('nextCashier').options[document.getElementById('nextCashier').selectedIndex].text.split(' ')[0]
    };

    shifts.unshift(newShift); // 添加到开头

    // 重置当前班次数据
    currentShiftData = {
        orderCount: 0,
        totalAmount: 0,
        cash: 0,
        wechat: 0,
        alipay: 0,
        other: 0
    };

    renderShiftTable();
    updatePagination();
    closeCreateShiftModal();
    alert('交班成功！');

    // 询问是否打印
    if (confirm('是否立即打印交班单？')) {
        printSingleShift(newShift.id);
    }
}

// 查看交班详情
function viewShiftDetail(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    const detailInfo = document.getElementById('shiftDetailInfo');
    if (detailInfo) {
        detailInfo.innerHTML = `
            <div class="shift-detail-row">
                <div class="shift-detail-label">交班单号：</div>
                <div class="shift-detail-value">${shift.shiftNo}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">交班时间：</div>
                <div class="shift-detail-value">${shift.shiftTime}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">交班收银员：</div>
                <div class="shift-detail-value">${shift.cashierName}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">接班收银员：</div>
                <div class="shift-detail-value">${shift.nextCashierName}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">订单数量：</div>
                <div class="shift-detail-value">${shift.orderCount} 单</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">收款总额：</div>
                <div class="shift-detail-value" style="color: var(--color-primary); font-size: var(--font-size-lg);">¥${shift.totalAmount.toFixed(2)}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">现金：</div>
                <div class="shift-detail-value">¥${shift.cash.toFixed(2)}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">微信支付：</div>
                <div class="shift-detail-value">¥${shift.wechat.toFixed(2)}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">支付宝：</div>
                <div class="shift-detail-value">¥${shift.alipay.toFixed(2)}</div>
            </div>
            <div class="shift-detail-row">
                <div class="shift-detail-label">其他：</div>
                <div class="shift-detail-value">¥${shift.other.toFixed(2)}</div>
            </div>
            ${shift.remark ? `
            <div class="shift-detail-row">
                <div class="shift-detail-label">备注：</div>
                <div class="shift-detail-value">${shift.remark}</div>
            </div>
            ` : ''}
        `;
    }

    // 保存当前查看的交班ID
    window.currentViewShiftId = shiftId;

    const modal = document.getElementById('shiftDetailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭交班详情弹窗
function closeShiftDetailModal() {
    const modal = document.getElementById('shiftDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 打印单个交班单
function printSingleShift(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    console.log('打印交班单:', shift.shiftNo);
    
    // 创建打印内容
    const printContent = generatePrintContent(shift);
    
    // 打开打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// 批量打印
function batchPrint() {
    if (selectedShifts.length === 0) {
        alert('请选择要打印的交班单');
        return;
    }

    const selectedShiftData = shifts.filter(s => selectedShifts.includes(s.id));
    
    if (confirm(`确定要打印 ${selectedShifts.length} 张交班单吗？`)) {
        selectedShiftData.forEach((shift, index) => {
            setTimeout(() => {
                printSingleShift(shift.id);
            }, index * 500); // 延迟打印，避免浏览器阻止多个打印窗口
        });
        
        // 清空选择
        selectedShifts = [];
        document.getElementById('selectAllCheckbox').checked = false;
        renderShiftTable();
    }
}

// 生成打印内容
function generatePrintContent(shift) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>交班单 - ${shift.shiftNo}</title>
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
            margin-bottom: 5px;
        }
        .print-shift-no {
            font-size: 14px;
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
        .print-total {
            font-size: 18px;
            font-weight: bold;
            color: #000;
            margin-top: 10px;
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
        <div class="print-title">交班单</div>
        <div class="print-shift-no">${shift.shiftNo}</div>
    </div>
    
    <div class="print-section">
        <div class="print-row">
            <span class="print-label">交班时间：</span>
            <span>${shift.shiftTime}</span>
        </div>
        <div class="print-row">
            <span class="print-label">交班收银员：</span>
            <span>${shift.cashierName}</span>
        </div>
        <div class="print-row">
            <span class="print-label">接班收银员：</span>
            <span>${shift.nextCashierName}</span>
        </div>
    </div>
    
    <div class="print-section">
        <div class="print-row">
            <span class="print-label">订单数量：</span>
            <span>${shift.orderCount} 单</span>
        </div>
        <div class="print-row">
            <span class="print-label">现金：</span>
            <span>¥${shift.cash.toFixed(2)}</span>
        </div>
        <div class="print-row">
            <span class="print-label">微信支付：</span>
            <span>¥${shift.wechat.toFixed(2)}</span>
        </div>
        <div class="print-row">
            <span class="print-label">支付宝：</span>
            <span>¥${shift.alipay.toFixed(2)}</span>
        </div>
        <div class="print-row">
            <span class="print-label">其他：</span>
            <span>¥${shift.other.toFixed(2)}</span>
        </div>
        <div class="print-row print-total">
            <span>收款总额：</span>
            <span>¥${shift.totalAmount.toFixed(2)}</span>
        </div>
    </div>
    
    ${shift.remark ? `
    <div class="print-section">
        <div class="print-row">
            <span class="print-label">备注：</span>
            <span>${shift.remark}</span>
        </div>
    </div>
    ` : ''}
    
    <div class="print-footer">
        <div>打印时间：${new Date().toLocaleString('zh-CN')}</div>
    </div>
</body>
</html>
    `;
}

// 打印交班单（从详情弹窗）
function printShift() {
    if (window.currentViewShiftId) {
        printSingleShift(window.currentViewShiftId);
    }
}

// 全局函数
window.closeCreateShiftModal = closeCreateShiftModal;
window.closeShiftDetailModal = closeShiftDetailModal;
window.toggleShiftSelection = toggleShiftSelection;
window.viewShiftDetail = viewShiftDetail;
window.printSingleShift = printSingleShift;
window.printShift = printShift;
