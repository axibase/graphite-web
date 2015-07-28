/* composer.html replace */
function addTarget(target) {
    var label = decodeURIComponent(target);
    TargetStore.add([ new TargetRecord({value: target, label: label}) ]);
}

/* composer_widgets.js replace */
GraphDataWindow.create = function () {
    var _this = this;

    this.targetList = new Ext.ListView({
        store: TargetStore,
        multiSelect: true,
        emptyText: "No graph targets",
        reserveScrollOffset: true,
        columnSort: false,
        hideHeaders: true,
        width: 385,
        height: 140,
        // only difference
        columns: [ {header: "Graph Targets", width: 1.0, dataIndex: "label"} ],
        listeners: {
            contextmenu: this.targetContextMenu,
            afterrender: this.targetChanged,
            selectionchange: this.targetChanged,
            dblclick: function (targetList, index, node, e) {
                targetList.select(index);
                this.editTarget();
            },
            scope: this
        }
    });

    var targetsPanel = new Ext.Panel({
        region: 'center',
        width: 400,
        height: 200,
        layout: 'fit',
        items: this.targetList
    });


    var buttonPanel = new Ext.Panel({
        region: 'east',
        width: 100,
        baseCls: 'x-window-mc',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: { xtype: 'button', disabled: true },
        items: [
            {
                text: 'Add',
                handler: this.addTarget.createDelegate(this),
                disabled: false
            }, {
                text: 'Edit',
                id: 'editTargetButton',
                handler: this.editTarget.createDelegate(this)
            }, {
                text: 'Remove',
                id: 'removeTargetButton',
                handler: this.removeTarget.createDelegate(this)
            }, {
                text: 'Move',
                id: 'moveButton',
                menuAlign: 'tr-tl',
                menu: {
                    subMenuAlign: 'tr-tl',
                    defaults: {
                        defaultAlign: 'tr-tl'
                    },
                    items: [
                        { text: 'Move Up', handler: this.moveTargetUp.createDelegate(this) },
                        { text: 'Move Down', handler: this.moveTargetDown.createDelegate(this) },
                        { text: 'Swap', handler: this.swapTargets.createDelegate(this), id: 'menuSwapTargets' }
                    ]
                }
            }, {
                text: 'Apply Function',
                id: 'applyFunctionButton',
                menuAlign: 'tr-tl',
                menu: {
                    subMenuAlign: 'tr-tl',
                    defaults: {
                        defaultAlign: 'tr-tl'
                    },
                    items: createFunctionsMenu()
                }
            }, {
                text: 'Undo Function',
                handler: this.removeOuterCall.createDelegate(this),
                id: 'undoFunctionButton'
            }
        ]
    });

    this.window = new Ext.Window({
        title: "Graph Data",
        height: 200,
        width: 600,
        closeAction: 'hide',
        layout: 'border',
        items: [
            targetsPanel,
            buttonPanel
        ],
        listeners: {
            afterrender: function () {
                if (_this.targetList.getNodes().length > 0) {
                    _this.targetList.select(0);
                }
            }
        }
    });
    return this.window;
};