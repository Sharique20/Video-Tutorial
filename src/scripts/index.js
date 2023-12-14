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

    $("#passwordContainer").hide();
    $("#signin").click(() => {
        LoadPage('user-login.html');
    })
    var email = "";
    $("#btnGetStarted").click(() => {
        email = $("#Email").val();
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:7700/getusers",
            success: (users) => {
                var user = users.find(item => item.Email === email);
                if (user) {
                    if (user.Email === email) {
                        $("#passwordContainer").show();
                        $("#emailContainer").hide();
                        $("#error").hide();
                    }
                } else {
                    $("#error").html(`<div class="mt-4">User doesn't Exists - <button class="btn btn-light" id="lnkRegister">Register</button></div>`);
                }
            }
        })
    })
    $("#btnSignIn").click(() => {
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:7700/getusers",
            success: (users) => {
                var user = users.find(item => item.Email === email);
                if (user) {
                    if (user.Password === $("#Password").val()) {
                        alert("Login Success");
                        $("#passwordContainer").hide();
                        $("#signin").html(`${user.UserName} - Signout`);
                    } else {
                        alert("Invalid Password");
                    }
                }
            }
        })
    })
    $(document).on("click", "#lnkRegister", () => {
        LoadPage('user-register.html');
        $("#error").hide();
        $("#emailContainer").hide();
    })
    $(document).on("click", "#btnRegister", () => {
        var user = {
            "UserId": $("#UserId").val(),
            "UserName": $("#UserName").val(),
            "Password": $("#RPassword").val(),
            "Email": $("#REmail").val(),
            "Mobile": $("#Mobile").val(),
        }
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:7700/adduser",
            data: user
        })
       alert('Registered Successfully..');
        LoadPage('user-login.html');
    })

    function LoadVideos() {
        $("section").html("");
        $.ajax({
            method: "get",
            url : "http://127.0.0.1:7700/getvideos",
            success: (videos) => {
                videos.map(video=>{
                    $(`
                    <div class="box">
                        <iframe height="200" src=${video.Url} class="card-img-top"></iframe>
                        <div>
                           ${video.Title}
                            </div>
                        </div>
                    `).appendTo("section");
                })
            }
        })
    }

    $(document).on("click", "#btnLogin", ()=>{
        $.ajax({
             method:"get",
             url: "http://127.0.0.1:7700/getusers",
             success: (users) => {
                var user = users.find(item => item.UserId==$("#LoginUserId").val());
                if(user.UserId==$("#LoginUserId").val() && user.Password==$("#LoginPassword").val())
                {
                    // create a cookies and store user detail in cookie
                  LoadVideos();
                  $("#signin").html(`${user.UserName}<button id="btnSignout" class="btn btn-warning">Signout</button>`)
                } else {
                    //use multilevel if condition for validation
                    alert(`Invalid Username or Password`);
                }
             }
        })
    })

    $(document).on("click", "#btnSignout", ()=>{
        location.reload();
        //delete cookie and navigate to home page or login page
    })
})