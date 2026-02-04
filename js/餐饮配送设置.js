// 餐饮配送设置页面交互逻辑

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
});

// 加载设置
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('cateringDeliverySettings') || '{}');

    document.getElementById('enableTakeout').checked = settings.enableTakeout !== undefined ? settings.enableTakeout : true;
    document.getElementById('enableSelfPickup').checked = settings.enableSelfPickup !== undefined ? settings.enableSelfPickup : true;
    document.getElementById('enableLocalDelivery').checked = settings.enableLocalDelivery !== undefined ? settings.enableLocalDelivery : true;
    document.getElementById('defaultDeliveryMethod').value = settings.defaultDeliveryMethod || 'takeout';
    document.getElementById('enableFreeShipping').checked = settings.enableFreeShipping !== undefined ? settings.enableFreeShipping : true;
    document.getElementById('freeShippingAmount').value = settings.freeShippingAmount || 99;
    document.getElementById('defaultShippingFee').value = settings.defaultShippingFee || 5;
    document.getElementById('shippingFeeCalculation').value = settings.shippingFeeCalculation || 'fixed';
    document.getElementById('selfPickupFree').checked = settings.selfPickupFree !== undefined ? settings.selfPickupFree : true;
    document.getElementById('enableScheduledDelivery').checked = settings.enableScheduledDelivery !== undefined ? settings.enableScheduledDelivery : true;
    document.getElementById('defaultDeliveryTime').value = settings.defaultDeliveryTime || 30;
    document.getElementById('minDeliveryTime').value = settings.minDeliveryTime || 30;
    document.getElementById('maxDeliveryTime').value = settings.maxDeliveryTime || 60;
    document.getElementById('enableDeliveryRange').checked = settings.enableDeliveryRange !== undefined ? settings.enableDeliveryRange : false;
    document.getElementById('deliveryRange').value = settings.deliveryRange || 0;
}

// 保存设置
function saveSettings() {
    const settings = {
        enableTakeout: document.getElementById('enableTakeout').checked,
        enableSelfPickup: document.getElementById('enableSelfPickup').checked,
        enableLocalDelivery: document.getElementById('enableLocalDelivery').checked,
        defaultDeliveryMethod: document.getElementById('defaultDeliveryMethod').value,
        enableFreeShipping: document.getElementById('enableFreeShipping').checked,
        freeShippingAmount: parseFloat(document.getElementById('freeShippingAmount').value),
        defaultShippingFee: parseFloat(document.getElementById('defaultShippingFee').value),
        shippingFeeCalculation: document.getElementById('shippingFeeCalculation').value,
        selfPickupFree: document.getElementById('selfPickupFree').checked,
        enableScheduledDelivery: document.getElementById('enableScheduledDelivery').checked,
        defaultDeliveryTime: parseInt(document.getElementById('defaultDeliveryTime').value),
        minDeliveryTime: parseInt(document.getElementById('minDeliveryTime').value),
        maxDeliveryTime: parseInt(document.getElementById('maxDeliveryTime').value),
        enableDeliveryRange: document.getElementById('enableDeliveryRange').checked,
        deliveryRange: parseFloat(document.getElementById('deliveryRange').value)
    };

    localStorage.setItem('cateringDeliverySettings', JSON.stringify(settings));
    alert('设置保存成功！');
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置吗？将恢复到默认值。')) {
        return;
    }

    localStorage.removeItem('cateringDeliverySettings');
    loadSettings();
    alert('设置已重置为默认值！');
}
