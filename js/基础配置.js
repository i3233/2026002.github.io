// 基础配置页面交互逻辑

// 打印机数据
let printers = [
    { id: 1, name: '前台小票打印机', type: 'receipt', connection: 'usb', categories: ['order'] },
    { id: 2, name: '后厨打印机1', type: 'kitchen', connection: 'network', ip: '192.168.1.100', categories: ['kitchen'] },
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderPrinterList();
});

// 初始化事件监听
function initEventListeners() {
    // App安装按钮
    const installAppBtn = document.getElementById('installAppBtn');
    if (installAppBtn) {
        installAppBtn.addEventListener('click', function() {
            installApp();
        });
    }

    // 下载App按钮
    const downloadAppBtn = document.getElementById('downloadAppBtn');
    if (downloadAppBtn) {
        downloadAppBtn.addEventListener('click', function() {
            downloadApp();
        });
    }

    // 生成绑定码按钮
    const generateBindCodeBtn = document.getElementById('generateBindCodeBtn');
    if (generateBindCodeBtn) {
        generateBindCodeBtn.addEventListener('click', function() {
            generateBindCode();
        });
    }

    // 复制绑定码按钮
    const copyBindCodeBtn = document.getElementById('copyBindCodeBtn');
    if (copyBindCodeBtn) {
        copyBindCodeBtn.addEventListener('click', function() {
            copyBindCode();
        });
    }

    // 支付开关
    const wechatPaySwitch = document.getElementById('wechatPaySwitch');
    if (wechatPaySwitch) {
        wechatPaySwitch.addEventListener('change', function() {
            togglePaymentContent('wechatPay', this.checked);
        });
    }

    const alipaySwitch = document.getElementById('alipaySwitch');
    if (alipaySwitch) {
        alipaySwitch.addEventListener('change', function() {
            togglePaymentContent('alipay', this.checked);
        });
    }

    // 保存支付设置
    const savePaymentBtn = document.getElementById('savePaymentBtn');
    if (savePaymentBtn) {
        savePaymentBtn.addEventListener('click', function() {
            savePaymentSettings();
        });
    }

    // 添加打印机按钮
    const addPrinterBtn = document.getElementById('addPrinterBtn');
    if (addPrinterBtn) {
        addPrinterBtn.addEventListener('click', function() {
            showPrinterModal();
        });
    }

    // 打印机连接方式切换
    const printerConnection = document.getElementById('printerConnection');
    if (printerConnection) {
        printerConnection.addEventListener('change', function() {
            const networkGroup = document.getElementById('printerNetworkGroup');
            if (networkGroup) {
                networkGroup.style.display = this.value === 'network' ? 'block' : 'none';
            }
        });
    }

    // 保存打印机
    const savePrinterBtn = document.querySelector('#printerModal .config-btn-primary');
    if (savePrinterBtn) {
        savePrinterBtn.addEventListener('click', function() {
            savePrinter();
        });
    }

    // 测试电子秤连接
    const testScaleBtn = document.getElementById('testScaleBtn');
    if (testScaleBtn) {
        testScaleBtn.addEventListener('click', function() {
            testScaleConnection();
        });
    }

    // 保存电子秤设置
    const saveScaleBtn = document.getElementById('saveScaleBtn');
    if (saveScaleBtn) {
        saveScaleBtn.addEventListener('click', function() {
            saveScaleSettings();
        });
    }
}

// 安装App
function installApp() {
    if (confirm('确定要安装收银台App吗？')) {
        console.log('开始安装App...');
        // 实现App安装逻辑
        alert('App安装功能待实现');
    }
}

// 下载App
function downloadApp() {
    console.log('下载App安装包...');
    // 实现下载逻辑
    alert('下载功能待实现');
}

// 生成绑定码
function generateBindCode() {
    // 生成随机绑定码（示例：8位数字字母组合）
    const bindCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const bindCodeValue = document.getElementById('bindCodeValue');
    const copyBtn = document.getElementById('copyBindCodeBtn');
    
    if (bindCodeValue) {
        bindCodeValue.textContent = bindCode;
    }
    
    if (copyBtn) {
        copyBtn.style.display = 'inline-flex';
    }
    
    console.log('生成绑定码:', bindCode);
}

// 复制绑定码
function copyBindCode() {
    const bindCodeValue = document.getElementById('bindCodeValue');
    if (bindCodeValue && bindCodeValue.textContent !== '点击生成按钮获取') {
        navigator.clipboard.writeText(bindCodeValue.textContent).then(function() {
            alert('绑定码已复制到剪贴板');
        }).catch(function() {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = bindCodeValue.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('绑定码已复制到剪贴板');
        });
    }
}

