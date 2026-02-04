// 商品标签页面交互逻辑

// 标签数据（虚拟数据）
let tagListData = [
    {
        id: 1,
        name: '热销',
        sort: 1,
        fontColor: '#ffffff',
        backgroundColor: '#ff4757',
        createTime: '2024-01-15 10:30:00'
    },
    {
        id: 2,
        name: '新品',
        sort: 2,
        fontColor: '#ffffff',
        backgroundColor: '#2ed573',
        createTime: '2024-01-16 14:20:00'
    },
    {
        id: 3,
        name: '推荐',
        sort: 3,
        fontColor: '#ffffff',
        backgroundColor: '#5352ed',
        createTime: '2024-01-17 09:15:00'
    },
    {
        id: 4,
        name: '特价',
        sort: 4,
        fontColor: '#ffffff',
        backgroundColor: '#ff6348',
        createTime: '2024-01-18 11:45:00'
    },
    {
        id: 5,
        name: '限时',
        sort: 5,
        fontColor: '#ffffff',
        backgroundColor: '#ffa502',
        createTime: '2024-01-19 16:30:00'
    },
    {
        id: 6,
        name: '精选',
        sort: 6,
        fontColor: '#2f3542',
        backgroundColor: '#ffd32a',
        createTime: '2024-01-20 13:20:00'
    },
    {
        id: 7,
        name: '爆款',
        sort: 7,
        fontColor: '#ffffff',
        backgroundColor: '#ee5a6f',
        createTime: '2024-01-21 10:10:00'
    },
    {
        id: 8,
        name: '限购',
        sort: 8,
        fontColor: '#ffffff',
        backgroundColor: '#5f27cd',
        createTime: '2024-01-22 15:40:00'
    },
    {
        id: 9,
        name: '包邮',
        sort: 9,
        fontColor: '#ffffff',
        backgroundColor: '#00d2d3',
        createTime: '2024-01-23 08:25:00'
    },
    {
        id: 10,
        name: '秒杀',
        sort: 10,
        fontColor: '#ffffff',
        backgroundColor: '#ff3838',
        createTime: '2024-01-24 12:00:00'
    },
    {
        id: 11,
        name: '会员专享',
        sort: 11,
        fontColor: '#ffffff',
        backgroundColor: '#c44569',
        createTime: '2024-01-25 14:50:00'
    },
    {
        id: 12,
        name: '满减',
        sort: 12,
        fontColor: '#ffffff',
        backgroundColor: '#f0932b',
        createTime: '2024-01-26 09:30:00'
    }
];

// 筛选条件
let searchKeyword = '';

// 选中的标签ID
let selectedTags = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderTagTable();
});

// 初始化事件监听
function initEventListeners() {
    // 搜索
    const searchInput = document.getElementById('tagSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchKeyword = this.value.trim();
            renderTagTable();
        });
    }

    // 搜索按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('tagSearchInput');
            if (searchInput) {
                searchKeyword = searchInput.value.trim();
                renderTagTable();
            }
        });
    }

    // 新建标签
    const createTagBtn = document.getElementById('createTagBtn');
    if (createTagBtn) {
        createTagBtn.addEventListener('click', function() {
            showCreateTagModal();
        });
    }

    // 初始化新建标签表单
    initCreateTagForm();

    // 批量删除
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', function() {
            if (selectedTags.length === 0) {
                alert('请先选择要删除的标签');
                return;
            }
            if (confirm(`确定要删除选中的 ${selectedTags.length} 个标签吗？`)) {
                tagListData = tagListData.filter(tag => !selectedTags.includes(tag.id));
                selectedTags = [];
                renderTagTable();
                alert('标签删除成功');
            }
        });
    }

    // 全选复选框
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }
}

