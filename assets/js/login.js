$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').click(function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // console.log(layui);
    //从layui中提取form
    const { form, layer } = layui;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            //通过形参拿到重复密码中的值
            //value和上面的输入密码进行比较,若不同则返回提示
            //这行代码获取到了输入密码框的值
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '写错了'
            }
        }
    })
    //监听表单的注册事件
    $('.reg-box').submit(function (e) {
        // 阻止提交按钮的默认时间
        e.preventDefault()
        $.ajax({
            url: 'api/reguser',
            method: 'POST',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success(res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '注册失败');
                    return
                } else {
                    layer.msg('注册成功');
                    $('#link_login').click();
                }
            }
        })
    })
    $('#login_form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'api/login',
            method: 'POST',
            //下面这行代码是快速获取到表单内的所有数据
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message || '登陆失败')
                }
                layer.msg('登陆成功')
                //把res.token的值.记录下来,以token的命名记录在浏览器内
                localStorage.setItem('token', res.token)

                location.href = '/index.html'
            }
        })
    })
})