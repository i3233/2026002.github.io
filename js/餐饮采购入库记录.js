// 餐饮采购入库记录页面交互逻辑

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

// 模拟采购订单数据（从采购订单页面获取，结合餐饮商品特点）
const purchaseOrders = [
    {
        id: 'CG20250201001',
        date: '2026-02-01',
        partner: '雅安本地供应商A',
        productType: 'normal',
        amount: 3400.00,
        payable: 3400.00,
        products: [
            { id: 1, name: '锅巴肉片', type: 'normal', category: 'chinese', spec: '1份', unit: '份', qty: 50, price: 68.00, barcode: '6901234567890' },
            { id: 2, name: '肥肠血旺', type: 'normal', category: 'chinese', spec: '1份', unit: '份', qty: 30, price: 45.00, barcode: '6901234567891' }
        ]
    },
    {
        id: 'CG20250201003',
        date: '2026-02-01',
        partner: '酒类供应商C',
        productType: 'normal',
        amount: 3560.00,
        payable: 3000.00,
        products: [
            { id: 3, name: '彩虹斗酒套装41支', type: 'normal', category: 'rainbow', spec: '41支装', unit: '套', qty: 20, price: 178.00, barcode: '6901234567892' },
            { id: 4, name: '红尘玫瑰17支', type: 'normal', category: 'rainbow', spec: '17支装', unit: '支', qty: 50, price: 118.00, barcode: '6901234567893' }
        ]
    },
    {
        id: 'CG20250201007',
        date: '2026-02-02',
        partner: '套餐供应商D',
        productType: 'package',
        amount: 2670.00,
        payable: 2500.00,
        products: [
            { id: 5, name: '彩虹斗酒套餐41支', type: 'package', category: 'package', spec: '套餐装', unit: '套', qty: 15, price: 178.00, barcode: '6901234567894' }
        ]
    },
    {
        id: 'CG20250201008',
        date: '2026-02-02',
        partner: '食材供应商E',
        productType: 'weight',
        amount: 1500.75,
        payable: 1500.75,
        products: [
            { id: 6, name: '小吃系列（称重）', type: 'weight', category: 'snack', spec: '称重', unit: 'kg', qty: 100.50, price: 14.93, barcode: '' }
        ]
    }
];

// 当前选中的订单
let selectedOrder = null;
// 当前入库的商品明细（包含条码和入库数量）
let storageItems = [];
// 是否强制条码录入
let barcodeRequired = false;
// 审核状态：none-未提交, pending-审核中, approved-已通过, rejected-已拒绝
let auditStatus = 'none';

// 初始化订单列表
function initOrderList() {
    const datalist = document.getElementById('orderList');
    datalist.innerHTML = '';
    purchaseOrders.forEach(order => {
        const option = document.createElement('option');
        option.value = `${order.id} - ${order.partner}`;
        option.dataset.orderId = order.id;
        datalist.appendChild(option);
    });
}

// 选择订单
function selectOrder(orderId) {
    selectedOrder = purchaseOrders.find(o => o.id === orderId);
    if (!selectedOrder) {
        alert('未找到该订单');
        return;
    }

    // 显示订单信息
    document.getElementById('orderIdDisplay').textContent = selectedOrder.id;
    document.getElementById('orderDateDisplay').textContent = selectedOrder.date;
    document.getElementById('orderPartnerDisplay').textContent = selectedOrder.partner;
    const productType = productTypeMap[selectedOrder.productType] || productTypeMap['normal'];
    document.getElementById('orderProductTypeDisplay').innerHTML = `<span class="product-type-badge ${productType.class}">${productType.text}</span>`;
    document.getElementById('orderAmountDisplay').textContent = `¥${selectedOrder.amount.toFixed(2)}`;
    document.getElementById('orderPayableDisplay').textContent = `¥${selectedOrder.payable.toFixed(2)}`;
    document.getElementById('orderInfoCard').classList.remove('hidden');

    // 初始化入库商品明细
    storageItems = selectedOrder.products.map(product => ({
        ...product,
        storageQty: product.qty,
        scannedBarcode: product.barcode || ''
    }));

    // 显示商品明细表格
    renderProductsTable();
    document.getElementById('productsSection').style.display = 'block';
    document.getElementById('barcodeScanSection').style.display = 'block';
    document.getElementById('payableSection').style.display = 'block';
    document.getElementById('auditStatusSection').style.display = 'block';
    document.getElementById('actionSection').style.display = 'flex';

    // 更新应付金额
    updatePayable();
}

