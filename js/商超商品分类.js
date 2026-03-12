// 商超 - 商品分类页面交互逻辑
// 支持三级分类：parentId 为 null 为一级，指向一级为二级，指向二级为三级
// 分类数据来源：商超分类数据.js（与商品列表左侧菜单共用）

var _baseData = (typeof window !== 'undefined' && window.shangchaoCategoryData && window.shangchaoCategoryData.length) ? JSON.parse(JSON.stringify(window.shangchaoCategoryData)) : [
    { id: 1, name: '雅安好物', productCount: 3, sort: 1, status: 'enabled', parentId: null },
    { id: 2, name: '雅安好景', productCount: 7, sort: 2, status: 'enabled', parentId: null },
    { id: 3, name: '文创产品', productCount: 5, sort: 3, status: 'enabled', parentId: null },
    { id: 4, name: '绿营养蛋系列', productCount: 2, sort: 1, status: 'enabled', parentId: 1 },
    { id: 5, name: '蒙顶山茶系列', productCount: 3, sort: 2, status: 'enabled', parentId: 2 },
    { id: 6, name: '茶饮小类', productCount: 1, sort: 1, status: 'enabled', parentId: 5 }
];
let categoryListData = _baseData;

function syncCategoryDataToStorage() {
    try {
        localStorage.setItem('shangchaoCategoryData', JSON.stringify(categoryListData));
        if (typeof window !== 'undefined') window.shangchaoCategoryData = categoryListData;
    } catch (e) {}
}

// 获取分类层级：1=一级 2=二级 3=三级
function getCategoryLevel(cat) {
    if (!cat || !cat.parentId) return 1;
    var parent = categoryListData.find(function (c) { return c.id === cat.parentId; });
    if (!parent || !parent.parentId) return 2;
    return 3;
}

