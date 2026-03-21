// 收银台基础设置页面交互逻辑

// 先进入收银台登录页，再进入主界面
const POS_LOGIN_PATH = 'pages/收银台/收银台登录.html?type=catering';

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    bindEvents();
});

function bindEvents() {
    // 复制链接
    document.getElementById('copyLinkBtn').addEventListener('click', copyEntryLink);
    // 进入收银台
    document.getElementById('enterPosBtn').addEventListener('click', enterPos);
    // 保存与重置
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
    // 选择分类
    document.getElementById('selectCategoryBtn').addEventListener('click', selectCategory);
    // 分类标签删除
    document.getElementById('categoryTags').addEventListener('click', function(e) {
        if (e.target.classList.contains('pos-settings-tag-remove')) {
            const name = e.target.getAttribute('data-name');
            removeCategoryTag(name);
        }
    });
    // 改价设置、版权设置
    document.getElementById('selectLogoBtn').addEventListener('click', function() { document.getElementById('logoFileInput').click(); });
    document.getElementById('logoFileInput').addEventListener('change', onLogoFileSelect);
    document.getElementById('resetLogoBtn').addEventListener('click', resetLogo);
    document.getElementById('removeLogoBtn').addEventListener('click', removeLogo);
    document.getElementById('selectBgBtn').addEventListener('click', function() { document.getElementById('bgFileInput').click(); });
    document.getElementById('bgFileInput').addEventListener('change', onBgFileSelect);
    document.getElementById('resetBgBtn').addEventListener('click', resetBg);
    document.getElementById('removeBgBtn').addEventListener('click', removeBg);
}

// 复制入口链接
function copyEntryLink() {
    const input = document.getElementById('entryUrl');
    input.select();
    input.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        alert('链接已复制到剪贴板');
    } catch (err) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(input.value).then(function() {
                alert('链接已复制到剪贴板');
            }).catch(function() {
                alert('复制失败，请手动复制');
            });
        } else {
            alert('复制失败，请手动复制');
        }
    }
}

// 进入收银台（先进入模拟登录页）
function enterPos() {
    try {
        if (window.parent && typeof window.parent.loadPage === 'function') {
            window.parent.loadPage({ preventDefault: function() {} }, POS_LOGIN_PATH, '收银台登录');
        } else {
            window.location.href = '../收银台/收银台登录.html?type=catering';
        }
    } catch (e) {
        window.location.href = '../收银台/收银台登录.html?type=catering';
    }
}

// 选择分类（占位，可后续对接分类选择弹窗）
function selectCategory() {
    const tags = document.getElementById('categoryTags');
    const count = tags.querySelectorAll('.pos-settings-tag').length;
    if (count >= 10) {
        alert('最多添加10个常用分类');
        return;
    }
    const name = prompt('请输入分类名称（演示）');
    if (name && name.trim()) {
        addCategoryTag(name.trim());
    }
}

function addCategoryTag(name) {
    const tags = document.getElementById('categoryTags');
    const exists = tags.querySelector(`.pos-settings-tag-remove[data-name="${name}"]`);
    if (exists) return;
    const count = tags.querySelectorAll('.pos-settings-tag').length;
    if (count >= 10) {
        alert('最多添加10个常用分类');
        return;
    }
    const span = document.createElement('span');
    span.className = 'pos-settings-tag';
    span.innerHTML = `${name} <span class="pos-settings-tag-remove" data-name="${name}">&times;</span>`;
    tags.appendChild(span);
}

function removeCategoryTag(name) {
    const el = document.querySelector(`.pos-settings-tag-remove[data-name="${name}"]`);
    if (el) el.closest('.pos-settings-tag').remove();
}