// 渲染商品明细表格
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    let totalOrderQty = 0;
    let totalStorageQty = 0;

    storageItems.forEach((item, index) => {
        totalOrderQty += item.qty;
        totalStorageQty += item.storageQty || 0;

        const row = document.createElement('tr');
        row.dataset.productId = item.id;
        row.dataset.index = index;
        
        const productType = productTypeMap[item.type] || productTypeMap['normal'];
        const categoryName = categoryMap[item.category] || item.category;
        const barcodeValue = item.scannedBarcode || '';
        const isMatched = barcodeValue && item.barcode && barcodeValue === item.barcode;
        const barcodeClass = barcodeRequired && !barcodeValue ? 'required' : '';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="product-type-badge ${productType.class}">${productType.text}</span></td>
            <td><span class="category-badge">${categoryName}</span></td>
            <td>${item.name}</td>
            <td>${item.spec}</td>
            <td>${item.unit}</td>
            <td class="text-right">${item.qty.toFixed(2)}</td>
            <td class="text-right">¥${item.price.toFixed(2)}</td>
            <td class="text-right">¥${(item.qty * item.price).toFixed(2)}</td>
            <td>
                <input type="text" 
                       class="barcode-input ${barcodeClass}" 
                       data-product-id="${item.id}"
                       data-index="${index}"
                       value="${barcodeValue}"
                       placeholder="${barcodeRequired ? '必填' : '可选'}">
            </td>
            <td>
                <span class="barcode-status ${isMatched ? 'matched' : barcodeValue ? 'unmatched' : ''}">
                    ${isMatched ? '✓ 已匹配' : barcodeValue ? '✗ 未匹配' : '未录入'}
                </span>
            </td>
            <td class="text-right">
                <input type="number" 
                       class="form-input" 
                       style="width: 100px; text-align: right; padding: var(--spacing-xs) var(--spacing-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-md); font-size: var(--font-size-sm);"
                       data-product-id="${item.id}"
                       data-index="${index}"
                       value="${item.storageQty.toFixed(2)}"
                       min="0"
                       max="${item.qty}"
                       step="0.01">
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalOrderQty').textContent = totalOrderQty.toFixed(2);
    document.getElementById('totalStorageQty').textContent = totalStorageQty.toFixed(2);

    // 显示/隐藏强制条码提示
    const alert = document.getElementById('barcodeRequiredAlert');
    if (barcodeRequired) {
        alert.style.display = 'block';
    } else {
        alert.style.display = 'none';
    }

    // 绑定条码输入事件
    bindBarcodeInputs();
    // 绑定入库数量输入事件
    bindStorageQtyInputs();
}

// 绑定条码输入事件
function bindBarcodeInputs() {
    document.querySelectorAll('.barcode-input').forEach(input => {
        input.addEventListener('input', function() {
            const productId = parseInt(this.dataset.productId);
            const index = parseInt(this.dataset.index);
            const barcode = this.value.trim();
            
            storageItems[index].scannedBarcode = barcode;
            
            // 检查是否匹配
            const item = storageItems[index];
            const isMatched = barcode && item.barcode && barcode === item.barcode;
            
            // 更新状态显示
            const row = this.closest('tr');
            const statusCell = row.querySelector('.barcode-status');
            if (isMatched) {
                statusCell.className = 'barcode-status matched';
                statusCell.textContent = '✓ 已匹配';
                this.classList.remove('required');
            } else if (barcode) {
                statusCell.className = 'barcode-status unmatched';
                statusCell.textContent = '✗ 未匹配';
                if (barcodeRequired) {
                    this.classList.add('required');
                }
            } else {
                statusCell.className = 'barcode-status';
                statusCell.textContent = '未录入';
                if (barcodeRequired) {
                    this.classList.add('required');
                } else {
                    this.classList.remove('required');
                }
            }

            // 检查是否可以提交
            checkCanSubmit();
        });

        input.addEventListener('blur', function() {
            if (barcodeRequired && !this.value.trim()) {
                this.classList.add('required');
            }
        });
    });
}

// 绑定入库数量输入事件
function bindStorageQtyInputs() {
    document.querySelectorAll('input[type="number"][data-product-id]').forEach(input => {
        input.addEventListener('input', function() {
            const productId = parseInt(this.dataset.productId);
            const index = parseInt(this.dataset.index);
            const qty = parseFloat(this.value) || 0;
            const maxQty = storageItems[index].qty;
            
            if (qty > maxQty) {
                this.value = maxQty.toFixed(2);
                storageItems[index].storageQty = maxQty;
            } else if (qty < 0) {
                this.value = '0.00';
                storageItems[index].storageQty = 0;
            } else {
                storageItems[index].storageQty = qty;
            }

            // 更新合计
            updateTotals();
            // 更新应付金额
            updatePayable();
        });
    });
}

// 更新合计
function updateTotals() {
    let totalStorageQty = 0;
    storageItems.forEach(item => {
        totalStorageQty += item.storageQty || 0;
    });
    document.getElementById('totalStorageQty').textContent = totalStorageQty.toFixed(2);
}

// 更新应付金额
function updatePayable() {
    if (!selectedOrder) return;

    let totalAmount = 0;
    storageItems.forEach(item => {
        totalAmount += (item.storageQty || 0) * item.price;
    });

    const originalPayable = selectedOrder.payable;
    const newPayable = originalPayable + totalAmount;
    const change = totalAmount;

    document.getElementById('payableValue').textContent = `¥${newPayable.toFixed(2)}`;
    
    if (change > 0) {
        document.getElementById('payableChange').textContent = `入库后将增加应付金额 ¥${change.toFixed(2)}`;
        document.getElementById('payableChange').style.color = 'var(--color-error)';
    } else {
        document.getElementById('payableChange').textContent = '应付金额无变化';
        document.getElementById('payableChange').style.color = 'var(--color-text-secondary)';
    }
}

// 检查是否可以提交
function checkCanSubmit() {
    if (!selectedOrder) {
        return false;
    }

    if (barcodeRequired) {
        // 检查是否所有商品都录入了条码
        const allBarcoded = storageItems.every(item => item.scannedBarcode && item.scannedBarcode.trim());
        return allBarcoded;
    }

    return true;
}

// 扫描条码
function scanBarcode(barcode) {
    if (!barcode || !barcode.trim()) {
        return;
    }

    // 查找匹配的商品
    const matchedItem = storageItems.find(item => item.barcode === barcode.trim());
    
    if (matchedItem) {
        // 找到匹配的商品，自动填充条码
        const index = storageItems.findIndex(item => item.id === matchedItem.id);
        storageItems[index].scannedBarcode = barcode.trim();
        
        // 重新渲染表格
        renderProductsTable();
        
        // 高亮显示匹配的行
        const row = document.querySelector(`tr[data-product-id="${matchedItem.id}"]`);
        if (row) {
            row.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 2000);
        }
    } else {
        alert('未找到匹配的商品条码，请检查条码是否正确');
    }
}

