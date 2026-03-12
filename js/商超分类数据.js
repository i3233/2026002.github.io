// 商超分类数据 - 商品分类页、商品列表左侧菜单共用（单一数据源）
// 结构：parentId=null 为一级，指向一级为二级，指向二级为三级
var _defaultCategoryData = [
    { id: 1, name: '雅安好物', productCount: 3, sort: 1, status: 'enabled', parentId: null },
    { id: 2, name: '雅安好景', productCount: 7, sort: 2, status: 'enabled', parentId: null },
    { id: 3, name: '文创产品', productCount: 5, sort: 3, status: 'enabled', parentId: null },
    { id: 4, name: '绿营养蛋系列', productCount: 2, sort: 1, status: 'enabled', parentId: 1 },
    { id: 5, name: '蒙顶山茶系列', productCount: 3, sort: 2, status: 'enabled', parentId: 2 },
    { id: 6, name: '茶饮小类', productCount: 1, sort: 1, status: 'enabled', parentId: 5 }
];
function _loadCategoryData() {
    try {
        var s = localStorage.getItem('shangchaoCategoryData');
        if (s) return JSON.parse(s);
    } catch (e) {}
    return _defaultCategoryData.slice();
}
window.shangchaoCategoryData = _loadCategoryData();

// 将扁平数据转为树形（供左侧菜单使用）
window.buildCategoryTree = function buildCategoryTree(flatList) {
    var list = flatList || _loadCategoryData();
    function getChildren(pid) {
        return list.filter(function(c) { return c.parentId === pid; }).sort(function(a, b) { return (a.sort || 0) - (b.sort || 0) || a.id - b.id; });
    }
    function toNode(c) {
        var children = getChildren(c.id);
        return {
            id: c.id,
            name: c.name,
            parentId: c.parentId,
            children: children.map(toNode)
        };
    }
    var roots = getChildren(null);
    return roots.map(toNode);
};
