/**
 * 收银台模拟登录：无真实校验，任意内容可进入主界面
 */
(function () {
    function getPosType() {
        var p = new URLSearchParams(window.location.search || '');
        var t = (p.get('type') || 'catering').toLowerCase();
        if (t !== 'mall' && t !== 'catering') {
            t = 'catering';
        }
        return t;
    }

    function goToMain() {
        var type = getPosType();
        window.location.href = '收银台主界面.html?type=' + encodeURIComponent(type);
    }

    function switchTab(name) {
        document.querySelectorAll('.pos-login-tab').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === name);
        });
        document.querySelectorAll('.pos-login-panel').forEach(function (panel) {
            panel.classList.toggle('active', panel.getAttribute('data-panel') === name);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var type = getPosType();
        var tag = document.getElementById('posLoginTypeTag');
        if (tag) {
            tag.textContent = type === 'mall' ? '商超收银台' : '餐饮收银台';
        }

        document.querySelectorAll('.pos-login-tab').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchTab(btn.getAttribute('data-tab') || 'scan');
            });
        });

        document.getElementById('btnLogin').addEventListener('click', goToMain);

        var smsBtn = document.getElementById('btnSmsCode');
        if (smsBtn) {
            smsBtn.addEventListener('click', function () {
                alert('演示：验证码已发送（实际未发送短信）');
            });
        }

        switchTab('scan');
    });
})();
