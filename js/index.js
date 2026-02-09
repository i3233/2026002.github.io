// 菜单数据结构
const menuData = [
    {
        module: "商超",
        items: [
            {
                title: "商品",
                children: [
                    { title: "商品列表", path: "pages/商超/商品列表.html" },
                    { title: "套餐列表", path: "pages/商超/套餐列表.html" },
                    { title: "商品分类", path: "pages/商超/商品分类.html" },
                    { title: "商品标签", path: "pages/商超/商品标签.html" }
                ]
            },
            {
                title: "采购",
                children: [
                    { title: "采购订单", path: "pages/商超/采购订单.html" },
                    { title: "采购入库", path: "pages/商超/采购入库.html" },
                    { title: "采购退货", path: "pages/商超/采购退货.html" }
                ]
            },
            {
                title: "销售",
                children: [
                    { title: "全部订单", path: "pages/商超/全部订单.html" },
                    { title: "线上订单", path: "pages/商超/线上订单.html" },
                    { title: "提货点管理", path: "pages/商超/提货点管理.html" },
                    { title: "收银台订单", path: "pages/商超/收银台订单.html" },
                    { title: "批发订单", path: "pages/商超/批发订单.html" }
                ]
            },
            {
                title: "库存",
                children: [
                    { title: "库存查询", path: "pages/商超/库存查询.html" },
                    { title: "调拨处理（列表）", path: "pages/商超/调拨处理.html" }
                ]
            },
            {
                title: "报表",
                children: [
                    { title: "当日结存单", path: "pages/商超/当日结存单.html" },
                    { title: "历史结存", path: "pages/商超/历史结存.html" }
                ]
            },
            {
                title: "设置",
                children: [
                    { title: "商品", path: "pages/商超/设置/商品.html" },
                    { title: "订单", path: "pages/商超/设置/订单.html" },
                    { title: "支付", path: "pages/商超/设置/支付.html" },
                    { title: "配送", path: "pages/商超/设置/配送.html" }
                ]
            }
        ]
    },
    {
        module: "收银台",
        items: [
            { title: "收银台主界面", path: "pages/收银台/收银台主界面.html" },
            { title: "基础配置", path: "pages/收银台/基础配置.html" },
            { title: "商品添加", path: "pages/收银台/商品添加.html" },
            { title: "收银员", path: "pages/收银台/收银员.html" },
            { title: "交班管理", path: "pages/收银台/交班管理.html" },
            { title: "导购/拣货/服务员", path: "pages/收银台/导购管理.html" },
            { title: "导购业绩", path: "pages/收银台/导购业绩.html" },
            { title: "收银报表", path: "pages/收银台/收银报表.html" }
        ]
    },
    {
        module: "线上商城",
        items: [
            { title: "基础配置", path: "pages/线上商城/基础配置.html" },
            { title: "商品添加", path: "pages/线上商城/商品添加.html" },
            { title: "配送员管理", path: "pages/线上商城/配送员管理.html" },
            { title: "用户订单查看", path: "pages/线上商城/用户订单查看.html" },
            { title: "订单管理", path: "pages/线上商城/订单管理.html" }
        ]
    },
    {
        module: "财务管理",
        items: [
            { title: "收支汇总", path: "pages/财务管理/收支汇总.html" },
            { title: "采购汇总", path: "pages/财务管理/采购汇总.html" },
            { title: "订单汇总", path: "pages/财务管理/订单汇总.html" },
            { title: "库存汇总", path: "pages/财务管理/库存汇总.html" },
            { title: "往来汇总", path: "pages/财务管理/往来汇总.html" },
            { title: "往来单位", path: "pages/财务管理/往来单位.html" },
            { title: "资金汇总", path: "pages/财务管理/资金汇总.html" },
            { title: "业绩汇总", path: "pages/财务管理/业绩汇总.html" },
            { title: "利润表", path: "pages/财务管理/利润表.html" },
            {
                title: "审核中心",
                children: [
                    { title: "采购入库审核", path: "pages/财务管理/采购入库审核.html" },
                    { title: "采购退货审核", path: "pages/财务管理/采购退货审核.html" },
                    { title: "批发订单审核", path: "pages/财务管理/批发订单审核.html" },
                    { title: "调拨审核", path: "pages/财务管理/调拨审核.html" }
                ]
            },
            { title: "老板一张表", path: "pages/财务管理/老板一张表.html" },
            { title: "仓库管理", path: "pages/财务管理/仓库管理.html" },
            { title: "仓库基础配置", path: "pages/财务管理/仓库基础配置.html" },
            { title: "资金管理", path: "pages/财务管理/资金管理.html" }
        ]
    },
    {
        module: "餐饮",
        items: [
            {
                title: "商品",
                children: [
                    { title: "商品列表", path: "pages/餐饮/商品列表.html" },
                    { title: "套餐列表", path: "pages/餐饮/套餐列表.html" },
                    { title: "商品分类", path: "pages/餐饮/商品分类.html" },
                    { title: "商品标签", path: "pages/餐饮/商品标签.html" }
                ]
            },
            {
                title: "采购",
                children: [
                    { title: "采购订单列表", path: "pages/餐饮/采购订单列表.html" },
                    { title: "采购入库记录", path: "pages/餐饮/采购入库记录.html" },
                    { title: "采购退货记录", path: "pages/餐饮/采购退货记录.html" }
                ]
            },
            {
                title: "销售",
                children: [
                    { title: "全部订单", path: "pages/餐饮/全部订单.html" },
                    { title: "线上订单", path: "pages/餐饮/线上订单.html" },
                    { title: "收银台订单", path: "pages/餐饮/收银台订单.html" }
                ]
            },
            {
                title: "分析",
                children: [
                    { title: "菜品原料设置", path: "pages/餐饮/菜品原料设置.html" },
                    { title: "用料分析", path: "pages/餐饮/用料分析.html" }
                ]
            },
            {
                title: "桌台",
                children: [
                    { title: "桌台管理", path: "pages/餐饮/桌台管理.html" },
                    { title: "桌台二维码管理", path: "pages/餐饮/桌台二维码管理.html" },
                    { title: "扫码点餐", path: "pages/餐饮/扫码点餐.html" }
                ]
            },
            {
                title: "报表",
                children: [
                    { title: "当日结存单", path: "pages/餐饮/当日结存单.html" },
                    { title: "进销存汇总", path: "pages/餐饮/进销存汇总.html" },
                    { title: "历史结存", path: "pages/餐饮/历史结存.html" }
                ]
            },
            {
                title: "设置",
                children: [
                    { title: "商品", path: "pages/餐饮/设置/商品.html" },
                    { title: "订单", path: "pages/餐饮/设置/订单.html" },
                    { title: "支付", path: "pages/餐饮/设置/支付.html" },
                    { title: "配送", path: "pages/餐饮/设置/配送.html" }
                ]
            }
        ]
    }
];

