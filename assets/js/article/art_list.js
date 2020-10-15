$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    initCate()

    //美化时间
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }




    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//默认页码为1
        pagesize: 2,//每页显示多少数据
        cate_id: '',//文章发布的id
        state: '',//文章发布的状态
    }





    initTable()   //调用,获取数据并且渲染,调用必须在q后面调用,否则失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            data: q,   //q就是上文的参数数据
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //让下拉菜单中的选项自动生成
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)  //[] 用来获取自定义的标签
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()

            }
        })
    }

    //绑定提交按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })



    function renderPage(total) {
        // console.log(total)   //toatal就是总共所有的数据量
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号 ,elem指容纳分页符的盒子
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum,  //默认选中的分页
            limits: [2, 3, 5, 10],  //选择每页显示多少条数据的下拉菜单选择项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            jump: function (obj, first) {  //当页码发生改变的时候会触发jump回调函数
                //initTable会触发jump回调函数.如果在下面再调用initTable(),会导致无限循环
                console.log(first);//只有initTable的时候,first的值是true,所以增加一个检测条件,
                q.pagenum = obj.curr
                //当下拉菜单选择一页显示x条数据的时候会触发jump函数回调,那么此时将obj的limit(一页显示x调数据)赋值给q再重新渲染即可
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        });
    }


    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-Id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            var len = $('.btn-delete').length;
            $.ajax({
                method: 'GET',
                url: 'my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //分析,如果当前页面无剩余数据的时候,页码-1,再进行渲染,所以要进行一次if判断
                    if (len == 1) { //判断页面有多少个删除按钮,当只有一个删除按钮的时候,走下面的代码
                        //页码至少为1,当1为1的时候,不能再-1,如果为其他,就把页码-1再进行渲染
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    //删除之后重新渲染
                    initTable()
                    //关闭窗口
                    layer.close(index) //index就是窗口
                }

            })
        })

    })


})


