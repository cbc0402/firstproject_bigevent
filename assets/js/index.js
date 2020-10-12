$(function () {
    getUserInfo();

    //退出事件
    $('#btnLogout').on('click', function () {
        //确认是否弹出
        layer.confirm('是否确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.清空本地的token
            localStorage.removeItem('token')
            //2.跳转login界面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})



function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        //headers 就是请求头的配置,只有写headers才能有权限读取到用户信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                console.log(res.message || '获取用户信息失败');
                return
            }

            //调用renderAvatar函数,并且传入用户数据
            renderAvatar(res.data)
        },
        //无论ajax请求是否成功都会调用这个
        // complete: function (res) {
        //     console.log(res.responseJSON);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         //清除token,也就是消除了权限
        //         localStorage.removeItem("token")
        //         //强制跳转登录界面
        //         location.href = '/login.html'

        //     }
        // }
    })
}
function renderAvatar(user) {
    //1. 先获取用户的名称  nickname是后台配置的用户昵称
    //username也是后台配置的用户id,优先配置用户昵称,如果没有就配置他的id
    var name = user.nickname || user.username
    //2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3. 渲染你用户的头像
    if (user.user_pic !== null) {
        //优先渲染用户的图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();

    } else {
        //无图片头像则渲染首个文字头像
        $('.layui-nav-img').hide();
        //toUpperCase();转换为大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}