// 提交财务审核
function submitAudit() {
    if (!selectedOrder) {
        alert('请先选择采购订单');
        return;
    }

    // 检查条码（如果强制）
    if (barcodeRequired) {
        const missingBarcode = storageItems.find(item => !item.scannedBarcode || !item.scannedBarcode.trim());
        if (missingBarcode) {
            alert('请为所有商品录入条码后再提交审核');
            return;
        }
    }

    // 检查入库数量
    const hasStorageQty = storageItems.some(item => item.storageQty > 0);
    if (!hasStorageQty) {
        alert('请至少录入一个商品的入库数量');
        return;
    }

    if (!confirm('确定要提交财务审核吗？提交后将无法修改。')) {
        return;
    }

    // 更新审核状态
    auditStatus = 'pending';
    updateAuditStatus();
    
    // 模拟审核流程（3秒后自动通过）
    setTimeout(() => {
        auditStatus = 'approved';
        updateAuditStatus();
        
        // 更新应付金额
        updatePayable();
        
        alert('审核已通过！入库成功，应付金额已更新。');
    }, 3000);
}

// 更新审核状态
function updateAuditStatus() {
    const badge = document.getElementById('auditStatusBadge');
    const text = document.getElementById('auditStatusText');

    badge.className = 'audit-status-badge ' + auditStatus;
    
    switch(auditStatus) {
        case 'none':
            badge.textContent = '未提交';
            text.textContent = '请完成商品明细和条码录入后提交财务审核';
            break;
        case 'pending':
            badge.textContent = '审核中';
            text.textContent = '已提交财务审核，请等待审核结果...';
            break;
        case 'approved':
            badge.textContent = '审核通过';
            text.textContent = '审核已通过，入库成功！应付金额已更新。';
            break;
        case 'rejected':
            badge.textContent = '审核拒绝';
            text.textContent = '审核未通过，请检查后重新提交。';
            break;
    }

    // 更新提交按钮状态
    const submitBtn = document.getElementById('submitAuditBtn');
    if (auditStatus === 'pending' || auditStatus === 'approved') {
        submitBtn.disabled = true;
        submitBtn.textContent = auditStatus === 'approved' ? '已审核通过' : '审核中...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交财务审核';
    }
}

