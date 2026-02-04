// 用料分析页面交互逻辑

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

// 菜品数据（包含原料信息）- 与菜品原料设置页面保持一致
const productData = [
    {
        id: 1,
        name: '锅巴肉片',
        category: 'chinese',
        categoryName: '中餐',
        price: 68.00,
        ingredients: [
            { id: 1, name: '猪肉', qty: 200, unit: 'g' },
            { id: 2, name: '锅巴', qty: 100, unit: 'g' },
            { id: 3, name: '青椒', qty: 50, unit: 'g' },
            { id: 4, name: '调料', qty: 20, unit: 'g' }
        ]
    },
    {
        id: 2,
        name: '肥肠血旺',
        category: 'chinese',
        categoryName: '中餐',
        price: 45.00,
        ingredients: [
            { id: 5, name: '肥肠', qty: 150, unit: 'g' },
            { id: 6, name: '血旺', qty: 200, unit: 'g' },
            { id: 7, name: '豆芽', qty: 100, unit: 'g' },
            { id: 8, name: '调料', qty: 30, unit: 'g' }
        ]
    },
    {
        id: 3,
        name: '彩虹斗酒套装41支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 178.00,
        ingredients: [
            { id: 9, name: '基酒', qty: 500, unit: 'ml' },
            { id: 10, name: '果汁', qty: 200, unit: 'ml' },
            { id: 11, name: '糖浆', qty: 50, unit: 'ml' }
        ]
    },
    {
        id: 4,
        name: '红尘玫瑰17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        ingredients: [
            { id: 12, name: '基酒', qty: 300, unit: 'ml' },
            { id: 13, name: '玫瑰糖浆', qty: 30, unit: 'ml' }
        ]
    },
    {
        id: 5,
        name: '猕猴蓝17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        ingredients: [
            { id: 14, name: '基酒', qty: 300, unit: 'ml' },
            { id: 15, name: '猕猴桃汁', qty: 50, unit: 'ml' }
        ]
    },
    {
        id: 6,
        name: '草莓蜜酒17支',
        category: 'rainbow',
        categoryName: '彩虹斗酒',
        price: 118.00,
        ingredients: [
            { id: 16, name: '基酒', qty: 300, unit: 'ml' },
            { id: 17, name: '草莓糖浆', qty: 40, unit: 'ml' }
        ]
    }
];

// 模拟销售订单数据（用于分析）
const salesOrders = [
    { id: 1, productId: 1, productName: '锅巴肉片', date: '2026-02-01', qty: 5, amount: 340.00 },
    { id: 2, productId: 2, productName: '肥肠血旺', date: '2026-02-01', qty: 3, amount: 135.00 },
    { id: 3, productId: 1, productName: '锅巴肉片', date: '2026-02-02', qty: 8, amount: 544.00 },
    { id: 4, productId: 3, productName: '彩虹斗酒套装41支', date: '2026-02-01', qty: 2, amount: 356.00 },
    { id: 5, productId: 4, productName: '红尘玫瑰17支', date: '2026-02-01', qty: 10, amount: 1180.00 },
    { id: 6, productId: 5, productName: '猕猴蓝17支', date: '2026-02-02', qty: 6, amount: 708.00 },
    { id: 7, productId: 6, productName: '草莓蜜酒17支', date: '2026-02-02', qty: 4, amount: 472.00 },
    { id: 8, productId: 2, productName: '肥肠血旺', date: '2026-02-03', qty: 7, amount: 315.00 },
    { id: 9, productId: 4, productName: '红尘玫瑰17支', date: '2026-02-03', qty: 5, amount: 590.00 }
];

// 筛选条件
let startDate = '2026-02-01';
let endDate = '2026-02-03';
let currentCategory = 'all';
let searchKeyword = '';
let viewMode = 'product'; // 'product' 或 'ingredient'

