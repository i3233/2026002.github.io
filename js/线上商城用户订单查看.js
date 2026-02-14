(function () {
    var STORAGE_KEY = 'mallUserOrders';
    var statusTextMap = { pending: '待支付', paid: '待发货', shipped: '已发货', completed: '已完成', cancelled: '已取消' };

    function getOrders() {
        try {
            var r = localStorage.getItem(STORAGE_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }

    function renderDesktop() {
        var list = getOrders();
        var filter = (document.getElementById('statusFilter') || {}).value || '';
        var filtered = filter ? list.filter(function (o) { return o.status === filter; }) : list;

        var tbody = document.getElementById('orderTableBody');
        var emptyEl = document.getElementById('orderEmpty');
        if (!tbody) return;
        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        tbody.innerHTML = filtered.map(function (o) {
            return '<tr>' +
                '<td>' + (o.orderNo || '') + '</td>' +
                '<td>' + (o.userName || '') + ' ' + (o.userPhone || '') + '</td>' +
                '<td>' + (o.summary || '-') + '</td>' +
                '<td>¥' + (o.amount != null ? Number(o.amount).toFixed(2) : '0.00') + '</td>' +
                '<td>' + (statusTextMap[o.status] || o.status || '') + '</td>' +
                '<td>' + (o.createdAt || '') + '</td></tr>';
        }).join('');
    }

    // 渲染手机端模拟界面
    function renderPhone(statusFilter) {
        var list = getOrders();
        var filtered = statusFilter ? list.filter(function (o) { return o.status === statusFilter; }) : list;
        var listEl = document.getElementById('phoneOrderList');
        if (!listEl) return;

        if (!filtered.length) {
            listEl.innerHTML = '<div style="padding:16px;text-align:center;color:#9ca3af;font-size:13px;">暂无相关订单</div>';
            return;
        }

        listEl.innerHTML = filtered.map(function (o) {
            var statusText = statusTextMap[o.status] || o.status || '';
            return '' +
                '<div class="phone-order-item">' +
                '  <div class="phone-order-top">' +
                '    <span>订单号 ' + (o.orderNo || '') + '</span>' +
                '    <span class="phone-order-status">' + statusText + '</span>' +
                '  </div>' +
                '  <div class="phone-order-body">' +
                '    <div class="phone-order-goods">' + (o.summary || '-') + '</div>' +
                '    <div class="phone-order-amount">¥' + (o.amount != null ? Number(o.amount).toFixed(2) : '0.00') + '</div>' +
                '  </div>' +
                '  <div class="phone-order-footer">' +
                (o.status === 'pending'
                    ? '<button class="phone-order-btn primary">去支付</button>'
                    : o.status === 'paid'
                    ? '<button class="phone-order-btn primary">提醒发货</button>'
                    : o.status === 'shipped'
                    ? '<button class="phone-order-btn primary">确认收货</button>'
                    : '<button class="phone-order-btn">再次购买</button>') +
                '  </div>' +
                '</div>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var orders = getOrders();
        if (orders.length === 0) {
            var demo = [
                { orderNo: 'M202602030001', userName: '张三', userPhone: '138****8001', summary: '雅安特产绿营养蛋x2 等', amount: 88.5, status: 'paid', createdAt: '2026-02-03 10:00' },
                { orderNo: 'M202602030002', userName: '李四', userPhone: '139****8002', summary: '锅巴肉片x1', amount: 35, status: 'completed', createdAt: '2026-02-02 15:30' },
                { orderNo: 'M202602030003', userName: '王五', userPhone: '137****8003', summary: '蒙顶山茶x1 等', amount: 120, status: 'pending', createdAt: '2026-02-01 09:20' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        }
        document.getElementById('statusFilter').addEventListener('change', renderDesktop);
        document.getElementById('refreshBtn').addEventListener('click', renderDesktop);

        // 手机端预览按钮
        var openPhoneBtn = document.getElementById('openPhonePreviewBtn');
        var phoneOverlay = document.getElementById('phoneOverlay');
        var phoneCloseBtn = document.getElementById('phoneCloseBtn');
        if (openPhoneBtn && phoneOverlay) {
            openPhoneBtn.addEventListener('click', function () {
                phoneOverlay.classList.add('show');
                renderPhone('');
                // 重置顶部tab选中
                document.querySelectorAll('.phone-tab').forEach(function (tab) {
                    tab.classList.toggle('active', !tab.dataset.status);
                });
            });
        }
        if (phoneCloseBtn && phoneOverlay) {
            phoneCloseBtn.addEventListener('click', function () {
                phoneOverlay.classList.remove('show');
            });
        }
        if (phoneOverlay) {
            phoneOverlay.addEventListener('click', function (e) {
                if (e.target === phoneOverlay) phoneOverlay.classList.remove('show');
            });
        }
        // 手机端tab切换
        document.querySelectorAll('.phone-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var status = this.dataset.status || '';
                document.querySelectorAll('.phone-tab').forEach(function (t) {
                    t.classList.toggle('active', t === tab);
                });
                renderPhone(status);
            });
        });

        renderDesktop();
    });
})();