// 当前选中的模块
let currentModuleName = null;

// 生成菜单HTML（支持指定模块）
function generateMenu(moduleName = null) {
    const menuContainer = document.getElementById('sidebarMenu');
    if (!menuContainer) return;
    
    let menuHTML = '';

    // 如果指定了模块名，只显示该模块的菜单
    const modulesToShow = moduleName 
        ? menuData.filter(m => m.module === moduleName)
        : menuData;

    if (modulesToShow.length === 0) {
        menuHTML = '<div style="padding: var(--spacing-md); color: var(--color-text-secondary); text-align: center;">暂无菜单</div>';
        menuContainer.innerHTML = menuHTML;
        return;
    }

    modulesToShow.forEach((module, moduleIndex) => {
        // 主模块标题（如果只显示一个模块，默认展开；否则默认收起）
        const isExpanded = moduleName !== null;
        menuHTML += `<div class="menu-module ${isExpanded ? '' : 'collapsed'}" data-module-index="${moduleIndex}" data-module-name="${module.module}">`;
        menuHTML += `<div class="module-title" onclick="toggleModule(this)" data-module-index="${moduleIndex}">`;
        menuHTML += `<span class="module-title-text">${module.module}</span>`;
        menuHTML += `<svg class="module-arrow" viewBox="0 0 16 16" fill="currentColor">`;
        menuHTML += `<path d="M6 12l4-4-4-4"/>`;
        menuHTML += `</svg>`;
        menuHTML += `</div>`;
        menuHTML += `<div class="module-content">`;

        // 一级菜单
        module.items.forEach(item => {
            if (item.children && item.children.length > 0) {
                // 有子菜单的一级菜单
                menuHTML += `<div class="menu-item" data-module="${module.module}" data-item="${item.title}">`;
                menuHTML += `<div class="menu-item-link" onclick="toggleSubmenu(this)">`;
                menuHTML += `<span class="menu-item-text">${item.title}</span>`;
                menuHTML += `<svg class="menu-item-arrow" viewBox="0 0 16 16" fill="currentColor">`;
                menuHTML += `<path d="M6 12l4-4-4-4"/>`;
                menuHTML += `</svg>`;
                menuHTML += `</div>`;
                menuHTML += `<div class="submenu">`;
                
                item.children.forEach(child => {
                    menuHTML += `<div class="submenu-item">`;
                    menuHTML += `<a href="#" class="submenu-item-link" data-path="${child.path}" data-title="${child.title}" onclick="loadPage(event, '${child.path}', '${child.title}')">${child.title}</a>`;
                    menuHTML += `</div>`;
                });
                
                menuHTML += `</div>`;
                menuHTML += `</div>`;
            } else {
                // 无子菜单的一级菜单
                menuHTML += `<div class="menu-item">`;
                menuHTML += `<a href="#" class="menu-item-link" data-path="${item.path}" data-title="${item.title}" onclick="loadPage(event, '${item.path}', '${item.title}')">`;
                menuHTML += `<span class="menu-item-text">${item.title}</span>`;
                menuHTML += `</a>`;
                menuHTML += `</div>`;
            }
        });

        menuHTML += `</div>`; // 关闭 module-content
        menuHTML += `</div>`; // 关闭 menu-module
    });

    menuContainer.innerHTML = menuHTML;
    currentModuleName = moduleName;
}

