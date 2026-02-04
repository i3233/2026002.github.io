// 桌台二维码管理页面交互逻辑

// 桌台数据（从桌台管理页面获取，这里使用模拟数据）
let tableData = [
    { id: 1, tableNo: 'A01', area: '大厅', qrcodeGenerated: true, qrcodeUrl: 'https://example.com/scan?table=A01' },
    { id: 2, tableNo: 'A02', area: '大厅', qrcodeGenerated: true, qrcodeUrl: 'https://example.com/scan?table=A02' },
    { id: 3, tableNo: 'A03', area: '大厅', qrcodeGenerated: false, qrcodeUrl: null },
    { id: 4, tableNo: 'B01', area: '包间', qrcodeGenerated: true, qrcodeUrl: 'https://example.com/scan?table=B01' },
    { id: 5, tableNo: 'B02', area: '包间', qrcodeGenerated: false, qrcodeUrl: null },
    { id: 6, tableNo: 'C01', area: 'VIP区', qrcodeGenerated: true, qrcodeUrl: 'https://example.com/scan?table=C01' },
    { id: 7, tableNo: 'C02', area: 'VIP区', qrcodeGenerated: true, qrcodeUrl: 'https://example.com/scan?table=C02' },
    { id: 8, tableNo: 'D01', area: '露台', qrcodeGenerated: false, qrcodeUrl: null }
];

// 筛选条件
let currentStatus = 'all';
let searchKeyword = '';
let selectedTables = [];

// 分页信息
let pagination = {
    currentPage: 1,
    pageSize: 12,
    total: 0
};

// 当前预览的桌台ID
let currentPreviewTableId = null;

// DOM 元素
const qrcodeGrid = document.getElementById('qrcodeGrid');
const tableSearchInput = document.getElementById('tableSearchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationPages = document.getElementById('paginationPages');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderQrcodeGrid();
    updateSummary();
    updatePagination();
});

// 初始化事件监听
function initEventListeners() {
    // 状态筛选
    document.querySelectorAll('.table-qrcode-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.table-qrcode-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStatus = this.dataset.status || 'all';
            pagination.currentPage = 1;
            renderQrcodeGrid();
            updateSummary();
            updatePagination();
        });
    });

    // 搜索
    tableSearchInput.addEventListener('input', function() {
        searchKeyword = this.value.trim();
        pagination.currentPage = 1;
        renderQrcodeGrid();
        updatePagination();
    });

    // 分页
    pageSizeSelect.addEventListener('change', function() {
        pagination.pageSize = parseInt(this.value);
        pagination.currentPage = 1;
        renderQrcodeGrid();
        updatePagination();
    });

    // 批量生成
    document.getElementById('batchGenerateBtn').addEventListener('click', function() {
        batchGenerateQrcode();
    });

    // 批量下载
    document.getElementById('batchDownloadBtn').addEventListener('click', function() {
        batchDownloadQrcode();
    });

    // 批量打印
    document.getElementById('batchPrintBtn').addEventListener('click', function() {
        batchPrintQrcode();
    });

    // 刷新
    document.getElementById('refreshBtn').addEventListener('click', function() {
        renderQrcodeGrid();
        updateSummary();
        updatePagination();
    });

    // 生成二维码
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('generate-qrcode-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            generateQrcode(tableId);
        }
        if (e.target.classList.contains('preview-qrcode-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            previewQrcode(tableId);
        }
        if (e.target.classList.contains('download-qrcode-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            downloadQrcode(tableId);
        }
        if (e.target.classList.contains('print-qrcode-btn')) {
            const tableId = parseInt(e.target.dataset.tableId);
            printQrcode(tableId);
        }
    });

    // 预览弹窗下载/打印
    document.getElementById('downloadQrcodeBtn').addEventListener('click', function() {
        if (currentPreviewTableId) {
            downloadQrcode(currentPreviewTableId);
        }
    });

    document.getElementById('printQrcodeBtn').addEventListener('click', function() {
        if (currentPreviewTableId) {
            printQrcode(currentPreviewTableId);
        }
    });
}

