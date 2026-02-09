// 线上商城 - 商品添加：展示已同步商品，提供上线/下线
(function () {
    var STORAGE_KEY = 'mallSyncedProducts';

    function getSyncedList() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function setSyncedList(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function setOnline(productId, source, online) {
        var list = getSyncedList();
        var item = list.find(function (p) { return p.productId === productId && p.source === source; });
        if (item) {
            item.online = !!online;
            item.updatedAt = new Date().toISOString();
            setSyncedList(list);
            return true;
        }
        return false;
    }

    var SHANGCHAO_KEY = 'shangchaoProductList';
    var CANYIN_KEY = 'canyinProductList';

    // 默认商超商品（弹窗无缓存数据时使用，与商超商品列表保持一致）
    var defaultShangchaoProducts = [
        { id: 1,  name: '雅安特产绿营养蛋', category: '雅安好景', image: '../../images/01.jpg', price: 20.00 },
        { id: 2,  name: '土司农家散养蛋',     category: '雅安好景', image: '../../images/02.jpg', price: 18.00 },
        { id: 3,  name: '有机山茶油',         category: '雅安好景', image: '../../images/03.jpg', price: 36.00 },
        { id: 4,  name: '腊味礼盒',           category: '雅安好景', image: '../../images/04.jpg', price: 15.00 },
        { id: 5,  name: '蒙顶山茶',           category: '雅安好景', image: '../../images/05.jpg', price: 49.00 },
        { id: 6,  name: '雅鱼鲜礼盒',         category: '雅安好景', image: '../../images/06.jpg', price: 68.00 },
        { id: 7,  name: '花椒油',             category: '雅安好景', image: '../../images/01.jpg', price: 15.00 },
        { id: 13, name: '雅安蜂蜜',           category: '雅安好物', image: '../../images/01.jpg', price: 38.00 },
        { id: 14, name: '雅安黑茶',           category: '雅安好物', image: '../../images/02.jpg', price: 88.00 },
        { id: 15, name: '雅安菌菇干货',       category: '雅安好物', image: '../../images/03.jpg', price: 45.00 },
        { id: 8,  name: '熊猫周边玩偶',       category: '文创产品',   image: '../../images/02.jpg', price: 28.00 },
        { id: 9,  name: '雅安风景明信片',     category: '文创产品',   image: '../../images/03.jpg', price: 58.00 },
        { id: 10, name: '茶具套装',           category: '文创产品',   image: '../../images/04.jpg', price: 52.00 },
        { id: 11, name: '手工茶饼',           category: '文创产品',   image: '../../images/05.jpg', price: 58.00 },
        { id: 12, name: '精品礼盒装',         category: '文创产品',   image: '../../images/06.jpg', price: 268.00 }
    ];
    // 默认餐饮商品（弹窗无缓存数据时使用）
    var defaultCanyinProducts = [
        { id: 1, name: '锅巴肉片', category: 'chinese', categoryName: '中餐', price: 68 },
        { id: 2, name: '肥肠血旺', category: 'chinese', categoryName: '中餐', price: 45 },
        { id: 3, name: '彩虹斗酒套装41支', category: 'rainbow', categoryName: '彩虹斗酒', price: 178 },
        { id: 4, name: '红尘玫瑰17支', category: 'rainbow', categoryName: '彩虹斗酒', price: 118 },
        { id: 5, name: '猕猴蓝17支', category: 'rainbow', categoryName: '彩虹斗酒', price: 118 },
        { id: 6, name: '草莓蜜酒17支', category: 'rainbow', categoryName: '彩虹斗酒', price: 118 }
    ];

    function isAlreadySynced(source, productId) {
        return getSyncedList().some(function (p) { return p.source === source && String(p.productId) === String(productId); });
    }

    function getProductListBySource(source) {
        try {
            var key = source === '商超' ? SHANGCHAO_KEY : CANYIN_KEY;
            var raw = localStorage.getItem(key);
            var list = raw ? JSON.parse(raw) : null;
            if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
        return source === '商超' ? defaultShangchaoProducts : defaultCanyinProducts;
    }

    var currentAddTab = '商超';

    function openAddModal() {
        var overlay = document.getElementById('addProductModal');
        if (overlay) overlay.classList.remove('hidden');
        currentAddTab = '商超';
        document.querySelectorAll('.mall-modal-tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === currentAddTab);
        });
        renderAddModalList();
    }

    function closeAddModal() {
        var overlay = document.getElementById('addProductModal');
        if (overlay) overlay.classList.add('hidden');
    }

    function renderAddModalList() {
        var listEl = document.getElementById('addModalList');
        var emptyEl = document.getElementById('addModalEmpty');
        if (!listEl) return;
        var list = getProductListBySource(currentAddTab);
        if (!Array.isArray(list)) list = currentAddTab === '商超' ? defaultShangchaoProducts : defaultCanyinProducts;
        if (list.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        listEl.innerHTML = list.map(function (item) {
            var id = item.id;
            var name = item.name || '';
            var category = item.categoryName || item.category || '';
            var price = item.price != null ? '¥' + Number(item.price).toFixed(2) : '';
            var added = isAlreadySynced(currentAddTab, id);
            var idStr = String(id);
            var safe = function (s) { return String(s == null || s === '' ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
            return '<li><label style="display:flex;align-items:center;gap:8px;cursor:' + (added ? 'default' : 'pointer') + ';">' +
                '<input type="checkbox" class="add-modal-checkbox" data-source="' + currentAddTab + '" data-id="' + safe(idStr) + '" data-name="' + safe(name) + '" data-category="' + safe(category) + '" data-price="' + (item.price != null ? item.price : '') + '" data-image="' + safe(item.image || '') + '" ' + (added ? 'disabled' : '') + '>' +
                '<span class="item-name">' + safe(name) + '</span>' +
                '<span class="item-meta">' + category + ' ' + price + '</span>' +
                (added ? '<span class="item-added">已添加</span>' : '') +
                '</label></li>';
        }).join('');
    }

    function confirmAddModal() {
        var list = getSyncedList();
        var added = 0;
        document.querySelectorAll('.add-modal-checkbox:not(:disabled):checked').forEach(function (cb) {
            var source = cb.dataset.source;
            var id = cb.dataset.id;
            var name = cb.dataset.name || '';
            var category = cb.dataset.category || '';
            var price = parseFloat(cb.dataset.price) || 0;
            var image = cb.dataset.image || '';
            if (list.some(function (p) { return p.source === source && String(p.productId) === String(id); })) return;
            list.push({
                source: source,
                productId: id,
                name: name,
                categoryName: category,
                category: category,
                price: price,
                image: image,
                syncedAt: new Date().toISOString(),
                online: false
            });
            added++;
        });
        if (added > 0) setSyncedList(list);
        closeAddModal();
        render();
        if (added > 0) alert('已添加 ' + added + ' 个商品。在商超/餐饮商品列表中的「同步到线上商城」开关将显示为已开启。');
    }

    function render() {
        var list = getSyncedList();
        var filter = (document.getElementById('sourceFilter') || {}).value || '';
        var filtered = filter ? list.filter(function (p) { return p.source === filter; }) : list;

        var tbody = document.getElementById('mallProductTableBody');
        var emptyEl = document.getElementById('mallProductEmpty');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';

        tbody.innerHTML = filtered.map(function (p) {
            var price = p.price != null ? '¥' + Number(p.price).toFixed(2) : '-';
            var time = p.syncedAt || p.updatedAt || '-';
            var statusClass = p.online ? 'mall-product-status-on' : 'mall-product-status-off';
            var statusText = p.online ? '已上线' : '未上线';
            var img = p.image ? '<img src="' + p.image + '" alt="">' : '<span style="width:40px;height:40px;background:var(--color-neutral-200);border-radius:var(--radius-md);"></span>';
            return (
                '<tr data-id="' + p.productId + '" data-source="' + (p.source || '') + '">' +
                '<td>' + (p.source || '') + '</td>' +
                '<td><div class="product-cell">' + img + '<span>' + (p.name || '') + '</span></div></td>' +
                '<td>' + (p.categoryName || p.category || '-') + '</td>' +
                '<td>' + price + '</td>' +
                '<td>' + time + '</td>' +
                '<td><span class="' + statusClass + '">' + statusText + '</span></td>' +
                '<td>' +
                (p.online
                    ? '<button type="button" class="mall-product-btn mall-product-btn-offline" data-action="offline">下线</button>'
                    : '<button type="button" class="mall-product-btn mall-product-btn-online" data-action="online">上线</button>') +
                '</td></tr>'
            );
        }).join('');

        tbody.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var row = btn.closest('tr');
                if (!row) return;
                var id = row.dataset.id;
                var source = row.dataset.source;
                var action = btn.dataset.action;
                if (action === 'online') {
                    setOnline(id, source, true);
                } else {
                    setOnline(id, source, false);
                }
                render();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 若本地没有商超/餐饮商品缓存，则写入默认列表，保证弹窗始终有数据
        try {
            if (!localStorage.getItem(SHANGCHAO_KEY) || JSON.parse(localStorage.getItem(SHANGCHAO_KEY) || '[]').length === 0) {
                localStorage.setItem(SHANGCHAO_KEY, JSON.stringify(defaultShangchaoProducts));
            }
            if (!localStorage.getItem(CANYIN_KEY) || JSON.parse(localStorage.getItem(CANYIN_KEY) || '[]').length === 0) {
                localStorage.setItem(CANYIN_KEY, JSON.stringify(defaultCanyinProducts));
            }
        } catch (e) {}

        var sourceFilter = document.getElementById('sourceFilter');
        if (sourceFilter) sourceFilter.addEventListener('change', render);
        var refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) refreshBtn.addEventListener('click', render);
        var addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) addProductBtn.addEventListener('click', openAddModal);
        var addModalClose = document.getElementById('addModalClose');
        if (addModalClose) addModalClose.addEventListener('click', closeAddModal);
        var addModalCancel = document.getElementById('addModalCancel');
        if (addModalCancel) addModalCancel.addEventListener('click', closeAddModal);
        var addModalConfirm = document.getElementById('addModalConfirm');
        if (addModalConfirm) addModalConfirm.addEventListener('click', confirmAddModal);
        document.querySelectorAll('.mall-modal-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                currentAddTab = this.dataset.tab || '商超';
                document.querySelectorAll('.mall-modal-tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === currentAddTab); });
                renderAddModalList();
            });
        });
        var overlay = document.getElementById('addProductModal');
        if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeAddModal(); });
        render();
    });
})();