// 切换到指定模块的菜单
function switchToModule(moduleName) {
    console.log('切换到模块:', moduleName);
    generateMenu(moduleName);
    
    // 侧边栏标题现在是链接，不需要更新文本
    // 如果需要显示当前模块，可以在标题后添加提示
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle && moduleName) {
        // 保持"卡片入口页"不变，或者可以显示当前模块
        // sidebarTitle.textContent = '卡片入口页';
    }
}

// 确保函数在全局作用域中可用
if (typeof window !== 'undefined') {
    window.switchToModule = switchToModule;
    window.generateMenu = generateMenu;
}

// 切换主模块展开/收起
function toggleModule(element) {
    const menuModule = element.closest('.menu-module');
    if (!menuModule) return;
    
    menuModule.classList.toggle('collapsed');
}

// 切换子菜单展开/收起
function toggleSubmenu(element) {
    const menuItem = element.closest('.menu-item');
    menuItem.classList.toggle('expanded');
}

// 查找菜单项的完整路径信息
function findMenuPath(path) {
    for (const module of menuData) {
        // 检查一级菜单（无子菜单）
        for (const item of module.items) {
            if (item.path === path) {
                return {
                    module: module.module,
                    level1: item.title,
                    level2: null,
                    path: path
                };
            }
        }
        
        // 检查二级菜单（有子菜单）
        for (const item of module.items) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.path === path) {
                        return {
                            module: module.module,
                            level1: item.title,
                            level2: child.title,
                            path: path
                        };
                    }
                }
            }
        }
    }
    return null;
}

// 更新面包屑导航
function updateBreadcrumb(pathInfo) {
    const breadcrumbNav = document.getElementById('breadcrumbNav');
    
    if (!pathInfo) {
        breadcrumbNav.innerHTML = '<span class="breadcrumb-item">首页</span>';
        return;
    }
    
    let breadcrumbHTML = '<a href="#" class="breadcrumb-item breadcrumb-link" onclick="goHome(event)">首页</a>';
    
    // 主模块
    breadcrumbHTML += '<span class="breadcrumb-separator">/</span>';
    breadcrumbHTML += `<span class="breadcrumb-item">${pathInfo.module}</span>`;
    
    // 一级菜单
    if (pathInfo.level1) {
        breadcrumbHTML += '<span class="breadcrumb-separator">/</span>';
        breadcrumbHTML += `<span class="breadcrumb-item">${pathInfo.level1}</span>`;
    }
    
    // 二级菜单
    if (pathInfo.level2) {
        breadcrumbHTML += '<span class="breadcrumb-separator">/</span>';
        breadcrumbHTML += `<span class="breadcrumb-item">${pathInfo.level2}</span>`;
    }
    
    breadcrumbNav.innerHTML = breadcrumbHTML;
}

