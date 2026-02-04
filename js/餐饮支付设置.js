// 餐饮支付设置页面交互逻辑

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
});

// 加载设置
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('cateringPaymentSettings') || '{}');

    document.getElementById('enableCash').checked = settings.enableCash !== undefined ? settings.enableCash : true;
    document.getElementById('enableWeChat').checked = settings.enableWeChat !== undefined ? settings.enableWeChat : true;
    document.getElementById('enableAlipay').checked = settings.enableAlipay !== undefined ? settings.enableAlipay : true;
    document.getElementById('enableBankCard').checked = settings.enableBankCard !== undefined ? settings.enableBankCard : true;
    document.getElementById('enableBalance').checked = settings.enableBalance !== undefined ? settings.enableBalance : true;
    document.getElementById('enablePaymentPassword').checked = settings.enablePaymentPassword !== undefined ? settings.enablePaymentPassword : false;
    document.getElementById('paymentPasswordThreshold').value = settings.paymentPasswordThreshold || 0;
    document.getElementById('enablePaymentTimeout').checked = settings.enablePaymentTimeout !== undefined ? settings.enablePaymentTimeout : true;
    document.getElementById('paymentTimeoutMinutes').value = settings.paymentTimeoutMinutes || 30;
    document.getElementById('enablePaymentNotify').checked = settings.enablePaymentNotify !== undefined ? settings.enablePaymentNotify : true;
    document.getElementById('enableVoiceNotify').checked = settings.enableVoiceNotify !== undefined ? settings.enableVoiceNotify : true;
}

// 保存设置
function saveSettings() {
    const settings = {
        enableCash: document.getElementById('enableCash').checked,
        enableWeChat: document.getElementById('enableWeChat').checked,
        enableAlipay: document.getElementById('enableAlipay').checked,
        enableBankCard: document.getElementById('enableBankCard').checked,
        enableBalance: document.getElementById('enableBalance').checked,
        enablePaymentPassword: document.getElementById('enablePaymentPassword').checked,
        paymentPasswordThreshold: parseFloat(document.getElementById('paymentPasswordThreshold').value),
        enablePaymentTimeout: document.getElementById('enablePaymentTimeout').checked,
        paymentTimeoutMinutes: parseInt(document.getElementById('paymentTimeoutMinutes').value),
        enablePaymentNotify: document.getElementById('enablePaymentNotify').checked,
        enableVoiceNotify: document.getElementById('enableVoiceNotify').checked
    };

    localStorage.setItem('cateringPaymentSettings', JSON.stringify(settings));
    alert('设置保存成功！');
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置吗？将恢复到默认值。')) {
        return;
    }

    localStorage.removeItem('cateringPaymentSettings');
    loadSettings();
    alert('设置已重置为默认值！');
}
