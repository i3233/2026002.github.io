// 导购/拣货/服务员管理页面交互逻辑

// 人员数据
let guides = [
    {
        id: 1,
        code: 'G001',
        name: '王小明',
        type: 'guide',
        phone: '13800138010',
        areas: ['1楼', '2楼'],
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 2,
        code: 'P001',
        name: '张小华',
        type: 'picker',
        phone: '13800138011',
        areas: ['仓库A', '仓库B'],
        status: 'active',
        createTime: '2024-01-16 14:30:00'
    },
    {
        id: 3,
        code: 'W001',
        name: '李小红',
        type: 'waiter',
        phone: '13800138012',
        areas: ['大厅', '包间1-5'],
        status: 'active',
        createTime: '2024-01-17 09:15:00'
    },
    {
        id: 4,
        code: 'G002',
        name: '赵小刚',
        type: 'guide',
        phone: '13800138013',
        areas: ['3楼', '4楼'],
        status: 'inactive',
        createTime: '2024-01-18 11:20:00'
    },
];

// 当前编辑的人员ID
let editingGuideId = null;

// 筛选条件
let currentType = 'all';
let currentStatus = 'all';
let searchKeyword = '';

// 类型映射
const typeMap = {
    'guide': '导购',
    'picker': '拣货',
    'waiter': '服务员'
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderGuideTable();
    updateAssistGuideSelect();
});

// 初始化事件监听
function initEventListeners() {
    // 添加人员按钮
    const addGuideBtn = document.getElementById('addGuideBtn');
    if (addGuideBtn) {
        addGuideBtn.addEventListener('click', function() {
            showGuideModal();
        });
    }

    // 辅助出库按钮
    const assistOutboundBtn = document.getElementById('assistOutboundBtn');
    if (assistOutboundBtn) {
        assistOutboundBtn.addEventListener('click', function() {
            showAssistOutboundModal();
        });
    }

    // 类型筛选
    document.querySelectorAll('.guide-filter-btn[data-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.guide-filter-btn[data-type]').forEach(b => b.classList.remove('guide-filter-btn-active'));
            this.classList.add('guide-filter-btn-active');
            currentType = this.dataset.type;
            renderGuideTable();
        });
    });

    // 状态筛选
    document.querySelectorAll('.guide-filter-btn[data-status]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.guide-filter-btn[data-status]').forEach(b => b.classList.remove('guide-filter-btn-active'));
            this.classList.add('guide-filter-btn-active');
            currentStatus = this.dataset.status;
            renderGuideTable();
        });
    });

    // 搜索
    const searchInput = document.getElementById('guideSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            renderGuideTable();
        });
    }
}

