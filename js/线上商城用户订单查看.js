(function () {
    var STORAGE_KEY = 'mallUserOrders';
    var statusTextMap = { pending: '待支付', paid: '待发货', shipped: '已发货', completed: '已完成', cancelled: '已取消' };

    function getOrders() {
        try {
            var r = localStorage.getItem(STORAGE_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }

    function render() {
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

    document.addEventListener('DOMContentLoaded', function () {
        var orders = getOrders();
        if (orders.length === 0) {
            var demo = [
                { orderNo: 'M202602030001', userName: '张三', userPhone: '138****8001', summary: '商品x2等', amount: 88.5, status: 'paid', createdAt: '2026-02-03 10:00' },
                { orderNo: 'M202602030002', userName: '李四', userPhone: '139****8002', summary: '商品x1', amount: 35, status: 'completed', createdAt: '2026-02-02 15:30' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        }
        document.getElementById('statusFilter').addEventListener('change', render);
        document.getElementById('refreshBtn').addEventListener('click', render);
        render();
    });
})();
