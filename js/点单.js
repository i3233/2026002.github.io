// 点单页面交互逻辑

// 本地存储 key：按桌台存储订单、当前选中的桌台（从桌位页点击进入时设置）
var STORAGE_KEY_TABLE_ORDERS = 'cashierTableOrders';
var STORAGE_KEY_CURRENT_TABLE = 'cashierCurrentTableCode';

// 订单数据
let orderItems = [];
let selectedMember = null;

// 获取当前桌台 code（从桌位点击进入时由 localStorage 传入）
function getCurrentTableCode() {
    try { return localStorage.getItem(STORAGE_KEY_CURRENT_TABLE) || ''; } catch (e) { return ''; }
}
// 读取某桌台的订单列表
function getTableOrders(tableCode) {
    if (!tableCode) return [];
    try {
        var raw = localStorage.getItem(STORAGE_KEY_TABLE_ORDERS) || '{}';
        var obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(obj[tableCode]) ? obj[tableCode] : [];
    } catch (e) { return []; }
}
// 保存某桌台的订单列表
function saveTableOrders(tableCode, items) {
    if (!tableCode) return;
    try {
        var raw = localStorage.getItem(STORAGE_KEY_TABLE_ORDERS) || '{}';
        var obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
        obj[tableCode] = items || [];
        localStorage.setItem(STORAGE_KEY_TABLE_ORDERS, JSON.stringify(obj));
    } catch (e) {}
}
// 更新当前桌台显示条
function updateTableBar() {
    var code = getCurrentTableCode();
    var bar = document.getElementById('orderTableBar');
    var valueEl = document.getElementById('currentTableCode');
    if (bar && valueEl) {
        if (code) {
            bar.style.display = 'flex';
            valueEl.textContent = code;
        } else {
            bar.style.display = 'none';
        }
    }
}

// 商品数据
const productData = [
    // 软饮
    { id: 1, name: '红牛', price: 15, image: null, category: 'soft-drink' },
    { id: 2, name: '旺仔牛奶', price: 15, image: null, category: 'soft-drink' },
    { id: 3, name: '王老吉（听装）', price: 10, image: null, category: 'soft-drink' },
    { id: 4, name: '可乐（听装）', price: 8, image: null, category: 'soft-drink' },
    { id: 5, name: '红茶', price: 8, image: null, category: 'soft-drink' },
    { id: 6, name: '农夫山泉550ml', price: 8, image: null, category: 'soft-drink' },
    { id: 7, name: '苏打水', price: 10, image: null, category: 'soft-drink' },
    { id: 8, name: '雪碧', price: 8, image: null, category: 'soft-drink' },
    { id: 9, name: '脉动', price: 12, image: null, category: 'soft-drink' },
    // 啤酒
    { id: 10, name: '百威经典（半打）', price: 108, image: null, category: 'beer' },
    { id: 11, name: '百威经典（一打）', price: 198, image: null, category: 'beer' },
    { id: 12, name: '科罗娜（半打）', price: 158, image: null, category: 'beer' },
    { id: 13, name: '科罗娜（一打）', price: 298, image: null, category: 'beer' },
    { id: 14, name: '百威铝罐（半打）', price: 158, image: null, category: 'beer' },
    { id: 15, name: '百威铝罐（一打）', price: 298, image: null, category: 'beer' },
    { id: 16, name: '福佳白（半打）', price: 138, image: null, category: 'beer' },
    { id: 17, name: '福佳白（一打）', price: 258, image: null, category: 'beer' },
    { id: 18, name: '1664桃红（半打）', price: 198, image: null, category: 'beer' },
    { id: 19, name: '1664桃红（一打）', price: 388, image: null, category: 'beer' },
    { id: 20, name: '动力火车（半打）', price: 78, image: null, category: 'beer' },
    { id: 21, name: '动力火车（一打）', price: 148, image: null, category: 'beer' },
    { id: 22, name: '崂山啤酒（半打）', price: 68, image: null, category: 'beer' },
    { id: 23, name: '崂山啤酒（一打）', price: 128, image: null, category: 'beer' },
    { id: 24, name: '1664白啤（半打）', price: 188, image: null, category: 'beer' },
    { id: 25, name: '1664白啤（一打）', price: 368, image: null, category: 'beer' },
    // 小号
    { id: 26, name: '小食拼盘', price: 28, image: null, category: 'snack' },
    { id: 27, name: '花生米', price: 15, image: null, category: 'snack' },
    { id: 28, name: '瓜子', price: 12, image: null, category: 'snack' },
    // 其它
    { id: 29, name: '其他商品1', price: 20, image: null, category: 'other' },
    { id: 30, name: '其他商品2', price: 25, image: null, category: 'other' },
    // 洋酒
    { id: 31, name: '威士忌', price: 388, image: null, category: 'wine' },
    { id: 32, name: '白兰地', price: 488, image: null, category: 'wine' },
    // 特色
    { id: 33, name: '特色斗酒1', price: 88, image: null, category: 'special' },
    { id: 34, name: '特色斗酒2', price: 98, image: null, category: 'special' },
    // 彩虹
    { id: 35, name: '彩虹斗酒1', price: 108, image: null, category: 'rainbow' },
    { id: 36, name: '彩虹斗酒2', price: 118, image: null, category: 'rainbow' },
    // 套餐
    { id: 37, name: '优惠套餐A', price: 198, image: null, category: 'package' },
    { id: 38, name: '优惠套餐B', price: 298, image: null, category: 'package' },
    // 中餐
    { id: 39, name: '宫保鸡丁', price: 38, image: null, category: 'chinese' },
    { id: 40, name: '麻婆豆腐', price: 28, image: null, category: 'chinese' },
];

