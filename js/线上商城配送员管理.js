(function () {
    var STORAGE_KEY = 'mallDeliveryDrivers';

    function getList() {
        try {
            var r = localStorage.getItem(STORAGE_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }
    function setList(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function render() {
        var list = getList();
        var tbody = document.getElementById('driverTableBody');
        var emptyEl = document.getElementById('driverEmpty');
        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        tbody.innerHTML = list.map(function (d) {
            var statusClass = d.status === 'on' ? 'status-on' : 'status-off';
            var statusText = d.status === 'on' ? '接单中' : '已停用';
            return '<tr data-id="' + (d.id || '') + '">' +
                '<td>' + (d.name || '') + '</td>' +
                '<td>' + (d.phone || '') + '</td>' +
                '<td><span class="' + statusClass + '">' + statusText + '</span></td>' +
                '<td>' + (d.area || '-') + '</td>' +
                '<td>' + (d.orderCount != null ? d.orderCount : 0) + '</td>' +
                '<td><button type="button" class="btn-link edit-driver">编辑</button> <button type="button" class="btn-link toggle-driver">' + (d.status === 'on' ? '停用' : '启用') + '</button></td></tr>';
        }).join('');

        tbody.querySelectorAll('.edit-driver').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                var id = row && row.dataset.id;
                var list = getList();
                var item = list.find(function (d) { return String(d.id) === String(id); });
                if (item) {
                    var name = prompt('姓名', item.name);
                    if (name != null) {
                        var phone = prompt('手机号', item.phone);
                        if (phone != null) {
                            var area = prompt('负责区域', item.area || '');
                            item.name = name;
                            item.phone = phone;
                            item.area = area != null ? area : item.area;
                            setList(list);
                            render();
                        }
                    }
                }
            });
        });
        tbody.querySelectorAll('.toggle-driver').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                var id = row && row.dataset.id;
                var list = getList();
                var item = list.find(function (d) { return String(d.id) === String(id); });
                if (item) {
                    item.status = item.status === 'on' ? 'off' : 'on';
                    setList(list);
                    render();
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var list = getList();
        if (list.length === 0) {
            setList([
                { id: '1', name: '张师傅', phone: '13800138001', status: 'on', area: 'A区', orderCount: 12 },
                { id: '2', name: '李师傅', phone: '13800138002', status: 'on', area: 'B区', orderCount: 8 }
            ]);
        }
        render();
        document.getElementById('addDriverBtn').addEventListener('click', function () {
            var name = prompt('配送员姓名');
            if (name == null || !name.trim()) return;
            var phone = prompt('手机号');
            if (phone == null || !phone.trim()) return;
            var area = prompt('负责区域', '');
            var list = getList();
            var id = String(Date.now());
            list.push({ id: id, name: name.trim(), phone: phone.trim(), status: 'on', area: area || '', orderCount: 0 });
            setList(list);
            render();
        });
    });
})();
