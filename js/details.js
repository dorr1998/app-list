$(document).ready(function() {
  // 获取地址栏参数
  var appId = getSearch("appId")
  console.log(appId)

  $.ajax({
    type: "get",
    url: "/appList/web/app/findAppList",
    data: {
      id: appId,
      page: 1, // 页码
      pageSize: 10
    },
    dataType: "json",
    success: function(info) {
      $(".container .pic img")[0].src = info.data.rows[0].appImage
      $(".container .app-name")[0].innerText = info.data.rows[0].appName
    }
  })
  $.ajax({
    url: "/appList/web/app/findAppDetail",
    type: "get",
    dataType: "json",
    data: {
      appId: appId
    },
    success: function(info) {
      info.data[0].createTime = dateFormat(parseInt(info.data[0].createTime))
      // info.data[0]
      var obj = {
        list: info.data[0]
      }
      var htmlStr = template("tpl", obj)
      $("section .container .form").html(htmlStr)
      getVersion()
    }
  })

  // 根据接口返回数据拼接版本号
  function getVersion() {
    $.ajax({
      url: "/appList/web/app/findAppDetail",
      type: "get",
      dataType: "json",
      data: {
        appId: appId
      },
      success: function(info) {
        var arr = info.data
        var strAll = ""
        for (var i = 0; i < arr.length; i++) {
          arr[i].createTime = dateFormat(parseInt(arr[i].createTime))
          var str =
            '<option value="' +
            arr[i].appUrl +
            '" data-id="' +
            arr[i].id +
            '" data-size="' +
            arr[i].appSize +
            '" data-date="' +
            arr[i].createTime +
            '" data-desc="' +
            arr[i].versionInfo +
            '" data-url="' +
            arr[i].appUrl +
            '" ' +
            (i === 0 ? "selected" : "") +
            ">" +
            arr[i].versionCode +
            "</option>"
          strAll += str
        }
        $("#version").html(strAll)
        // 根据版本号选择的多级联动
        $("select[name='version']").on("change", function() {
          $(".form .size").html(
            $(this)
              .find("option:selected")
              .data("size")
          )
          var $url = $(this)
            .find("option:selected")
            .data("url")
          // $(".form .download").href = $url
          $(".form .date").html(
            $(this)
              .find("option:selected")
              .data("date")
          )
          $(".form .descript").html(
            $(this)
              .find("option:selected")
              .data("desc")
          )
          $(".form .qrcode").val(
            $(this)
              .find("option:selected")
              .data("url")
          )
          // 立即下载
          $("form .download").click(function() {
            window.open($url)
          })
          // 二维码
          changeQr()
        })
        changeQr(arr[0].appUrl)
      }
    })
  } // getVersion

  function changeQr(url) {
    var qrUrl = url || $(".form .qrcode").val()
    $("#qrcode").empty()
    var qrcode = new QRCode("qrcode", {
      text: qrUrl,
      width: 100,
      height: 100,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    })
  }
})

// 获取地址栏参数
function getSearch(k) {
  var search = decodeURI(location.search)
  search = search.slice(1)
  var arr = search.split("&")
  var obj = {}
  arr.forEach(function(v, i) {
    var key = v.split("=")[0]
    var value = v.split("=")[1]
    obj[key] = value
  })
  return obj[k]
}

// 传入时间戳，返回 yyyy-MM-dd hh:mm:ss的格式
function dateFormat(time) {
  if (time == "0") {
    return ""
  }
  var time = new Date(time)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  var hour = time.getHours()
  var minutes = time.getMinutes()
  var seconds = time.getSeconds()

  return (
    year +
    "-" +
    zeroFill(month) +
    "-" +
    zeroFill(day) +
    " " +
    zeroFill(hour) +
    ":" +
    zeroFill(minutes) +
    ":" +
    zeroFill(seconds)
  )
}

function zeroFill(t) {
  if (t < 10) {
    return "0" + t
  } else {
    return t
  }
}