// 分析结果
let analysisResults = {
    byProduct: [], // 按菜品统计
    byIngredient: [] // 按原料统计
};

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 20,
    total: 0
};

// DOM 元素
const productViewTableBody = document.getElementById('productViewTableBody');
const ingredientViewTableBody = document.getElementById('ingredientViewTableBody');
const productViewTable = document.getElementById('productViewTable');
const ingredientViewTable = document.getElementById('ingredientViewTable');
const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const categoryFilterSelect = document.getElementById('categoryFilterSelect');
const productSearchInput = document.getElementById('productSearchInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationPages = document.getElementById('paginationPages');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    performAnalysis();
});

// 初始化事件监听
function initEventListeners() {
    // 分析按钮
    analyzeBtn.addEventListener('click', function() {
        startDate = startDateInput.value;
        endDate = endDateInput.value;
        currentCategory = categoryFilterSelect.value;
        searchKeyword = productSearchInput.value.trim();
        pagination.currentPage = 1;
        performAnalysis();
    });

    // 视图切换
    document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            viewMode = this.value;
            renderTable();
            updatePagination();
        });
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderTable();
        updatePagination();
    });

    // 导出
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportAnalysis();
    });

    document.getElementById('exportDetailBtn').addEventListener('click', function() {
        exportDetailReport();
    });
}

// 执行分析
function performAnalysis() {
    // 筛选销售订单
    let filteredOrders = salesOrders.filter(order => {
        // 时间筛选
        if (order.date < startDate || order.date > endDate) {
            return false;
        }
        return true;
    });

    // 按菜品统计
    const productStats = {};
    filteredOrders.forEach(order => {
        const product = productData.find(p => p.id === order.productId);
        if (!product) return;

        // 分类筛选
        if (currentCategory !== 'all' && product.category !== currentCategory) {
            return;
        }

        // 搜索筛选
        if (searchKeyword && !product.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return;
        }

        if (!productStats[order.productId]) {
            productStats[order.productId] = {
                productId: order.productId,
                productName: order.productName,
                category: product.category,
                categoryName: product.categoryName,
                totalQty: 0,
                totalAmount: 0,
                ingredients: product.ingredients || []
            };
        }
        productStats[order.productId].totalQty += order.qty;
        productStats[order.productId].totalAmount += order.amount;
    });

    analysisResults.byProduct = Object.values(productStats);

    // 按原料统计
    const ingredientStats = {};
    analysisResults.byProduct.forEach(productStat => {
        productStat.ingredients.forEach(ingredient => {
            const key = `${ingredient.name}_${ingredient.unit}`;
            if (!ingredientStats[key]) {
                ingredientStats[key] = {
                    name: ingredient.name,
                    unit: ingredient.unit,
                    totalQty: 0,
                    usedInProducts: []
                };
            }
            // 计算消耗量 = 菜品销售数量 × 原料用量
            const consumption = productStat.totalQty * ingredient.qty;
            ingredientStats[key].totalQty += consumption;
            
            // 记录使用该原料的菜品
            const existingProduct = ingredientStats[key].usedInProducts.find(p => p.id === productStat.productId);
            if (existingProduct) {
                existingProduct.qty += productStat.totalQty;
            } else {
                ingredientStats[key].usedInProducts.push({
                    id: productStat.productId,
                    name: productStat.productName,
                    qty: productStat.totalQty
                });
            }
        });
    });

    analysisResults.byIngredient = Object.values(ingredientStats);

    // 更新统计
    updateSummary();
    
    // 渲染表格
    renderTable();
    updatePagination();
}

