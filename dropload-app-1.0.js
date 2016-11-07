/**
 * Created by huangjiajia on 2016/11/4.
 * Description: web app dropLoad
 */
(function ($, window) {
    var DropLoad = function (element,options, fn) {
        this.$dropLoad   = $(element);
        this.options     = options;
        this.hasData     = true;
        this.isloading   = false;

        // 初始化
        this.init(options);

        // load事件
        this.bindLoad();

        return this;
    };

    DropLoad.prototype = {};

    DropLoad.DEFAULT = {
        domUp : {                                                              // 上方DOM
            domClass    : 'dropload-up',
            refreshHtml : '<div class="dropload-refresh">↓下拉刷新</div>',
            updateHtml  : '<div class="dropload-update">↑释放更新</div>',
            loadHtml    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown : {                                                             // 下方DOM
            domClass    : 'dropload-down',
            refreshHtml : '<div class="dropload-refresh">↑上拉加载更多</div>',
            loadHtml    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            noDataHtml  : '<div class="dropload-noData">暂无数据</div>'
        },
        autoLoad   : false,                                                     // 自动加载
        loadUpFn   : '',                                                        // 上方function
        loadDownFn : ''                                                         // 下方function
    };

    DropLoad.prototype.init = function (options) {
        var height       = this.$dropLoad.height(),
            scrollHeight = this.$dropLoad[0].scrollHeight,
            html         = '';

        this.options = $.extend(true, {}, DropLoad.DEFAULT, options);

        // 判断如果没有滚动条，不进行初始化
        if(height <= scrollHeight) {
            this.$dropLoad.css('overflow-y','auto');

            if(typeof (this.options.loadDownFn) == 'function') {
                html  = '<div class="' + this.options.domDown.domClass + '">';
                html += this.options.domDown.refreshHtml;
                html += '</div>';

                this.$dropLoad.append(html);
                this.$domLoad = this.$dropLoad.find('.' + this.options.domDown.domClass);

                console.log(this.$domLoad, '.' + this.options.domDown.domClass)
            }
        }
    };

    DropLoad.prototype.bindLoad = function () {
        var $dropLoad = this.$dropLoad,
            _this     = this;

        $dropLoad.scroll(function () {
            var $this = $(this);

            // 获取指定元素的滚动条高度
            var scrollTop    = $this.scrollTop(),
                height       = $this.height(),
                scrollHeight = $this[0].scrollHeight;

            // 滚动滚动到底部
            if(scrollTop + height >= scrollHeight - 10 && !_this.isloading && _this.hasData) {

                // 调用dropLoad方法
                loadDownFunc(_this);
            }
        })
    };

    DropLoad.prototype.resetDomHtml = function () {
        this.isloading = false;
        if(this.hasData) {
            this.$domLoad.html(this.options.domDown.loadHtml);
        }
        else {
            this.$domLoad.html(this.options.domDown.noDataHtml);
        }

    };

    DropLoad.prototype.noData = function (type) {
        this.hasData = type;
        console.log(this.hasData)
    };

    function loadDownFunc(dom) {
        var _this = dom;

        _this.isloading = true;
        _this.$domLoad.html(_this.options.domDown.loadHtml);

        _this.options.loadDownFn && _this.options.loadDownFn(_this);
    }

    // 扩展到jquery上
    $.fn.dropload = function (options, fn) {
        return new DropLoad(this, options, fn);
    }

})(jQuery, window);