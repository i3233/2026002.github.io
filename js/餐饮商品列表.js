// 餐饮商品列表页面交互逻辑

// 商品数据
let productListData = [
    {
        id: 1,
        name: '锅巴肉片',
        category: 'chinese',
        categoryName: '中餐',
        price: 68.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
    {
        id: 2,
        name: '肥肠血旺',
        category: 'chinese',
        categoryName: '中餐',
        price: 45.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
    {
        id: 3,
        name: '彩虹斗酒套装41支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 178.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
    {
        id: 4,
        name: '红尘玫瑰17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
    {
        id: 5,
        name: '猕猴蓝17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
    {
        id: 6,
        name: '草莓蜜酒17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        sales: 0,
        salesStatus: 'bad',
        status: 'on',
        type: 'normal'
    },
];

// 筛选条件
let currentTab = 'normal';
let currentCategory = 'all';
let searchKeyword = '';

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
};

// 选中的商品ID
let selectedProducts = [];

// 销量状态映射
const salesStatusMap = {
    'good': { text: '好', class: 'product-list-sales-status-good' },
    'normal': { text: '一般', class: 'product-list-sales-status-normal' },
    'bad': { text: '差', class: 'product-list-sales-status-bad' }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initCreateCategoryForm();
    renderProductTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 标签切换
    document.querySelectorAll('.product-list-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.product-list-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            pagination.currentPage = 1;
            renderProductTable();
            updatePagination();
        });
    });

    // 分类切换
    document.querySelectorAll('.product-list-category-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.product-list-category-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            pagination.currentPage = 1;
            renderProductTable();
            updatePagination();
        });
    });

    // 新建分类
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', function() {
            createCategory();
        });
    }

    // 搜索
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            pagination.currentPage = 1;
            renderProductTable();
            updatePagination();
        });
    }

    // 全选复选框
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }

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

    // 批量创建
    const batchCreateBtn = document.getElementById('batchCreateBtn');
    if (batchCreateBtn) {
        batchCreateBtn.addEventListener('click', function() {
            showBatchCreateModal();
        });
    }

    // 新建商品
    const createProductBtn = document.getElementById('createProductBtn');
    if (createProductBtn) {
        createProductBtn.addEventListener('click', function() {
            showCreateProductModal();
        });
    }

    // 初始化新建商品表单事件
    initCreateProductForm();

    // AI绘画
    const aiPaintBtn = document.getElementById('aiPaintBtn');
    if (aiPaintBtn) {
        aiPaintBtn.addEventListener('click', function() {
            console.log('AI绘画');
            alert('AI绘画功能待实现');
        });
    }

    // 商品导入
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            showImportProductModal();
        });
    }

    // 初始化商品导入表单
    initImportProductForm();

    // 商品导出
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProducts();
        });
    }

    // 分页按钮
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (pagination.currentPage > 1) {
                pagination.currentPage--;
                renderProductTable();
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
                renderProductTable();
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
            renderProductTable();
            updatePagination();
        });
    }
}