// 更新统计卡片
function updateSummary() {
    const totalAmount = analysisResults.byProduct.reduce((sum, p) => sum + p.totalAmount, 0);
    const productCount = analysisResults.byProduct.length;
    const ingredientCount = analysisResults.byIngredient.length;
    const totalConsumption = analysisResults.byIngredient.reduce((sum, ing) => sum + ing.totalQty, 0);

    document.getElementById('summaryTotalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('summaryProductCount').textContent = productCount;
    document.getElementById('summaryIngredientCount').textContent = ingredientCount;
    document.getElementById('summaryTotalConsumption').textContent = totalConsumption.toFixed(2);
}

// 渲染表格
function renderTable() {
    if (viewMode === 'product') {
        productViewTable.style.display = 'table';
        ingredientViewTable.style.display = 'none';
        renderProductView();
    } else {
        productViewTable.style.display = 'none';
        ingredientViewTable.style.display = 'table';
        renderIngredientView();
    }
}

// 渲染按菜品视图
function renderProductView() {
    productViewTableBody.innerHTML = '';

    const totalPages = Math.ceil(analysisResults.byProduct.length / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = analysisResults.byProduct.slice(start, end);

    if (pageData.length === 0) {
        productViewTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据，请选择时间范围后点击"分析"按钮</td></tr>';
        return;
    }

    pageData.forEach(productStat => {
        const tr = document.createElement('tr');
        tr.dataset.productId = productStat.productId;
        
        // 生成原料消耗列表
        const ingredientsHtml = productStat.ingredients.map(ing => {
            const consumption = productStat.totalQty * ing.qty;
            return `<div class="ingredient-analysis-ingredient-item">
                <span class="ingredient-analysis-ingredient-name">${ing.name}</span>：${consumption.toFixed(2)}${ing.unit}
            </div>`;
        }).join('');

        tr.innerHTML = `
            <td>
                <span class="ingredient-analysis-product-name">${productStat.productName}</span>
            </td>
            <td>
                <span class="ingredient-analysis-category-badge">${productStat.categoryName}</span>
            </td>
            <td class="text-right">${productStat.totalQty}</td>
            <td class="text-right">¥${productStat.totalAmount.toFixed(2)}</td>
            <td>
                <div class="ingredient-analysis-ingredients-list">
                    ${ingredientsHtml || '<span style="color: var(--color-text-secondary);">未设置原料</span>'}
                </div>
            </td>
            <td>
                <button class="ingredient-analysis-action-btn view-detail-btn" data-product-id="${productStat.productId}">查看详情</button>
            </td>
        `;
        productViewTableBody.appendChild(tr);
    });

    // 绑定查看详情事件
    bindDetailButtons();
}

// 渲染按原料视图
function renderIngredientView() {
    ingredientViewTableBody.innerHTML = '';

    const totalPages = Math.ceil(analysisResults.byIngredient.length / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = analysisResults.byIngredient.slice(start, end);

    if (pageData.length === 0) {
        ingredientViewTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据，请选择时间范围后点击"分析"按钮</td></tr>';
        return;
    }

    pageData.forEach(ingredientStat => {
        const tr = document.createElement('tr');
        
        // 生成使用菜品列表
        const productsHtml = ingredientStat.usedInProducts.map(p => {
            return `<span style="margin-right: var(--spacing-sm); padding: 2px 6px; background-color: var(--color-neutral-100); border-radius: var(--radius-sm); font-size: var(--font-size-xs);">${p.name}(${p.qty})</span>`;
        }).join('');

        tr.innerHTML = `
            <td>
                <span class="ingredient-analysis-product-name">${ingredientStat.name}</span>
            </td>
            <td>${ingredientStat.unit}</td>
            <td class="text-right">${ingredientStat.totalQty.toFixed(2)}</td>
            <td>
                <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-xs);">
                    ${productsHtml}
                </div>
            </td>
            <td>
                <button class="ingredient-analysis-action-btn view-detail-btn" data-ingredient-name="${ingredientStat.name}" data-ingredient-unit="${ingredientStat.unit}">查看详情</button>
            </td>
        `;
        ingredientViewTableBody.appendChild(tr);
    });

    // 绑定查看详情事件
    bindDetailButtons();
}

// 绑定查看详情按钮
function bindDetailButtons() {
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (viewMode === 'product') {
                const productId = parseInt(this.dataset.productId);
                showProductDetail(productId);
            } else {
                const ingredientName = this.dataset.ingredientName;
                const ingredientUnit = this.dataset.ingredientUnit;
                showIngredientDetail(ingredientName, ingredientUnit);
            }
        });
    });
}

