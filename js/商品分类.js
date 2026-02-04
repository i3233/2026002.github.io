// 商品分类页面交互逻辑

// 分类数据
let categoryListData = [
    {
        id: 1,
        name: '优惠套餐',
        productCount: 11,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 2,
        name: '彩虹斗酒',
        productCount: 7,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 3,
        name: '特色斗酒',
        productCount: 12,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 4,
        name: '洋酒香槟',
        productCount: 14,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 5,
        name: '其他系列',
        productCount: 2,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 6,
        name: '小吃系列',
        productCount: 36,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 7,
        name: '啤酒',
        productCount: 16,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 8,
        name: '软饮系列',
        productCount: 9,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 9,
        name: '家政',
        productCount: 0,
        sort: 0,
        status: 'enabled'
    },
    {
        id: 10,
        name: '中餐',
        productCount: 2,
        sort: 1,
        status: 'enabled'
    }
];

// 筛选条件
let searchKeyword = '';

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
};

// 选中的分类ID
let selectedCategories = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initCreateCategoryForm();
    renderCategoryTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 搜索
    const searchInput = document.getElementById('categorySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            pagination.currentPage = 1;
            renderCategoryTable();
            updatePagination();
        });
    }

    // 搜索按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('categorySearchInput');
            if (searchInput) {
                searchKeyword = searchInput.value.trim();
                pagination.currentPage = 1;
                renderCategoryTable();
                updatePagination();
            }
        });
    }

    // 新建分类
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', function() {
            showCreateCategoryModal();
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
                renderCategoryTable();
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
                renderCategoryTable();
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
            renderCategoryTable();
            updatePagination();
        });
    }
}

// 渲染分类表格
function renderCategoryTable() {
    const tableBody = document.getElementById('categoryTableBody');
    if (!tableBody) return;

    // 过滤分类
    let filteredCategories = categoryListData;

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredCategories = filteredCategories.filter(c =>
            c.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 更新总数
    pagination.total = filteredCategories.length;

    // 分页
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pagedCategories = filteredCategories.slice(start, end);

    if (pagedCategories.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无分类数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = pagedCategories.map(category => {
        const isSelected = selectedCategories.includes(category.id);
        const statusClass = category.status === 'enabled' 
            ? 'category-list-status-badge-enabled' 
            : 'category-list-status-badge-disabled';
        const statusText = category.status === 'enabled' ? '已启用' : '已禁用';

        return `
            <tr>
                <td>
                    <label class="category-list-checkbox-label">
                        <input type="checkbox" class="category-checkbox" value="${category.id}" ${isSelected ? 'checked' : ''} onchange="toggleCategorySelection(${category.id})">
                    </label>
                </td>
                <td>
                    <span class="category-list-category-name">${category.name}</span>
                </td>
                <td>
                    <a href="#" class="category-list-product-count" onclick="viewCategoryProducts(${category.id}); return false;">${category.productCount}</a>
                </td>
                <td>
                    <span class="category-list-sort-order">${category.sort}</span>
                </td>
                <td>
                    <span class="category-list-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="category-list-action-buttons">
                        <button class="category-list-action-btn category-list-action-btn-edit" onclick="editCategory(${category.id})">编辑</button>
                        <button class="category-list-action-btn category-list-action-btn-delete" onclick="deleteCategory(${category.id})">删除</button>
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
            pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        // 如果总页数大于7页，显示省略号
        if (pagination.currentPage <= 4) {
            // 当前页在前4页
            for (let i = 1; i <= 5; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        } else if (pagination.currentPage >= totalPages - 3) {
            // 当前页在后4页
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
            // 当前页在中间
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
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
    renderCategoryTable();
    updatePagination();
}

// 切换全选
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const categoryId = parseInt(cb.value);
        if (checked) {
            if (!selectedCategories.includes(categoryId)) {
                selectedCategories.push(categoryId);
            }
        } else {
            selectedCategories = selectedCategories.filter(id => id !== categoryId);
        }
    });
}

// 切换单个选择
function toggleCategorySelection(categoryId) {
    const index = selectedCategories.indexOf(categoryId);
    if (index > -1) {
        selectedCategories.splice(index, 1);
    } else {
        selectedCategories.push(categoryId);
    }
    
    // 更新全选状态
    const checkboxes = document.querySelectorAll('.category-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

// 查看分类商品
function viewCategoryProducts(categoryId) {
    console.log('查看分类商品:', categoryId);
    alert('查看分类商品功能待实现');
}

// 编辑分类
function editCategory(categoryId) {
    console.log('编辑分类:', categoryId);
    alert('编辑分类功能待实现');
}

// 删除分类
function deleteCategory(categoryId) {
    const category = categoryListData.find(c => c.id === categoryId);
    if (!category) return;

    if (confirm(`确定要删除分类"${category.name}"吗？`)) {
        const index = categoryListData.findIndex(c => c.id === categoryId);
        if (index > -1) {
            categoryListData.splice(index, 1);
            renderCategoryTable();
            updatePagination();
            alert('分类已删除');
        }
    }
}

// ========== 新建分类弹窗相关函数（复用商品列表页面的函数） ==========

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
        status: enabled ? 'enabled' : 'disabled',
        productCount: 0,
        channels: channels,
        requiredCategory: document.getElementById('requiredCategorySwitch').checked,
        timeSchedule: timeSchedule
    };

    // 添加到分类列表
    categoryListData.push(newCategory);
    
    // 刷新表格
    renderCategoryTable();
    updatePagination();
    
    // 关闭弹窗
    closeCreateCategoryModal();
    
    alert(`分类"${name}"创建成功！`);
}

// 全局函数
window.toggleCategorySelection = toggleCategorySelection;
window.goToPage = goToPage;
window.viewCategoryProducts = viewCategoryProducts;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.removeCategoryImage = removeCategoryImage;
window.addCategoryBadge = addCategoryBadge;
window.removeTimeSlot = removeTimeSlot;
window.updateTimeItemDisplay = updateTimeItemDisplay;
window.saveCategory = saveCategory;
