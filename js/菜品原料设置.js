// 菜品原料设置页面交互逻辑

// 餐饮商品分类映射
const categoryMap = {
    'chinese': '中餐',
    'rainbow': '彩虹斗酒',
    'special': '特色斗酒',
    'wine': '洋酒香槟',
    'beer': '啤酒',
    'snack': '小吃系列',
    'other': '其他系列',
    'package': '优惠套餐',
    'department': '百货',
    'housekeeping': '家政',
    'soft-drink': '软饮系列'
};

// 菜品数据（包含原料信息）
let productData = [
    {
        id: 1,
        name: '锅巴肉片',
        category: 'chinese',
        categoryName: '中餐',
        ingredients: [
            { id: 1, name: '猪肉', qty: 200, unit: 'g' },
            { id: 2, name: '锅巴', qty: 100, unit: 'g' },
            { id: 3, name: '青椒', qty: 50, unit: 'g' },
            { id: 4, name: '调料', qty: 20, unit: 'g' }
        ],
        updateTime: '2026-02-01 10:30:00'
    },
    {
        id: 2,
        name: '肥肠血旺',
        category: 'chinese',
        categoryName: '中餐',
        ingredients: [
            { id: 5, name: '肥肠', qty: 150, unit: 'g' },
            { id: 6, name: '血旺', qty: 200, unit: 'g' },
            { id: 7, name: '豆芽', qty: 100, unit: 'g' },
            { id: 8, name: '调料', qty: 30, unit: 'g' }
        ],
        updateTime: '2026-02-01 11:15:00'
    },
    {
        id: 3,
        name: '彩虹斗酒套装41支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        ingredients: [
            { id: 9, name: '基酒', qty: 500, unit: 'ml' },
            { id: 10, name: '果汁', qty: 200, unit: 'ml' },
            { id: 11, name: '糖浆', qty: 50, unit: 'ml' }
        ],
        updateTime: '2026-01-30 14:20:00'
    },
    {
        id: 4,
        name: '红尘玫瑰17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        ingredients: [
            { id: 12, name: '基酒', qty: 300, unit: 'ml' },
            { id: 13, name: '玫瑰糖浆', qty: 30, unit: 'ml' }
        ],
        updateTime: '2026-01-29 16:45:00'
    },
    {
        id: 5,
        name: '猕猴蓝17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        ingredients: [
            { id: 14, name: '基酒', qty: 300, unit: 'ml' },
            { id: 15, name: '猕猴桃汁', qty: 50, unit: 'ml' }
        ],
        updateTime: '2026-01-29 16:45:00'
    },
    {
        id: 6,
        name: '草莓蜜酒17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        ingredients: [
            { id: 16, name: '基酒', qty: 300, unit: 'ml' },
            { id: 17, name: '草莓糖浆', qty: 40, unit: 'ml' }
        ],
        updateTime: '2026-01-29 16:45:00'
    }
];

// 筛选条件
let currentCategory = 'all';
let searchKeyword = '';
let selectedProducts = [];

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
};

// 当前编辑的菜品ID
let currentEditProductId = null;
// 当前编辑的原料列表
let currentIngredients = [];

// DOM 元素
const productTableBody = document.getElementById('productTableBody');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const productSearchInput = document.getElementById('productSearchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationPages = document.getElementById('paginationPages');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderProductTable();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 分类菜单点击
    document.querySelectorAll('.ingredient-setting-category-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.ingredient-setting-category-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category || 'all';
            pagination.currentPage = 1;
            renderProductTable();
            updatePagination();
        });
    });

    // 搜索
    productSearchInput.addEventListener('input', function() {
        searchKeyword = this.value.trim();
        pagination.currentPage = 1;
        renderProductTable();
        updatePagination();
    });

    // 全选
    selectAllCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.product-checkbox').forEach(cb => {
            cb.checked = checked;
            if (checked) {
                if (!selectedProducts.includes(parseInt(cb.dataset.productId))) {
                    selectedProducts.push(parseInt(cb.dataset.productId));
                }
            } else {
                selectedProducts = [];
            }
        });
    });

    // 行复选框
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-checkbox')) {
            const productId = parseInt(e.target.dataset.productId);
            if (e.target.checked) {
                if (!selectedProducts.includes(productId)) {
                    selectedProducts.push(productId);
                }
            } else {
                selectedProducts = selectedProducts.filter(id => id !== productId);
            }
            syncSelectAll();
        }
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderProductTable();
        updatePagination();
    });

    // 设置原料按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('set-ingredient-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            showIngredientModal(productId);
        }
    });

    // 添加原料按钮（弹窗内）
    document.getElementById('addIngredientRowBtn').addEventListener('click', function() {
        addIngredientRow();
    });

    // 保存原料
    document.getElementById('saveIngredientsBtn').addEventListener('click', function() {
        saveIngredients();
    });

    // 添加原料弹窗
    document.getElementById('addIngredientBtn').addEventListener('click', function() {
        showAddIngredientModal();
    });

    document.getElementById('confirmAddIngredientBtn').addEventListener('click', function() {
        confirmAddIngredient();
    });

    // 批量设置
    document.getElementById('batchSetBtn').addEventListener('click', function() {
        if (selectedProducts.length === 0) {
            alert('请先选择要设置原料的菜品');
            return;
        }
        alert('批量设置原料（示例）：共选择 ' + selectedProducts.length + ' 个菜品');
    });

    // 导出
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportIngredients();
    });

    // 导入
    document.getElementById('importBtn').addEventListener('click', function() {
        alert('导入原料设置（示例）');
    });
}