// 显示菜品详情
function showProductDetail(productId) {
    const productStat = analysisResults.byProduct.find(p => p.productId === productId);
    if (!productStat) {
        alert('未找到该菜品');
        return;
    }

    const product = productData.find(p => p.id === productId);
    
    let detailHtml = `
        <div class="ingredient-analysis-detail-section">
            <h3 class="ingredient-analysis-detail-title">菜品信息</h3>
            <table class="ingredient-analysis-detail-table">
                <tr>
                    <th>菜品名称</th>
                    <td>${productStat.productName}</td>
                    <th>分类</th>
                    <td>${productStat.categoryName}</td>
                </tr>
                <tr>
                    <th>销售数量</th>
                    <td>${productStat.totalQty}</td>
                    <th>销售金额</th>
                    <td>¥${productStat.totalAmount.toFixed(2)}</td>
                </tr>
            </table>
        </div>
        <div class="ingredient-analysis-detail-section">
            <h3 class="ingredient-analysis-detail-title">原料消耗明细</h3>
            <table class="ingredient-analysis-detail-table">
                <thead>
                    <tr>
                        <th>原料名称</th>
                        <th>单位用量</th>
                        <th>单位</th>
                        <th class="text-right">销售数量</th>
                        <th class="text-right">总消耗量</th>
                    </tr>
                </thead>
                <tbody>
    `;

    productStat.ingredients.forEach(ingredient => {
        const consumption = productStat.totalQty * ingredient.qty;
        detailHtml += `
            <tr>
                <td>${ingredient.name}</td>
                <td>${ingredient.qty}</td>
                <td>${ingredient.unit}</td>
                <td class="text-right">${productStat.totalQty}</td>
                <td class="text-right">${consumption.toFixed(2)}${ingredient.unit}</td>
            </tr>
        `;
    });

    detailHtml += `
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('detailModalTitle').textContent = `详情 - ${productStat.productName}`;
    document.getElementById('detailModalContent').innerHTML = detailHtml;
    document.getElementById('detailModal').style.display = 'block';
}

// 显示原料详情
function showIngredientDetail(ingredientName, ingredientUnit) {
    const ingredientStat = analysisResults.byIngredient.find(ing => 
        ing.name === ingredientName && ing.unit === ingredientUnit
    );
    if (!ingredientStat) {
        alert('未找到该原料');
        return;
    }

    let detailHtml = `
        <div class="ingredient-analysis-detail-section">
            <h3 class="ingredient-analysis-detail-title">原料信息</h3>
            <table class="ingredient-analysis-detail-table">
                <tr>
                    <th>原料名称</th>
                    <td>${ingredientStat.name}</td>
                    <th>单位</th>
                    <td>${ingredientStat.unit}</td>
                    <th>总消耗量</th>
                    <td>${ingredientStat.totalQty.toFixed(2)}${ingredientStat.unit}</td>
                </tr>
            </table>
        </div>
        <div class="ingredient-analysis-detail-section">
            <h3 class="ingredient-analysis-detail-title">使用该原料的菜品</h3>
            <table class="ingredient-analysis-detail-table">
                <thead>
                    <tr>
                        <th>菜品名称</th>
                        <th>分类</th>
                        <th>单位用量</th>
                        <th class="text-right">销售数量</th>
                        <th class="text-right">消耗量</th>
                    </tr>
                </thead>
                <tbody>
    `;

    ingredientStat.usedInProducts.forEach(productInfo => {
        const product = productData.find(p => p.id === productInfo.id);
        const ingredient = product?.ingredients.find(ing => ing.name === ingredientName && ing.unit === ingredientUnit);
        const consumption = productInfo.qty * (ingredient?.qty || 0);
        
        detailHtml += `
            <tr>
                <td>${productInfo.name}</td>
                <td>${product?.categoryName || '-'}</td>
                <td>${ingredient?.qty || 0}${ingredient?.unit || ''}</td>
                <td class="text-right">${productInfo.qty}</td>
                <td class="text-right">${consumption.toFixed(2)}${ingredientUnit}</td>
            </tr>
        `;
    });

    detailHtml += `
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('detailModalTitle').textContent = `详情 - ${ingredientStat.name}`;
    document.getElementById('detailModalContent').innerHTML = detailHtml;
    document.getElementById('detailModal').style.display = 'block';
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 更新分页
function updatePagination() {
    const data = viewMode === 'product' ? analysisResults.byProduct : analysisResults.byIngredient;
    pagination.total = data.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('totalRecords').textContent = pagination.total;
    
    // 上一页/下一页按钮
    prevPageBtn.disabled = pagination.currentPage === 1;
    nextPageBtn.disabled = pagination.currentPage === totalPages || totalPages === 0;

    prevPageBtn.onclick = function() {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderTable();
            updatePagination();
        }
    };

    nextPageBtn.onclick = function() {
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderTable();
            updatePagination();
        }
    };

    // 页码按钮
    paginationPages.innerHTML = '';
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, pagination.currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'ingredient-analysis-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ingredient-analysis-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'ingredient-analysis-pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            pagination.currentPage = i;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ingredient-analysis-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'ingredient-analysis-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderTable();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 导出分析结果
function exportAnalysis() {
    const csv = viewMode === 'product' ? exportProductView() : exportIngredientView();
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `用料分析_${viewMode === 'product' ? '按菜品' : '按原料'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 导出按菜品视图
function exportProductView() {
    const rows = [
        ['菜品名称', '分类', '销售数量', '销售金额', '原料消耗明细'].join(',')
    ];
    
    analysisResults.byProduct.forEach(productStat => {
        const ingredientsText = productStat.ingredients.map(ing => {
            const consumption = productStat.totalQty * ing.qty;
            return `${ing.name}(${consumption.toFixed(2)}${ing.unit})`;
        }).join('; ');
        
        rows.push([
            productStat.productName,
            productStat.categoryName,
            productStat.totalQty,
            productStat.totalAmount.toFixed(2),
            ingredientsText
        ].join(','));
    });
    
    return rows.join('\n');
}

// 导出按原料视图
function exportIngredientView() {
    const rows = [
        ['原料名称', '单位', '总消耗量', '使用菜品'].join(',')
    ];
    
    analysisResults.byIngredient.forEach(ingredientStat => {
        const productsText = ingredientStat.usedInProducts.map(p => `${p.name}(${p.qty})`).join('; ');
        
        rows.push([
            ingredientStat.name,
            ingredientStat.unit,
            ingredientStat.totalQty.toFixed(2),
            productsText
        ].join(','));
    });
    
    return rows.join('\n');
}

// 导出详细报表
function exportDetailReport() {
    const csv = [
        ['菜品名称', '分类', '销售数量', '销售金额', '原料名称', '单位用量', '单位', '总消耗量'].join(',')
    ];
    
    analysisResults.byProduct.forEach(productStat => {
        productStat.ingredients.forEach(ingredient => {
            const consumption = productStat.totalQty * ingredient.qty;
            csv.push([
                productStat.productName,
                productStat.categoryName,
                productStat.totalQty,
                productStat.totalAmount.toFixed(2),
                ingredient.name,
                ingredient.qty,
                ingredient.unit,
                consumption.toFixed(2)
            ].join(','));
        });
    });
    
    const blob = new Blob(['\ufeff' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `用料分析详细报表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 全局函数
window.closeDetailModal = closeDetailModal;
