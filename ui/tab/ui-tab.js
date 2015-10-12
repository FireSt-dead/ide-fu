var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ui;
(function (ui) {
    var TabBar = (function (_super) {
        __extends(TabBar, _super);
        function TabBar() {
            _super.apply(this, arguments);
        }
        TabBar.prototype.createdCallback = function () {
            var t = TabBar.document.getElementById("ui-tabbar");
            var clone = document.importNode(t.content, true);
            var shadow = this.createShadowRoot();
            shadow.appendChild(clone);
        };
        TabBar.prototype.select = function (item) {
            for (var i = 0; i < this.childNodes.length; i++) {
                var child = this.childNodes[i];
                if (child instanceof Tab) {
                    child.removeAttribute("selected");
                }
            }
            item.setAttribute("selected", true);
        };
        TabBar.document = document.currentScript.ownerDocument;
        TabBar = __decorate([
            component("ui-tabbar")
        ], TabBar);
        return TabBar;
    })(HTMLElement);
    var Tab = (function (_super) {
        __extends(Tab, _super);
        function Tab() {
            _super.apply(this, arguments);
        }
        Tab.prototype.createdCallback = function () {
            var t = Tab.document.getElementById("ui-tab");
            var clone = document.importNode(t.content, true);
            var shadow = this.createShadowRoot();
            shadow.appendChild(clone);
            this.addEventListener("click", function () {
                this.parentNode.select(this);
            });
        };
        Tab.document = document.currentScript.ownerDocument;
        Tab = __decorate([
            component("ui-tab")
        ], Tab);
        return Tab;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-tab.js.map