// 渲染商品表格
function renderProductTable() {
    const tableBody = document.getElementById('productTableBody');
    if (!tableBody) return;

    // 过滤商品
    let filteredProducts = productListData;

    // 按标签类型过滤
    if (currentTab !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.type === currentTab);
    }

    // 按分类过滤
    if (currentCategory !== 'all') {
        if (currentCategory === 'uncategorized') {
            filteredProducts = filteredProducts.filter(p => !p.category);
        } else {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }
    }

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 更新总数
    pagination.total = filteredProducts.length;

    // 分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pagedProducts = filteredProducts.slice(start, end);

    if (pagedProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无商品数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = pagedProducts.map(product => {
        const isSelected = selectedProducts.includes(product.id);
        const salesStatus = salesStatusMap[product.salesStatus] || salesStatusMap['bad'];
        const statusClass = product.status === 'on' ? 'product-list-status-badge-on' : 'product-list-status-badge-off';
        const statusText = product.status === 'on' ? '在售' : '停售';

        return `
            <tr>
                <td>
                    <label class="product-list-checkbox-label">
                        <input type="checkbox" class="product-checkbox" value="${product.id}" ${isSelected ? 'checked' : ''} onchange="toggleProductSelection(${product.id})">
                    </label>
                </td>
                <td>
                    <span class="product-list-product-name">${product.name}</span>
                </td>
                <td>
                    <span class="product-list-category-badge">${product.categoryName || '未分类'}</span>
                </td>
                <td>
                    <span class="product-list-price">¥${product.price.toFixed(2)}</span>
                </td>
                <td>
                    <span class="product-list-sales-count">${product.sales}</span>
                </td>
                <td>
                    <span class="product-list-sales-status ${salesStatus.class}">${salesStatus.text}</span>
                </td>
                <td>
                    <span class="product-list-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="product-list-action-buttons">
                        <button class="product-list-btn product-list-btn-text" onclick="editProduct(${product.id})">编辑</button>
                        <button class="product-list-btn product-list-btn-text" onclick="toggleProductStatus(${product.id})">${product.status === 'on' ? '停用' : '启用'}</button>
                        <button class="product-list-btn product-list-btn-text" onclick="deleteProduct(${product.id})">删除</button>
                        <button class="product-list-btn product-list-btn-text" onclick="linkStall(${product.id})">关联档口</button>
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
            pagesHTML += `<button class="product-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        // 如果总页数大于7页，显示省略号
        if (pagination.currentPage <= 4) {
            // 当前页在前4页
            for (let i = 1; i <= 5; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="product-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span class="product-list-pagination-ellipsis">...</span>`;
            pagesHTML += `<button class="product-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        } else if (pagination.currentPage >= totalPages - 3) {
            // 当前页在后4页
            pagesHTML += `<button class="product-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span class="product-list-pagination-ellipsis">...</span>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="product-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
            // 当前页在中间
            pagesHTML += `<button class="product-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span class="product-list-pagination-ellipsis">...</span>`;
            for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="product-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span class="product-list-pagination-ellipsis">...</span>`;
            pagesHTML += `<button class="product-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
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
    renderProductTable();
    updatePagination();
}

// 切换全选
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const productId = parseInt(cb.value);
        if (checked) {
            if (!selectedProducts.includes(productId)) {
                selectedProducts.push(productId);
            }
        } else {
            selectedProducts = selectedProducts.filter(id => id !== productId);
        }
    });
}

// 切换单个选择
function toggleProductSelection(productId) {
    const index = selectedProducts.indexOf(productId);
    if (index > -1) {
        selectedProducts.splice(index, 1);
    } else {
        selectedProducts.push(productId);
    }
    
    // 更新全选状态
    const checkboxes = document.querySelectorAll('.product-checkbox');
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

    if (selectedProducts.length === 0) {
        alert('请先选择要操作的商品');
        return;
    }

    const actionMap = {
        'modifyPackaging': '修改包装费',
        'modifyCategory': '修改分类',
        'delete': '删除',
        'enable': '启用',
        'disable': '禁用',
        'modifySpec': '修改规格'
    };

    const actionName = actionMap[action] || '操作';
    
    if (confirm(`确定要对选中的 ${selectedProducts.length} 个商品执行"${actionName}"操作吗？`)) {
        console.log('批量操作:', action, selectedProducts);
        
        if (action === 'delete') {
            // 批量删除
            productListData = productListData.filter(p => !selectedProducts.includes(p.id));
            alert('商品删除成功');
        } else if (action === 'enable') {
            // 批量启用
            productListData.forEach(p => {
                if (selectedProducts.includes(p.id)) {
                    p.status = 'on';
                }
            });
            alert('商品启用成功');
        } else if (action === 'disable') {
            // 批量禁用
            productListData.forEach(p => {
                if (selectedProducts.includes(p.id)) {
                    p.status = 'off';
                }
            });
            alert('商品禁用成功');
        } else if (action === 'modifyPackaging') {
            // 批量修改包装费
            const packagingFee = prompt('请输入包装费金额（元）：');
            if (packagingFee !== null && packagingFee.trim() !== '') {
                const fee = parseFloat(packagingFee);
                if (!isNaN(fee) && fee >= 0) {
                    productListData.forEach(p => {
                        if (selectedProducts.includes(p.id)) {
                            p.packagingFee = fee;
                        }
                    });
                    alert('包装费修改成功');
                } else {
                    alert('请输入有效的金额');
                    return;
                }
            } else {
                return;
            }
        } else if (action === 'modifyCategory') {
            // 批量修改分类
            const categoryName = prompt('请输入新的分类名称：');
            if (categoryName !== null && categoryName.trim() !== '') {
                productListData.forEach(p => {
                    if (selectedProducts.includes(p.id)) {
                        p.categoryName = categoryName.trim();
                        // 这里可以根据实际情况设置category值
                    }
                });
                alert('分类修改成功');
            } else {
                return;
            }
        } else if (action === 'modifySpec') {
            // 批量修改规格
            const spec = prompt('请输入新的规格：');
            if (spec !== null && spec.trim() !== '') {
                productListData.forEach(p => {
                    if (selectedProducts.includes(p.id)) {
                        p.spec = spec.trim();
                    }
                });
                alert('规格修改成功');
            } else {
                return;
            }
        }

        selectedProducts = [];
        renderProductTable();
        updatePagination();
    }
}

// 编辑商品
function editProduct(productId) {
    console.log('编辑商品:', productId);
    alert('编辑商品功能待实现');
}

// 切换商品状态
function toggleProductStatus(productId) {
    const product = productListData.find(p => p.id === productId);
    if (!product) return;

    const newStatus = product.status === 'on' ? 'off' : 'on';
    const action = newStatus === 'on' ? '启用' : '停用';

    if (confirm(`确定要${action}商品"${product.name}"吗？`)) {
        product.status = newStatus;
        renderProductTable();
    }
}

// 删除商品
function deleteProduct(productId) {
    const product = productListData.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`确定要删除商品"${product.name}"吗？`)) {
        const index = productListData.findIndex(p => p.id === productId);
        if (index > -1) {
            productListData.splice(index, 1);
            renderProductTable();
            updatePagination();
            alert('商品已删除');
        }
    }
}

// 关联档口
function linkStall(productId) {
    console.log('关联档口:', productId);
    alert('关联档口功能待实现');
}

// 导出商品
function exportProducts() {
    let filteredProducts = productListData;

    if (currentCategory !== 'all') {
        if (currentCategory === 'uncategorized') {
            filteredProducts = filteredProducts.filter(p => !p.category);
        } else {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }
    }

    if (searchKeyword) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 生成CSV内容
    let csvContent = '商品名称,分类,价格,销量,销量状态,状态\n';
    
    filteredProducts.forEach(product => {
        const salesStatus = salesStatusMap[product.salesStatus]?.text || '差';
        const status = product.status === 'on' ? '在售' : '停售';
        csvContent += `${product.name},${product.categoryName || '未分类'},${product.price.toFixed(2)},${product.sales},${salesStatus},${status}\n`;
    });

    // 创建下载链接
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `商品列表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('商品导出成功！');
}

// 显示新建分类弹窗
function showCreateCategoryModal() {
    const modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetCreateCategoryForm();
        // 生成时间安排
        renderTimeSchedule();
    }
}

// 关闭新建分类弹窗
function closeCreateCategoryModal() {
    const modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 新建分类（保留原函数名以兼容）
function createCategory() {
    showCreateCategoryModal();
}

// 初始化新建分类表单
function initCreateCategoryForm() {
    // 分类图片上传
    const categoryImageUpload = document.getElementById('categoryImageUpload');
    const categoryImageInput = document.getElementById('categoryImageInput');
    if (categoryImageUpload && categoryImageInput) {
        categoryImageUpload.addEventListener('click', () => categoryImageInput.click());
        categoryImageInput.addEventListener('change', handleCategoryImageUpload);
    }

    // 状态切换按钮
    const statusToggle = document.getElementById('categoryStatusToggle');
    if (statusToggle) {
        statusToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const enableSwitch = document.getElementById('categoryEnableSwitch');
            if (enableSwitch) {
                enableSwitch.checked = this.classList.contains('active');
            }
        });
    }

    // 启用开关
    const enableSwitch = document.getElementById('categoryEnableSwitch');
    if (enableSwitch) {
        enableSwitch.addEventListener('change', function() {
            const statusToggle = document.getElementById('categoryStatusToggle');
            if (statusToggle) {
                if (this.checked) {
                    statusToggle.classList.add('active');
                    statusToggle.querySelector('.product-list-status-toggle-text').textContent = '启用';
                } else {
                    statusToggle.classList.remove('active');
                    statusToggle.querySelector('.product-list-status-toggle-text').textContent = '禁用';
                }
            }
        });
    }
}

// 处理分类图片上传
function handleCategoryImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5M');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('categoryImagePreview');
            const previewImg = document.getElementById('categoryImagePreviewImg');
            const uploadArea = document.getElementById('categoryImageUpload');
            if (preview && previewImg && uploadArea) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// 移除分类图片
function removeCategoryImage() {
    const preview = document.getElementById('categoryImagePreview');
    const uploadArea = document.getElementById('categoryImageUpload');
    const categoryImageInput = document.getElementById('categoryImageInput');
    if (preview && uploadArea && categoryImageInput) {
        preview.style.display = 'none';
        uploadArea.style.display = 'block';
        categoryImageInput.value = '';
    }
}

// 生成时间安排
function renderTimeSchedule() {
    const container = document.getElementById('timeScheduleContainer');
    if (!container) return;

    const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    
    container.innerHTML = days.map((day, index) => `
        <div class="product-list-time-item" data-day="${index}">
            <input type="checkbox" class="product-list-time-item-checkbox" checked data-day="${index}" onchange="updateTimeItemDisplay(${index})">
            <span class="product-list-time-item-day">${day}</span>
            <div class="product-list-time-item-inputs">
                <input type="time" class="product-list-time-input" value="00:00" data-day="${index}" data-type="start">
                <span class="product-list-time-separator">-</span>
                <input type="time" class="product-list-time-input" value="23:59" data-day="${index}" data-type="end">
            </div>
            <button class="product-list-time-btn remove" onclick="removeTimeSlot(${index})" style="display: none;">-</button>
        </div>
    `).join('');
}

// 移除时间段
function removeTimeSlot(dayIndex) {
    const timeItem = document.querySelector(`.product-list-time-item[data-day="${dayIndex}"]`);
    if (timeItem) {
        const checkbox = timeItem.querySelector('.product-list-time-item-checkbox');
        if (checkbox) {
            checkbox.checked = false;
            updateTimeItemDisplay(dayIndex);
        }
    }
}

// 更新时间段显示
function updateTimeItemDisplay(dayIndex) {
    const timeItem = document.querySelector(`.product-list-time-item[data-day="${dayIndex}"]`);
    if (timeItem) {
        const checkbox = timeItem.querySelector('.product-list-time-item-checkbox');
        const removeBtn = timeItem.querySelector('.product-list-time-btn.remove');
        if (checkbox && removeBtn) {
            if (checkbox.checked) {
                removeBtn.style.display = 'none';
                timeItem.style.opacity = '1';
            } else {
                removeBtn.style.display = 'flex';
                timeItem.style.opacity = '0.5';
            }
        }
    }
}

// 添加分类角标
function addCategoryBadge() {
    console.log('添加分类角标');
    alert('添加分类角标功能待实现');
}

// 重置新建分类表单
function resetCreateCategoryForm() {
    // 重置输入
    document.getElementById('categoryNameInput').value = '';
    document.getElementById('categorySortInput').value = '1';
    document.getElementById('categoryProductsInput').value = '';
    
    // 重置图片
    removeCategoryImage();
    
    // 重置开关
    const enableSwitch = document.getElementById('categoryEnableSwitch');
    const statusToggle = document.getElementById('categoryStatusToggle');
    if (enableSwitch) {
        enableSwitch.checked = true;
    }
    if (statusToggle) {
        statusToggle.classList.add('active');
        statusToggle.querySelector('.product-list-status-toggle-text').textContent = '启用';
    }
    
    // 重置售卖渠道开关
    const channelSwitches = [
        'channelPickupSwitch',
        'channelDeliverySwitch',
        'channelCashierSwitch',
        'channelTableSwitch',
        'channelPointsSwitch',
        'channelMallSwitch'
    ];
    channelSwitches.forEach(id => {
        const switchEl = document.getElementById(id);
        if (switchEl) switchEl.checked = false;
    });
    
    // 重置必选分类开关
    const requiredSwitch = document.getElementById('requiredCategorySwitch');
    if (requiredSwitch) requiredSwitch.checked = false;
    
    // 重置时间安排
    renderTimeSchedule();
}

// 保存分类
function saveCategory() {
    const name = document.getElementById('categoryNameInput').value.trim();
    const sort = parseInt(document.getElementById('categorySortInput').value) || 1;
    const enabled = document.getElementById('categoryEnableSwitch').checked;

    // 验证必填项
    if (!name) {
        alert('请输入分类名称');
        return;
    }

    // 获取售卖渠道
    const channels = [];
    if (document.getElementById('channelPickupSwitch').checked) channels.push('pickup');
    if (document.getElementById('channelDeliverySwitch').checked) channels.push('delivery');
    if (document.getElementById('channelCashierSwitch').checked) channels.push('cashier');
    if (document.getElementById('channelTableSwitch').checked) channels.push('table');
    if (document.getElementById('channelPointsSwitch').checked) channels.push('points');
    if (document.getElementById('channelMallSwitch').checked) channels.push('mall');

    // 获取时间安排
    const timeSchedule = [];
    for (let i = 0; i < 7; i++) {
        const checkbox = document.querySelector(`.product-list-time-item-checkbox[data-day="${i}"]`);
        if (checkbox && checkbox.checked) {
            const startInput = document.querySelector(`.product-list-time-input[data-day="${i}"][data-type="start"]`);
            const endInput = document.querySelector(`.product-list-time-input[data-day="${i}"][data-type="end"]`);
            if (startInput && endInput) {
                timeSchedule.push({
                    day: i,
                    start: startInput.value,
                    end: endInput.value
                });
            }
        }
    }

    // 创建新分类对象
    const newCategory = {
        id: Date.now(),
        name: name,
        sort: sort,
        enabled: enabled,
        channels: channels,
        requiredCategory: document.getElementById('requiredCategorySwitch').checked,
        timeSchedule: timeSchedule
    };

    console.log('新建分类:', newCategory);
    
    // 这里可以添加实际的创建分类逻辑
    // 例如：调用API创建分类，然后刷新分类列表
    
    // 关闭弹窗
    closeCreateCategoryModal();
    
    alert(`分类"${name}"创建成功！\n（实际功能需要连接后端API）`);
}

// 显示商品导入弹窗
function showImportProductModal() {
    const modal = document.getElementById('importProductModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetImportProductForm();
    }
}

// 关闭商品导入弹窗
function closeImportProductModal() {
    const modal = document.getElementById('importProductModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 初始化商品导入表单
function initImportProductForm() {
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
function resetImportProductForm() {
    const fileInput = document.getElementById('importFileInput');
    const fileNameEl = document.getElementById('importFileName');
    const uploadArea = document.getElementById('importFileUploadArea');

    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '菜单表格文件.CSV';
    if (uploadArea) uploadArea.classList.remove('has-file');
    
    window.selectedImportFile = null;
}

// 下载模板
function downloadTemplate() {
    // 创建CSV模板内容
    const csvContent = [
        ['商品名称', '价格', '分类', '单位', '库存', '描述'],
        ['示例商品1', '10.00', '中餐', '件', '100', '这是示例商品1的描述'],
        ['示例商品2', '20.00', '软饮系列', '件', '50', '这是示例商品2的描述']
    ].map(row => row.join(',')).join('\n');

    // 添加BOM以支持中文
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '商品导入模板.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('模板下载成功');
}

// 开始上传
function startUpload() {
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
        closeImportProductModal();
    };
    
    reader.onerror = function() {
        alert('文件读取失败，请重试');
    };
    
    reader.readAsText(window.selectedImportFile, 'UTF-8');
}

// 显示批量创建弹窗
function showBatchCreateModal() {
    const modal = document.getElementById('batchCreateModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

// 关闭批量创建弹窗
function closeBatchCreateModal() {
    const modal = document.getElementById('batchCreateModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // 恢复滚动
    }
}

// 前往创建
function goToCreate(type) {
    closeBatchCreateModal();
    
    const typeMap = {
        'image': '传图批量建',
        'manual': '手动批量创建',
        'table': '表格批量建'
    };
    
    console.log('前往创建:', typeMap[type] || type);
    alert(`跳转到${typeMap[type] || type}页面\n（实际功能需要连接后端API）`);
}

// 显示新建商品弹窗
function showCreateProductModal() {
    const modal = document.getElementById('createProductModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetCreateProductForm();
    }
}

// 关闭新建商品弹窗
function closeCreateProductModal() {
    const modal = document.getElementById('createProductModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 初始化新建商品表单
function initCreateProductForm() {
    // 封面图片上传
    const coverImageUpload = document.getElementById('coverImageUpload');
    const coverImageInput = document.getElementById('coverImageInput');
    if (coverImageUpload && coverImageInput) {
        coverImageUpload.addEventListener('click', () => coverImageInput.click());
        coverImageInput.addEventListener('change', handleCoverImageUpload);
    }

    // 商品图片上传
    const productImagesUpload = document.getElementById('productImagesUpload');
    const productImagesInput = document.getElementById('productImagesInput');
    if (productImagesUpload && productImagesInput) {
        productImagesUpload.addEventListener('click', () => productImagesInput.click());
        productImagesInput.addEventListener('change', handleProductImagesUpload);
    }

    // 状态切换按钮
    const statusToggle = document.getElementById('productStatusToggle');
    if (statusToggle) {
        statusToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const enableSwitch = document.getElementById('productEnableSwitch');
            if (enableSwitch) {
                enableSwitch.checked = this.classList.contains('active');
            }
        });
    }

    // 启用开关
    const enableSwitch = document.getElementById('productEnableSwitch');
    if (enableSwitch) {
        enableSwitch.addEventListener('change', function() {
            const statusToggle = document.getElementById('productStatusToggle');
            if (statusToggle) {
                if (this.checked) {
                    statusToggle.classList.add('active');
                    statusToggle.querySelector('.product-list-status-toggle-text').textContent = '启用';
                } else {
                    statusToggle.classList.remove('active');
                    statusToggle.querySelector('.product-list-status-toggle-text').textContent = '禁用';
                }
            }
        });
    }

    // AI绘图按钮
    const aiDrawBtn = document.getElementById('aiDrawBtn');
    if (aiDrawBtn) {
        aiDrawBtn.addEventListener('click', function() {
            console.log('一键AI绘图');
            alert('AI绘图功能待实现');
        });
    }
}

// 处理封面图片上传
function handleCoverImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5M');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('coverImagePreview');
            const previewImg = document.getElementById('coverImagePreviewImg');
            const uploadArea = document.getElementById('coverImageUpload');
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
function removeCoverImage() {
    const preview = document.getElementById('coverImagePreview');
    const uploadArea = document.getElementById('coverImageUpload');
    const coverImageInput = document.getElementById('coverImageInput');
    if (preview && uploadArea && coverImageInput) {
        preview.style.display = 'none';
        uploadArea.style.display = 'block';
        coverImageInput.value = '';
    }
}

// 处理商品图片上传
function handleProductImagesUpload(e) {
    const files = Array.from(e.target.files);
    const previewGrid = document.getElementById('productImagesPreview');
    if (!previewGrid) return;

    const maxImages = 9;
    const currentImages = previewGrid.querySelectorAll('.product-list-uploaded-image').length;
    
    if (currentImages + files.length > maxImages) {
        alert(`最多只能上传${maxImages}张图片，当前已有${currentImages}张`);
        return;
    }

    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`图片"${file.name}"大小超过5M，已跳过`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'product-list-uploaded-image';
            imageDiv.innerHTML = `
                <img src="${e.target.result}" alt="商品图片">
                <button class="product-list-remove-image" onclick="removeProductImage(this)">×</button>
            `;
            previewGrid.appendChild(imageDiv);
        };
        reader.readAsDataURL(file);
    });
}

// 移除商品图片
function removeProductImage(btn) {
    const imageDiv = btn.closest('.product-list-uploaded-image');
    if (imageDiv) {
        imageDiv.remove();
    }
}

// 切换商品详情折叠
function toggleProductDetails() {
    const content = document.getElementById('productDetailsContent');
    const icon = document.getElementById('productDetailsIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换规格选项折叠
function toggleSpecOptions() {
    const content = document.getElementById('specOptionsContent');
    const icon = document.getElementById('specOptionsIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换商品属性折叠
function toggleProductAttributes() {
    const content = document.getElementById('productAttributesContent');
    const icon = document.getElementById('productAttributesIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换加料选项折叠
function toggleAddonOptions() {
    const content = document.getElementById('addonOptionsContent');
    const icon = document.getElementById('addonOptionsIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 添加商品规格
function addProductSpec() {
    console.log('添加商品规格');
    alert('添加商品规格功能待实现');
}

// 添加加价规格组
function addPriceSpecGroup() {
    console.log('添加加价规格组');
    alert('添加加价规格组功能待实现');
}

// 添加固定价规格组
function addFixedPriceSpecGroup() {
    console.log('添加固定价规格组');
    alert('添加固定价规格组功能待实现');
}

// 添加商品属性
function addProductAttribute() {
    console.log('添加商品属性');
    alert('添加商品属性功能待实现');
}

// 添加属性组
function addAttributeGroup() {
    console.log('添加属性组');
    alert('添加属性组功能待实现');
}

// 添加加料商品
function addAddonProduct() {
    console.log('添加加料商品');
    alert('添加加料商品功能待实现');
}

// 添加加料组
function addAddonGroup() {
    console.log('添加加料组');
    alert('添加加料组功能待实现');
}

// 切换配置折叠
function toggleConfiguration() {
    const content = document.getElementById('configurationContent');
    const icon = document.getElementById('configurationIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换厨房配置折叠
function toggleKitchenConfig() {
    const content = document.getElementById('kitchenConfigContent');
    const icon = document.getElementById('kitchenConfigIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换开售时间折叠
function toggleSalesTime() {
    const content = document.getElementById('salesTimeContent');
    const icon = document.getElementById('salesTimeIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 切换营养元素折叠
function toggleNutrition() {
    const content = document.getElementById('nutritionContent');
    const icon = document.getElementById('nutritionIcon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

// 重置新建商品表单
function resetCreateProductForm() {
    // 重置所有输入
    document.getElementById('productNameInput').value = '';
    document.getElementById('productPriceInput').value = '';
    document.getElementById('productMinPurchaseInput').value = '1';
    document.getElementById('productCategorySelect').value = '';
    document.getElementById('productDescriptionInput').value = '';
    
    // 重置图片
    removeCoverImage();
    const productImagesPreview = document.getElementById('productImagesPreview');
    if (productImagesPreview) {
        productImagesPreview.innerHTML = '';
    }
    
    // 重置富文本编辑器
    const richEditorContent = document.getElementById('richEditorContent');
    if (richEditorContent) {
        richEditorContent.innerHTML = '<p>请输入图文详情内容...</p>';
    }
    
    // 重置其他信息字段
    document.getElementById('productCodeInput').value = '';
    document.getElementById('productUnitInput').value = '';
    document.getElementById('productWeightInput').value = '';
    document.getElementById('productPackagingFeeInput').value = '';
    
    // 重置开关
    const enableSwitch = document.getElementById('productEnableSwitch');
    const statusToggle = document.getElementById('productStatusToggle');
    if (enableSwitch) {
        enableSwitch.checked = false;
    }
    if (statusToggle) {
        statusToggle.classList.remove('active');
        statusToggle.querySelector('.product-list-status-toggle-text').textContent = '启用';
    }
    
    // 重置其他开关
    const specPriceHiddenSwitch = document.getElementById('specPriceHiddenSwitch');
    const addonPriceHiddenSwitch = document.getElementById('addonPriceHiddenSwitch');
    const singleItemNoDeliverySwitch = document.getElementById('singleItemNoDeliverySwitch');
    const miniProgramHiddenSwitch = document.getElementById('miniProgramHiddenSwitch');
    const isAccessibleSwitch = document.getElementById('isAccessibleSwitch');
    const purchaseNoticeSwitch = document.getElementById('purchaseNoticeSwitch');
    const orderFormSwitch = document.getElementById('orderFormSwitch');
    const orderUploadImageSwitch = document.getElementById('orderUploadImageSwitch');
    const showUnreleasedSwitch = document.getElementById('showUnreleasedSwitch');
    const useNutritionSwitch = document.getElementById('useNutritionSwitch');
    
    if (specPriceHiddenSwitch) specPriceHiddenSwitch.checked = false;
    if (addonPriceHiddenSwitch) addonPriceHiddenSwitch.checked = false;
    if (singleItemNoDeliverySwitch) singleItemNoDeliverySwitch.checked = false;
    if (miniProgramHiddenSwitch) miniProgramHiddenSwitch.checked = false;
    if (isAccessibleSwitch) isAccessibleSwitch.checked = false;
    if (purchaseNoticeSwitch) purchaseNoticeSwitch.checked = false;
    if (orderFormSwitch) orderFormSwitch.checked = false;
    if (orderUploadImageSwitch) orderUploadImageSwitch.checked = false;
    if (showUnreleasedSwitch) showUnreleasedSwitch.checked = false;
    if (useNutritionSwitch) useNutritionSwitch.checked = false;
    
    // 重置其他字段
    const productTagsSelect = document.getElementById('productTagsSelect');
    const kitchenTimeoutInput = document.getElementById('kitchenTimeoutInput');
    const salesTimeSlotRadios = document.querySelectorAll('input[name="salesTimeSlot"]');
    
    if (productTagsSelect) productTagsSelect.value = '';
    if (kitchenTimeoutInput) kitchenTimeoutInput.value = '0';
    if (salesTimeSlotRadios.length > 0) {
        salesTimeSlotRadios[0].checked = true; // 默认选中"全部时段"
    }
    
    // 折叠所有折叠区域
    const collapseContents = [
        { content: 'productDetailsContent', icon: 'productDetailsIcon' },
        { content: 'specOptionsContent', icon: 'specOptionsIcon' },
        { content: 'productAttributesContent', icon: 'productAttributesIcon' },
        { content: 'addonOptionsContent', icon: 'addonOptionsIcon' },
        { content: 'configurationContent', icon: 'configurationIcon' },
        { content: 'kitchenConfigContent', icon: 'kitchenConfigIcon' },
        { content: 'salesTimeContent', icon: 'salesTimeIcon' },
        { content: 'nutritionContent', icon: 'nutritionIcon' }
    ];
    
    collapseContents.forEach(item => {
        const contentEl = document.getElementById(item.content);
        const iconEl = document.getElementById(item.icon);
        if (contentEl && iconEl) {
            contentEl.style.display = 'none';
            iconEl.textContent = '▼';
        }
    });
}

// 保存商品
function saveProduct() {
    const name = document.getElementById('productNameInput').value.trim();
    const price = parseFloat(document.getElementById('productPriceInput').value);
    const minPurchase = parseInt(document.getElementById('productMinPurchaseInput').value) || 1;
    const category = document.getElementById('productCategorySelect').value;
    const description = document.getElementById('productDescriptionInput').value.trim();
    const enabled = document.getElementById('productEnableSwitch').checked;

    // 获取其他信息
    const code = document.getElementById('productCodeInput').value.trim();
    const unit = document.getElementById('productUnitInput').value.trim();
    const weight = document.getElementById('productWeightInput').value.trim();
    const packagingFee = parseFloat(document.getElementById('productPackagingFeeInput').value) || 0;

    // 获取配置信息
    const tags = document.getElementById('productTagsSelect').value;
    const singleItemNoDelivery = document.getElementById('singleItemNoDeliverySwitch').checked;
    const miniProgramHidden = document.getElementById('miniProgramHiddenSwitch').checked;
    const isAccessible = document.getElementById('isAccessibleSwitch').checked;
    const purchaseNotice = document.getElementById('purchaseNoticeSwitch').checked;
    const orderForm = document.getElementById('orderFormSwitch').checked;
    const orderUploadImage = document.getElementById('orderUploadImageSwitch').checked;

    // 获取厨房配置
    const kitchenTimeout = parseInt(document.getElementById('kitchenTimeoutInput').value) || 0;

    // 获取开售时间配置
    const showUnreleased = document.getElementById('showUnreleasedSwitch').checked;
    const salesTimeSlot = document.querySelector('input[name="salesTimeSlot"]:checked')?.value || 'all';

    // 获取营养元素配置
    const useNutrition = document.getElementById('useNutritionSwitch').checked;

    // 验证必填项
    if (!name) {
        alert('请输入商品名称');
        return;
    }
    if (isNaN(price) || price < 0) {
        alert('请输入有效的价格');
        return;
    }
    if (!category) {
        alert('请选择所属分类');
        return;
    }

    // 获取分类名称
    const categorySelect = document.getElementById('productCategorySelect');
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    // 创建新商品对象
    const newProduct = {
        id: Date.now(), // 临时ID
        name: name,
        category: category,
        categoryName: categoryName,
        price: price,
        sales: 0,
        salesStatus: 'bad',
        status: enabled ? 'on' : 'off',
        type: currentTab,
        minPurchase: minPurchase,
        description: description,
        code: code,
        unit: unit,
        weight: weight,
        packagingFee: packagingFee,
        tags: tags,
        singleItemNoDelivery: singleItemNoDelivery,
        miniProgramHidden: miniProgramHidden,
        isAccessible: isAccessible,
        purchaseNotice: purchaseNotice,
        orderForm: orderForm,
        orderUploadImage: orderUploadImage,
        kitchenTimeout: kitchenTimeout,
        showUnreleased: showUnreleased,
        salesTimeSlot: salesTimeSlot,
        useNutrition: useNutrition
    };

    // 添加到商品列表
    productListData.push(newProduct);
    
    // 刷新表格
    renderProductTable();
    updatePagination();
    
    // 关闭弹窗
    closeCreateProductModal();
    
    alert('商品创建成功！');
}

// 全局函数
window.toggleProductSelection = toggleProductSelection;
window.goToPage = goToPage;
window.batchAction = batchAction;
window.editProduct = editProduct;
window.toggleProductStatus = toggleProductStatus;
window.deleteProduct = deleteProduct;
window.linkStall = linkStall;
window.showBatchCreateModal = showBatchCreateModal;
window.closeBatchCreateModal = closeBatchCreateModal;
window.goToCreate = goToCreate;
window.showCreateProductModal = showCreateProductModal;
window.closeCreateProductModal = closeCreateProductModal;
window.removeCoverImage = removeCoverImage;
window.removeProductImage = removeProductImage;
window.toggleProductDetails = toggleProductDetails;
window.toggleSpecOptions = toggleSpecOptions;
window.toggleProductAttributes = toggleProductAttributes;
window.toggleAddonOptions = toggleAddonOptions;
window.addProductSpec = addProductSpec;
window.addPriceSpecGroup = addPriceSpecGroup;
window.addFixedPriceSpecGroup = addFixedPriceSpecGroup;
window.addProductAttribute = addProductAttribute;
window.addAttributeGroup = addAttributeGroup;
window.addAddonProduct = addAddonProduct;
window.addAddonGroup = addAddonGroup;
window.toggleConfiguration = toggleConfiguration;
window.toggleKitchenConfig = toggleKitchenConfig;
window.toggleSalesTime = toggleSalesTime;
window.toggleNutrition = toggleNutrition;
window.saveProduct = saveProduct;
window.showCreateCategoryModal = showCreateCategoryModal;
window.closeCreateCategoryModal = closeCreateCategoryModal;
window.removeCategoryImage = removeCategoryImage;
window.addCategoryBadge = addCategoryBadge;
window.removeTimeSlot = removeTimeSlot;
window.updateTimeItemDisplay = updateTimeItemDisplay;
window.saveCategory = saveCategory;
window.showImportProductModal = showImportProductModal;
window.closeImportProductModal = closeImportProductModal;
window.downloadTemplate = downloadTemplate;
window.startUpload = startUpload;
