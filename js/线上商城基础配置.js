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
        mallEnabled: true
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
        var img = preview ? preview.querySelector('img') : null;
        return {
            storeName: document.getElementById('storeName').value.trim(),
            storeLogo: img ? img.src : (loadConfig().storeLogo || ''),
            storeIntro: document.getElementById('storeIntro').value.trim(),
            servicePhone: document.getElementById('servicePhone').value.trim(),
            storeNotice: document.getElementById('storeNotice').value.trim(),
            appId: document.getElementById('appId').value.trim(),
            appSecret: document.getElementById('appSecret').value.trim(),
            mallEnabled: document.getElementById('mallEnabled').checked
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