// 渲染菜品表格
function renderProductTable() {
    productTableBody.innerHTML = '';

    // 筛选数据
    let filteredData = productData.filter(product => {
        // 分类筛选
        if (currentCategory !== 'all' && product.category !== currentCategory) {
            return false;
        }
        // 搜索筛选
        if (searchKeyword && !product.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return false;
        }
        return true;
    });

    pagination.total = filteredData.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</td></tr>';
        return;
    }

    pageData.forEach(product => {
        const tr = document.createElement('tr');
        tr.dataset.productId = product.id;
        
        const ingredientCount = product.ingredients ? product.ingredients.length : 0;
        
        tr.innerHTML = `
            <td>
                <label class="ingredient-setting-checkbox-label">
                    <input type="checkbox" class="product-checkbox" data-product-id="${product.id}">
                </label>
            </td>
            <td>
                <span class="ingredient-setting-product-name">${product.name}</span>
            </td>
            <td>
                <span class="ingredient-setting-category-badge">${product.categoryName}</span>
            </td>
            <td>
                <span class="ingredient-setting-ingredient-count">${ingredientCount}</span>
                <span style="color: var(--color-text-secondary);"> 种</span>
            </td>
            <td>${product.updateTime || '-'}</td>
            <td>
                <button class="ingredient-setting-action-btn set-ingredient-btn" data-product-id="${product.id}">设置原料</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });

    syncSelectAll();
}

// 同步全选状态
function syncSelectAll() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const checkedCount = document.querySelectorAll('.product-checkbox:checked').length;
    selectAllCheckbox.checked = checkedCount > 0 && checkedCount === checkboxes.length;
}

// 显示设置原料弹窗
function showIngredientModal(productId) {
    const product = productData.find(p => p.id === productId);
    if (!product) {
        alert('未找到该菜品');
        return;
    }

    currentEditProductId = productId;
    currentIngredients = product.ingredients ? JSON.parse(JSON.stringify(product.ingredients)) : [];

    // 设置弹窗标题和菜品信息
    document.getElementById('ingredientModalTitle').textContent = `设置原料 - ${product.name}`;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductCategory').textContent = product.categoryName;

    // 渲染原料列表
    renderIngredientsTable();

    // 显示弹窗
    document.getElementById('ingredientModal').style.display = 'block';
}

// 关闭设置原料弹窗
function closeIngredientModal() {
    document.getElementById('ingredientModal').style.display = 'none';
    currentEditProductId = null;
    currentIngredients = [];
}

// 渲染原料列表
function renderIngredientsTable() {
    const tbody = document.getElementById('ingredientsTableBody');
    tbody.innerHTML = '';

    if (currentIngredients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无原料，请点击"添加原料"按钮添加</td></tr>';
        return;
    }

    currentIngredients.forEach((ingredient, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <input type="text" class="ingredient-setting-ingredient-input" value="${ingredient.name}" 
                       data-field="name" data-index="${index}" placeholder="原料名称">
            </td>
            <td>
                <input type="number" class="ingredient-setting-ingredient-input" value="${ingredient.qty}" 
                       data-field="qty" data-index="${index}" placeholder="用量" step="0.01" min="0">
            </td>
            <td>
                <select class="ingredient-setting-ingredient-select" data-field="unit" data-index="${index}">
                    <option value="g" ${ingredient.unit === 'g' ? 'selected' : ''}>克(g)</option>
                    <option value="kg" ${ingredient.unit === 'kg' ? 'selected' : ''}>千克(kg)</option>
                    <option value="ml" ${ingredient.unit === 'ml' ? 'selected' : ''}>毫升(ml)</option>
                    <option value="l" ${ingredient.unit === 'l' ? 'selected' : ''}>升(l)</option>
                    <option value="个" ${ingredient.unit === '个' ? 'selected' : ''}>个</option>
                    <option value="份" ${ingredient.unit === '份' ? 'selected' : ''}>份</option>
                    <option value="包" ${ingredient.unit === '包' ? 'selected' : ''}>包</option>
                    <option value="瓶" ${ingredient.unit === '瓶' ? 'selected' : ''}>瓶</option>
                    <option value="支" ${ingredient.unit === '支' ? 'selected' : ''}>支</option>
                </select>
            </td>
            <td>
                <button class="ingredient-setting-action-btn ingredient-setting-action-btn-danger remove-ingredient-btn" data-index="${index}">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 绑定输入事件
    bindIngredientInputs();
    // 绑定删除事件
    bindRemoveButtons();
}

// 绑定原料输入事件
function bindIngredientInputs() {
    document.querySelectorAll('.ingredient-setting-ingredient-input, .ingredient-setting-ingredient-select').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            const field = this.dataset.field;
            if (currentIngredients[index]) {
                if (field === 'qty') {
                    currentIngredients[index][field] = parseFloat(this.value) || 0;
                } else {
                    currentIngredients[index][field] = this.value;
                }
            }
        });
    });
}

// 绑定删除按钮事件
function bindRemoveButtons() {
    document.querySelectorAll('.remove-ingredient-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (confirm('确定要删除这个原料吗？')) {
                currentIngredients.splice(index, 1);
                renderIngredientsTable();
            }
        });
    });
}

// 添加原料行
function addIngredientRow() {
    const newIngredient = {
        id: Date.now(),
        name: '',
        qty: 0,
        unit: 'g'
    };
    currentIngredients.push(newIngredient);
    renderIngredientsTable();
}

// 保存原料
function saveIngredients() {
    if (!currentEditProductId) {
        return;
    }

    // 验证原料数据
    const hasEmpty = currentIngredients.some(ing => !ing.name || ing.qty <= 0);
    if (hasEmpty) {
        alert('请填写完整的原料信息（原料名称和用量必须大于0）');
        return;
    }

    // 更新菜品数据
    const product = productData.find(p => p.id === currentEditProductId);
    if (product) {
        product.ingredients = currentIngredients;
        product.updateTime = new Date().toLocaleString('zh-CN');
    }

    // 刷新表格
    renderProductTable();
    
    // 关闭弹窗
    closeIngredientModal();
    
    alert('原料设置保存成功！');
}

// 显示添加原料弹窗
function showAddIngredientModal() {
    document.getElementById('addIngredientModal').style.display = 'block';
    document.getElementById('ingredientNameInput').value = '';
    document.getElementById('ingredientQtyInput').value = '';
    document.getElementById('ingredientUnitSelect').value = '';
}

// 关闭添加原料弹窗
function closeAddIngredientModal() {
    document.getElementById('addIngredientModal').style.display = 'none';
}

// 确认添加原料（添加到原料库）
function confirmAddIngredient() {
    const name = document.getElementById('ingredientNameInput').value.trim();
    const qty = parseFloat(document.getElementById('ingredientQtyInput').value);
    const unit = document.getElementById('ingredientUnitSelect').value;

    if (!name || !qty || qty <= 0 || !unit) {
        alert('请填写完整的原料信息');
        return;
    }

    // 这里可以添加到原料库
    alert(`添加原料成功：${name} ${qty}${unit}`);
    closeAddIngredientModal();
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('totalRecords').textContent = pagination.total;
    
    // 上一页/下一页按钮
    prevPageBtn.disabled = pagination.currentPage === 1;
    nextPageBtn.disabled = pagination.currentPage === totalPages || totalPages === 0;

    prevPageBtn.addEventListener('click', function() {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderProductTable();
            updatePagination();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderProductTable();
            updatePagination();
        }
    });

    // 页码按钮
    paginationPages.innerHTML = '';
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, pagination.currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'ingredient-setting-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
            renderProductTable();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ingredient-setting-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'ingredient-setting-pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            pagination.currentPage = i;
            renderProductTable();
            updatePagination();
        });
        paginationPages.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ingredient-setting-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'ingredient-setting-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderProductTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 导出原料设置
function exportIngredients() {
    const csv = [
        ['菜品名称', '分类', '原料名称', '用量', '单位'].join(','),
        ...productData.flatMap(product => {
            if (!product.ingredients || product.ingredients.length === 0) {
                return [[product.name, product.categoryName, '', '', ''].join(',')];
            }
            return product.ingredients.map(ing => {
                return [
                    product.name,
                    product.categoryName,
                    ing.name,
                    ing.qty,
                    ing.unit
                ].join(',');
            });
        })
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `菜品原料设置_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 全局函数
window.closeIngredientModal = closeIngredientModal;
window.closeAddIngredientModal = closeAddIngredientModal;
