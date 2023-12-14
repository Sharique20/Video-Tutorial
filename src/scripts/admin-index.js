function LoadPage(pageName) {
    $.ajax({
        method: "get",
        url: pageName,
        success: (response) => {
            $("section").html(response);
        }
    })
}

$(function () {
    $("#btnSignIn").click(() => {
        LoadPage("user-login.html");
        //$("#lblTitle").html("Admin Login");
    })

    function LoadVideos() {
        $("section").html("");
        $.ajax({
            method: 'get',
            url: "http://127.0.0.1:7700/getvideos",
            success: (videos) => {
                videos.map(video => {
                    $(`<tr>
                            <td>${video.Title}</td>
                            <td> <iframe src=${video.Url} width="200" height="100"> </iframe> </td>
                            <td> 
                                <button id="btnEdit" name=${video.VideoId} class="btn btn-warning bi bi-pen-fill"></button>
                                <button id="btnDelete" name=${video.VideoId}  class="btn btn-danger bi bi-trash-fill"></button>
                                </td>
                            </tr>`).appendTo("tbody");
                })
            }
        })
    }


    $(document).on("click", "#btnLogin", () => {
        $.ajax({
            method: 'get',
            url: 'http://127.0.0.1:7700/getadmin',
            success: (users) => {
                var user = users.find(admin => admin.UserId == $("#LoginUserId").val());
                if (user.UserId == $("#LoginUserId").val() && user.Password == $("#LoginPassword").val()) {
                    LoadPage('admin-dashboard.html');
                    LoadVideos();
                } else {
                    alert('Invalid Admin Details');
                }
            }
        })
    })

    function LoadCategories() {
        $.ajax({
            method: 'get',
            url: 'http://127.0.0.1:7700/getcategories',
            success: (categories) => {
                categories.map(category => {
                    $(`<option value=${category.CategoryId}>${category.CategoryName}</option>`).appendTo("#lstCategories");
                })
            }
        })
    }

    $(document).on("click", "#btnAddNew", () => {
        LoadPage('admin-add-video.html');
        LoadCategories();
    })

    $(document).on("click", "#btnAddVideo", () => {
        var video = {
            VideoId: $("#VideoId").val(),
            Title: $("#Title").val(),
            Url: $("#Url").val(),
            Likes: $("#Likes").val(),
            Views: $("#Views").val(),
            CategoryId: $("#lstCategories").val()
        };
        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1:7700/addvideo',
            data: video
        })
        alert('Video Added Successfully..');
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })

    var id;
    $(document).on("click", "#btnEdit", (e) => {
        LoadPage('admin-edit-video.html');
        LoadCategories();
        id = parseInt(e.target.name);
        $.ajax({
            method: 'get',
            url: `http://127.0.0.1:7700/getvideo/${id}`,
            success: (video) => {
                $("#VideoId").val(video[0].VideoId);
                $("#Title").val(video[0].Title);
                $("#Url").val(video[0].Url);
                $("#Likes").val(video[0].Likes);
                $("#Views").val(video[0].Views);
                $("#lstCategories").val(video[0].CategoryId);
            }
        })
    })

    $(document).on("click", "#btnCancel", () => {
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })

    $(document).on("click", "#btnUpdateVideo", () => {
        var video = {
            VideoId: $("#VideoId").val(),
            Title: $("#Title").val(),
            Url: $("#Url").val(),
            Likes: $("#Likes").val(),
            Views: $("#Views").val(),
            CategoryId: $("#lstCategories").val()
        };
        $.ajax({
            method: 'put',
            url: `http://127.0.0.1:7700/updatevideo/${id}`,
            data: video
        })
        alert("Video Updated..");
        LoadPage("admin-dashboard.html");
        LoadVideos();
    })

    $(document).on("click", "#btnDelete", (e) => {
        var id = parseInt(e.target.name);
        var flag = confirm("Are you sure?\nWant to Delete?");
        if (flag == true) {
            $.ajax({
                method: 'delete',
                url: `http://127.0.0.1:7700/deletevideo/${id}`
            })
            alert("video deleted successfully");
            LoadPage("admin-dashboard.html");
            LoadVideos();
        }
    })

})
