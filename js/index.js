$(function() {
  var currentPage = 1
  var pageSize = 9
  var pages = 1
  var isEnd = false
  if (
    navigator.userAgent.indexOf("Android") > -1 ||
    navigator.userAgent.indexOf("iPhone") > -1
  ) {
    getList()
    // 条件搜索
    $("#app-list .search_btn").click(function() {
      pages = 1
      $.ajax({
        type: "get",
        url: "/appList/web/app/findAppList",
        async: false,
        data: {
          appName: $.trim($(".search_input").val()),
          page: pages, // 页码
          pageSize: pageSize
        },
        dataType: "json",
        success: function(info) {
          var obj = {
            list: info.data.rows
          }
          // 模板引擎 template( 模板id, 数据对象)
          var htmlStr = template("tmp", obj)
          // 根据生成的htmlStr 模板, 渲染列表数据
          $("#app-list .app-list").html(htmlStr)
        }
      })
    })

    window.onscroll = function() {
      if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
        getList()
      }
    }
  } else {
    // 一进入页面,发送ajax, 请求列表数据,通过模板引擎,进行渲染
    render()
    // 条件搜索
    $("#app-list .search_btn").click(function() {
      render()
    })
  }
  function getList() {
    if (isEnd) {
      return
    }
    $.ajax({
      type: "get",
      url: "/appList/web/app/findAppList",
      async: false,
      data: {
        appName: $.trim($(".search_input").val()),
        page: pages, // 页码
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        var obj = {
          list: info.data.rows
        }
        // 模板引擎 template( 模板id, 数据对象)
        var htmlStr = template("tmp", obj)
        // 根据生成的htmlStr 模板, 渲染列表数据
        $("#app-list .app-list").append(htmlStr)
        if (info.data.rows.length < pageSize) {
          isEnd = true
        } else {
          pages++
        }
      }
    })
  }
  function render() {
    $.ajax({
      type: "get",
      url: "/appList/web/app/findAppList",
      data: {
        appName: $.trim($(".search_input").val()),
        page: currentPage, // 页码
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info)
        var obj = {
          list: info.data.rows
        }
        info.data.page = currentPage
        // 模板引擎 template( 模板id, 数据对象)
        var htmlStr = template("tmp", obj)
        // 根据生成的htmlStr 模板, 渲染列表数据
        $("#app-list .app-list").html(htmlStr)
        // 分页插件初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, // 指定bootstrap版本
          totalPages: Math.ceil(info.data.total / pageSize), // 总页数
          currentPage: info.data.page, // 当前页

          onPageClicked: function(event, originEvent, type, page) {
            currentPage = page // 更新当前页
            render() // 重新渲染
          }
        })
      }
    })
  }

  function getScrollTop() {
    var scrollTop = 0,
      bodyScrollTop = 0,
      documentScrollTop = 0
    if (document.body) {
      bodyScrollTop = document.body.scrollTop
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop
    }
    scrollTop =
      bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
    return scrollTop
  }
  function getScrollHeight() {
    var scrollHeight = 0,
      bodyScrollHeight = 0,
      documentScrollHeight = 0
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight
    }
    scrollHeight =
      bodyScrollHeight - documentScrollHeight > 0
        ? bodyScrollHeight
        : documentScrollHeight
    return scrollHeight
  }
  //浏览器视口的高度
  function getWindowHeight() {
    var windowHeight = 0
    if (document.compatMode == "CSS1Compat") {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }
    return windowHeight
  }
})