// 标签页管理
const tabsManager = {
    tabs: [], // 存储所有标签页信息
    activeTabId: null, // 当前激活的标签页ID
    
    // 生成唯一ID
    generateId: function() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // 查找标签页
    findTab: function(path) {
        return this.tabs.find(tab => tab.path === path);
    },
    
    // 添加标签页
    addTab: function(path, title, pathInfo) {
        // 检查是否已存在
        let tab = this.findTab(path);
        if (tab) {
            // 如果已存在，切换到该标签页
            this.switchTab(tab.id);
            return tab;
        }
        
        // 创建新标签页
        const tabId = this.generateId();
        tab = {
            id: tabId,
            path: path,
            title: title,
            pathInfo: pathInfo
        };
        
        this.tabs.push(tab);
        this.activeTabId = tabId;
        
        // 创建iframe
        this.createIframe(tabId, path);
        
        // 更新UI
        this.renderTabs();
        this.updateBreadcrumb(pathInfo);
        document.getElementById('contentTitle').textContent = title;
        
        // 更新菜单激活状态
        this.updateMenuActiveState(path);
        
        // 显示返回按钮
        const backToCardsBtn = document.getElementById('backToCardsBtn');
        if (backToCardsBtn) {
            backToCardsBtn.style.display = 'inline-flex';
        }
        
        return tab;
    },
    
    // 创建iframe
    createIframe: function(tabId, path) {
        const contentBody = document.getElementById('contentBody');
        const placeholder = document.getElementById('contentPlaceholder');
        
        // 隐藏占位符
        if (placeholder) placeholder.style.display = 'none';
        
        // 隐藏菜单页面的iframe（如果存在）
        const menuFrame = document.getElementById('menuFrame');
        if (menuFrame) {
            menuFrame.style.display = 'none';
        }
        
        // 隐藏卡片入口（如果存在）
        const grid = document.getElementById('moduleEntryGrid');
        const header = document.querySelector('.module-entry-header');
        if (grid) grid.style.display = 'none';
        if (header) header.style.display = 'none';
        
        // 创建iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'frame_' + tabId;
        iframe.src = path;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; display: none;';
        contentBody.appendChild(iframe);
        
        // 显示当前标签页的iframe
        this.showActiveIframe();
    },
    
    // 显示激活的iframe
    showActiveIframe: function() {
        // 隐藏所有内容iframe
        document.querySelectorAll('[id^="frame_"]').forEach(frame => {
            frame.style.display = 'none';
        });
        
        // 隐藏菜单页面iframe（如果存在）
        const menuFrame = document.getElementById('menuFrame');
        if (menuFrame) {
            menuFrame.style.display = 'none';
        }
        
        // 显示当前激活的iframe
        if (this.activeTabId) {
            const activeFrame = document.getElementById('frame_' + this.activeTabId);
            if (activeFrame) {
                activeFrame.style.display = 'block';
            }
        }
    },
    
    // 切换标签页
    switchTab: function(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;
        
        this.activeTabId = tabId;
        
        // 更新UI
        this.renderTabs();
        this.updateBreadcrumb(tab.pathInfo);
        document.getElementById('contentTitle').textContent = tab.title;
        
        // 显示对应的iframe
        this.showActiveIframe();
        
        // 更新菜单激活状态
        this.updateMenuActiveState(tab.path);
    },
    
    // 更新菜单激活状态
    updateMenuActiveState: function(path) {
        // 移除所有活动状态
        document.querySelectorAll('.menu-item-link.active, .submenu-item-link.active').forEach(link => {
            link.classList.remove('active');
        });
        
        // 查找对应的菜单项并激活
        const menuLink = document.querySelector(`[data-path="${path}"]`);
        if (menuLink) {
            menuLink.classList.add('active');
            
            // 如果是子菜单项，也激活父菜单并展开
            const menuItem = menuLink.closest('.menu-item');
            if (menuItem && menuLink.classList.contains('submenu-item-link')) {
                const parentLink = menuItem.querySelector('.menu-item-link');
                if (parentLink && parentLink !== menuLink) {
                    parentLink.classList.add('active');
                    menuItem.classList.add('expanded');
                }
            }
        }
    },
    
    // 关闭标签页
    closeTab: function(tabId, event) {
        if (event) {
            event.stopPropagation();
        }
        
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;
        
        // 移除iframe
        const iframe = document.getElementById('frame_' + tabId);
        if (iframe) {
            iframe.remove();
        }
        
        // 从数组中移除
        this.tabs.splice(tabIndex, 1);
        
        // 如果关闭的是当前激活的标签页
        if (this.activeTabId === tabId) {
            if (this.tabs.length > 0) {
                // 切换到最后一个标签页
                const newActiveTab = this.tabs[this.tabs.length - 1];
                this.switchTab(newActiveTab.id);
            } else {
                // 没有标签页了，显示占位符
                this.activeTabId = null;
                document.getElementById('contentPlaceholder').style.display = 'flex';
                document.getElementById('contentTitle').textContent = '欢迎使用';
                updateBreadcrumb(null);
                
                // 移除所有活动状态
                document.querySelectorAll('.menu-item-link.active, .submenu-item-link.active').forEach(link => {
                    link.classList.remove('active');
                });
                
                // 收起所有展开的菜单
                document.querySelectorAll('.menu-item.expanded').forEach(item => {
                    item.classList.remove('expanded');
                });
            }
        }
        
        // 更新标签页UI
        this.renderTabs();
    },
    
    // 渲染标签页
    renderTabs: function() {
        const tabsWrapper = document.getElementById('tabsWrapper');
        
        if (this.tabs.length === 0) {
            tabsWrapper.innerHTML = '';
            return;
        }
        
        let tabsHTML = '';
        this.tabs.forEach(tab => {
            const isActive = tab.id === this.activeTabId;
            tabsHTML += `
                <div class="tab-item ${isActive ? 'active' : ''}" onclick="tabsManager.switchTab('${tab.id}')">
                    <span class="tab-item-title" title="${tab.title}">${tab.title}</span>
                    <span class="tab-item-close" onclick="tabsManager.closeTab('${tab.id}', event)" title="关闭">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </span>
                </div>
            `;
        });
        
        tabsWrapper.innerHTML = tabsHTML;
    },
    
    // 更新面包屑（复用原有函数）
    updateBreadcrumb: function(pathInfo) {
        updateBreadcrumb(pathInfo);
    }
};