// 当前搜索关键词
let searchKeyword = '';
// 当前选中的分类
let currentCategory = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    var tableCode = getCurrentTableCode();
    if (tableCode) {
        orderItems = getTableOrders(tableCode).slice();
    }
    updateTableBar();
    initEventListeners();
    updateOrderDisplay();
    renderProducts();
    setViewMode('medium');
});

// 初始化事件监听
function initEventListeners() {
    // 选择客户按钮
    const selectCustomerBtn = document.getElementById('selectCustomerBtn');
    if (selectCustomerBtn) {
        selectCustomerBtn.addEventListener('click', function() {
            showMemberSearchModal();
        });
    }

    // 储值按钮
    const storageBtn = document.getElementById('storageBtn');
    if (storageBtn) {
        storageBtn.addEventListener('click', function() {
            showStorageModal();
        });
    }

    // 修改优惠按钮
    const modifyDiscountBtn = document.getElementById('modifyDiscountBtn');
    if (modifyDiscountBtn) {
        modifyDiscountBtn.addEventListener('click', function() {
            showDiscountSelectModal();
        });
    }

    // 收银按钮
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            showCheckoutModal();
        });
    }

    // 清空按钮
    function doClearOrder() {
        if (confirm('确定清空当前订单？')) {
            orderItems = [];
            updateOrderDisplay();
        }
    }
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', doClearOrder);
    const clearBtn2 = document.getElementById('clearBtn2');
    if (clearBtn2) clearBtn2.addEventListener('click', doClearOrder);

    // 数量 +/-（有内容时号牌列）
    const qtyMinus = document.getElementById('orderQtyMinus');
    const qtyPlus = document.getElementById('orderQtyPlus');
    if (qtyMinus) qtyMinus.addEventListener('click', function() {
        if (orderItems.length > 0 && orderItems[0]) {
            orderItems[0].quantity -= 1;
            if (orderItems[0].quantity <= 0) orderItems.splice(0, 1);
            updateOrderDisplay();
        }
    });
    if (qtyPlus) qtyPlus.addEventListener('click', function() {
        if (orderItems.length > 0 && orderItems[0]) {
            orderItems[0].quantity += 1;
            updateOrderDisplay();
        }
    });

    // 取单按钮
    const takeOrderBtn = document.getElementById('takeOrderBtn');
    if (takeOrderBtn) takeOrderBtn.addEventListener('click', showHangOrderModal);
    const takeOrderBtn2 = document.getElementById('takeOrderBtn2');
    if (takeOrderBtn2) takeOrderBtn2.addEventListener('click', showHangOrderModal);

    // 整单打折\减免按钮
    const discountBtn = document.getElementById('discountBtn');
    if (discountBtn) discountBtn.addEventListener('click', showDiscountModal);
    const discountBtn2 = document.getElementById('discountBtn2');
    if (discountBtn2) discountBtn2.addEventListener('click', showDiscountModal);

    // 整单备注按钮
    const remarkBtn = document.getElementById('remarkBtn');
    if (remarkBtn) remarkBtn.addEventListener('click', showRemarkModal);
    const remarkBtn2 = document.getElementById('remarkBtn2');
    if (remarkBtn2) remarkBtn2.addEventListener('click', showRemarkModal);

    // 团购券先核销按钮
    const grouponBtn = document.getElementById('grouponBtn');
    if (grouponBtn) grouponBtn.addEventListener('click', showGrouponModal);
    const grouponBtn2 = document.getElementById('grouponBtn2');
    if (grouponBtn2) grouponBtn2.addEventListener('click', showGrouponModal);

    // 向上滑按钮
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', function() {
            const orderItemsList = document.getElementById('orderItemsList');
            if (orderItemsList) {
                orderItemsList.scrollTop -= 100;
            }
        });
    }

    // 向下滑按钮
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            const orderItemsList = document.getElementById('orderItemsList');
            if (orderItemsList) {
                orderItemsList.scrollTop += 100;
            }
        });
    }

    // 商品搜索
    const productSearchInput = document.getElementById('productSearchInput');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            renderProducts();
        });
    }

    // 临时商品按钮
    const tempProductBtn = document.getElementById('tempProductBtn');
    if (tempProductBtn) {
        tempProductBtn.addEventListener('click', function() {
            showTempProductModal();
        });
    }

    // 设置按钮
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log('打开设置');
            // 实现设置功能
        });
    }

    // 大图模式按钮
    const viewLargeBtn = document.getElementById('viewLargeBtn');
    if (viewLargeBtn) {
        viewLargeBtn.addEventListener('click', function() {
            setViewMode('large');
        });
    }

    // 中图模式按钮
    const viewMediumBtn = document.getElementById('viewMediumBtn');
    if (viewMediumBtn) {
        viewMediumBtn.addEventListener('click', function() {
            setViewMode('medium');
        });
    }

    // 小图模式按钮
    const viewSmallBtn = document.getElementById('viewSmallBtn');
    if (viewSmallBtn) {
        viewSmallBtn.addEventListener('click', function() {
            setViewMode('small');
        });
    }

    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('刷新商品列表');
            renderProducts();
        });
    }

    // 分类标签切换
    document.querySelectorAll('.order-category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新激活状态
            document.querySelectorAll('.order-category-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前分类
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });

    // 支付按钮
    const scanPayBtn = document.getElementById('scanPayBtn');
    if (scanPayBtn) {
        scanPayBtn.addEventListener('click', function() {
            showScanPayModal();
        });
    }

    const cashPayBtn = document.getElementById('cashPayBtn');
    if (cashPayBtn) {
        cashPayBtn.addEventListener('click', function() {
            showCashPayModal();
        });
    }

    const douyinPayBtn = document.getElementById('douyinPayBtn');
    if (douyinPayBtn) {
        douyinPayBtn.addEventListener('click', function() {
            showDouyinPayModal();
        });
    }

    const payLaterBtn = document.getElementById('payLaterBtn');
    if (payLaterBtn) {
        payLaterBtn.addEventListener('click', function() {
            if (confirm('确定设为先吃后付？')) {
                console.log('设为先吃后付');
            }
        });
    }
}