// 渲染二维码网格
function renderQrcodeGrid() {
    qrcodeGrid.innerHTML = '';

    // 筛选数据
    let filteredData = tableData.filter(table => {
        // 状态筛选
        if (currentStatus === 'generated' && !table.qrcodeGenerated) {
            return false;
        }
        if (currentStatus === 'not-generated' && table.qrcodeGenerated) {
            return false;
        }
        // 搜索筛选
        if (searchKeyword && 
            !table.tableNo.toLowerCase().includes(searchKeyword.toLowerCase()) &&
            !table.area.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return false;
        }
        return true;
    });

    pagination.total = filteredData.length;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        qrcodeGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-lg); color: var(--color-text-secondary);">暂无数据</div>';
        return;
    }

    pageData.forEach(table => {
        const card = document.createElement('div');
        card.className = 'table-qrcode-card';
        card.dataset.tableId = table.id;

        let qrcodeHtml = '';
        if (table.qrcodeGenerated && table.qrcodeUrl) {
            qrcodeHtml = `<div class="table-qrcode-card-qrcode" id="qrcode-${table.id}"></div>`;
            // 生成二维码图片
            setTimeout(() => {
                generateQrcodeImage(table.id, table.qrcodeUrl);
            }, 100);
        } else {
            qrcodeHtml = `<div class="table-qrcode-card-qrcode">
                <div class="table-qrcode-card-qrcode-placeholder">未生成二维码</div>
            </div>`;
        }

        card.innerHTML = `
            <div class="table-qrcode-card-header">
                <div class="table-qrcode-card-table-no">${table.tableNo}</div>
                <div class="table-qrcode-card-area">${table.area}</div>
            </div>
            ${qrcodeHtml}
            <div class="table-qrcode-card-actions">
                ${table.qrcodeGenerated ? `
                    <button class="table-qrcode-card-btn preview-qrcode-btn" data-table-id="${table.id}">预览</button>
                    <button class="table-qrcode-card-btn download-qrcode-btn" data-table-id="${table.id}">下载</button>
                    <button class="table-qrcode-card-btn print-qrcode-btn" data-table-id="${table.id}">打印</button>
                ` : `
                    <button class="table-qrcode-card-btn table-qrcode-card-btn-primary generate-qrcode-btn" data-table-id="${table.id}">生成</button>
                `}
            </div>
        `;
        qrcodeGrid.appendChild(card);
    });
}

// 生成二维码图片
function generateQrcodeImage(tableId, url) {
    const container = document.getElementById(`qrcode-${tableId}`);
    if (!container) return;

    QRCode.toCanvas(container, url, {
        width: 150,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function(error) {
        if (error) {
            console.error('生成二维码失败:', error);
            container.innerHTML = '<div class="table-qrcode-card-qrcode-placeholder">生成失败</div>';
        }
    });
}

// 生成二维码
function generateQrcode(tableId) {
    const table = tableData.find(t => t.id === tableId);
    if (!table) {
        alert('未找到该桌台');
        return;
    }

    if (table.qrcodeGenerated) {
        alert('该桌台已生成二维码');
        return;
    }

    // 生成二维码URL
    const qrcodeUrl = `https://example.com/scan?table=${table.tableNo}`;
    table.qrcodeUrl = qrcodeUrl;
    table.qrcodeGenerated = true;

    renderQrcodeGrid();
    updateSummary();
    alert('二维码生成成功！');
}

// 预览二维码
function previewQrcode(tableId) {
    const table = tableData.find(t => t.id === tableId);
    if (!table || !table.qrcodeGenerated) {
        alert('该桌台未生成二维码');
        return;
    }

    currentPreviewTableId = tableId;

    document.getElementById('qrcodePreviewTitle').textContent = `二维码预览 - ${table.tableNo}`;
    document.getElementById('previewTableNo').textContent = table.tableNo;
    document.getElementById('previewArea').textContent = table.area;
    document.getElementById('previewUrl').textContent = table.qrcodeUrl;

    // 生成预览二维码
    const previewContainer = document.getElementById('qrcodePreviewImage');
    previewContainer.innerHTML = '';
    QRCode.toCanvas(previewContainer, table.qrcodeUrl, {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function(error) {
        if (error) {
            console.error('生成预览二维码失败:', error);
            previewContainer.innerHTML = '<div style="color: var(--color-text-secondary);">生成失败</div>';
        }
    });

    document.getElementById('qrcodePreviewModal').style.display = 'block';
}

// 关闭预览弹窗
function closeQrcodePreviewModal() {
    document.getElementById('qrcodePreviewModal').style.display = 'none';
    currentPreviewTableId = null;
}

// 下载二维码
function downloadQrcode(tableId) {
    const table = tableData.find(t => t.id === tableId);
    if (!table || !table.qrcodeGenerated) {
        alert('该桌台未生成二维码');
        return;
    }

    // 创建canvas生成二维码
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, table.qrcodeUrl, {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function(error) {
        if (error) {
            alert('下载失败：' + error.message);
            return;
        }

        // 下载图片
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `桌台${table.tableNo}_二维码.png`;
            link.click();
            URL.revokeObjectURL(url);
        });
    });
}

