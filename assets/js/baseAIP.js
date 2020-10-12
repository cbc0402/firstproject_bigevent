const baseUrl = 'http://ajax.frontend.itheima.net/'

//每次走ajax的时候,都会先执行一次这个函数
$.ajaxPrefilter(function (options) {
    options.url = baseUrl + options.url
    console.log(options.url);
})