// 设置视图模式
let currentViewMode = 'medium';
function setViewMode(mode) {
    currentViewMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('#viewLargeBtn, #viewMediumBtn, #viewSmallBtn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById('view' + mode.charAt(0).toUpperCase() + mode.slice(1) + 'Btn');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 更新商品展示区的样式类
    const productContent = document.querySelector('.order-product-content');
    if (productContent) {
        productContent.className = 'order-product-content order-view-' + mode;
    }
    
    console.log('切换视图模式:', mode);
}

// 显示临时商品弹窗
function showTempProductModal() {
    const suffix = '_' + Date.now();
    const modal = createModal(`
        <div class="order-modal-content order-modal-temp-product">
            <div class="order-modal-header">
                <h3>添加临时商品</h3>
                <button type="button" class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div class="order-form-group">
                    <label for="tempProductName${suffix}">名称 <span class="order-form-required">*</span></label>
                    <input type="text" class="order-form-input" value="临时商品" id="tempProductName${suffix}" placeholder="临时商品">
                </div>
                <div class="order-form-group">
                    <label for="tempProductPrice${suffix}">价格 <span class="order-form-required">*</span></label>
                    <input type="number" class="order-form-input" placeholder="输入商品价格" id="tempProductPrice${suffix}" step="0.01">
                </div>
                <div class="order-form-group">
                    <label for="tempProductQuantity${suffix}">数量 <span class="order-form-required">*</span></label>
                    <input type="number" class="order-form-input" value="1" id="tempProductQuantity${suffix}" min="1">
                </div>
                <div class="order-form-group">
                    <label for="tempProductStall${suffix}">档口</label>
                    <select class="order-form-input" id="tempProductStall${suffix}">
                        <option value="">请选择档口</option>
                    </select>
                </div>
                <div class="order-form-group">
                    <label for="tempProductRemark${suffix}">备注</label>
                    <textarea class="order-form-input order-form-textarea" id="tempProductRemark${suffix}" placeholder="请输入自定义备注" rows="3"></textarea>
                </div>
            </div>
            <div class="order-modal-footer">
                <button type="button" class="order-btn order-btn-primary order-btn-temp-add" data-temp-suffix="${suffix}" onclick="confirmTempProduct(this)">加入购物车</button>
            </div>
        </div>
    `);
}

// 确认临时商品
function confirmTempProduct(btn) {
    const suffix = btn && btn.dataset && btn.dataset.tempSuffix ? btn.dataset.tempSuffix : '_' + Date.now();
    const nameEl = document.getElementById('tempProductName' + suffix);
    const priceEl = document.getElementById('tempProductPrice' + suffix);
    const quantityEl = document.getElementById('tempProductQuantity' + suffix);
    
    if (!nameEl || !nameEl.value.trim()) {
        alert('请输入商品名称');
        return;
    }
    const price = parseFloat(priceEl ? priceEl.value : 0);
    if (isNaN(price) || price < 0) {
        alert('请输入有效的商品价格');
        return;
    }
    const quantity = parseInt(quantityEl ? quantityEl.value : 1, 10) || 1;
    
    const product = {
        id: 'temp_' + Date.now(),
        name: nameEl.value.trim(),
        price: price,
        quantity: quantity
    };
    
    addToOrder(product);
    closeOrderModal();
}

// 渲染商品列表
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // 过滤商品
    let filteredProducts = productData;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 渲染商品卡片
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="order-product-card" data-product-id="${product.id}">
            <div class="order-product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}">` : 
                    `<div class="order-product-image-placeholder">📦</div>`
                }
            </div>
            <div class="order-product-name">${product.name}</div>
            <div class="order-product-price">¥${product.price}</div>
            <button class="order-product-add-btn" onclick="addProductToOrder(${product.id})" title="添加到订单">+</button>
        </div>
    `).join('');

    // 添加商品卡片点击事件（点击卡片空白区域也可以添加）
    productsGrid.querySelectorAll('.order-product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('order-product-add-btn')) {
                const productId = parseInt(this.dataset.productId);
                addProductToOrder(productId);
            }
        });
    });
}

