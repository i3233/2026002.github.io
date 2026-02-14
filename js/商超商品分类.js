// 商超 - 商品分类页面交互逻辑
// 分类与商超商品列表中的「分类筛选」保持一致：雅安好物、雅安好景、文创产品

// 分类数据（与商超收银台、商品列表一致：雅安好景 7 件、雅安好物 3 件、文创产品 5 件）
// 支持二级分类：通过 parentId 区分，null 为一级分类
let categoryListData = [
    { id: 1, name: '雅安好物', productCount: 3, sort: 1, status: 'enabled', parentId: null },
    { id: 2, name: '雅安好景', productCount: 7, sort: 2, status: 'enabled', parentId: null },
    { id: 3, name: '文创产品', productCount: 5, sort: 3, status: 'enabled', parentId: null },
    // 示例二级分类（仅作为展示，可以后续通过界面新增）
    { id: 4, name: '绿营养蛋系列', productCount: 2, sort: 1, status: 'enabled', parentId: 1 },
    { id: 5, name: '蒙顶山茶系列', productCount: 3, sort: 2, status: 'enabled', parentId: 2 }
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

// 当前在弹窗中新建的上级分类ID（null 表示一级分类）
let currentParentCategoryId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initCreateCategoryForm();
    renderCategoryTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    const searchInput = document.getElementById('categorySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            pagination.currentPage = 1;
            renderCategoryTable();
            updatePagination();
        });
    }

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

    const createCategoryBtn = document.getElementById('createCategoryBtn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', function() {
            currentParentCategoryId = null;
            showCreateCategoryModal();
        });
    }

    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }

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

