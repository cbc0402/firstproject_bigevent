$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    //调用
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: 'my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                //快速获取后台数据中,用户的账号 邮件等
                form.val('formUserInfo', res.data)
                console.log(res);
            }

        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })



    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '更新失败')
                    return
                }
                console.log('1111');
                layer.msg('更新用户信息成功')
                window.parent.getUserInfo();
                console.log(window.parent);
            }
        })
    })
})

