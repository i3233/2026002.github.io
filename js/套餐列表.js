// 套餐列表页面交互逻辑

// 套餐数据（虚拟数据）
let packageListData = [
    {
        id: 1,
        name: '彩虹斗酒套餐41支',
        image: 'https://via.placeholder.com/60',
        description: '包含多种口味斗酒，适合聚会',
        category: 'discount',
        categoryName: '优惠套餐',
        price: 178.00,
        originalPrice: 220.00,
        products: ['红尘玫瑰17支', '猕猴蓝17支', '草莓蜜酒17支'],
        sales: 156,
        status: 'on'
    },
    {
        id: 2,
        name: '特色斗酒组合套餐',
        image: 'https://via.placeholder.com/60',
        description: '精选特色斗酒组合',
        category: 'special',
        categoryName: '特色套餐',
        price: 128.00,
        originalPrice: 160.00,
        products: ['特色斗酒A', '特色斗酒B', '特色斗酒C'],
        sales: 89,
        status: 'on'
    },
    {
        id: 3,
        name: '中餐双人套餐',
        image: 'https://via.placeholder.com/60',
        description: '锅巴肉片+肥肠血旺+米饭+汤',
        category: 'combo',
        categoryName: '组合套餐',
        price: 98.00,
        originalPrice: 128.00,
        products: ['锅巴肉片', '肥肠血旺', '米饭', '紫菜蛋花汤'],
        sales: 234,
        status: 'on'
    },
    {
        id: 4,
        name: '啤酒畅饮套餐',
        image: 'https://via.placeholder.com/60',
        description: '多种啤酒组合，适合聚会',
        category: 'discount',
        categoryName: '优惠套餐',
        price: 88.00,
        originalPrice: 120.00,
        products: ['啤酒A', '啤酒B', '啤酒C', '啤酒D'],
        sales: 312,
        status: 'on'
    },
    {
        id: 5,
        name: '软饮系列套餐',
        image: 'https://via.placeholder.com/60',
        description: '多种软饮组合',
        category: 'combo',
        categoryName: '组合套餐',
        price: 58.00,
        originalPrice: 75.00,
        products: ['可乐', '雪碧', '橙汁', '柠檬水'],
        sales: 145,
        status: 'on'
    },
    {
        id: 6,
        name: '小吃拼盘套餐',
        image: 'https://via.placeholder.com/60',
        description: '多种小吃组合',
        category: 'combo',
        categoryName: '组合套餐',
        price: 68.00,
        originalPrice: 85.00,
        products: ['炸鸡翅', '薯条', '鸡米花', '洋葱圈'],
        sales: 278,
        status: 'on'
    },
    {
        id: 7,
        name: '洋酒香槟套餐',
        image: 'https://via.placeholder.com/60',
        description: '精选洋酒香槟组合',
        category: 'special',
        categoryName: '特色套餐',
        price: 288.00,
        originalPrice: 360.00,
        products: ['洋酒A', '香槟B', '配菜C'],
        sales: 45,
        status: 'on'
    },
    {
        id: 8,
        name: '周末特惠套餐',
        image: 'https://via.placeholder.com/60',
        description: '周末限时特惠',
        category: 'discount',
        categoryName: '优惠套餐',
        price: 138.00,
        originalPrice: 180.00,
        products: ['主菜A', '配菜B', '饮料C', '甜品D'],
        sales: 167,
        status: 'off'
    }
];

// 筛选条件
let currentCategory = 'all';
let currentStatus = 'all';
let searchKeyword = '';

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
};

