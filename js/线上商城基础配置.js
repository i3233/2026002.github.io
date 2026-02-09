(function () {
    var STORAGE_KEY = 'mallBaseConfig';

    var defaultConfig = {
        storeName: '',
        storeLogo: '',
        storeIntro: '',
        servicePhone: '',
        storeNotice: '',
        appId: '',
        appSecret: '',
        mallEnabled: true,
        unpaidCancelMinutes: 30,
        autoCompleteDays: 7,
        allowUserCancel: true,
        enableDelivery: true,
        minOrderAmount: 0,
        deliveryFee: 5,
        freeDeliveryAmount: 99,
        deliveryRadius: 5,
        enableWechatPay: true,
        enableBalancePay: false
    };

    function loadConfig() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var saved = JSON.parse(raw);
                return Object.assign({}, defaultConfig, saved);
            }
        } catch (e) {}
        return Object.assign({}, defaultConfig);
    }

    function saveConfig(config) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    function configToForm(config) {
        document.getElementById('storeName').value = config.storeName || '';
        document.getElementById('storeIntro').value = config.storeIntro || '';
        document.getElementById('servicePhone').value = config.servicePhone || '';
        document.getElementById('storeNotice').value = config.storeNotice || '';
        document.getElementById('appId').value = config.appId || '';
        document.getElementById('appSecret').value = config.appSecret || '';
        document.getElementById('mallEnabled').checked = !!config.mallEnabled;
        document.getElementById('unpaidCancelMinutes').value = config.unpaidCancelMinutes ?? 30;
        document.getElementById('autoCompleteDays').value = config.autoCompleteDays ?? 7;
        document.getElementById('allowUserCancel').checked = !!config.allowUserCancel;
        document.getElementById('enableDelivery').checked = !!config.enableDelivery;
        document.getElementById('minOrderAmount').value = config.minOrderAmount ?? 0;
        document.getElementById('deliveryFee').value = config.deliveryFee ?? 5;
        document.getElementById('freeDeliveryAmount').value = config.freeDeliveryAmount ?? 99;
        document.getElementById('deliveryRadius').value = config.deliveryRadius ?? 5;
        document.getElementById('enableWechatPay').checked = !!config.enableWechatPay;
        document.getElementById('enableBalancePay').checked = !!config.enableBalancePay;
        if (config.storeLogo) {
            var preview = document.getElementById('storeLogoPreview');
            preview.innerHTML = '<img src="' + config.storeLogo + '" alt="Logo">';
            preview.style.display = 'block';
        } else {
            document.getElementById('storeLogoPreview').style.display = 'none';
        }
    }

    function formToConfig() {
        var preview = document.getElementById('storeLogoPreview');
        var img = preview.querySelector('img');
        return {
            storeName: document.getElementById('storeName').value.trim(),
            storeLogo: img ? img.src : (loadConfig().storeLogo || ''),
            storeIntro: document.getElementById('storeIntro').value.trim(),
            servicePhone: document.getElementById('servicePhone').value.trim(),
            storeNotice: document.getElementById('storeNotice').value.trim(),
            appId: document.getElementById('appId').value.trim(),
            appSecret: document.getElementById('appSecret').value.trim(),
            mallEnabled: document.getElementById('mallEnabled').checked,
            unpaidCancelMinutes: parseInt(document.getElementById('unpaidCancelMinutes').value, 10) || 30,
            autoCompleteDays: parseInt(document.getElementById('autoCompleteDays').value, 10) || 7,
            allowUserCancel: document.getElementById('allowUserCancel').checked,
            enableDelivery: document.getElementById('enableDelivery').checked,
            minOrderAmount: parseFloat(document.getElementById('minOrderAmount').value) || 0,
            deliveryFee: parseFloat(document.getElementById('deliveryFee').value) || 5,
            freeDeliveryAmount: parseFloat(document.getElementById('freeDeliveryAmount').value) || 99,
            deliveryRadius: parseInt(document.getElementById('deliveryRadius').value, 10) || 5,
            enableWechatPay: document.getElementById('enableWechatPay').checked,
            enableBalancePay: document.getElementById('enableBalancePay').checked
        };
    }

    function initUpload() {
        var upload = document.getElementById('storeLogoUpload');
        var input = document.getElementById('storeLogoInput');
        var preview = document.getElementById('storeLogoPreview');
        if (!upload || !input || !preview) return;
        upload.addEventListener('click', function () { input.click(); });
        input.addEventListener('change', function () {
            var file = input.files && input.files[0];
            if (!file || !file.type.match(/^image\//)) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = '<img src="' + e.target.result + '" alt="Logo">';
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        configToForm(loadConfig());
        initUpload();

        document.getElementById('saveBtn').addEventListener('click', function () {
            saveConfig(formToConfig());
            alert('配置已保存');
        });

        document.getElementById('resetBtn').addEventListener('click', function () {
            if (confirm('确定恢复为默认配置吗？')) {
                saveConfig(defaultConfig);
                configToForm(loadConfig());
                alert('已恢复默认');
            }
        });
    });
})();
