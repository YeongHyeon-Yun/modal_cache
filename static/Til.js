$(document).ready(function () {
    getCards();
    showReviews();
    showLocation();
});

window.addEventListener('load', () => {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(showLocation, showError)
    }
})

var myModal = document.getElementById('myModal')

myModal.addEventListener('showns.bs.modal', function () {
    myModal.focus()
})


function getCards() {
    $.ajax({
        type: "GET",
        url: `/sorted`,
        data: {},
        success: function (response) {
            velogCards = response['velogcards']
            tistoryCards = response['tistorycards']
            $("#velog-box").empty();
            velogCards.forEach(function (velogCards) {
                makeVelogCard(velogCards);
                makeModal(velogCards);

            });

            $("#tistory-box").empty();
            tistoryCards.forEach(function (tistoryCards) {
                makeTistoryCard(tistoryCards);
                makeModal(tistoryCards);
            });

        }
    })
}

function test() {
  console.log("before");
  setTimeout(() => console.log("after"), 10000);
  console.log("after");
}

function velClick() {
    if ($("#velog-box").is(":visible")) {
        $("#velog-box").hide();
    } else {
        $("#velog-box").show();
    }
}


function tisClick() {
    if ($("#tistory-box").is(":visible")) {
        $("#tistory-box").hide();
    } else {
        $("#tistory-box").show();
    }
}


