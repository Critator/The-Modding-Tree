var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,
    treeLayout: "",
}

// A "ghost" node which can offset other layers in the tree.
addNode("blank", {
    layerShown: "ghost",
})

// This built-in tree tab is required.
addLayer("tree-tab", {
    tabFormat: [["tree", function() {
        return layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS
    }]],
    previousTab: "",
    leftTab: true,
})