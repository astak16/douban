


$('header > div').on('click', function () {
    // console.log($(this).index())
    $(this).addClass('active').siblings().removeClass('active')
    $('main section').eq($(this).index()).fadeIn().siblings().hide()
})

var isLoading = false
// var isFinish = false
start()

function start(){
    getData(function(data){
        render(data)
    })
}
$('main').scroll(function(){
    var clock
    if (clock) {
        clearTimeout(clock)
    }
    clock = setTimeout(function () {
        var $main = $('main')
        if ($('#top250').find('.container').height() - 10 <= $main.height() + $main.scrollTop()) {
            start()
        }
    }, 300)

})

function getData(callback){
    var index = 0
    if (isLoading) return
    isLoading = true
    $("#top250").find('.loading').show()
    $.ajax({
        url: 'https://api.douban.com/v2/movie/top250',
        type: 'get',
        data: {
            start: index || 0,
            count: 20
        },
        dataType: 'jsonp'
    }).done(function (ret) {
        // console.log(ret)
        index += 20;
        // if(index >= ret.total){
        //     isFinish = true
        // }
        callback&&callback(ret)
        // _this.render(ret)
    }).fail(function () {
        console.log('error')
    }).always(function () {
        isLoading = false
        $("#top250").find('.loading').hide()
    })
}

function render(data){
    var template
    data.subjects.forEach(function (movie) {
        template = `
                <div class="item">
                    <a href="#">
                    <div class="cover">
                        <img src="http://img3.doubanio.com/view/photo/s_ratio_poster/public/p494268647.jpg" alt="">
                    </div>
                    <div class="detail">
                        <h2>霸王别姬</h2>
                        <div class="extra">
                            <span class="score">9.3</span>分 / <span class="collect"></span>收藏
                        </div>
                        <div class="extra"><span class="year"></span> / <span class="type"></span> </div>
                        <div class="extra">导演：<span class="director"></span></div>
                        <div class="extra">主演：<span class="actor"></span></div>
                    </div>
                    </a>
                </div>`

        $node = $(template)
        $node.find('.cover img').attr('src', movie.images.small)
        $node.find('.detail h2').text(movie.title)
        $node.find('.extra .year').text(movie.year)
        $node.find('.extra .type').text(movie.genres.join(' / '))
        $node.find('.extra .score').text(movie.rating.average)
        $node.find('.extra .collect').text(movie.collect_count)
        $node.find('.extra .director').text(director(movie.directors))
        $node.find('.extra .actor').text(actor(movie.casts))

        $("#top250").find('.container').append($node)
    })
}

    function director(item){
        var xxx = []
        item.forEach(function (line) {
            xxx.push(line.name)
        })
        return xxx.join('、');
    }
    function actor(item){
        var ddd = []
        item.forEach(function (line) {
            ddd.push(line.name)
        })
        return ddd.join('、');
    }
