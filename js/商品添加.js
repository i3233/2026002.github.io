// 商品添加页面交互逻辑

// 商品数据
const productListData = [
    { id: 1, name: '锅巴肉片', price: 68.00, stock: 100, status: 'on', category: 'chinese', image: null },
    { id: 2, name: '肥肠血旺', price: 45.00, stock: 50, status: 'on', category: 'chinese', image: null },
    { id: 3, name: '彩虹斗酒套装41支', price: 178.00, stock: 20, status: 'on', category: 'rainbow', image: null },
    { id: 4, name: '红尘玫瑰17支', price: 118.00, stock: 30, status: 'on', category: 'rainbow', image: null },
    { id: 5, name: '猴赛荔17支', price: 118.00, stock: 25, status: 'on', category: 'rainbow', image: null },
    { id: 6, name: '草莓蜜酒17支', price: 118.00, stock: 35, status: 'on', category: 'rainbow', image: null },
    { id: 7, name: '金茉莉皇茶（小）', price: 128.00, stock: 15, status: 'on', category: 'soft-drink', image: null },
    { id: 8, name: '百威经典（半打）', price: 108.00, stock: 100, status: 'on', category: 'beer', image: null },
    { id: 9, name: '百威经典（一打）', price: 198.00, stock: 80, status: 'on', category: 'beer', image: null },
    { id: 10, name: '科罗娜（半打）', price: 158.00, stock: 60, status: 'on', category: 'beer', image: null },
    { id: 11, name: '优惠套餐A', price: 198.00, stock: 50, status: 'on', category: 'package', image: null },
    { id: 12, name: '优惠套餐B', price: 298.00, stock: 30, status: 'off', category: 'package', image: null },
];

// 当前筛选条件
let currentCategory = 'all';
let currentStatus = 'all';
let searchKeyword = '';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderProductTable();
});

// 初始化事件监听
function initEventListeners() {
    // 标签切换
    document.querySelectorAll('.product-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabType = this.dataset.tab;
            console.log('切换到标签:', tabType);
            // 根据标签类型切换内容
        });
    });

    // 分类筛选
    document.querySelectorAll('.product-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.product-filter-btn').forEach(b => b.classList.remove('product-filter-btn-active'));
            this.classList.add('product-filter-btn-active');
            currentCategory = this.dataset.category;
            renderProductTable();
        });
    });

    // 状态筛选
    document.querySelectorAll('.product-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.product-status-btn').forEach(b => b.classList.remove('product-status-btn-active'));
            this.classList.add('product-status-btn-active');
            currentStatus = this.dataset.status;
            renderProductTable();
        });
    });

    // 搜索
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            renderProductTable();
        });
    }
}

// 渲染商品表格
function renderProductTable() {
    const tableBody = document.getElementById('productTableBody');
    if (!tableBody) return;

    // 过滤商品
    let filteredProducts = productListData;

    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }

    // 按状态过滤
    if (currentStatus !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.status === currentStatus);
    }

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // 渲染表格行
    tableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="product-name-cell">
                    <div class="product-thumbnail">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}">` : 
                            `<div class="product-thumbnail-placeholder">📦</div>`
                        }
                    </div>
                    <div class="product-name-text">${product.name}</div>
                </div>
            </td>
            <td>
                <div class="product-price-cell">
                    <span class="product-price-value">¥${product.price.toFixed(2)}</span>
                    <a href="#" class="product-edit-link" onclick="editPrice(${product.id}); return false;">编辑</a>
                </div>
            </td>
            <td>
                <div class="product-stock-cell">
                    <span class="product-stock-value">${product.stock === -1 ? '不限' : product.stock}</span>
                    <a href="#" class="product-edit-link" onclick="editStock(${product.id}); return false;">编辑</a>
                </div>
            </td>
            <td>
                <div class="product-action-cell">
                    ${product.status === 'on' ? 
                        `<button class="product-action-btn product-action-btn-offline" onclick="setProductStatus(${product.id}, 'off')">下架</button>` :
                        `<button class="product-action-btn product-action-btn-offline" onclick="setProductStatus(${product.id}, 'on')">上架</button>`
                    }
                    <button class="product-action-btn product-action-btn-stop" onclick="stopProduct(${product.id})">停售</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 编辑价格
function editPrice(productId) {
    const product = productListData.find(p => p.id === productId);
    if (!product) return;

    const newPrice = prompt(`请输入新价格（当前价格：¥${product.price.toFixed(2)}）:`, product.price);
    if (newPrice !== null && !isNaN(newPrice) && parseFloat(newPrice) >= 0) {
        product.price = parseFloat(newPrice);
        renderProductTable();
    }
}

// 编辑库存
function editStock(productId) {
    const product = productListData.find(p => p.id === productId);
    if (!product) return;

    const currentStock = product.stock === -1 ? '不限' : product.stock;
    const newStock = prompt(`请输入新库存（当前库存：${currentStock}，输入-1表示不限）:`, product.stock);
    if (newStock !== null && !isNaN(newStock) && (parseInt(newStock) >= -1)) {
        product.stock = parseInt(newStock);
        renderProductTable();
    }
}

// 设置商品状态
function setProductStatus(productId, status) {
    const product = productListData.find(p => p.id === productId);
    if (!product) return;

    product.status = status;
    renderProductTable();
}

// 停售商品
function stopProduct(productId) {
    if (confirm('确定要停售这个商品吗？')) {
        const product = productListData.find(p => p.id === productId);
        if (product) {
            product.status = 'off';
            renderProductTable();
        }
    }
}

// 全局函数
window.editPrice = editPrice;
window.editStock = editStock;
window.setProductStatus = setProductStatus;
window.stopProduct = stopProduct;