function showLocation(position) {   // 위치 정보 호출 성공시
    let latitude = position.coords.latitude   // 위도
    let longitude = position.coords.longitude  // 경도
    let apiKey = '97329c7c315676010b49d9b9dc79185c';
    let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude
        + "&lon=" + longitude
        + "&appid=" + apiKey;
    let options = {method: 'GET'}
    $.ajax(weatherUrl, options).then((response) => {
        console.log(response) // jSON 타입 위치 및 날씨 정보 로그 확인
        let icon = response.weather[0].icon
        let iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
        let img = document.querySelector("#wicon")
        img.src = iconUrl
        let w_icon_id = icon[0] + icon[1];
        if (w_icon_id == '01') {
            $("#weather_comment").text("맑은 하늘이네요! 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '02') {
            $("#weather_comment").text("약간 구름낀 날씨네요! 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '03') {
            $("#weather_comment").text("구름이 조금 더 꼈지만 코딩 공부하기 좋은 날씨네요!♥");
        } else if (w_icon_id == '04') {
            $("#weather_comment").text("구름이 좀 끼고 우중충하니까 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '09') {
            $("#weather_comment").text("소나기가 내리는 지금은 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '10') {
            $("#weather_comment").text("비가 와요! 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '11') {
            $("#weather_comment").text("천둥 번개가 치는 지금은?! 코딩공부하기 좋은 날~♥");
        } else if (w_icon_id == '13') {
            $("#weather_comment").text("눈이 와요~! 코딩공부하기 좋은 날~♥");
        } else
            $("#weather_comment").text("안개가 낀 날씨도 역시! 코딩공부하기 좋은 날~♥");

        $("#tempr").text(Math.round(parseFloat((response.main.temp - 273))) + '˚'); // 현재 온도
    }).catch((error) => {
        console.log(error)
    })
}

function showError(position) {
    // 실패 했을 때 처리
    alert("위치 정보를 얻을 수 없습니다.")
}


function makeVelogCard(cards) {
    let tempHtml = `<div class="card hotboxs" xmlns="http://www.w3.org/1999/html">
                        <img class="card-img-top card-rows" height="200" src="${cards['pic']}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${cards['name']}</h5>
                            <p class="card-text">${cards['url']}</p>
                            <div class="d-flex justify-content-center">
                            <a href="#" onclick="window.open('${cards['url']}', 'new')" class="btn btn-warning st">바로가기</a>
                            <button type="button" data-toggle="modal" data-target="#modal${cards['id']}" className="btn btn-warning st">리뷰달기</button>

                            <a href="/review/${cards['id']}" onclick="showReviews()" class="btn btn-warning st">리뷰보기</a>

                        </div>
                        </div>
                    </div>`
    $("#velog-box").append(tempHtml);
}

// <button type="button" href="/review/{{ word.word }}?status_give=old">{{ word.word }}  class="btn btn-warning st">리뷰달기</button>

// $('#myModal').on('show.bs.modal', function (event) {
//     let bookId = $(event.relatedTarget).data('test')
//     console.log(bookId)
//     // $(this).find('.modal-body input').val(bookId)
// })

function makeTistoryCard(cards) {
    let tempHtml = `<div class="card hotboxs">
                        <img class="card-img-top card-rows" height="200" src="${cards['pic']}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${cards['name']}</h5>
                            <p class="card-text">${cards['url']}</p>
                            <div class="d-flex justify-content-center">
                            <a href="#" onclick="window.open('${cards['url']}', 'new')" class="btn btn-warning st">바로가기</a>
<!--                            <button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-warning st">리뷰달기</button>-->
                        </div>
                        </div>
                    </div>`
    $("#tistory-box").append(tempHtml);
}

//검색
function search() {
    let txt = $("#searchtxt").val()
    $.ajax({
        type: "GET",
        url: "/search?txt=" + txt,
        data: {},
        success: function (response) {
            $("#flush").empty();
            let tempHtml = ``
            if (txt == response.name) {
                let tempHtml = `<div class="card hotboxs">
                        <img class="card-img-top card-rows" height="200" src="${response['pic']}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${response['name']}</h5>
                            <p class="card-text">${response['url']}</p>
                            <div class="d-flex justify-content-center">
                            <a href="${response['url']}" class="btn btn-warning st">바로가기</a>
<!--                            <button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-warning st">리뷰달기</button>-->
                        </div>
                        </div>
                    </div>
                    <button onclick="window.location.href = '/'" type="button" class="btn btn-primary ">메인으로</button>`
                $("#flush").append(tempHtml);
            } else {
                let tempHtml = `<button onclick="window.location.href = '/'" type="button" class="btn btn-primary">메인으로</button>`
                $("#flush").append(tempHtml);
            }
        }
    });
}

function makeModal(info) {
    console.log(info['idx'], info['name'])
    temp_html = `<div class="modal fade" id="modal${info['id']}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">${info['idx']} 이런 생각들을 했어요!</h5>
                                    </div>
                                    <div class="modal-body">
                                        <table class="table">
                                          <thead>
                                            <tr>
                                              <th scope="col">#</th>
                                              <th scope="col">작성자 추후에 ID로 변경</th>
                                              <th scope="col">한 줄 리뷰</th>
                                              <th scope="col">삭제</th>
                                            </tr>
                                          </thead>
                                          <tbody class="test" id="table${info['id']}">
                                          
                                          </tbody>
                                        </table>
                                    </div>
                                    
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">한 줄 리뷰 작성하기</h5>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <div class="form-group">
                                                <label for="recipient-name" class="col-form-label">작성자:</label>
                                                <input type="text" class="form-control" id="writer${info['id']}">
                                            </div>
                                            <div class="form-group">
                                                <label for="message-text" class="col-form-label">리뷰를 달아주세요:</label>
                                                <textarea class="form-control" id="reviewcontent${info['id']}"></textarea>
                                            </div>
                                        </form>
                    
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
                                        <button type="button" onclick="postReview('${info['id']}')" class="btn btn-warning">작성 완료</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
    $("#set_modal").append(temp_html)
}


// 모달 리뷰 저장
// 코드 기여도 곽영호 튜터님 +++++ 찬홍 ++++ 지희 +++ 준호 ++ 나
function postReview(idx) {
    let writer = $('#writer' + idx).val()
    let review_content = $('#reviewcontent' + idx).val()
    console.log(idx, writer, review_content)
    $.ajax({
        type: "POST",
        url: "/review",
        data: {owner_give: idx, user_give: writer, review_give: review_content},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();

        }
    })
}

// showReviews 이부분이 안됩니다 일반 새로고침과 강력한 새로고침 캐시초기화

function showReviews() {
            $.ajax({
                type: "GET",
                url: "/memo",
                data: {},
                success: function (response) {
                    console.log('반응')
                    let reviews = response['all_reviews'];
                    // for(i=0; i<3; i++) {
                    //     let temp_html = `<tr>
                    //                            <th>${i+1}</th>
                    //                            <td>${reviews[i]['writer']}</td>
                    //                            <td>${reviews[i]['reviewcontent']}</td>
                    //                            <td><button type="button" class="btn btn-danger">삭제</button></td>
                    //                       </tr>`
                    //     $('#table123').append(temp_html)
                    // }
                     let temp_html = `<tr>
                                           <th>123213</th>
                                           <td>1413412</td>
                                           <td>5125125</td>
                                           <td><button type="button" class="btn btn-danger">삭제</button></td>
                                      </tr>
                                      <tr>
                                           <th>123213</th>
                                           <td>1413412</td>
                                           <td>5125125</td>
                                           <td><button type="button" class="btn btn-danger">삭제</button></td>
                                      </tr>`
                    $('#table123').append(temp_html)
                }
            })
        }


// 모달창에 리뷰 띄워 주기




            // for (let i = 0; i < memos.length; i++) {
            //     let writer = memos[i]['writer']
            //     let reviewcontent = memos[i]['reviewcontent']
            //     // let url = articles[i]['url']
            //     let temp_html = `<tr>
            //           <th scope="row">${index + 1}</th>
            //           <td>${writer}<td>
            //           <td>${reviewcontent}</td>
            //           <td><button type="button" class="btn btn-danger">삭제</button></td>
            //           </tr>`
            //     $('#table-box' + memos[i]['owner']).append(temp_html)
            // }

function getTarget(name) {

    alert(name)
    // $.ajax({
    //     type: "POST",
    //     url: "/review",
    //     data: {target_give: name},
    //     success: function (response) {
    //     }
    // })
}

function reset() {
    location.reload();
}