// 渲染人员表格
function renderGuideTable() {
    const tableBody = document.getElementById('guideTableBody');
    if (!tableBody) return;

    // 过滤人员
    let filteredGuides = guides;

    // 按类型过滤
    if (currentType !== 'all') {
        filteredGuides = filteredGuides.filter(g => g.type === currentType);
    }

    // 按状态过滤
    if (currentStatus !== 'all') {
        filteredGuides = filteredGuides.filter(g => g.status === currentStatus);
    }

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredGuides = filteredGuides.filter(g =>
            g.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            g.code.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    if (filteredGuides.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无人员数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = filteredGuides.map(guide => {
        const typeClass = `guide-type-badge-${guide.type}`;
        const statusClass = guide.status === 'active' ? 'guide-status-badge-active' : 'guide-status-badge-inactive';
        const statusText = guide.status === 'active' ? '在职' : '离职';

        return `
            <tr>
                <td>${guide.code}</td>
                <td>${guide.name}</td>
                <td>
                    <span class="guide-type-badge ${typeClass}">${typeMap[guide.type]}</span>
                </td>
                <td>${guide.phone}</td>
                <td>
                    <div class="guide-areas-display">
                        ${guide.areas.map(area => `<span class="guide-area-tag">${area}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <span class="guide-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>${guide.createTime}</td>
                <td>
                    <div class="guide-action-buttons">
                        <button class="guide-btn guide-btn-text" onclick="editGuide(${guide.id})">编辑</button>
                        <button class="guide-btn guide-btn-danger" onclick="deleteGuide(${guide.id})">删除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 显示人员弹窗
function showGuideModal(guideId = null) {
    editingGuideId = guideId;
    const modal = document.getElementById('guideModal');
    const modalTitle = document.getElementById('guideModalTitle');
    const form = document.getElementById('guideForm');
    const areasList = document.getElementById('guideAreasList');

    if (modalTitle) {
        modalTitle.textContent = guideId ? '编辑人员' : '添加人员';
    }

    if (guideId) {
        // 编辑模式
        const guide = guides.find(g => g.id === guideId);
        if (guide) {
            document.getElementById('guideCode').value = guide.code;
            document.getElementById('guideName').value = guide.name;
            document.getElementById('guideType').value = guide.type;
            document.getElementById('guidePhone').value = guide.phone;
            document.getElementById('guideStatus').checked = guide.status === 'active';
            
            // 渲染负责区域
            renderAreasList(guide.areas);
        }
    } else {
        // 添加模式
        form.reset();
        document.getElementById('guideStatus').checked = true;
        renderAreasList([]);
    }

    if (modal) {
        modal.style.display = 'flex';
    }
}

// 渲染负责区域列表
function renderAreasList(areas) {
    const areasList = document.getElementById('guideAreasList');
    if (!areasList) return;

    if (areas.length === 0) {
        areasList.innerHTML = '<div class="guide-areas-empty">暂无负责区域，请添加</div>';
        return;
    }

    areasList.innerHTML = areas.map((area, index) => `
        <div class="guide-area-item">
            <input type="text" class="guide-area-item-input" value="${area}" data-index="${index}" onchange="updateArea(${index}, this.value)">
            <button type="button" class="guide-area-item-delete" onclick="removeArea(${index})" title="删除">×</button>
        </div>
    `).join('');
}

// 添加区域
function addArea() {
    const areasList = document.getElementById('guideAreasList');
    if (!areasList) return;

    const currentAreas = getCurrentAreas();
    currentAreas.push('');
    
    renderAreasList(currentAreas);
}

// 更新区域
function updateArea(index, value) {
    // 区域值会在保存时统一获取
}

// 删除区域
function removeArea(index) {
    const areasList = document.getElementById('guideAreasList');
    if (!areasList) return;

    const currentAreas = getCurrentAreas();
    currentAreas.splice(index, 1);
    
    renderAreasList(currentAreas);
}

// 获取当前区域列表
function getCurrentAreas() {
    const areaInputs = document.querySelectorAll('.guide-area-item-input');
    return Array.from(areaInputs).map(input => input.value.trim()).filter(v => v);
}

// 关闭人员弹窗
function closeGuideModal() {
    const modal = document.getElementById('guideModal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingGuideId = null;
    document.getElementById('guideForm').reset();
}

// 保存人员
function saveGuide() {
    const form = document.getElementById('guideForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const code = document.getElementById('guideCode').value;
    const name = document.getElementById('guideName').value;
    const type = document.getElementById('guideType').value;
    const phone = document.getElementById('guidePhone').value;
    const status = document.getElementById('guideStatus').checked ? 'active' : 'inactive';
    const areas = getCurrentAreas();

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号');
        return;
    }

    // 验证负责区域
    if (areas.length === 0) {
        alert('请至少添加一个负责区域');
        return;
    }

    if (editingGuideId) {
        // 更新人员
        const guide = guides.find(g => g.id === editingGuideId);
        if (guide) {
            // 检查工号是否重复（排除当前编辑的）
            if (guides.some(g => g.code === code && g.id !== editingGuideId)) {
                alert('工号已存在');
                return;
            }

            guide.code = code;
            guide.name = name;
            guide.type = type;
            guide.phone = phone;
            guide.status = status;
            guide.areas = areas;

            alert('人员更新成功');
        }
    } else {
        // 添加人员
        // 检查工号是否重复
        if (guides.some(g => g.code === code)) {
            alert('工号已存在');
            return;
        }

        const newGuide = {
            id: guides.length + 1,
            code: code,
            name: name,
            type: type,
            phone: phone,
            areas: areas,
            status: status,
            createTime: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        guides.push(newGuide);
        alert('人员添加成功');
    }

    renderGuideTable();
    updateAssistGuideSelect();
    closeGuideModal();
}

// 编辑人员
function editGuide(guideId) {
    showGuideModal(guideId);
}

// 删除人员
function deleteGuide(guideId) {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return;

    if (confirm(`确定要删除人员"${guide.name}"吗？`)) {
        guides = guides.filter(g => g.id !== guideId);
        renderGuideTable();
        updateAssistGuideSelect();
        alert('人员已删除');
    }
}

// 显示辅助出库弹窗
function showAssistOutboundModal() {
    updateAssistGuideSelect();
    document.getElementById('assistOrderNo').value = '';
    document.getElementById('assistRemark').value = '';
    document.getElementById('assistGuideSelect').value = '';

    const modal = document.getElementById('assistOutboundModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 更新辅助出库人员选择
function updateAssistGuideSelect() {
    const select = document.getElementById('assistGuideSelect');
    if (!select) return;

    const activeGuides = guides.filter(g => g.status === 'active');
    
    select.innerHTML = '<option value="">请选择人员</option>' +
        activeGuides.map(guide => 
            `<option value="${guide.id}">${guide.name} (${guide.code}) - ${typeMap[guide.type]}</option>`
        ).join('');
}

// 关闭辅助出库弹窗
function closeAssistOutboundModal() {
    const modal = document.getElementById('assistOutboundModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 确认辅助出库
function confirmAssistOutbound() {
    const guideId = document.getElementById('assistGuideSelect').value;
    const orderNo = document.getElementById('assistOrderNo').value;
    const remark = document.getElementById('assistRemark').value;

    if (!guideId) {
        alert('请选择人员');
        return;
    }

    if (!orderNo) {
        alert('请输入订单号');
        return;
    }

    const guide = guides.find(g => g.id == guideId);
    if (!guide) return;

    console.log('辅助出库:', {
        guide: guide.name,
        orderNo: orderNo,
        remark: remark
    });

    alert(`辅助出库成功！\n人员：${guide.name}\n订单号：${orderNo}`);
    closeAssistOutboundModal();
}

// 全局函数
window.closeGuideModal = closeGuideModal;
window.closeAssistOutboundModal = closeAssistOutboundModal;
window.editGuide = editGuide;
window.deleteGuide = deleteGuide;
window.addArea = addArea;
window.updateArea = updateArea;
window.removeArea = removeArea;
