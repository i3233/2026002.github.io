// 收银台主界面交互逻辑

// 菜单页面配置
const menuPages = {
    'order': {
        name: '点单',
        path: '子页面/点单.html'
    },
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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initMenuEvents();
    initPowerButton();
    // 默认加载点单页面
    loadPage('order');
});

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

// 加载页面
function loadPage(menuType) {
    const contentFrame = document.getElementById('cashierContentFrame');
    if (!contentFrame) return;
    
    const pageConfig = menuPages[menuType];
    if (!pageConfig) return;
    
    // 通过iframe加载页面
    contentFrame.src = pageConfig.path;
}

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