// 加载设置
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('posBasicSettings') || '{}');

    document.getElementById('enableShiftHandover').checked = settings.enableShiftHandover !== undefined ? settings.enableShiftHandover : true;
    document.getElementById('enableMemberRecharge').checked = settings.enableMemberRecharge !== undefined ? settings.enableMemberRecharge : true;
    document.getElementById('addMoneySwitch').checked = settings.addMoneySwitch !== undefined ? settings.addMoneySwitch : true;
    document.getElementById('enableTeamDividend').checked = settings.enableTeamDividend !== undefined ? settings.enableTeamDividend : true;
    document.getElementById('enableDistribution').checked = settings.enableDistribution !== undefined ? settings.enableDistribution : true;
    document.getElementById('enableShareholderDividend').checked = settings.enableShareholderDividend !== undefined ? settings.enableShareholderDividend : true;
    document.getElementById('payWechat').checked = settings.payWechat !== undefined ? settings.payWechat : true;
    document.getElementById('payAlipay').checked = settings.payAlipay !== undefined ? settings.payAlipay : true;
    document.getElementById('payCash').checked = settings.payCash !== undefined ? settings.payCash : true;
    document.getElementById('payPos').checked = settings.payPos !== undefined ? settings.payPos : true;
    document.getElementById('payCombined').checked = settings.payCombined || false;
    document.getElementById('wechatPaySelect').value = settings.wechatPaySelect || 'wechat';
    document.getElementById('alipayPaySelect').value = settings.alipayPaySelect || 'alipay';
    document.getElementById('tabSwitch').checked = settings.tabSwitch !== undefined ? settings.tabSwitch : true;
    document.getElementById('enableCoupon').checked = settings.enableCoupon !== undefined ? settings.enableCoupon : true;
    document.getElementById('enableSuperMemberDiscount').checked = settings.enableSuperMemberDiscount || false;
    document.getElementById('enableMemberPrice').checked = settings.enableMemberPrice !== undefined ? settings.enableMemberPrice : true;
    document.getElementById('enablePointsDeduction').checked = settings.enablePointsDeduction !== undefined ? settings.enablePointsDeduction : true;
    document.getElementById('enableFullDiscount').checked = settings.enableFullDiscount || false;
    document.getElementById('roundingSwitch').checked = settings.roundingSwitch !== undefined ? settings.roundingSwitch : true;
    var roundingEl = document.querySelector('input[name="roundingType"][value="' + (settings.roundingType || 'roundCents') + '"]');
    if (roundingEl) roundingEl.checked = true;
    document.getElementById('enableCashierCommission').checked = settings.enableCashierCommission !== undefined ? settings.enableCashierCommission : true;
    document.getElementById('enableSalespersonCommission').checked = settings.enableSalespersonCommission !== undefined ? settings.enableSalespersonCommission : true;
    var cashierTypeEl = document.querySelector('input[name="cashierCommissionType"][value="' + (settings.cashierCommissionType || 'amount') + '"]');
    if (cashierTypeEl) cashierTypeEl.checked = true;
    var salespersonTypeEl = document.querySelector('input[name="salespersonCommissionType"][value="' + (settings.salespersonCommissionType || 'amount') + '"]');
    if (salespersonTypeEl) salespersonTypeEl.checked = true;
    document.getElementById('cashierCommissionRate').value = settings.cashierCommissionRate !== undefined ? settings.cashierCommissionRate : 1;
    document.getElementById('salespersonCommissionRate').value = settings.salespersonCommissionRate !== undefined ? settings.salespersonCommissionRate : 1;
    document.getElementById('priceAdjustSwitch').checked = settings.priceAdjustSwitch !== undefined ? settings.priceAdjustSwitch : true;
    var priceTypeEl = document.querySelector('input[name="priceAdjustType"][value="' + (settings.priceAdjustType || 'percent') + '"]');
    if (priceTypeEl) priceTypeEl.checked = true;
    document.getElementById('maxPriceIncrease').value = settings.maxPriceIncrease !== undefined ? settings.maxPriceIncrease : 10;
    document.getElementById('maxPriceDecrease').value = settings.maxPriceDecrease !== undefined ? settings.maxPriceDecrease : 1;
    document.getElementById('copyrightText').value = settings.copyrightText || '磐石云鼎';
    document.getElementById('copyrightLink').value = settings.copyrightLink || '';
    if (settings.logoData) {
        try { showLogoPreview(settings.logoData); } catch (e) { resetLogoDisplay(); }
    } else {
        resetLogoDisplay();
    }
    if (settings.bgData) {
        try { showBgPreview(settings.bgData); } catch (e) { resetBgDisplay(); }
    } else {
        resetBgDisplay();
    }

    // 分类标签
    const categories = settings.categories || ['雅安好物', '雅安好景', '文创产品'];
    const tagsEl = document.getElementById('categoryTags');
    tagsEl.innerHTML = '';
    categories.forEach(function(name) {
        const span = document.createElement('span');
        span.className = 'pos-settings-tag';
        span.innerHTML = `${name} <span class="pos-settings-tag-remove" data-name="${name}">&times;</span>`;
        tagsEl.appendChild(span);
    });
}