// 获取分类完整路径（用于展示）
function getCategoryPath(cat) {
    if (!cat) return '';
    var names = [cat.name];
    var p = categoryListData.find(function (c) { return c.id === cat.parentId; });
    while (p) {
        names.unshift(p.name);
        p = categoryListData.find(function (c) { return c.id === p.parentId; });
    }
    return names.join(' / ');
}

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

    var pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            pagination.pageSize = parseInt(this.value, 10);
            pagination.currentPage = 1;
            renderCategoryTable();
            updatePagination();
        });
    }

    var batchDeleteBtn = document.getElementById('batchDeleteBtn');
    if (batchDeleteBtn) batchDeleteBtn.addEventListener('click', batchDeleteCategories);
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

    // 排序：按层级树形排序（一级 > 其子二级 > 其子三级，再按 sort）
    function getSortKey(c) {
        var p1 = !c.parentId ? c : categoryListData.find(function (x) { return x.id === c.parentId; });
        if (p1 && p1.parentId) p1 = categoryListData.find(function (x) { return x.id === p1.parentId; }) || p1;
        var p1Id = p1 ? (typeof p1 === 'object' ? p1.id : p1) : 0;
        var p2Id = c.parentId || 0;
        return (p1Id * 10000 + p2Id) * 1000 + (c.sort || 0) * 10 + c.id;
    }
    filteredCategories = filteredCategories.slice().sort(function (a, b) {
        return getSortKey(a) - getSortKey(b);
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

    tableBody.innerHTML = pagedCategories.map(function (category) {
        var isSelected = selectedCategories.indexOf(category.id) >= 0;
        var statusClass = category.status === 'enabled'
            ? 'category-list-status-badge-enabled'
            : 'category-list-status-badge-disabled';
        var statusText = category.status === 'enabled' ? '已启用' : '已禁用';
        var level = getCategoryLevel(category);
        var nameClass = 'category-list-category-name category-list-category-name--level' + level;
        var displayText = level === 1 ? category.name : getCategoryPath(category);
        var canAddChild = level < 3;
        var childBtn = canAddChild ? '<button class="category-list-action-btn category-list-action-btn-edit" onclick="openChildCategoryModal(' + category.id + ')">新建子分类</button>' : '';

        return '<tr data-level="' + level + '">' +
            '<td><label class="category-list-checkbox-label"><input type="checkbox" class="category-checkbox" value="' + category.id + '" ' + (isSelected ? 'checked' : '') + ' onchange="toggleCategorySelection(' + category.id + ')"></label></td>' +
            '<td><div class="' + nameClass + '"><span class="category-list-name-text">' + displayText + '</span></div></td>' +
            '<td><a href="#" class="category-list-product-count" onclick="viewCategoryProducts(' + category.id + '); return false;">' + category.productCount + '</a></td>' +
            '<td><span class="category-list-sort-order">' + category.sort + '</span></td>' +
            '<td><span class="category-list-status-badge ' + statusClass + '">' + statusText + '</span></td>' +
            '<td><div class="category-list-action-buttons">' +
            '<button class="category-list-action-btn category-list-action-btn-edit" onclick="editCategory(' + category.id + ')">编辑</button>' +
            childBtn +
            '<button class="category-list-action-btn category-list-action-btn-delete" onclick="deleteCategory(' + category.id + ')">删除</button>' +
            '</div></td></tr>';
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
    document.querySelectorAll('.category-checkbox').forEach(function (cb) {
        cb.checked = checked;
        var categoryId = parseInt(cb.value, 10);
        if (checked) {
            if (selectedCategories.indexOf(categoryId) < 0) selectedCategories.push(categoryId);
        } else {
            selectedCategories = selectedCategories.filter(function (id) { return id !== categoryId; });
        }
    });
    updateBatchDeleteVisibility();
}

function batchDeleteCategories() {
    if (selectedCategories.length === 0) return;
    var hasChildren = selectedCategories.some(function (id) {
        return categoryListData.some(function (c) { return c.parentId === id; });
    });
    if (hasChildren) {
        alert('所选分类中包含有子分类的项，请先删除子分类');
        return;
    }
    if (!confirm('确定要删除选中的 ' + selectedCategories.length + ' 个分类吗？')) return;
    selectedCategories.forEach(function (id) {
        var idx = categoryListData.findIndex(function (c) { return c.id === id; });
        if (idx > -1) categoryListData.splice(idx, 1);
    });
    selectedCategories = [];
    renderCategoryTable();
    updatePagination();
    updateBatchDeleteVisibility();
    document.getElementById('selectAllCheckbox').checked = false;
    syncCategoryDataToStorage();
    alert('已删除');
}

function toggleCategorySelection(categoryId) {
    var index = selectedCategories.indexOf(categoryId);
    if (index > -1) selectedCategories.splice(index, 1);
    else selectedCategories.push(categoryId);
    var checkboxes = document.querySelectorAll('.category-checkbox');
    var allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(function (cb) { return cb.checked; });
    var selectAll = document.getElementById('selectAllCheckbox');
    if (selectAll) selectAll.checked = allChecked;
    updateBatchDeleteVisibility();
}

function updateBatchDeleteVisibility() {
    var btn = document.getElementById('batchDeleteBtn');
    if (btn) btn.style.display = selectedCategories.length > 0 ? 'inline-flex' : 'none';
}

function viewCategoryProducts(categoryId) {
    console.log('查看分类商品:', categoryId);
    alert('查看分类商品功能待实现');
}

var currentEditCategoryId = null;

function editCategory(categoryId) {
    var category = categoryListData.find(function (c) { return c.id === categoryId; });
    if (!category) return;
    currentEditCategoryId = categoryId;
    currentParentCategoryId = category.parentId;
    document.getElementById('categoryNameInput').value = category.name;
    document.getElementById('categorySortInput').value = category.sort || 1;
    document.getElementById('categoryEnableSwitch').checked = category.status === 'enabled';
    var statusToggle = document.getElementById('categoryStatusToggle');
    if (statusToggle) {
        statusToggle.classList.toggle('active', category.status === 'enabled');
        statusToggle.querySelector('.product-list-status-toggle-text').textContent = category.status === 'enabled' ? '启用' : '禁用';
    }
    document.getElementById('createCategoryModal').querySelector('.product-list-modal-title').textContent = '编辑分类';
    showCreateCategoryModal();
}

function deleteCategory(categoryId) {
    var category = categoryListData.find(function (c) { return c.id === categoryId; });
    if (!category) return;
    var children = categoryListData.filter(function (c) { return c.parentId === categoryId; });
    if (children.length > 0) {
        alert('该分类下有子分类，请先删除子分类');
        return;
    }
    if (confirm('确定要删除分类"' + getCategoryPath(category) + '"吗？')) {
        var index = categoryListData.findIndex(function (c) { return c.id === categoryId; });
        if (index > -1) {
            categoryListData.splice(index, 1);
            renderCategoryTable();
            updatePagination();
            syncCategoryDataToStorage();
            alert('分类已删除');
        }
    }
}

// ========== 新建分类弹窗 ==========

// 填充上级分类下拉：可选父级为一级、二级分类，编辑时排除自身及子孙
function populateParentCategorySelect() {
    var sel = document.getElementById('parentCategorySelect');
    if (!sel) return;
    var excludeIds = []; // 编辑时排除自身及所有子孙
    if (currentEditCategoryId) {
        excludeIds.push(currentEditCategoryId);
        var collectDescendants = function (pid) {
            categoryListData.forEach(function (c) {
                if (c.parentId === pid) {
                    excludeIds.push(c.id);
                    collectDescendants(c.id);
                }
            });
        };
        collectDescendants(currentEditCategoryId);
    }
    var opts = ['<option value="">无（一级分类）</option>'];
    categoryListData.forEach(function (c) {
        if (excludeIds.indexOf(c.id) >= 0) return;
        var lev = getCategoryLevel(c);
        if (lev >= 3) return; // 只能选一级、二级作为父级
        var label = lev === 1 ? '一级：' + c.name : getCategoryPath(c);
        opts.push('<option value="' + c.id + '">' + label + '</option>');
    });
    sel.innerHTML = opts.join('');
    sel.value = currentParentCategoryId ? String(currentParentCategoryId) : '';
    sel.disabled = false;
}

function showCreateCategoryModal() {
    var modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (!currentEditCategoryId) resetCreateCategoryForm();
        renderTimeSchedule();
        populateParentCategorySelect();
    }
}

function closeCreateCategoryModal() {
    var modal = document.getElementById('createCategoryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentEditCategoryId = null;
        modal.querySelector('.product-list-modal-title').textContent = '新建分类';
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

    var parentSel = document.getElementById('parentCategorySelect');
    var parentIdVal = (parentSel && parentSel.value) ? parseInt(parentSel.value, 10) : null;

    if (currentEditCategoryId) {
        var existing = categoryListData.find(function (c) { return c.id === currentEditCategoryId; });
        if (existing) {
            existing.name = name;
            existing.sort = sort;
            existing.status = enabled ? 'enabled' : 'disabled';
            existing.parentId = parentIdVal;
            renderCategoryTable();
            updatePagination();
            closeCreateCategoryModal();
            syncCategoryDataToStorage();
            alert('分类"' + name + '"已更新');
        }
        return;
    }

    var newCategory = {
        id: Date.now(),
        name: name,
        sort: sort,
        status: enabled ? 'enabled' : 'disabled',
        productCount: 0,
        channels: channels,
        requiredCategory: document.getElementById('requiredCategorySwitch') ? document.getElementById('requiredCategorySwitch').checked : false,
        timeSchedule: timeSchedule,
        parentId: parentIdVal
    };

    categoryListData.push(newCategory);
    renderCategoryTable();
    updatePagination();
    closeCreateCategoryModal();
    syncCategoryDataToStorage();
    alert('分类"' + name + '"创建成功');
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
window.closeCreateCategoryModal = closeCreateCategoryModal;
