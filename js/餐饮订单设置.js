// 餐饮订单设置页面交互逻辑

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
    const settings = JSON.parse(localStorage.getItem('cateringOrderSettings') || '{}');

    document.getElementById('orderNoRule').value = settings.orderNoRule || 'dateSeq';
    document.getElementById('orderNoPrefix').value = settings.orderNoPrefix || 'DD';
    document.getElementById('autoCancelMinutes').value = settings.autoCancelMinutes || 30;
    document.getElementById('enableOrderRemark').checked = settings.enableOrderRemark !== undefined ? settings.enableOrderRemark : true;
    document.getElementById('enableTableOrder').checked = settings.enableTableOrder !== undefined ? settings.enableTableOrder : true;
    document.getElementById('requireTableNo').checked = settings.requireTableNo !== undefined ? settings.requireTableNo : true;
    document.getElementById('enableGuestCount').checked = settings.enableGuestCount !== undefined ? settings.enableGuestCount : true;
    document.getElementById('enableScanOrder').checked = settings.enableScanOrder !== undefined ? settings.enableScanOrder : true;
    document.getElementById('autoBindTable').checked = settings.autoBindTable !== undefined ? settings.autoBindTable : true;
    document.getElementById('requireLoginForScan').checked = settings.requireLoginForScan !== undefined ? settings.requireLoginForScan : false;
    document.getElementById('enablePendingMake').checked = settings.enablePendingMake !== undefined ? settings.enablePendingMake : true;
    document.getElementById('enableMaking').checked = settings.enableMaking !== undefined ? settings.enableMaking : true;
    document.getElementById('enableAutoNotify').checked = settings.enableAutoNotify !== undefined ? settings.enableAutoNotify : true;
}

// 保存设置
function saveSettings() {
    const settings = {
        orderNoRule: document.getElementById('orderNoRule').value,
        orderNoPrefix: document.getElementById('orderNoPrefix').value,
        autoCancelMinutes: parseInt(document.getElementById('autoCancelMinutes').value),
        enableOrderRemark: document.getElementById('enableOrderRemark').checked,
        enableTableOrder: document.getElementById('enableTableOrder').checked,
        requireTableNo: document.getElementById('requireTableNo').checked,
        enableGuestCount: document.getElementById('enableGuestCount').checked,
        enableScanOrder: document.getElementById('enableScanOrder').checked,
        autoBindTable: document.getElementById('autoBindTable').checked,
        requireLoginForScan: document.getElementById('requireLoginForScan').checked,
        enablePendingMake: document.getElementById('enablePendingMake').checked,
        enableMaking: document.getElementById('enableMaking').checked,
        enableAutoNotify: document.getElementById('enableAutoNotify').checked
    };

    localStorage.setItem('cateringOrderSettings', JSON.stringify(settings));
    alert('设置保存成功！');
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置吗？将恢复到默认值。')) {
        return;
    }

    localStorage.removeItem('cateringOrderSettings');
    loadSettings();
    alert('设置已重置为默认值！');
}
