const baseUrl = 'http://ajax.frontend.itheima.net/'

//每次走ajax的时候,都会先执行一次这个函数
$.ajaxPrefilter(function (options) {
    options.url = baseUrl + options.url
    console.log(options.url);

    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
     //无论ajax请求是否成功都会调用这个函数
    options.complete = function (res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //清除token,也就是消除了权限
            localStorage.removeItem("token")
            //强制跳转登录界面
            location.href = '/login.html'

        }
    }
})