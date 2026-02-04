// 餐饮商品设置页面交互逻辑

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载设置
    loadSettings();

    // 保存设置
    document.getElementById('saveBtn').addEventListener('click', saveSettings);

    // 重置设置
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
});

// 加载设置
function loadSettings() {
    // 从localStorage加载设置，如果没有则使用默认值
    const settings = JSON.parse(localStorage.getItem('cateringProductSettings') || '{}');

    // 设置默认值
    document.getElementById('defaultSort').value = settings.defaultSort || 100;
    document.getElementById('defaultProductType').value = settings.defaultProductType || 'normal';
    document.getElementById('defaultStatus').value = settings.defaultStatus || 'onSale';
    document.getElementById('enableSpecs').checked = settings.enableSpecs !== undefined ? settings.enableSpecs : false;
    document.getElementById('enableTags').checked = settings.enableTags !== undefined ? settings.enableTags : true;
    document.getElementById('enablePackagingFee').checked = settings.enablePackagingFee !== undefined ? settings.enablePackagingFee : true;
    document.getElementById('pageSize').value = settings.pageSize || '20';
    document.getElementById('showSales').checked = settings.showSales !== undefined ? settings.showSales : true;
    document.getElementById('showReviews').checked = settings.showReviews !== undefined ? settings.showReviews : true;
    document.getElementById('maxImages').value = settings.maxImages || 9;
    document.getElementById('enableMultiCategory').checked = settings.enableMultiCategory !== undefined ? settings.enableMultiCategory : true;
    document.getElementById('categoryDepth').value = settings.categoryDepth || '2';
    document.getElementById('requireCategory').checked = settings.requireCategory !== undefined ? settings.requireCategory : true;
    document.getElementById('enableIngredients').checked = settings.enableIngredients !== undefined ? settings.enableIngredients : true;
    document.getElementById('requireIngredients').checked = settings.requireIngredients !== undefined ? settings.requireIngredients : false;
}

// 保存设置
function saveSettings() {
    const settings = {
        defaultSort: parseInt(document.getElementById('defaultSort').value),
        defaultProductType: document.getElementById('defaultProductType').value,
        defaultStatus: document.getElementById('defaultStatus').value,
        enableSpecs: document.getElementById('enableSpecs').checked,
        enableTags: document.getElementById('enableTags').checked,
        enablePackagingFee: document.getElementById('enablePackagingFee').checked,
        pageSize: document.getElementById('pageSize').value,
        showSales: document.getElementById('showSales').checked,
        showReviews: document.getElementById('showReviews').checked,
        maxImages: parseInt(document.getElementById('maxImages').value),
        enableMultiCategory: document.getElementById('enableMultiCategory').checked,
        categoryDepth: document.getElementById('categoryDepth').value,
        requireCategory: document.getElementById('requireCategory').checked,
        enableIngredients: document.getElementById('enableIngredients').checked,
        requireIngredients: document.getElementById('requireIngredients').checked
    };

    // 保存到localStorage
    localStorage.setItem('cateringProductSettings', JSON.stringify(settings));

    alert('设置保存成功！');
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置吗？将恢复到默认值。')) {
        return;
    }

    // 清除localStorage
    localStorage.removeItem('cateringProductSettings');

    // 重新加载设置
    loadSettings();

    alert('设置已重置为默认值！');
}