// 打印二维码
function printQrcode(tableId) {
    const table = tableData.find(t => t.id === tableId);
    if (!table || !table.qrcodeGenerated) {
        alert('该桌台未生成二维码');
        return;
    }

    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>桌台${table.tableNo}二维码</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px;
                        font-family: Arial, sans-serif;
                    }
                    h2 {
                        margin-bottom: 20px;
                    }
                    .qrcode-container {
                        margin: 20px 0;
                    }
                    .info {
                        margin-top: 20px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h2>桌台${table.tableNo} - ${table.area}</h2>
                <div class="qrcode-container" id="qrcode"></div>
                <div class="info">
                    <p>请扫描二维码进行点餐</p>
                    <p style="font-size: 12px; color: #666;">${table.qrcodeUrl}</p>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
                <script>
                    QRCode.toCanvas(document.getElementById('qrcode'), '${table.qrcodeUrl}', {
                        width: 300,
                        margin: 2
                    }, function(error) {
                        if (!error) {
                            window.print();
                        }
                    });
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// 批量生成二维码
function batchGenerateQrcode() {
    const notGenerated = tableData.filter(t => !t.qrcodeGenerated);
    if (notGenerated.length === 0) {
        alert('所有桌台都已生成二维码');
        return;
    }

    if (confirm(`确定要为 ${notGenerated.length} 个未生成二维码的桌台批量生成二维码吗？`)) {
        notGenerated.forEach(table => {
            table.qrcodeUrl = `https://example.com/scan?table=${table.tableNo}`;
            table.qrcodeGenerated = true;
        });
        renderQrcodeGrid();
        updateSummary();
        alert('批量生成成功！');
    }
}

// 批量下载二维码
function batchDownloadQrcode() {
    const generated = tableData.filter(t => t.qrcodeGenerated);
    if (generated.length === 0) {
        alert('没有已生成的二维码');
        return;
    }

    alert(`批量下载 ${generated.length} 个二维码（示例功能）`);
    // 实际实现中，可以打包成ZIP文件下载
}

// 批量打印二维码
function batchPrintQrcode() {
    const generated = tableData.filter(t => t.qrcodeGenerated);
    if (generated.length === 0) {
        alert('没有已生成的二维码');
        return;
    }

    alert(`批量打印 ${generated.length} 个二维码（示例功能）`);
    // 实际实现中，可以生成打印页面
}

// 更新统计
function updateSummary() {
    const totalCount = tableData.length;
    const generatedCount = tableData.filter(t => t.qrcodeGenerated).length;
    const notGeneratedCount = totalCount - generatedCount;

    document.getElementById('summaryTotalCount').textContent = totalCount;
    document.getElementById('summaryGeneratedCount').textContent = generatedCount;
    document.getElementById('summaryNotGeneratedCount').textContent = notGeneratedCount;
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    document.getElementById('totalRecords').textContent = pagination.total;
    
    // 上一页/下一页按钮
    prevPageBtn.disabled = pagination.currentPage === 1;
    nextPageBtn.disabled = pagination.currentPage === totalPages || totalPages === 0;

    prevPageBtn.onclick = function() {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderQrcodeGrid();
            updatePagination();
        }
    };

    nextPageBtn.onclick = function() {
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderQrcodeGrid();
            updatePagination();
        }
    };

    // 页码按钮
    paginationPages.innerHTML = '';
    const maxPages = Math.min(totalPages, 10);
    const startPage = Math.max(1, pagination.currentPage - 5);
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'table-qrcode-pagination-page-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            pagination.currentPage = 1;
            renderQrcodeGrid();
            updatePagination();
        });
        paginationPages.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'table-qrcode-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'table-qrcode-pagination-page-btn' + (i === pagination.currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            pagination.currentPage = i;
            renderQrcodeGrid();
            updatePagination();
        });
        paginationPages.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'table-qrcode-pagination-info';
            ellipsis.textContent = '...';
            paginationPages.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'table-qrcode-pagination-page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            pagination.currentPage = totalPages;
            renderQrcodeGrid();
            updatePagination();
        });
        paginationPages.appendChild(lastBtn);
    }
}

// 全局函数
window.closeQrcodePreviewModal = closeQrcodePreviewModal;