// 添加商品到订单
function addProductToOrder(productId) {
    const product = productData.find(p => p.id === productId);
    if (!product) return;

    addToOrder({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
    });
}

// 显示扫码支付弹窗
function showScanPayModal() {
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>扫码支付</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div style="text-align: center; padding: var(--spacing-xl); background-color: var(--color-neutral-50); border-radius: var(--radius-md); border: 2px dashed var(--color-neutral-300);">
                    <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">请扫描顾客付款码</p>
                </div>
                <div style="text-align: center; margin-top: var(--spacing-lg);">
                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">应付金额</p>
                    <p style="margin: var(--spacing-sm) 0 0; font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">¥${totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmPayment('scan')">确认支付</button>
            </div>
        </div>
    `);
}

// 显示现金支付弹窗
function showCashPayModal() {
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>现金收款</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div style="text-align: center; margin-bottom: var(--spacing-lg);">
                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">应收金额</p>
                    <p style="margin: var(--spacing-sm) 0 0; font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">¥${totalPrice.toFixed(2)}</p>
                </div>
                <div class="order-form-group">
                    <label>实收金额</label>
                    <input type="number" class="order-form-input" id="cashReceivedInput" placeholder="请输入实收金额" step="0.01">
                </div>
                <div style="padding: var(--spacing-md); background-color: var(--color-neutral-50); border-radius: var(--radius-md); margin-top: var(--spacing-md);">
                    <p style="margin: 0; font-size: var(--font-size-base); color: var(--color-text-primary);">找零：<span id="changeAmount" style="font-weight: var(--font-weight-bold); color: var(--color-primary);">¥0.00</span></p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmPayment('cash')">确认收款</button>
            </div>
        </div>
    `);

    // 计算找零
    const cashReceivedInput = document.getElementById('cashReceivedInput');
    if (cashReceivedInput) {
        cashReceivedInput.addEventListener('input', function() {
            const received = parseFloat(this.value) || 0;
            const change = received - totalPrice;
            const changeAmountEl = document.getElementById('changeAmount');
            if (changeAmountEl) {
                changeAmountEl.textContent = `¥${Math.max(0, change).toFixed(2)}`;
            }
        });
    }
}