// 保存设置
function saveSettings() {
    const tagsEl = document.getElementById('categoryTags');
    const categories = Array.from(tagsEl.querySelectorAll('.pos-settings-tag')).map(function(tag) {
        return tag.querySelector('.pos-settings-tag-remove').getAttribute('data-name');
    });

    const settings = {
        enableShiftHandover: document.getElementById('enableShiftHandover').checked,
        enableMemberRecharge: document.getElementById('enableMemberRecharge').checked,
        addMoneySwitch: document.getElementById('addMoneySwitch').checked,
        enableTeamDividend: document.getElementById('enableTeamDividend').checked,
        enableDistribution: document.getElementById('enableDistribution').checked,
        enableShareholderDividend: document.getElementById('enableShareholderDividend').checked,
        payWechat: document.getElementById('payWechat').checked,
        payAlipay: document.getElementById('payAlipay').checked,
        payCash: document.getElementById('payCash').checked,
        payPos: document.getElementById('payPos').checked,
        payCombined: document.getElementById('payCombined').checked,
        wechatPaySelect: document.getElementById('wechatPaySelect').value,
        alipayPaySelect: document.getElementById('alipayPaySelect').value,
        tabSwitch: document.getElementById('tabSwitch').checked,
        enableCoupon: document.getElementById('enableCoupon').checked,
        enableSuperMemberDiscount: document.getElementById('enableSuperMemberDiscount').checked,
        enableMemberPrice: document.getElementById('enableMemberPrice').checked,
        enablePointsDeduction: document.getElementById('enablePointsDeduction').checked,
        enableFullDiscount: document.getElementById('enableFullDiscount').checked,
        roundingSwitch: document.getElementById('roundingSwitch').checked,
        roundingType: document.querySelector('input[name="roundingType"]:checked').value,
        enableCashierCommission: document.getElementById('enableCashierCommission').checked,
        enableSalespersonCommission: document.getElementById('enableSalespersonCommission').checked,
        cashierCommissionType: document.querySelector('input[name="cashierCommissionType"]:checked').value,
        salespersonCommissionType: document.querySelector('input[name="salespersonCommissionType"]:checked').value,
        cashierCommissionRate: parseFloat(document.getElementById('cashierCommissionRate').value) || 1,
        salespersonCommissionRate: parseFloat(document.getElementById('salespersonCommissionRate').value) || 1,
        priceAdjustSwitch: document.getElementById('priceAdjustSwitch').checked,
        priceAdjustType: document.querySelector('input[name="priceAdjustType"]:checked').value,
        maxPriceIncrease: parseFloat(document.getElementById('maxPriceIncrease').value) || 10,
        maxPriceDecrease: parseFloat(document.getElementById('maxPriceDecrease').value) || 1,
        copyrightText: document.getElementById('copyrightText').value.trim(),
        copyrightLink: document.getElementById('copyrightLink').value.trim(),
        logoData: getLogoData(),
        bgData: getBgData(),
        categories: categories
    };

    localStorage.setItem('posBasicSettings', JSON.stringify(settings));
    alert('设置保存成功！');
}

// 改价、版权 - Logo
function onLogoFileSelect(e) {
    var file = e.target.files[0];
    if (!file || !file.type.match(/^image\//)) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        showLogoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

function showLogoPreview(dataUrl) {
    var placeholder = document.getElementById('logoPlaceholder');
    var preview = document.getElementById('logoPreview');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    var img = preview.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        img.alt = 'logo';
        preview.insertBefore(img, preview.firstChild);
    }
    img.src = dataUrl;
    img.style.cssText = 'width:100px;height:100px;border-radius:50%;object-fit:cover;';
    preview.dataset.logoData = dataUrl;
}

function resetLogoDisplay() {
    var placeholder = document.getElementById('logoPlaceholder');
    var preview = document.getElementById('logoPreview');
    var img = preview.querySelector('img');
    if (img) img.remove();
    if (placeholder) placeholder.style.display = 'flex';
    delete preview.dataset.logoData;
}

function resetLogo() {
    resetLogoDisplay();
}

function removeLogo() {
    resetLogoDisplay();
}

function getLogoData() {
    var preview = document.getElementById('logoPreview');
    return preview && preview.dataset.logoData ? preview.dataset.logoData : null;
}

// 版权 - 背景图
function onBgFileSelect(e) {
    var file = e.target.files[0];
    if (!file || !file.type.match(/^image\//)) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        showBgPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

function showBgPreview(dataUrl) {
    var placeholder = document.getElementById('bgPlaceholder');
    var preview = document.getElementById('bgPreview');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    var img = preview.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        img.alt = 'bg';
        preview.insertBefore(img, preview.firstChild);
    }
    img.src = dataUrl;
    preview.dataset.bgData = dataUrl;
}

function resetBgDisplay() {
    var placeholder = document.getElementById('bgPlaceholder');
    var preview = document.getElementById('bgPreview');
    var img = preview.querySelector('img');
    if (img) img.remove();
    if (placeholder) placeholder.style.display = 'block';
    delete preview.dataset.bgData;
}

function resetBg() {
    resetBgDisplay();
}

function removeBg() {
    resetBgDisplay();
}

function getBgData() {
    var preview = document.getElementById('bgPreview');
    return preview && preview.dataset.bgData ? preview.dataset.bgData : null;
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置吗？将恢复到默认值。')) {
        return;
    }
    localStorage.removeItem('posBasicSettings');
    loadSettings();
    alert('设置已重置为默认值！');
}
