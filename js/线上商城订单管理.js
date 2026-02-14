(function () {
    var STORAGE_KEY = 'mallUserOrders';
    var DRIVERS_KEY = 'mallDeliveryDrivers';
    var statusTextMap = { paid: '待发货', shipped: '已发货', completed: '已完成' };
    var currentStatus = '';

    function getOrders() {
        try {
            var r = localStorage.getItem(STORAGE_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }
    function setOrders(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    function getDrivers() {
        try {
            var r = localStorage.getItem(DRIVERS_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }

    function render() {
        var list = getOrders();

        // 状态筛选（来源于顶部 Tab）
        var filtered = currentStatus ? list.filter(function (o) { return o.status === currentStatus; }) : list;

        // 关键字/配送方式等筛选（简单示例：关键字按订单号/用户名）
        var keywordInput = document.getElementById('keywordInput');
        if (keywordInput && keywordInput.value.trim()) {
            var kw = keywordInput.value.trim().toLowerCase();
            filtered = filtered.filter(function (o) {
                return (o.orderNo || '').toLowerCase().indexOf(kw) !== -1 ||
                    (o.userName || '').toLowerCase().indexOf(kw) !== -1;
            });
        }
        var drivers = getDrivers();

        var listEl = document.getElementById('mallOrderList');
        var emptyEl = document.getElementById('orderEmpty');
        if (!listEl) return;
        if (filtered.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';

        listEl.innerHTML = filtered.map(function (o) {
            var driverName = o.driverName || (o.driverId ? (getDrivers().find(function (d) { return d.id === o.driverId; }) || {}).name : '') || '-';
            var ops = '';
            if (o.status === 'paid') {
                ops += '<button type="button" class="mall-order-action-btn primary btn-ship" data-id="' + (o.orderNo || o.id) + '">发</button>';
                ops += '<button type="button" class="mall-order-action-btn btn-assign" data-id="' + (o.orderNo || o.id) + '">配</button>';
            }
            if (o.status === 'shipped') {
                ops += '<button type="button" class="mall-order-action-btn primary btn-complete" data-id="' + (o.orderNo || o.id) + '">完</button>';
            }
            if (!ops) {
                ops = '<span style="font-size:12px;color:#9ca3af;">-</span>';
            }

            var firstProduct = (o.products && o.products[0]) || null;
            var productName = firstProduct ? firstProduct.name : (o.summary || '-');
            var qtyText = firstProduct ? '共' + String(firstProduct.qty || 1) + '件' : '';

            return '' +
                '<div class="mall-order-card-item" data-order="' + (o.orderNo || o.id) + '">' +
                '  <div class="mall-order-header">' +
                '    <span class="date">' + (o.createdAt || '') + '</span>' +
                '    <span class="order-no">订单号：<b>' + (o.orderNo || '') + '</b></span>' +
                '    <span class="username">' + (o.userName || '') + ' ' + (o.userPhone || '') + '</span>' +
                '    <span class="mall-order-badge mall-order-badge-green">' + (statusTextMap[o.status] || o.status || '') + '</span>' +
                '    <span style="font-size:12px;color:#9ca3af;">配送员：' + driverName + '</span>' +
                '  </div>' +
                '  <div class="mall-order-body">' +
                '    <div class="mall-order-checkbox-col"><input type="checkbox" class="order-checkbox" data-id="' + (o.orderNo || o.id) + '"></div>' +
                '    <div class="mall-order-products-col">' +
                '      <div class="mall-order-product-item">' +
                '        <div class="mall-order-product-thumb"></div>' +
                '        <div class="mall-order-product-info">' +
                '          <div class="mall-order-product-name">' + productName + '</div>' +
                '          <div class="mall-order-product-spec">' + (qtyText || '') + '</div>' +
                '        </div>' +
                '      </div>' +
                '    </div>' +
                '    <div class="mall-order-payment-col">' +
                '      <div class="mall-order-payment-amount">¥' + (o.amount != null ? Number(o.amount).toFixed(2) : '0.00') + '</div>' +
                '      <div class="mall-order-payment-status">' + (o.payType || '在线支付') + '</div>' +
                '    </div>' +
                '    <div class="mall-order-actions-col">' +
                ops +
                '    </div>' +
                '  </div>' +
                '</div>';
        }).join('');

        listEl.querySelectorAll('.btn-ship').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.dataset.id;
                var orders = getOrders();
                var order = orders.find(function (o) { return (o.orderNo || o.id) === id; });
                if (order) {
                    order.status = 'shipped';
                    order.shippedAt = new Date().toLocaleString();
                    setOrders(orders);
                    render();
                }
            });
        });
        listEl.querySelectorAll('.btn-assign').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.dataset.id;
                var drivers = getDrivers();
                var names = drivers.map(function (d) { return d.name + ' (' + d.phone + ')'; }).join('\n');
                var choice = prompt('配送员列表（姓名 手机）：\n' + names + '\n\n请输入要分配的配送员姓名或序号（1-based）');
                if (choice == null) return;
                var idx = parseInt(choice, 10);
                var driver = isNaN(idx) ? drivers.find(function (d) { return d.name === choice.trim(); }) : drivers[idx - 1];
                if (driver) {
                    var orders = getOrders();
                    var order = orders.find(function (o) { return (o.orderNo || o.id) === id; });
                    if (order) {
                        order.driverId = driver.id;
                        order.driverName = driver.name;
                        setOrders(orders);
                        render();
                    }
                }
            });
        });
        listEl.querySelectorAll('.btn-complete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.dataset.id;
                var orders = getOrders();
                var order = orders.find(function (o) { return (o.orderNo || o.id) === id; });
                if (order) {
                    order.status = 'completed';
                    order.completedAt = new Date().toLocaleString();
                    setOrders(orders);
                    render();
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 若目前还没有任何订单数据，则预置几条示例订单，方便在订单管理页直接看到效果
        var existing = getOrders();
        if (!existing || existing.length === 0) {
            var demo = [
                { orderNo: 'M202602030001', userName: '张三', userPhone: '138****8001', summary: '雅安特产绿营养蛋x2 等', amount: 88.5, status: 'paid', createdAt: '2026-02-03 10:00', payType: '在线支付' },
                { orderNo: 'M202602030002', userName: '李四', userPhone: '139****8002', summary: '锅巴肉片x1', amount: 35, status: 'shipped', createdAt: '2026-02-02 15:30', payType: '在线支付' },
                { orderNo: 'M202602030003', userName: '王五', userPhone: '137****8003', summary: '蒙顶山茶x1 等', amount: 120, status: 'completed', createdAt: '2026-02-01 09:20', payType: '在线支付' }
            ];
            setOrders(demo);
        }

        var refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) refreshBtn.addEventListener('click', render);

        // 状态 Tab 绑定
        document.querySelectorAll('.mall-order-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.mall-order-tab').forEach(function (t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                currentStatus = tab.dataset.status || '';
                render();
            });
        });

        // 全选 & 批量操作（示意）
        var bottomSelectAll = document.getElementById('bottomSelectAll');
        if (bottomSelectAll) {
            bottomSelectAll.addEventListener('change', function () {
                var checked = this.checked;
                document.querySelectorAll('.order-checkbox').forEach(function (cb) {
                    cb.checked = checked;
                });
            });
        }
        var batchShipLink = document.getElementById('batchShipLink');
        if (batchShipLink) {
            batchShipLink.addEventListener('click', function () {
                alert('批量发货（示例）：这里可以根据选中的订单执行批量发货逻辑。');
            });
        }
        var batchCompleteLink = document.getElementById('batchCompleteLink');
        if (batchCompleteLink) {
            batchCompleteLink.addEventListener('click', function () {
                alert('批量完成（示例）：这里可以根据选中的订单执行批量完成逻辑。');
            });
        }

        render();
    });
})();