// 选中的套餐ID
let selectedPackages = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderPackageTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 搜索
    const searchInput = document.getElementById('packageSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            pagination.currentPage = 1;
            renderPackageTable();
            updatePagination();
        });
    }

    // 分类筛选
    document.querySelectorAll('.package-list-filter-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.package-list-filter-btn[data-category]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            pagination.currentPage = 1;
            renderPackageTable();
            updatePagination();
        });
    });

    // 状态筛选
    document.querySelectorAll('.package-list-filter-btn[data-status]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.package-list-filter-btn[data-status]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStatus = this.dataset.status;
            pagination.currentPage = 1;
            renderPackageTable();
            updatePagination();
        });
    });

    // 新建套餐
    const createPackageBtn = document.getElementById('createPackageBtn');
    if (createPackageBtn) {
        createPackageBtn.addEventListener('click', function() {
            showCreatePackageModal();
        });
    }

    // 初始化新建套餐表单
    initCreatePackageForm();

    // 批量操作下拉菜单
    const batchActionBtn = document.getElementById('batchActionBtn');
    const batchActionMenu = document.getElementById('batchActionMenu');
    if (batchActionBtn && batchActionMenu) {
        batchActionBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            batchActionMenu.style.display = batchActionMenu.style.display === 'none' ? 'block' : 'none';
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', function() {
            batchActionMenu.style.display = 'none';
        });
    }

    // 套餐导入
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            showImportPackageModal();
        });
    }

    // 初始化套餐导入表单
    initImportPackageForm();

    // 套餐导出
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportPackages();
        });
    }

    // 全选复选框
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }

    // 分页按钮
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (pagination.currentPage > 1) {
                pagination.currentPage--;
                renderPackageTable();
                updatePagination();
            }
        });
    }

    const nextPageBtn = document.getElementById('nextPageBtn');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(pagination.total / pagination.pageSize);
            if (pagination.currentPage < totalPages) {
                pagination.currentPage++;
                renderPackageTable();
                updatePagination();
            }
        });
    }

    // 每页显示数量
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            pagination.pageSize = parseInt(this.value);
            pagination.currentPage = 1;
            renderPackageTable();
            updatePagination();
        });
    }
}