// 显示抖音支付弹窗
function showDouyinPayModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>抖音支付/核销</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div style="text-align: center; padding: var(--spacing-xl); background-color: var(--color-neutral-50); border-radius: var(--radius-md); border: 2px dashed var(--color-neutral-300);">
                    <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">请扫描抖音团购券</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmPayment('douyin')">确认</button>
            </div>
        </div>
    `);
}

// 确认支付
function confirmPayment(method) {
    console.log('支付方式:', method);
    // 清空订单
    orderItems = [];
    updateOrderDisplay();
    closeOrderModal();
}

// 全局函数
window.addProductToOrder = addProductToOrder;

// 更新订单显示
function updateOrderDisplay() {
    const orderItemsList = document.getElementById('orderItemsList');
    const orderItemsEmpty = document.getElementById('orderItemsEmpty');
    const totalPriceEl = document.getElementById('totalPrice');
    const actionsEmpty = document.getElementById('orderActionsEmpty');
    const actionsHasItems = document.getElementById('orderActionsHasItems');
    if (actionsEmpty) actionsEmpty.classList.toggle('hidden', orderItems.length > 0);
    if (actionsHasItems) actionsHasItems.classList.toggle('hidden', orderItems.length === 0);
    const qtyVal = document.getElementById('orderQtyValue');
    if (qtyVal) qtyVal.textContent = orderItems.length > 0 ? (orderItems[0].quantity || 1) : '1';

    if (!orderItemsList) return;

    if (orderItems.length === 0) {
        if (orderItemsEmpty) orderItemsEmpty.style.display = 'flex';
        orderItemsList.innerHTML = '';
        orderItemsList.appendChild(orderItemsEmpty);
    } else {
        if (orderItemsEmpty) orderItemsEmpty.style.display = 'none';
        
        // 生成菜品列表
        orderItemsList.innerHTML = orderItems.map((item, index) => `
            <div class="order-item">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">¥${item.price.toFixed(2)}</div>
                <div class="order-item-quantity">
                    <button class="order-quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                    <span class="order-quantity-value">${item.quantity}</span>
                    <button class="order-quantity-btn" onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="order-item-delete" onclick="deleteItem(${index})" title="删除">×</button>
            </div>
        `).join('');
    }

    // 更新总价
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (totalPriceEl) {
        totalPriceEl.textContent = `¥${totalPrice.toFixed(2)}`;
    }
    // 按桌台持久化订单（从桌位进入时）
    var tableCode = getCurrentTableCode();
    if (tableCode) {
        saveTableOrders(tableCode, orderItems);
    }
}

// 增加数量
function increaseQuantity(index) {
    if (orderItems[index]) {
        orderItems[index].quantity += 1;
        updateOrderDisplay();
    }
}

// 减少数量
function decreaseQuantity(index) {
    if (orderItems[index]) {
        orderItems[index].quantity -= 1;
        if (orderItems[index].quantity <= 0) {
            orderItems.splice(index, 1);
        }
        updateOrderDisplay();
    }
}

// 删除商品
function deleteItem(index) {
    if (confirm('确定要删除这个商品吗？')) {
        orderItems.splice(index, 1);
        updateOrderDisplay();
    }
}

// 添加商品到订单（供外部调用）
function addToOrder(product) {
    const existingItem = orderItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orderItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    updateOrderDisplay();
}

// 显示会员搜索弹窗
function showMemberSearchModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>选择客户</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div class="order-form-group">
                    <input type="text" class="order-form-input" placeholder="输入手机号或会员卡号搜索" id="memberSearchInput">
                </div>
                <div class="order-form-group">
                    <button class="order-btn order-btn-primary" onclick="searchMember()">搜索</button>
                </div>
                <div id="memberList" style="max-height: 300px; overflow-y: auto; margin-top: var(--spacing-md);">
                    <p style="text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg);">暂无会员数据</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-primary" onclick="addNewMember()">新增会员</button>
                <button class="order-btn order-btn-outline" onclick="closeOrderModal()">取消</button>
            </div>
        </div>
    `);
}

