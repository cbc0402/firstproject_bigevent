$(function () {
    //定义layer就是layui里面的layer方法
    var layer = layui.layer
    //获取数据
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.msg(res.message || '获取资源失败')
                    return
                }

                const htmlString = template('tpl-table', res)
                $('tbody').html(htmlString)
            }
        })
    }

    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            // 设置弹窗的宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html() //.html() 是获取,如果括号内添加'',会变成空

        })
    })


    //动态创建出来的表单只能通过代理,添加事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                //这里重新获取一次列表
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })
    //这个就是inex
    var indexEdit = null
    //获取form属性.就是layui的form方法
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            // 设置弹窗的宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() //.html() 是获取,如果括号内添加'',会变成空

        })
        //获取数据,填充点击编辑后的表单
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: 'my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                console.log(res);
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)   //关闭编辑
                initArtCateList()  //重新获取列表
            }

        })
    })

    //通过代理为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        //id就是根据后台返回的数据中的id值赋值给了自定义属性data-id
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: 'my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})