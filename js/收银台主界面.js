// 收银台主界面交互逻辑

// 菜单页面配置（点单对应桌位页，内含点单浮层）
const menuPages = {
    'table': {
        name: '点单',
        path: '子页面/桌位.html'
    },
    'order-list': {
        name: '订单',
        path: '子页面/订单.html'
    },
    'product': {
        name: '商品',
        path: '子页面/商品.html'
    },
    'finance': {
        name: '财务',
        path: '子页面/财务.html'
    },
    'member': {
        name: '会员',
        path: '子页面/会员.html'
    },
    'settings': {
        name: '设置',
        path: '子页面/设置.html'
    }
};

// 获取当前收银台类型（catering=餐饮 / mall=商超）
function getCashierType() {
    var params = new URLSearchParams(window.location.search || '');
    return params.get('type') || 'catering';
}

// 检查 URL 参数，若 type=catering 或 type=mall 则隐藏切换栏、使用统一布局
function applyUrlTypeParam() {
    var params = new URLSearchParams(window.location.search || '');
    var type = params.get('type');
    if (type === 'catering' || type === 'mall') {
        var bar = document.getElementById('cashierTopBar');
        if (bar) bar.style.display = 'none';
        var viewMall = document.getElementById('viewMall');
        if (viewMall) viewMall.classList.add('hidden');
        var viewCatering = document.getElementById('viewCatering');
        if (viewCatering) viewCatering.classList.remove('hidden');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    applyUrlTypeParam();
    initMenuEvents();
    initShiftButton();
    initTypeSwitch();
    var type = getCashierType();
    var defaultMenu = 'table';
    // 默认进入桌位界面（餐饮/商超均一致）
    document.querySelectorAll('.cashier-menu-item[data-menu]').forEach(function(item) {
        item.classList.toggle('active', item.dataset.menu === defaultMenu);
    });
    loadPage(defaultMenu);
});

// 餐饮/商超收银台切换
function initTypeSwitch() {
    var btnCatering = document.getElementById('btnCatering');
    var btnMall = document.getElementById('btnMall');
    var viewCatering = document.getElementById('viewCatering');
    var viewMall = document.getElementById('viewMall');
    if (!btnCatering || !btnMall || !viewCatering || !viewMall) return;
    btnCatering.addEventListener('click', function() {
        btnCatering.classList.add('active');
        btnMall.classList.remove('active');
        viewCatering.classList.remove('hidden');
        viewMall.classList.add('hidden');
    });
    btnMall.addEventListener('click', function() {
        btnMall.classList.add('active');
        btnCatering.classList.remove('active');
        viewMall.classList.remove('hidden');
        viewCatering.classList.add('hidden');
    });
}

// 初始化菜单事件
function initMenuEvents() {
    const menuItems = document.querySelectorAll('.cashier-menu-item[data-menu]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const menuType = this.dataset.menu;
            
            // 更新激活状态
            document.querySelectorAll('.cashier-menu-item').forEach(menu => {
                menu.classList.remove('active');
            });
            this.classList.add('active');
            
    // 加载对应的页面
    loadPage(menuType);
});
    });
}

// 加载页面（供主界面菜单与子页 iframe 通过 postMessage 调用）
function loadPage(menuType) {
    const contentFrame = document.getElementById('cashierContentFrame');
    if (!contentFrame) return;
    
    const pageConfig = menuPages[menuType];
    if (!pageConfig) return;
    
    var type = getCashierType();
    var path = pageConfig.path;
    if (type === 'mall') {
        path = path.indexOf('?') >= 0 ? path + '&type=mall' : path + '?type=mall';
    }
    contentFrame.src = path;
}

// 接收 iframe 内子页消息，避免跨域无法访问 parent（如 file:// 下 origin 为 null）
window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'loadCashierPage' && e.data.menuType) {
        loadPage(e.data.menuType);
    }
});

// 交班数据弹窗
function getShiftUpdateTimeStr() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var h = String(d.getHours()).padStart(2, '0');
    var min = String(d.getMinutes()).padStart(2, '0');
    var s = String(d.getSeconds()).padStart(2, '0');
    return y + '-' + m + '-' + day + ' ' + h + ':' + min + ':' + s + ' 已更新';
}

function showShiftModal() {
    var modal = document.getElementById('shiftModal');
    if (modal) {
        document.getElementById('shiftUpdateTime').textContent = getShiftUpdateTimeStr();
        modal.classList.add('shift-modal-show');
    }
}

function hideShiftModal() {
    var modal = document.getElementById('shiftModal');
    if (modal) modal.classList.remove('shift-modal-show');
}

function initShiftModal() {
    var modal = document.getElementById('shiftModal');
    var backdrop = modal && modal.querySelector('.shift-modal-backdrop');
    var refreshBtn = document.getElementById('shiftRefreshBtn');
    var closeBtn = document.getElementById('shiftCloseBtn');
    var submitBtn = document.getElementById('shiftSubmitBtn');
    if (backdrop) {
        backdrop.addEventListener('click', function () { hideShiftModal(); });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', function () { hideShiftModal(); });
    }
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            document.getElementById('shiftUpdateTime').textContent = getShiftUpdateTimeStr();
        });
    }
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            var needPrint = document.getElementById('shiftPrintReceipt') && document.getElementById('shiftPrintReceipt').checked;
            hideShiftModal();
            if (needPrint) alert('已打印交接班小票（示例）');
            alert('交接班成功，请重新登录（示例）');
        });
    }
}

// 初始化交班按钮
function initShiftButton() {
    const shiftBtn = document.getElementById('shiftBtn');
    if (shiftBtn) {
        shiftBtn.addEventListener('click', function() {
            showShiftModal();
        });
    }
    initShiftModal();
}