// 显示储值弹窗
function showStorageModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>会员储值</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div class="order-form-group">
                    <label>充值金额</label>
                    <input type="number" class="order-form-input" placeholder="请输入充值金额" id="storageAmount">
                </div>
                <div class="order-form-group">
                    <label>充值方式</label>
                    <select class="order-form-input" id="storageMethod">
                        <option>现金</option>
                        <option>微信支付</option>
                        <option>支付宝</option>
                    </select>
                </div>
                <div style="padding: var(--spacing-md); background-color: var(--color-neutral-50); border-radius: var(--radius-md); margin-top: var(--spacing-md);">
                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">赠送金额：¥0.00</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmStorage()">确认充值</button>
            </div>
        </div>
    `);
}

// 显示优惠选择弹窗
function showDiscountSelectModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>选择优惠</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div id="discountList" style="max-height: 400px; overflow-y: auto;">
                    <p style="text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg);">暂无可用优惠</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-outline" onclick="closeOrderModal()">取消</button>
            </div>
        </div>
    `);
}

// 显示收银弹窗
function showCheckoutModal() {
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>收银结算</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div style="text-align: center; padding: var(--spacing-lg);">
                    <p style="margin: 0 0 var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-secondary);">应付金额</p>
                    <p style="margin: 0; font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">¥${totalPrice.toFixed(2)}</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    <button class="order-btn order-btn-outline" onclick="selectPaymentMethod('wechat')">微信支付</button>
                    <button class="order-btn order-btn-outline" onclick="selectPaymentMethod('alipay')">支付宝</button>
                    <button class="order-btn order-btn-outline" onclick="selectPaymentMethod('cash')">现金</button>
                    <button class="order-btn order-btn-outline" onclick="selectPaymentMethod('card')">刷卡</button>
                </div>
                <div style="padding: var(--spacing-md); background-color: var(--color-neutral-50); border-radius: var(--radius-md); margin-top: var(--spacing-md);">
                    <label style="display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-primary); cursor: pointer;">
                        <input type="checkbox" checked> 打印小票
                    </label>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmCheckout()">确认结算</button>
            </div>
        </div>
    `);
}

// 创建弹窗
function createModal(content) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="order-modal-backdrop" onclick="closeOrderModal()"></div>
        ${content}
    `;

    modalContainer.appendChild(modal);
    setTimeout(() => modal.classList.add('order-modal-show'), 10);

    return modal;
}

// 关闭弹窗
function closeOrderModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    const modals = modalContainer.querySelectorAll('.order-modal');
    modals.forEach(modal => {
        modal.classList.remove('order-modal-show');
        setTimeout(() => modal.remove(), 300);
    });
}

// 搜索会员
function searchMember() {
    console.log('搜索会员');
    // 实现搜索逻辑
}

// 新增会员
function addNewMember() {
    console.log('新增会员');
    // 实现新增会员逻辑
}

