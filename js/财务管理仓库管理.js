(function () {
    var WH_KEY = 'financeWarehouseList';
    var KEEPER_KEY = 'financeWarehouseKeepers';

    function getWarehouses() {
        try {
            var r = localStorage.getItem(WH_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }
    function setWarehouses(list) {
        localStorage.setItem(WH_KEY, JSON.stringify(list));
    }
    function getKeepers() {
        try {
            var r = localStorage.getItem(KEEPER_KEY);
            return r ? JSON.parse(r) : [];
        } catch (e) { return []; }
    }
    function setKeepers(list) {
        localStorage.setItem(KEEPER_KEY, JSON.stringify(list));
    }

    function getKeeperNamesForWarehouse(warehouseId) {
        return getKeepers()
            .filter(function (k) { return k.status !== 'disabled' && (k.warehouseIds || []).indexOf(warehouseId) >= 0; })
            .map(function (k) { return k.name; })
            .join('、') || '-';
    }

    function renderWarehouses() {
        var list = getWarehouses();
        var tbody = document.getElementById('warehouseTableBody');
        var emptyEl = document.getElementById('warehouseEmpty');
        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        tbody.innerHTML = list.map(function (w) {
            var statusClass = w.status === 'enabled' ? 'wh-tag-success' : 'wh-tag';
            var statusText = w.status === 'enabled' ? '启用' : '停用';
            var keepers = getKeeperNamesForWarehouse(w.id);
            return '<tr data-id="' + w.id + '">' +
                '<td>' + (w.code || '') + '</td>' +
                '<td>' + (w.name || '') + '</td>' +
                '<td>' + keepers + '</td>' +
                '<td><span class="wh-tag ' + statusClass + '">' + statusText + '</span></td>' +
                '<td><button type="button" class="wh-btn-link btn-edit-wh">编辑</button> <button type="button" class="wh-btn-link btn-assign-wh">分配库管</button></td></tr>';
        }).join('');

        tbody.querySelectorAll('.btn-edit-wh').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                if (row) openWarehouseModal(row.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-assign-wh').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                if (row) openAssignModal(row.dataset.id);
            });
        });
    }

    function renderKeepers() {
        var list = getKeepers();
        var warehouses = getWarehouses();
        var tbody = document.getElementById('keeperTableBody');
        var emptyEl = document.getElementById('keeperEmpty');
        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        tbody.innerHTML = list.map(function (k) {
            var ids = k.warehouseIds || [];
            var names = ids.map(function (id) {
                var w = warehouses.find(function (x) { return x.id === id; });
                return w ? w.name : id;
            }).join('、') || '-';
            var statusClass = k.status === 'enabled' ? 'wh-tag-success' : 'wh-tag';
            var statusText = k.status === 'enabled' ? '启用' : '停用';
            return '<tr data-id="' + k.id + '">' +
                '<td>' + (k.name || '') + '</td>' +
                '<td>' + (k.account || '') + '</td>' +
                '<td>' + names + '</td>' +
                '<td><span class="wh-tag ' + statusClass + '">' + statusText + '</span></td>' +
                '<td><button type="button" class="wh-btn-link btn-edit-keeper">编辑</button></td></tr>';
        }).join('');

        tbody.querySelectorAll('.btn-edit-keeper').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                if (row) openKeeperModal(row.dataset.id);
            });
        });
    }

    var editingWarehouseId = null;
    function openWarehouseModal(id) {
        editingWarehouseId = id || null;
        document.getElementById('warehouseModalTitle').textContent = id ? '编辑仓库' : '新增仓库';
        document.getElementById('whCode').value = '';
        document.getElementById('whName').value = '';
        document.getElementById('whStatus').value = 'enabled';
        if (id) {
            var list = getWarehouses();
            var w = list.find(function (x) { return x.id === id; });
            if (w) {
                document.getElementById('whCode').value = w.code || '';
                document.getElementById('whName').value = w.name || '';
                document.getElementById('whStatus').value = w.status || 'enabled';
            }
        }
        document.getElementById('warehouseModal').classList.remove('hidden');
    }
    function closeWarehouseModal() {
        document.getElementById('warehouseModal').classList.add('hidden');
        editingWarehouseId = null;
    }
    function saveWarehouse() {
        var code = document.getElementById('whCode').value.trim();
        var name = document.getElementById('whName').value.trim();
        var status = document.getElementById('whStatus').value;
        if (!name) { alert('请填写仓库名称'); return; }
        var list = getWarehouses();
        if (editingWarehouseId) {
            var w = list.find(function (x) { return x.id === editingWarehouseId; });
            if (w) {
                w.code = code || w.code;
                w.name = name;
                w.status = status;
                setWarehouses(list);
            }
        } else {
            list.push({ id: 'wh_' + Date.now(), code: code || '', name: name, status: status });
            setWarehouses(list);
        }
        closeWarehouseModal();
        renderWarehouses();
    }

    var editingKeeperId = null;
    function openKeeperModal(id) {
        editingKeeperId = id || null;
        document.getElementById('keeperModalTitle').textContent = id ? '编辑库管员' : '添加库管员';
        document.getElementById('keeperName').value = '';
        document.getElementById('keeperAccount').value = '';
        document.getElementById('keeperStatus').value = 'enabled';
        var list = getWarehouses();
        var html = list.map(function (w) {
            var checked = '';
            if (id) {
                var keepers = getKeepers();
                var k = keepers.find(function (x) { return x.id === id; });
                if (k && (k.warehouseIds || []).indexOf(w.id) >= 0) checked = ' checked';
            }
            return '<div class="wh-checkbox-item"><label><input type="checkbox" class="keeper-wh-cb" value="' + w.id + '"' + checked + '> ' + (w.name || w.code || w.id) + '</label></div>';
        }).join('');
        document.getElementById('keeperWarehouseList').innerHTML = html || '<div class="wh-empty">请先添加仓库</div>';
        if (id) {
            var keepers = getKeepers();
            var k = keepers.find(function (x) { return x.id === id; });
            if (k) {
                document.getElementById('keeperName').value = k.name || '';
                document.getElementById('keeperAccount').value = k.account || '';
                document.getElementById('keeperStatus').value = k.status || 'enabled';
            }
        }
        document.getElementById('keeperModal').classList.remove('hidden');
    }
    function closeKeeperModal() {
        document.getElementById('keeperModal').classList.add('hidden');
        editingKeeperId = null;
    }
    function saveKeeper() {
        var name = document.getElementById('keeperName').value.trim();
        var account = document.getElementById('keeperAccount').value.trim();
        var status = document.getElementById('keeperStatus').value;
        if (!name) { alert('请填写库管员姓名'); return; }
        var selected = [];
        document.querySelectorAll('#keeperWarehouseList .keeper-wh-cb:checked').forEach(function (cb) { selected.push(cb.value); });
        var list = getKeepers();
        if (editingKeeperId) {
            var k = list.find(function (x) { return x.id === editingKeeperId; });
            if (k) {
                k.name = name;
                k.account = account;
                k.warehouseIds = selected;
                k.status = status;
                setKeepers(list);
            }
        } else {
            list.push({ id: 'kp_' + Date.now(), name: name, account: account, warehouseIds: selected, status: status });
            setKeepers(list);
        }
        closeKeeperModal();
        renderKeepers();
        renderWarehouses();
    }

    var assignWarehouseId = null;
    function openAssignModal(warehouseId) {
        assignWarehouseId = warehouseId;
        var list = getWarehouses();
        var w = list.find(function (x) { return x.id === warehouseId; });
        document.getElementById('assignWarehouseName').textContent = w ? w.name : warehouseId;
        var keepers = getKeepers();
        var kIds = [];
        keepers.forEach(function (k) {
            if ((k.warehouseIds || []).indexOf(warehouseId) >= 0) kIds.push(k.id);
        });
        var html = keepers.map(function (k) {
            var checked = kIds.indexOf(k.id) >= 0 ? ' checked' : '';
            return '<div class="wh-checkbox-item"><label><input type="checkbox" class="assign-keeper-cb" value="' + k.id + '"' + checked + '> ' + (k.name || '') + ' ' + (k.account ? '(' + k.account + ')' : '') + '</label></div>';
        }).join('');
        document.getElementById('assignKeeperList').innerHTML = html || '<div class="wh-empty">请先添加库管员</div>';
        document.getElementById('assignKeeperModal').classList.remove('hidden');
    }
    function closeAssignModal() {
        document.getElementById('assignKeeperModal').classList.add('hidden');
        assignWarehouseId = null;
    }
    function saveAssign() {
        if (!assignWarehouseId) return;
        var selected = [];
        document.querySelectorAll('#assignKeeperList .assign-keeper-cb:checked').forEach(function (cb) { selected.push(cb.value); });
        var list = getKeepers();
        list.forEach(function (k) {
            var ids = k.warehouseIds || [];
            var has = ids.indexOf(assignWarehouseId) >= 0;
            var want = selected.indexOf(k.id) >= 0;
            if (has && !want) ids = ids.filter(function (id) { return id !== assignWarehouseId; });
            if (!has && want) ids = ids.concat(assignWarehouseId);
            k.warehouseIds = ids;
        });
        setKeepers(list);
        closeAssignModal();
        renderKeepers();
        renderWarehouses();
    }

    function init() {
        var wh = getWarehouses();
        if (wh.length === 0) {
            setWarehouses([
                { id: 'wh1', code: 'CK001', name: '批发库', status: 'enabled' },
                { id: 'wh2', code: 'CK002', name: '零售库', status: 'enabled' },
                { id: 'wh3', code: 'CK003', name: '临时库', status: 'enabled' }
            ]);
            wh = getWarehouses();
        }
        var keepers = getKeepers();
        if (keepers.length === 0) {
            setKeepers([
                { id: 'kp1', name: '张库管', account: '13800138001', warehouseIds: ['wh1', 'wh2'], status: 'enabled' },
                { id: 'kp2', name: '李库管', account: '13800138002', warehouseIds: ['wh2', 'wh3'], status: 'enabled' },
                { id: 'kp3', name: '王库管', account: '13800138003', warehouseIds: ['wh1', 'wh3'], status: 'enabled' }
            ]);
        }
        renderWarehouses();
        renderKeepers();

        document.getElementById('addWarehouseBtn').addEventListener('click', function () { openWarehouseModal(); });
        document.getElementById('warehouseModalClose').addEventListener('click', closeWarehouseModal);
        document.getElementById('warehouseModalCancel').addEventListener('click', closeWarehouseModal);
        document.getElementById('warehouseModalSave').addEventListener('click', saveWarehouse);

        document.getElementById('addKeeperBtn').addEventListener('click', function () { openKeeperModal(); });
        document.getElementById('keeperModalClose').addEventListener('click', closeKeeperModal);
        document.getElementById('keeperModalCancel').addEventListener('click', closeKeeperModal);
        document.getElementById('keeperModalSave').addEventListener('click', saveKeeper);

        document.getElementById('assignKeeperModalClose').addEventListener('click', closeAssignModal);
        document.getElementById('assignKeeperModalCancel').addEventListener('click', closeAssignModal);
        document.getElementById('assignKeeperModalSave').addEventListener('click', saveAssign);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