// 切换支付内容显示
function togglePaymentContent(paymentType, isActive) {
    const content = document.getElementById(paymentType + 'Content');
    const item = document.getElementById(paymentType + 'Switch').closest('.payment-item');
    
    if (content && item) {
        if (isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    }
}

// 保存支付设置
function savePaymentSettings() {
    const wechatPay = document.getElementById('wechatPaySwitch').checked;
    const alipay = document.getElementById('alipaySwitch').checked;
    const cashPay = document.getElementById('cashPaySwitch').checked;
    
    console.log('保存支付设置:', {
        wechatPay,
        alipay,
        cashPay
    });
    
    alert('支付设置已保存');
}

// 渲染打印机列表
function renderPrinterList() {
    const printerList = document.getElementById('printerList');
    if (!printerList) return;

    if (printers.length === 0) {
        printerList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg);">暂无打印机，请添加</p>';
        return;
    }

    printerList.innerHTML = printers.map(printer => {
        const typeMap = {
            'receipt': '小票打印机',
            'kitchen': '后厨打印机',
            'label': '标签打印机'
        };
        
        const connectionMap = {
            'usb': 'USB',
            'network': '网络',
            'bluetooth': '蓝牙'
        };
        
        const categoryMap = {
            'order': '订单小票',
            'kitchen': '后厨单',
            'label': '标签'
        };
        
        return `
            <div class="printer-item">
                <div class="printer-item-info">
                    <div class="printer-item-name">${printer.name}</div>
                    <div class="printer-item-details">
                        ${typeMap[printer.type]} | ${connectionMap[printer.connection]}
                        ${printer.ip ? ' | ' + printer.ip : ''}
                        | 分类：${printer.categories.map(c => categoryMap[c]).join('、')}
                    </div>
                </div>
                <div class="printer-item-actions">
                    <button class="config-btn config-btn-outline" onclick="editPrinter(${printer.id})">编辑</button>
                    <button class="config-btn config-btn-outline" onclick="deletePrinter(${printer.id})">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// 显示打印机弹窗
function showPrinterModal() {
    const modal = document.getElementById('printerModal');
    if (modal) {
        modal.style.display = 'flex';
        // 重置表单
        document.getElementById('printerName').value = '';
        document.getElementById('printerType').value = 'receipt';
        document.getElementById('printerConnection').value = 'usb';
        document.getElementById('printerIP').value = '';
        document.getElementById('printerNetworkGroup').style.display = 'none';
        document.querySelectorAll('#printerModal .printer-categories input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'order';
        });
    }
}

// 关闭打印机弹窗
function closePrinterModal() {
    const modal = document.getElementById('printerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 保存打印机
function savePrinter() {
    const name = document.getElementById('printerName').value;
    const type = document.getElementById('printerType').value;
    const connection = document.getElementById('printerConnection').value;
    const ip = document.getElementById('printerIP').value;
    const categories = Array.from(document.querySelectorAll('#printerModal .printer-categories input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    if (!name) {
        alert('请输入打印机名称');
        return;
    }

    if (connection === 'network' && !ip) {
        alert('请输入IP地址');
        return;
    }

    const newPrinter = {
        id: printers.length + 1,
        name: name,
        type: type,
        connection: connection,
        categories: categories
    };

    if (connection === 'network') {
        newPrinter.ip = ip;
    }

    printers.push(newPrinter);
    renderPrinterList();
    closePrinterModal();
    alert('打印机添加成功');
}

// 编辑打印机
function editPrinter(printerId) {
    const printer = printers.find(p => p.id === printerId);
    if (!printer) return;

    // 填充表单
    document.getElementById('printerName').value = printer.name;
    document.getElementById('printerType').value = printer.type;
    document.getElementById('printerConnection').value = printer.connection;
    if (printer.ip) {
        document.getElementById('printerIP').value = printer.ip;
    }
    
    const networkGroup = document.getElementById('printerNetworkGroup');
    if (networkGroup) {
        networkGroup.style.display = printer.connection === 'network' ? 'block' : 'none';
    }

    document.querySelectorAll('#printerModal .printer-categories input[type="checkbox"]').forEach(cb => {
        cb.checked = printer.categories.includes(cb.value);
    });

    showPrinterModal();
    
    // 修改保存按钮行为为更新
    const saveBtn = document.querySelector('#printerModal .config-btn-primary');
    if (saveBtn) {
        saveBtn.textContent = '更新';
        saveBtn.onclick = function() {
            updatePrinter(printerId);
        };
    }
}

// 更新打印机
function updatePrinter(printerId) {
    const printer = printers.find(p => p.id === printerId);
    if (!printer) return;

    const name = document.getElementById('printerName').value;
    const type = document.getElementById('printerType').value;
    const connection = document.getElementById('printerConnection').value;
    const ip = document.getElementById('printerIP').value;
    const categories = Array.from(document.querySelectorAll('#printerModal .printer-categories input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    printer.name = name;
    printer.type = type;
    printer.connection = connection;
    printer.categories = categories;
    
    if (connection === 'network') {
        printer.ip = ip;
    } else {
        delete printer.ip;
    }

    renderPrinterList();
    closePrinterModal();
    alert('打印机更新成功');
    
    // 恢复保存按钮
    const saveBtn = document.querySelector('#printerModal .config-btn-primary');
    if (saveBtn) {
        saveBtn.textContent = '保存';
        saveBtn.onclick = savePrinter;
    }
}

// 删除打印机
function deletePrinter(printerId) {
    if (confirm('确定要删除这台打印机吗？')) {
        printers = printers.filter(p => p.id !== printerId);
        renderPrinterList();
        alert('打印机已删除');
    }
}

// 测试电子秤连接
function testScaleConnection() {
    const port = document.getElementById('scalePort').value;
    const baudRate = document.getElementById('scaleBaudRate').value;
    
    if (!port) {
        alert('请输入串口号');
        return;
    }

    console.log('测试电子秤连接:', { port, baudRate });
    alert('正在测试连接...\n串口：' + port + '\n波特率：' + baudRate);
}

// 保存电子秤设置
function saveScaleSettings() {
    const model = document.getElementById('scaleModel').value;
    const port = document.getElementById('scalePort').value;
    const baudRate = document.getElementById('scaleBaudRate').value;
    const autoConnect = document.getElementById('scaleAutoConnect').checked;

    if (!model || !port) {
        alert('请填写完整的电子秤设置');
        return;
    }

    console.log('保存电子秤设置:', {
        model,
        port,
        baudRate,
        autoConnect
    });

    alert('电子秤设置已保存');
}

// 全局函数
window.closePrinterModal = closePrinterModal;
window.editPrinter = editPrinter;
window.deletePrinter = deletePrinter;