// 确认储值
function confirmStorage() {
    console.log('确认储值');
    closeOrderModal();
}

// 选择支付方式
function selectPaymentMethod(method) {
    console.log('选择支付方式:', method);
}

// 确认结算
function confirmCheckout() {
    console.log('确认结算');
    // 清空订单
    orderItems = [];
    updateOrderDisplay();
    closeOrderModal();
}

// 显示挂单列表弹窗
function showHangOrderModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>挂单列表</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div id="hangOrderList" style="max-height: 400px; overflow-y: auto;">
                    <p style="text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg);">暂无挂单</p>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-outline" onclick="closeOrderModal()">取消</button>
            </div>
        </div>
    `);
}

// 显示折扣设置弹窗
function showDiscountModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>整单打折\减免</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div class="order-form-group">
                    <label>折扣比例（%）</label>
                    <input type="number" class="order-form-input" placeholder="请输入折扣比例" id="discountPercent">
                </div>
                <div class="order-form-group">
                    <label>或减免金额（元）</label>
                    <input type="number" class="order-form-input" placeholder="请输入减免金额" id="discountAmount">
                </div>
                <div class="order-form-group">
                    <label>折扣原因</label>
                    <input type="text" class="order-form-input" placeholder="请输入折扣原因" id="discountReason">
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmDiscount()">确认</button>
            </div>
        </div>
    `);
}

// 显示备注弹窗
function showRemarkModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>整单备注</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div class="order-form-group">
                    <textarea class="order-form-input" style="min-height: 100px; resize: vertical;" placeholder="请输入备注信息" id="orderRemark"></textarea>
                </div>
                <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md); flex-wrap: wrap;">
                    <button class="order-btn order-btn-outline" style="font-size: var(--font-size-xs); padding: var(--spacing-xs) var(--spacing-sm);" onclick="setRemark('不要辣')">不要辣</button>
                    <button class="order-btn order-btn-outline" style="font-size: var(--font-size-xs); padding: var(--spacing-xs) var(--spacing-sm);" onclick="setRemark('少盐')">少盐</button>
                    <button class="order-btn order-btn-outline" style="font-size: var(--font-size-xs); padding: var(--spacing-xs) var(--spacing-sm);" onclick="setRemark('打包')">打包</button>
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmRemark()">确认</button>
            </div>
        </div>
    `);
}

// 显示团购核销弹窗
function showGrouponModal() {
    const modal = createModal(`
        <div class="order-modal-content">
            <div class="order-modal-header">
                <h3>团购券核销</h3>
                <button class="order-modal-close" onclick="closeOrderModal()">×</button>
            </div>
            <div class="order-modal-body">
                <div style="padding: var(--spacing-xl); text-align: center; background-color: var(--color-neutral-50); border-radius: var(--radius-md); border: 2px dashed var(--color-neutral-300); margin-bottom: var(--spacing-md);">
                    <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">请扫描团购券二维码</p>
                </div>
                <div class="order-form-group">
                    <input type="text" class="order-form-input" placeholder="或手动输入券码" id="grouponCode">
                </div>
            </div>
            <div class="order-modal-footer">
                <button class="order-btn order-btn-secondary" onclick="closeOrderModal()">取消</button>
                <button class="order-btn order-btn-primary" onclick="confirmGroupon()">核销</button>
            </div>
        </div>
    `);
}

// 确认折扣
function confirmDiscount() {
    console.log('确认折扣');
    closeOrderModal();
}

// 设置备注快捷选项
function setRemark(text) {
    const remarkInput = document.getElementById('orderRemark');
    if (remarkInput) {
        remarkInput.value = text;
    }
}

// 确认备注
function confirmRemark() {
    const remarkInput = document.getElementById('orderRemark');
    if (remarkInput) {
        console.log('订单备注:', remarkInput.value);
    }
    closeOrderModal();
}

// 确认团购核销
function confirmGroupon() {
    const grouponCode = document.getElementById('grouponCode');
    if (grouponCode) {
        console.log('团购券码:', grouponCode.value);
    }
    closeOrderModal();
}

// 全局函数
window.closeOrderModal = closeOrderModal;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.deleteItem = deleteItem;
window.addToOrder = addToOrder;