// 渲染标签表格
function renderTagTable() {
    const tableBody = document.getElementById('tagTableBody');
    if (!tableBody) return;

    // 过滤标签
    let filteredTags = tagListData;

    // 按搜索关键词过滤
    if (searchKeyword) {
        filteredTags = filteredTags.filter(tag =>
            tag.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    if (filteredTags.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
                    暂无标签数据
                </td>
            </tr>
        `;
        return;
    }

    // 渲染表格行
    tableBody.innerHTML = filteredTags.map(tag => {
        const isSelected = selectedTags.includes(tag.id);

        return `
            <tr>
                <td>
                    <label class="tag-list-checkbox-label">
                        <input type="checkbox" class="tag-checkbox" value="${tag.id}" ${isSelected ? 'checked' : ''} onchange="toggleTagSelection(${tag.id})">
                    </label>
                </td>
                <td>
                    <span class="tag-list-sort-order">${tag.sort}</span>
                </td>
                <td>
                    <span class="tag-list-tag-name">${tag.name}</span>
                </td>
                <td>
                    <div class="tag-list-color-display">
                        <span class="tag-list-color-box" style="background-color: ${tag.fontColor};"></span>
                        <span class="tag-list-color-text">${tag.fontColor}</span>
                    </div>
                </td>
                <td>
                    <div class="tag-list-color-display">
                        <span class="tag-list-color-box" style="background-color: ${tag.backgroundColor};"></span>
                        <span class="tag-list-color-text">${tag.backgroundColor}</span>
                    </div>
                </td>
                <td>
                    <span class="tag-list-create-time">${tag.createTime}</span>
                </td>
                <td>
                    <div class="tag-list-action-buttons">
                        <button class="tag-list-action-btn tag-list-action-btn-edit" onclick="editTag(${tag.id})">编辑</button>
                        <button class="tag-list-action-btn tag-list-action-btn-delete" onclick="deleteTag(${tag.id})">删除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 切换全选
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.tag-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const tagId = parseInt(cb.value);
        if (checked) {
            if (!selectedTags.includes(tagId)) {
                selectedTags.push(tagId);
            }
        } else {
            selectedTags = selectedTags.filter(id => id !== tagId);
        }
    });
}

// 切换单个选择
function toggleTagSelection(tagId) {
    const index = selectedTags.indexOf(tagId);
    if (index > -1) {
        selectedTags.splice(index, 1);
    } else {
        selectedTags.push(tagId);
    }
    
    // 更新全选状态
    const checkboxes = document.querySelectorAll('.tag-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

// 编辑标签
function editTag(tagId) {
    console.log('编辑标签:', tagId);
    alert('编辑标签功能待实现');
}

// 删除标签
function deleteTag(tagId) {
    const tag = tagListData.find(t => t.id === tagId);
    if (!tag) return;

    if (confirm(`确定要删除标签"${tag.name}"吗？`)) {
        const index = tagListData.findIndex(t => t.id === tagId);
        if (index > -1) {
            tagListData.splice(index, 1);
            renderTagTable();
            alert('标签已删除');
        }
    }
}

// 显示新建标签弹窗
function showCreateTagModal() {
    const modal = document.getElementById('createTagModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 重置表单
        resetCreateTagForm();
    }
}

// 关闭新建标签弹窗
function closeCreateTagModal() {
    const modal = document.getElementById('createTagModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 初始化新建标签表单
function initCreateTagForm() {
    // 字体颜色选择器
    const fontColorInput = document.getElementById('fontColorInput');
    const fontColorBox = document.getElementById('fontColorBox');
    const fontColorText = document.getElementById('fontColorText');
    
    if (fontColorInput && fontColorBox && fontColorText) {
        fontColorInput.addEventListener('input', function() {
            const color = this.value;
            fontColorBox.style.backgroundColor = color;
            fontColorText.textContent = color.toUpperCase();
        });

        // 点击颜色方块也可以打开颜色选择器
        fontColorBox.addEventListener('click', function() {
            fontColorInput.click();
        });
    }

    // 背景颜色选择器
    const bgColorInput = document.getElementById('bgColorInput');
    const bgColorBox = document.getElementById('bgColorBox');
    const bgColorText = document.getElementById('bgColorText');
    
    if (bgColorInput && bgColorBox && bgColorText) {
        bgColorInput.addEventListener('input', function() {
            const color = this.value;
            bgColorBox.style.backgroundColor = color;
            bgColorText.textContent = color.toUpperCase();
        });

        // 点击颜色方块也可以打开颜色选择器
        bgColorBox.addEventListener('click', function() {
            bgColorInput.click();
        });
    }

    // 适用商品输入框（点击打开商品选择）
    const tagProductsInput = document.getElementById('tagProductsInput');
    if (tagProductsInput) {
        tagProductsInput.addEventListener('click', function() {
            console.log('选择商品');
            alert('选择商品功能待实现');
        });
    }
}

// 重置新建标签表单
function resetCreateTagForm() {
    // 重置输入
    document.getElementById('tagSortInput').value = '1';
    document.getElementById('tagNameInput').value = '';
    document.getElementById('tagProductsInput').value = '';
    
    // 重置颜色
    const fontColorInput = document.getElementById('fontColorInput');
    const bgColorInput = document.getElementById('bgColorInput');
    
    if (fontColorInput) {
        fontColorInput.value = '#ffffff';
        const fontColorBox = document.getElementById('fontColorBox');
        const fontColorText = document.getElementById('fontColorText');
        if (fontColorBox) fontColorBox.style.backgroundColor = '#ffffff';
        if (fontColorText) fontColorText.textContent = '#FFF';
    }
    
    if (bgColorInput) {
        bgColorInput.value = '#000000';
        const bgColorBox = document.getElementById('bgColorBox');
        const bgColorText = document.getElementById('bgColorText');
        if (bgColorBox) bgColorBox.style.backgroundColor = '#000000';
        if (bgColorText) bgColorText.textContent = '#000';
    }
}

// 保存标签
function saveTag() {
    const name = document.getElementById('tagNameInput').value.trim();
    const sort = parseInt(document.getElementById('tagSortInput').value) || 1;
    const fontColor = document.getElementById('fontColorInput').value.toUpperCase();
    const backgroundColor = document.getElementById('bgColorInput').value.toUpperCase();

    // 验证必填项
    if (!name) {
        alert('请输入标签名称');
        return;
    }

    // 创建新标签对象
    const newTag = {
        id: Date.now(),
        name: name,
        sort: sort,
        fontColor: fontColor,
        backgroundColor: backgroundColor,
        createTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-')
    };

    // 添加到标签列表
    tagListData.push(newTag);
    
    // 按排序排序
    tagListData.sort((a, b) => a.sort - b.sort);
    
    // 刷新表格
    renderTagTable();
    
    // 关闭弹窗
    closeCreateTagModal();
    
    alert(`标签"${name}"创建成功！`);
}

// 全局函数
window.toggleTagSelection = toggleTagSelection;
window.editTag = editTag;
window.deleteTag = deleteTag;
window.showCreateTagModal = showCreateTagModal;
window.closeCreateTagModal = closeCreateTagModal;
window.saveTag = saveTag;
