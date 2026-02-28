// 收银台主界面交互逻辑

// 菜单页面配置（点单已整合到桌位内，不再单独入口）
const menuPages = {
    'table': {
        name: '桌位',
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
    'queue': {
        name: '排号',
        path: '子页面/排号.html'
    },
    'finance': {
        name: '财务',
        path: '子页面/财务.html'
    },
    'member': {
        name: '会员',
        path: '子页面/会员.html'
    },
    'kitchen': {
        name: '制作',
        path: '子页面/制作.html'
    },
    'settings': {
        name: '设置',
        path: '子页面/设置.html'
    }
};

// 检查 URL 参数，若 type=catering 则隐藏切换栏、仅显示餐饮收银台
function applyUrlTypeParam() {
    var params = new URLSearchParams(window.location.search || '');
    var type = params.get('type');
    if (type === 'catering') {
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
    initPowerButton();
    initTypeSwitch();
    // 默认加载桌位页面
    loadPage('table');
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
    
    contentFrame.src = pageConfig.path;
}

// 接收 iframe 内子页消息，避免跨域无法访问 parent（如 file:// 下 origin 为 null）
window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'loadCashierPage' && e.data.menuType) {
        loadPage(e.data.menuType);
    }
});

// 初始化电源按钮
function initPowerButton() {
    const powerBtn = document.getElementById('powerBtn');
    if (powerBtn) {
        powerBtn.addEventListener('click', function() {
            if (confirm('请选择操作：\n1. 确定 - 注销登录\n2. 取消 - 取消操作')) {
                // 执行注销登录逻辑
                console.log('注销登录');
                // window.location.href = '../../index.html';
            }
        });
    }
}