// 渲染套餐表格
function renderPackageTable() {
    const tableBody = document.getElementById('packageTableBody');
    if (!tableBody) return;

    // 过滤套餐
    let filteredPackages = packageListData;

    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredPackages = filteredPackages.filter(p => p.category === currentCategory);
    }

    // 按状态过滤
    if (currentStatus !== 'all') {
        filteredPackages = filteredPackages.filter(p => p.status === currentStatus);
    }

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredPackages = filteredPackages.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            p.description.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 更新总数
    pagination.total = filteredPackages.length;

    // 分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pagedPackages = filteredPackages.slice(start, end);

    if (pagedPackages.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无套餐数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = pagedPackages.map(pkg => {
        const isSelected = selectedPackages.includes(pkg.id);
        const statusClass = pkg.status === 'on' ? 'package-list-status-badge-on' : 'package-list-status-badge-off';
        const statusText = pkg.status === 'on' ? '在售' : '停售';

        const productsList = pkg.products.map(product => 
            `<div class="package-list-product-item">${product}</div>`
        ).join('');

        return `
            <tr>
                <td>
                    <label class="package-list-checkbox-label">
                        <input type="checkbox" class="package-checkbox" value="${pkg.id}" ${isSelected ? 'checked' : ''} onchange="togglePackageSelection(${pkg.id})">
                    </label>
                </td>
                <td>
                    <div class="package-list-package-info">
                        <img src="${pkg.image}" alt="${pkg.name}" class="package-list-package-image" onerror="this.src='https://via.placeholder.com/60'">
                        <div>
                            <div class="package-list-package-name">${pkg.name}</div>
                            <div class="package-list-package-desc">${pkg.description}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="package-list-category-badge">${pkg.categoryName}</span>
                </td>
                <td>
                    <span class="package-list-price">¥${pkg.price.toFixed(2)}</span>
                </td>
                <td>
                    <span class="package-list-original-price">¥${pkg.originalPrice.toFixed(2)}</span>
                </td>
                <td>
                    <div class="package-list-products">
                        <div class="package-list-products-list">
                            ${productsList}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="package-list-sales-count">${pkg.sales}</span>
                </td>
                <td>
                    <span class="package-list-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="package-list-action-buttons">
                        <button class="package-list-action-btn package-list-action-btn-edit" onclick="editPackage(${pkg.id})">编辑</button>
                        <button class="package-list-action-btn package-list-action-btn-delete" onclick="deletePackage(${pkg.id})">删除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const paginationPages = document.getElementById('paginationPages');
    
    if (!paginationPages) return;

    let pagesHTML = '';
    
    if (totalPages <= 7) {
        // 如果总页数少于等于7页，显示所有页码
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === pagination.currentPage;
            pagesHTML += `<button class="package-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        // 如果总页数大于7页，显示省略号
        if (pagination.currentPage <= 4) {
            // 当前页在前4页
            for (let i = 1; i <= 5; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="package-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            pagesHTML += `<button class="package-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        } else if (pagination.currentPage >= totalPages - 3) {
            // 当前页在后4页
            pagesHTML += `<button class="package-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="package-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
            // 当前页在中间
            pagesHTML += `<button class="package-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="package-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            pagesHTML += `<button class="package-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        }
    }

    paginationPages.innerHTML = pagesHTML;

    // 更新按钮状态
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.disabled = pagination.currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = pagination.currentPage >= totalPages;
    }
}

// 跳转到指定页
function goToPage(page) {
    pagination.currentPage = page;
    renderPackageTable();
    updatePagination();
}

// 切换全选
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.package-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const packageId = parseInt(cb.value);
        if (checked) {
            if (!selectedPackages.includes(packageId)) {
                selectedPackages.push(packageId);
            }
        } else {
            selectedPackages = selectedPackages.filter(id => id !== packageId);
        }
    });
}

// 切换单个选择
function togglePackageSelection(packageId) {
    const index = selectedPackages.indexOf(packageId);
    if (index > -1) {
        selectedPackages.splice(index, 1);
    } else {
        selectedPackages.push(packageId);
    }
    
    // 更新全选状态
    const checkboxes = document.querySelectorAll('.package-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

// 批量操作
function batchAction(action) {
    // 关闭下拉菜单
    const batchActionMenu = document.getElementById('batchActionMenu');
    if (batchActionMenu) {
        batchActionMenu.style.display = 'none';
    }

    if (selectedPackages.length === 0) {
        alert('请先选择要操作的套餐');
        return;
    }

    const actionMap = {
        'modifyCategory': '修改分类',
        'delete': '删除',
        'enable': '启用',
        'disable': '禁用'
    };

    const actionName = actionMap[action] || '操作';
    
    if (confirm(`确定要对选中的 ${selectedPackages.length} 个套餐执行"${actionName}"操作吗？`)) {
        console.log('批量操作:', action, selectedPackages);
        
        if (action === 'delete') {
            packageListData = packageListData.filter(p => !selectedPackages.includes(p.id));
            alert('套餐删除成功');
        } else if (action === 'enable') {
            packageListData.forEach(p => {
                if (selectedPackages.includes(p.id)) {
                    p.status = 'on';
                }
            });
            alert('套餐启用成功');
        } else if (action === 'disable') {
            packageListData.forEach(p => {
                if (selectedPackages.includes(p.id)) {
                    p.status = 'off';
                }
            });
            alert('套餐禁用成功');
        } else if (action === 'modifyCategory') {
            alert('修改分类功能待实现');
            return;
        }

        selectedPackages = [];
        renderPackageTable();
        updatePagination();
    }
}

// 编辑套餐
function editPackage(packageId) {
    console.log('编辑套餐:', packageId);
    alert('编辑套餐功能待实现');
}

// 删除套餐
function deletePackage(packageId) {
    const pkg = packageListData.find(p => p.id === packageId);
    if (!pkg) return;

    if (confirm(`确定要删除套餐"${pkg.name}"吗？`)) {
        const index = packageListData.findIndex(p => p.id === packageId);
        if (index > -1) {
            packageListData.splice(index, 1);
            renderPackageTable();
            updatePagination();
            alert('套餐已删除');
        }
    }
}

// 导出套餐
function exportPackages() {
    let filteredPackages = packageListData;

    if (currentCategory !== 'all') {
        filteredPackages = filteredPackages.filter(p => p.category === currentCategory);
    }

    if (currentStatus !== 'all') {
        filteredPackages = filteredPackages.filter(p => p.status === currentStatus);
    }

    if (searchKeyword) {
        filteredPackages = filteredPackages.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            p.description.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 生成CSV内容
    let csvContent = '套餐名称,分类,套餐价,原价,包含商品,销量,状态\n';
    
    filteredPackages.forEach(pkg => {
        const status = pkg.status === 'on' ? '在售' : '停售';
        const products = pkg.products.join(';');
        csvContent += `${pkg.name},${pkg.categoryName},${pkg.price.toFixed(2)},${pkg.originalPrice.toFixed(2)},${products},${pkg.sales},${status}\n`;
    });

    // 创建下载链接
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `套餐列表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('套餐导出成功！');
}

// ========== 新建套餐弹窗相关函数 ==========

// 显示新建套餐弹窗
function showCreatePackageModal() {
    const modal = document.getElementById('createPackageModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetCreatePackageForm();
    }
}

// 关闭新建套餐弹窗
function closeCreatePackageModal() {
    const modal = document.getElementById('createPackageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 初始化新建套餐表单
function initCreatePackageForm() {
    // 封面图片上传
    const coverImageUpload = document.getElementById('packageCoverImageUpload');
    const coverImageInput = document.getElementById('packageCoverImageInput');
    if (coverImageUpload && coverImageInput) {
        coverImageUpload.addEventListener('click', () => coverImageInput.click());
        coverImageInput.addEventListener('change', handlePackageCoverImageUpload);
    }

    // 状态切换按钮
    const statusToggle = document.getElementById('packageStatusToggle');
    if (statusToggle) {
        statusToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const enableSwitch = document.getElementById('packageEnableSwitch');
            if (enableSwitch) {
                enableSwitch.checked = this.classList.contains('active');
            }
        });
    }

    // 启用开关
    const enableSwitch = document.getElementById('packageEnableSwitch');
    if (enableSwitch) {
        enableSwitch.addEventListener('change', function() {
            const statusToggle = document.getElementById('packageStatusToggle');
            if (statusToggle) {
                if (this.checked) {
                    statusToggle.classList.add('active');
                    statusToggle.querySelector('.package-list-status-toggle-text').textContent = '启用';
                } else {
                    statusToggle.classList.remove('active');
                    statusToggle.querySelector('.package-list-status-toggle-text').textContent = '禁用';
                }
            }
        });
    }

    // AI绘图按钮
    const aiDrawBtn = document.getElementById('packageAiDrawBtn');
    if (aiDrawBtn) {
        aiDrawBtn.addEventListener('click', function() {
            console.log('一键AI绘图');
            alert('AI绘图功能待实现');
        });
    }
}

// 处理封面图片上传
function handlePackageCoverImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5M');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('packageCoverImagePreview');
            const previewImg = document.getElementById('packageCoverImagePreviewImg');
            const uploadArea = document.getElementById('packageCoverImageUpload');
            if (preview && previewImg && uploadArea) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// 移除封面图片
function removePackageCoverImage() {
    const preview = document.getElementById('packageCoverImagePreview');
    const uploadArea = document.getElementById('packageCoverImageUpload');
    const coverImageInput = document.getElementById('packageCoverImageInput');
    if (preview && uploadArea && coverImageInput) {
        preview.style.display = 'none';
        uploadArea.style.display = 'block';
        coverImageInput.value = '';
    }
}

// 显示商品选择器
function showProductSelector() {
    const modal = document.getElementById('productSelectorModal');
    if (modal) {
        modal.style.display = 'flex';
        renderProductSelector();
    }
}

// 关闭商品选择器
function closeProductSelector() {
    const modal = document.getElementById('productSelectorModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 渲染商品选择器
function renderProductSelector() {
    const container = document.getElementById('productSelectorList');
    if (!container) return;

    // 模拟商品数据（实际应该从商品列表获取）
    const products = [
        { id: 1, name: '锅巴肉片', price: 68.00 },
        { id: 2, name: '肥肠血旺', price: 45.00 },
        { id: 3, name: '红尘玫瑰17支', price: 118.00 },
        { id: 4, name: '猕猴蓝17支', price: 118.00 },
        { id: 5, name: '草莓蜜酒17支', price: 118.00 },
        { id: 6, name: '啤酒A', price: 25.00 },
        { id: 7, name: '啤酒B', price: 28.00 },
        { id: 8, name: '可乐', price: 8.00 },
        { id: 9, name: '雪碧', price: 8.00 },
        { id: 10, name: '橙汁', price: 12.00 }
    ];

    // 获取已选中的商品ID
    const selectedProductIds = window.selectedProductsForPackage || [];

    container.innerHTML = products.map(product => {
        const isChecked = selectedProductIds.includes(product.id);
        return `
            <div class="package-list-selector-item">
                <input type="checkbox" value="${product.id}" ${isChecked ? 'checked' : ''} onchange="toggleProductSelection(${product.id})">
                <span class="package-list-selector-item-name">${product.name}</span>
                <span class="package-list-selector-item-price">¥${product.price.toFixed(2)}</span>
            </div>
        `;
    }).join('');
}

// 切换商品选择
function toggleProductSelection(productId) {
    if (!window.selectedProductsForPackage) {
        window.selectedProductsForPackage = [];
    }
    const index = window.selectedProductsForPackage.indexOf(productId);
    if (index > -1) {
        window.selectedProductsForPackage.splice(index, 1);
    } else {
        window.selectedProductsForPackage.push(productId);
    }
}

// 确认商品选择
function confirmProductSelection() {
    const selectedIds = window.selectedProductsForPackage || [];
    const selectedProductsList = document.getElementById('selectedProductsList');
    
    if (!selectedProductsList) return;

    if (selectedIds.length === 0) {
        selectedProductsList.innerHTML = '<div class="package-list-empty-hint">请选择商品</div>';
        closeProductSelector();
        return;
    }

    // 模拟商品数据（实际应该从商品列表获取）
    const products = [
        { id: 1, name: '锅巴肉片' },
        { id: 2, name: '肥肠血旺' },
        { id: 3, name: '红尘玫瑰17支' },
        { id: 4, name: '猕猴蓝17支' },
        { id: 5, name: '草莓蜜酒17支' },
        { id: 6, name: '啤酒A' },
        { id: 7, name: '啤酒B' },
        { id: 8, name: '可乐' },
        { id: 9, name: '雪碧' },
        { id: 10, name: '橙汁' }
    ];

    const selectedProducts = products.filter(p => selectedIds.includes(p.id));
    
    selectedProductsList.innerHTML = selectedProducts.map(product => `
        <span class="package-list-selected-product">
            ${product.name}
            <span class="package-list-selected-product-remove" onclick="removeSelectedProduct(${product.id})">×</span>
        </span>
    `).join('');

    closeProductSelector();
}

// 移除已选商品
function removeSelectedProduct(productId) {
    if (!window.selectedProductsForPackage) {
        window.selectedProductsForPackage = [];
    }
    const index = window.selectedProductsForPackage.indexOf(productId);
    if (index > -1) {
        window.selectedProductsForPackage.splice(index, 1);
    }
    
    // 更新显示
    confirmProductSelection();
}

// 重置新建套餐表单
function resetCreatePackageForm() {
    // 重置输入
    document.getElementById('packageNameInput').value = '';
    document.getElementById('packageDescriptionInput').value = '';
    document.getElementById('packagePriceInput').value = '';
    document.getElementById('packageOriginalPriceInput').value = '';
    document.getElementById('packageCategorySelect').value = '';
    document.getElementById('packageSortInput').value = '0';
    
    // 重置图片
    removePackageCoverImage();
    
    // 重置商品选择
    window.selectedProductsForPackage = [];
    const selectedProductsList = document.getElementById('selectedProductsList');
    if (selectedProductsList) {
        selectedProductsList.innerHTML = '<div class="package-list-empty-hint">请选择商品</div>';
    }
    
    // 重置开关
    const enableSwitch = document.getElementById('packageEnableSwitch');
    const statusToggle = document.getElementById('packageStatusToggle');
    if (enableSwitch) {
        enableSwitch.checked = true;
    }
    if (statusToggle) {
        statusToggle.classList.add('active');
        statusToggle.querySelector('.package-list-status-toggle-text').textContent = '启用';
    }
}

// 保存套餐
function savePackage() {
    const name = document.getElementById('packageNameInput').value.trim();
    const description = document.getElementById('packageDescriptionInput').value.trim();
    const price = parseFloat(document.getElementById('packagePriceInput').value);
    const originalPrice = parseFloat(document.getElementById('packageOriginalPriceInput').value);
    const category = document.getElementById('packageCategorySelect').value;
    const sort = parseInt(document.getElementById('packageSortInput').value) || 0;
    const enabled = document.getElementById('packageEnableSwitch').checked;

    // 验证必填项
    if (!name) {
        alert('请输入套餐名称');
        return;
    }
    if (isNaN(price) || price < 0) {
        alert('请输入有效的套餐价');
        return;
    }
    if (isNaN(originalPrice) || originalPrice < 0) {
        alert('请输入有效的原价');
        return;
    }
    if (!category) {
        alert('请选择分类');
        return;
    }
    if (!window.selectedProductsForPackage || window.selectedProductsForPackage.length === 0) {
        alert('请选择包含的商品');
        return;
    }

    // 获取分类名称
    const categorySelect = document.getElementById('packageCategorySelect');
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    // 获取商品名称
    const products = [
        { id: 1, name: '锅巴肉片' },
        { id: 2, name: '肥肠血旺' },
        { id: 3, name: '红尘玫瑰17支' },
        { id: 4, name: '猕猴蓝17支' },
        { id: 5, name: '草莓蜜酒17支' },
        { id: 6, name: '啤酒A' },
        { id: 7, name: '啤酒B' },
        { id: 8, name: '可乐' },
        { id: 9, name: '雪碧' },
        { id: 10, name: '橙汁' }
    ];
    const productNames = products
        .filter(p => window.selectedProductsForPackage.includes(p.id))
        .map(p => p.name);

    // 创建新套餐对象
    const newPackage = {
        id: Date.now(),
        name: name,
        image: 'https://via.placeholder.com/60',
        description: description,
        category: category,
        categoryName: categoryName,
        price: price,
        originalPrice: originalPrice,
        products: productNames,
        sales: 0,
        status: enabled ? 'on' : 'off'
    };

    // 添加到套餐列表
    packageListData.push(newPackage);
    
    // 刷新表格
    renderPackageTable();
    updatePagination();
    
    // 关闭弹窗
    closeCreatePackageModal();
    
    alert(`套餐"${name}"创建成功！`);
}

// ========== 套餐导入弹窗相关函数 ==========

// 显示套餐导入弹窗
function showImportPackageModal() {
    const modal = document.getElementById('importPackageModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetImportPackageForm();
    }
}

// 关闭套餐导入弹窗
function closeImportPackageModal() {
    const modal = document.getElementById('importPackageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 初始化套餐导入表单
function initImportPackageForm() {
    const uploadArea = document.getElementById('importFileUploadArea');
    const fileInput = document.getElementById('importFileInput');
    
    if (uploadArea && fileInput) {
        // 点击上传区域选择文件
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('has-file');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('has-file');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('has-file');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImportFileSelect(files[0]);
            }
        });

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImportFileSelect(e.target.files[0]);
            }
        });
    }
}

// 处理文件选择
function handleImportFileSelect(file) {
    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('请选择CSV格式的文件');
        return;
    }

    // 验证文件大小（假设最大10MB）
    if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过10MB');
        return;
    }

    // 更新文件名显示
    const fileNameEl = document.getElementById('importFileName');
    if (fileNameEl) {
        fileNameEl.textContent = file.name;
    }

    // 添加上传区域样式
    const uploadArea = document.getElementById('importFileUploadArea');
    if (uploadArea) {
        uploadArea.classList.add('has-file');
    }

    // 存储文件对象（用于后续上传）
    window.selectedImportFile = file;
}