// 加载页面
function loadPage(event, path, title) {
    event.preventDefault();
    
    // 查找路径信息
    const pathInfo = findMenuPath(path);
    
    // 添加或切换到标签页（会自动更新标题、面包屑和菜单状态）
    tabsManager.addTab(path, title, pathInfo);
}

// 返回首页
function goHome(event) {
    event.preventDefault();
    
    // 调用返回卡片函数
    if (typeof goBackToCards === 'function') {
        goBackToCards(event);
    } else {
        // 如果没有goBackToCards函数，执行原来的逻辑
        // 关闭所有标签页
        tabsManager.tabs.forEach(tab => {
            const iframe = document.getElementById('frame_' + tab.id);
            if (iframe) {
                iframe.remove();
            }
        });
        tabsManager.tabs = [];
        tabsManager.activeTabId = null;
        
        // 更新UI
        tabsManager.renderTabs();
        document.getElementById('contentTitle').textContent = '欢迎使用';
        updateBreadcrumb(null);
        document.getElementById('contentPlaceholder').style.display = 'flex';
        
        // 移除所有活动状态
        document.querySelectorAll('.menu-item-link.active, .submenu-item-link.active').forEach(link => {
            link.classList.remove('active');
        });
        
        // 收起所有展开的菜单
        document.querySelectorAll('.menu-item.expanded').forEach(item => {
            item.classList.remove('expanded');
        });
    }
}

// 页面加载完成后生成菜单和初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始不显示任何模块菜单，只显示卡片入口
    const menuContainer = document.getElementById('sidebarMenu');
    if (menuContainer) {
        menuContainer.innerHTML = '<div style="padding: var(--spacing-md); color: var(--color-text-secondary); text-align: center;">请从右侧选择功能模块</div>';
    }
    // 初始化面包屑为首页
    updateBreadcrumb(null);
    // 初始化标签页
    tabsManager.renderTabs();
    
    // 确保侧边栏标题链接可用
    const sidebarTitleLink = document.querySelector('.sidebar-title-link');
    if (sidebarTitleLink && typeof goBackToCards === 'function') {
        sidebarTitleLink.addEventListener('click', function(e) {
            e.preventDefault();
            goBackToCards(e);
        });
    }
});