// 渲染分类表格（支持二级分类）
function renderCategoryTable() {
    const tableBody = document.getElementById('categoryTableBody');
    if (!tableBody) return;

    let filteredCategories = categoryListData;
    if (searchKeyword) {
        filteredCategories = filteredCategories.filter(c =>
            c.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 排序：先按 parentId（一级在前），再按 sort，再按 id
    filteredCategories = filteredCategories.slice().sort((a, b) => {
        const pa = a.parentId || 0;
        const pb = b.parentId || 0;
        if (pa !== pb) return pa - pb;
        if (a.sort !== b.sort) return a.sort - b.sort;
        return a.id - b.id;
    });

    pagination.total = filteredCategories.length;
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

    tableBody.innerHTML = pagedCategories.map(category => {
        const isSelected = selectedCategories.includes(category.id);
        const statusClass = category.status === 'enabled'
            ? 'category-list-status-badge-enabled'
            : 'category-list-status-badge-disabled';
        const statusText = category.status === 'enabled' ? '已启用' : '已禁用';
        const isChild = !!category.parentId;
        const nameClass = 'category-list-category-name' + (isChild ? ' category-list-category-name--child' : '');

        return `
            <tr>
                <td>
                    <label class="category-list-checkbox-label">
                        <input type="checkbox" class="category-checkbox" value="${category.id}" ${isSelected ? 'checked' : ''} onchange="toggleCategorySelection(${category.id})">
                    </label>
                </td>
                <td><span class="${nameClass}">${category.name}</span></td>
                <td>
                    <a href="#" class="category-list-product-count" onclick="viewCategoryProducts(${category.id}); return false;">${category.productCount}</a>
                </td>
                <td><span class="category-list-sort-order">${category.sort}</span></td>
                <td><span class="category-list-status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="category-list-action-buttons">
                        <button class="category-list-action-btn category-list-action-btn-edit" onclick="editCategory(${category.id})">编辑</button>
                        ${!category.parentId ? `<button class="category-list-action-btn category-list-action-btn-edit" onclick="openChildCategoryModal(${category.id})">新建子分类</button>` : ''}
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
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === pagination.currentPage;
            pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        if (pagination.currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        } else if (pagination.currentPage >= totalPages - 3) {
            pagesHTML += `<button class="category-list-pagination-page" onclick="goToPage(1)">1</button>`;
            pagesHTML += `<span style="padding: 0 var(--spacing-xs); color: var(--color-text-secondary);">...</span>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                const isActive = i === pagination.currentPage;
                pagesHTML += `<button class="category-list-pagination-page ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
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

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.disabled = pagination.currentPage === 1;
    if (nextBtn) nextBtn.disabled = pagination.currentPage >= totalPages;
}

function goToPage(page) {
    pagination.currentPage = page;
    renderCategoryTable();
    updatePagination();
}

function toggleSelectAll(checked) {
    document.querySelectorAll('.category-checkbox').forEach(cb => {
        cb.checked = checked;
        const categoryId = parseInt(cb.value);
        if (checked) {
            if (!selectedCategories.includes(categoryId)) selectedCategories.push(categoryId);
        } else {
            selectedCategories = selectedCategories.filter(id => id !== categoryId);
        }
    });
}

function toggleCategorySelection(categoryId) {
    const index = selectedCategories.indexOf(categoryId);
    if (index > -1) selectedCategories.splice(index, 1);
    else selectedCategories.push(categoryId);
    const checkboxes = document.querySelectorAll('.category-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

function viewCategoryProducts(categoryId) {
    console.log('查看分类商品:', categoryId);
    alert('查看分类商品功能待实现');
}

function editCategory(categoryId) {
    console.log('编辑分类:', categoryId);
    alert('编辑分类功能待实现');
}

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

// ========== 新建分类弹窗 ==========

function showCreateCategoryModal() {
    const modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        resetCreateCategoryForm();
        renderTimeSchedule();

        // 根据 currentParentCategoryId 更新上级分类展示
        const parentDisplay = document.getElementById('parentCategoryDisplay');
        if (parentDisplay) {
            if (currentParentCategoryId) {
                const parent = categoryListData.find(c => c.id === currentParentCategoryId);
                parentDisplay.textContent = parent
                    ? `上级分类：${parent.name}（将创建为二级分类）`
                    : '上级分类：未知（ID ' + currentParentCategoryId + '）';
            } else {
                parentDisplay.textContent = '当前为一级分类';
            }
        }
    }
}

function closeCreateCategoryModal() {
    const modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function initCreateCategoryForm() {
    const categoryImageUpload = document.getElementById('categoryImageUpload');
    const categoryImageInput = document.getElementById('categoryImageInput');
    if (categoryImageUpload && categoryImageInput) {
        categoryImageUpload.addEventListener('click', () => categoryImageInput.click());
        categoryImageInput.addEventListener('change', handleCategoryImageUpload);
    }

    const statusToggle = document.getElementById('categoryStatusToggle');
    if (statusToggle) {
        statusToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const enableSwitch = document.getElementById('categoryEnableSwitch');
            if (enableSwitch) enableSwitch.checked = this.classList.contains('active');
        });
    }

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

function handleCategoryImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5M');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev) {
            const preview = document.getElementById('categoryImagePreview');
            const previewImg = document.getElementById('categoryImagePreviewImg');
            const uploadArea = document.getElementById('categoryImageUpload');
            if (preview && previewImg && uploadArea) {
                previewImg.src = ev.target.result;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

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

function updateTimeItemDisplay(dayIndex) {
    const timeItem = document.querySelector(`.product-list-time-item[data-day="${dayIndex}"]`);
    if (timeItem) {
        const checkbox = timeItem.querySelector('.product-list-time-item-checkbox');
        const removeBtn = timeItem.querySelector('.product-list-time-btn.remove');
        if (checkbox && removeBtn) {
            removeBtn.style.display = checkbox.checked ? 'none' : 'flex';
            timeItem.style.opacity = checkbox.checked ? '1' : '0.5';
        }
    }
}

function addCategoryBadge() {
    alert('添加分类角标功能待实现');
}

// 重置新建分类表单（商超渠道：线上、收银台、提货点、批发、积分商城、商城系统）
function resetCreateCategoryForm() {
    const nameEl = document.getElementById('categoryNameInput');
    const sortEl = document.getElementById('categorySortInput');
    const productsEl = document.getElementById('categoryProductsInput');
    if (nameEl) nameEl.value = '';
    if (sortEl) sortEl.value = '1';
    if (productsEl) productsEl.value = '';

    removeCategoryImage();

    const enableSwitch = document.getElementById('categoryEnableSwitch');
    const statusToggle = document.getElementById('categoryStatusToggle');
    if (enableSwitch) enableSwitch.checked = true;
    if (statusToggle) {
        statusToggle.classList.add('active');
        const text = statusToggle.querySelector('.product-list-status-toggle-text');
        if (text) text.textContent = '启用';
    }

    const channelSwitches = [
        'channelOnlineSwitch',
        'channelCashierSwitch',
        'channelPickupSwitch',
        'channelWholesaleSwitch',
        'channelPointsSwitch',
        'channelMallSwitch'
    ];
    channelSwitches.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });

    const requiredSwitch = document.getElementById('requiredCategorySwitch');
    if (requiredSwitch) requiredSwitch.checked = false;

    renderTimeSchedule();
}

// 保存分类（商超渠道）
function saveCategory() {
    const name = document.getElementById('categoryNameInput').value.trim();
    const sort = parseInt(document.getElementById('categorySortInput').value) || 1;
    const enabled = document.getElementById('categoryEnableSwitch').checked;

    if (!name) {
        alert('请输入分类名称');
        return;
    }

    const channels = [];
    if (document.getElementById('channelOnlineSwitch') && document.getElementById('channelOnlineSwitch').checked) channels.push('online');
    if (document.getElementById('channelCashierSwitch') && document.getElementById('channelCashierSwitch').checked) channels.push('cashier');
    if (document.getElementById('channelPickupSwitch') && document.getElementById('channelPickupSwitch').checked) channels.push('pickup');
    if (document.getElementById('channelWholesaleSwitch') && document.getElementById('channelWholesaleSwitch').checked) channels.push('wholesale');
    if (document.getElementById('channelPointsSwitch') && document.getElementById('channelPointsSwitch').checked) channels.push('points');
    if (document.getElementById('channelMallSwitch') && document.getElementById('channelMallSwitch').checked) channels.push('mall');

    const timeSchedule = [];
    for (let i = 0; i < 7; i++) {
        const checkbox = document.querySelector(`.product-list-time-item-checkbox[data-day="${i}"]`);
        if (checkbox && checkbox.checked) {
            const startInput = document.querySelector(`.product-list-time-input[data-day="${i}"][data-type="start"]`);
            const endInput = document.querySelector(`.product-list-time-input[data-day="${i}"][data-type="end"]`);
            if (startInput && endInput) {
                timeSchedule.push({ day: i, start: startInput.value, end: endInput.value });
            }
        }
    }

    const newCategory = {
        id: Date.now(),
        name: name,
        sort: sort,
        status: enabled ? 'enabled' : 'disabled',
        productCount: 0,
        channels: channels,
        requiredCategory: document.getElementById('requiredCategorySwitch').checked,
        timeSchedule: timeSchedule,
        parentId: currentParentCategoryId || null
    };

    categoryListData.push(newCategory);
    renderCategoryTable();
    updatePagination();
    closeCreateCategoryModal();
    alert(`分类"${name}"创建成功！`);
}

// 打开“新建子分类”弹窗
function openChildCategoryModal(parentId) {
    currentParentCategoryId = parentId;
    showCreateCategoryModal();
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
window.openChildCategoryModal = openChildCategoryModal;