// 重置导入表单
function resetImportPackageForm() {
    const fileInput = document.getElementById('importFileInput');
    const fileNameEl = document.getElementById('importFileName');
    const uploadArea = document.getElementById('importFileUploadArea');

    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '套餐表格文件.CSV';
    if (uploadArea) uploadArea.classList.remove('has-file');
    
    window.selectedImportFile = null;
}

// 下载模板
function downloadPackageTemplate() {
    // 创建CSV模板内容
    const csvContent = [
        ['套餐名称', '套餐描述', '套餐价', '原价', '分类', '包含商品', '排序'],
        ['示例套餐1', '这是示例套餐1的描述', '98.00', '128.00', '优惠套餐', '商品A;商品B;商品C', '1'],
        ['示例套餐2', '这是示例套餐2的描述', '158.00', '200.00', '组合套餐', '商品D;商品E', '2']
    ].map(row => row.join(',')).join('\n');

    // 添加BOM以支持中文
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '套餐导入模板.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('模板下载成功');
}

// 开始上传
function startPackageUpload() {
    if (!window.selectedImportFile) {
        alert('请先选择要上传的CSV文件');
        return;
    }

    // 验证文件
    if (!window.selectedImportFile.name.toLowerCase().endsWith('.csv')) {
        alert('请选择CSV格式的文件');
        return;
    }

    // 读取文件内容
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        
        // 解析CSV（简单解析，实际项目中应使用CSV解析库）
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            alert('文件内容为空');
            return;
        }

        // 验证行数限制（5000条）
        if (lines.length > 5001) { // 包含表头
            alert('单次上传不能超过5000条数据，当前文件包含' + (lines.length - 1) + '条数据');
            return;
        }

        // 这里可以添加实际的CSV解析和数据导入逻辑
        console.log('开始上传文件:', window.selectedImportFile.name);
        console.log('文件内容行数:', lines.length);
        
        // 模拟上传过程
        alert(`文件"${window.selectedImportFile.name}"上传成功！\n共${lines.length - 1}条数据\n（实际功能需要连接后端API进行数据导入）`);
        
        // 关闭弹窗
        closeImportPackageModal();
    };
    
    reader.onerror = function() {
        alert('文件读取失败，请重试');
    };
    
    reader.readAsText(window.selectedImportFile, 'UTF-8');
}

// 全局函数
window.togglePackageSelection = togglePackageSelection;
window.goToPage = goToPage;
window.batchAction = batchAction;
window.editPackage = editPackage;
window.deletePackage = deletePackage;
window.showCreatePackageModal = showCreatePackageModal;
window.closeCreatePackageModal = closeCreatePackageModal;
window.removePackageCoverImage = removePackageCoverImage;
window.showProductSelector = showProductSelector;
window.closeProductSelector = closeProductSelector;
window.toggleProductSelection = toggleProductSelection;
window.confirmProductSelection = confirmProductSelection;
window.removeSelectedProduct = removeSelectedProduct;
window.savePackage = savePackage;
window.showImportPackageModal = showImportPackageModal;
window.closeImportPackageModal = closeImportPackageModal;
window.downloadPackageTemplate = downloadPackageTemplate;
window.startPackageUpload = startPackageUpload;