// 重置表单
function resetForm() {
    if (!confirm('确定要重置吗？所有已录入的数据将丢失。')) {
        return;
    }

    selectedOrder = null;
    storageItems = [];
    auditStatus = 'none';

    document.getElementById('orderSearchInput').value = '';
    document.getElementById('orderInfoCard').classList.add('hidden');
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('barcodeScanSection').style.display = 'none';
    document.getElementById('payableSection').style.display = 'none';
    document.getElementById('auditStatusSection').style.display = 'none';
    document.getElementById('actionSection').style.display = 'none';
    document.getElementById('barcodeScanInput').value = '';
    
    updateAuditStatus();
}

// 事件绑定
document.addEventListener('DOMContentLoaded', function() {
    initOrderList();
    updateAuditStatus();

    document.getElementById('selectOrderBtn').addEventListener('click', function() {
        const input = document.getElementById('orderSearchInput');
        const value = input.value.trim();
        
        if (!value) {
            alert('请输入订单号');
            return;
        }

        // 从输入值中提取订单号
        let orderId = value;
        if (value.includes(' - ')) {
            orderId = value.split(' - ')[0];
        }

        selectOrder(orderId);
    });

    document.getElementById('orderSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('selectOrderBtn').click();
        }
    });

    document.getElementById('clearOrderBtn').addEventListener('click', resetForm);

    document.getElementById('barcodeScanInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const barcode = this.value.trim();
            if (barcode) {
                scanBarcode(barcode);
                this.value = '';
            }
        }
    });

    document.getElementById('scanBarcodeBtn').addEventListener('click', function() {
        const input = document.getElementById('barcodeScanInput');
        const barcode = input.value.trim();
        if (barcode) {
            scanBarcode(barcode);
            input.value = '';
        }
    });

    document.getElementById('submitAuditBtn').addEventListener('click', submitAudit);
    document.getElementById('resetBtn').addEventListener('click', resetForm);

    // 强制条码录入开关
    document.getElementById('barcodeRequiredCheckbox').addEventListener('change', function() {
        barcodeRequired = this.checked;
        
        // 如果已选择订单，重新渲染表格以更新必填状态
        if (selectedOrder) {
            renderProductsTable();
            checkCanSubmit();
        }
    });
});
