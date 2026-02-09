(function () {
    var STORAGE_KEY = 'mallUserOrders';
    var DRIVERS_KEY = 'mallDeliveryDrivers';
    var statusTextMap = { paid: '待发货', shipped: '已发货', completed: '已完成' };

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
        var filter = (document.getElementById('statusFilter') || {}).value || '';
        var filtered = filter ? list.filter(function (o) { return o.status === filter; }) : list;
        var drivers = getDrivers();

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
            var driverName = o.driverName || (o.driverId ? (getDrivers().find(function (d) { return d.id === o.driverId; }) || {}).name : '') || '-';
            var ops = '';
            if (o.status === 'paid') {
                ops += '<button type="button" class="btn-sm btn-primary btn-ship" data-id="' + (o.orderNo || o.id) + '">发货</button>';
                ops += '<button type="button" class="btn-sm btn-assign" data-id="' + (o.orderNo || o.id) + '">分配配送员</button>';
            }
            if (o.status === 'shipped') {
                ops += '<button type="button" class="btn-sm btn-complete" data-id="' + (o.orderNo || o.id) + '">完成</button>';
            }
            if (!ops) ops = '-';
            return '<tr data-order="' + (o.orderNo || o.id) + '">' +
                '<td>' + (o.orderNo || '') + '</td>' +
                '<td>' + (o.userName || '') + ' ' + (o.userPhone || '') + '</td>' +
                '<td>¥' + (o.amount != null ? Number(o.amount).toFixed(2) : '0.00') + '</td>' +
                '<td>' + (statusTextMap[o.status] || o.status || '') + '</td>' +
                '<td>' + driverName + '</td>' +
                '<td>' + ops + '</td></tr>';
        }).join('');

        tbody.querySelectorAll('.btn-ship').forEach(function (btn) {
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
        tbody.querySelectorAll('.btn-assign').forEach(function (btn) {
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
        tbody.querySelectorAll('.btn-complete').forEach(function (btn) {
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
        document.getElementById('statusFilter').addEventListener('change', render);
        document.getElementById('refreshBtn').addEventListener('click', render);
        render();
    });
})();
