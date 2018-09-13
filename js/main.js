var app = {
    init: function () {
        this.$tabs = $('header > div')
        this.$panels = $('main section')
        this.bind()
        top250.init()
        usBox.init()
        search.init()
    },
    bind: function () {
        var _this = this
        this.$tabs.on('click', function () {
            // console.log($(this).index())
            $(this).addClass('active').siblings().removeClass('active')
            _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
        })
    }
}
var top250 = {
    init: function(){
        this.$section = $('#top250');
        this.$main = $('main')
        this.$container = this.$section.find('.container')
        this.$loading = this.$section.find('.loading')

        this.index = 0
        this.clock = null
        this.isLoading = false
        this.isFinish = false
        this.bind()
        this.start()
    },
    bind: function(){
        // console.log(this.$container)
        var _this = this
        // /*函数节流，当一个东西频繁执行的时候，我不想让它一直执行，只想让它执行最后一次，
        // 定义 clock ，刚开始的时候没有值，if 里面不会执行，会执行下面的 setTimeout，
        // 如果在 300毫秒以内，又去执行 setTimeout ，clock 就有值了，会执行 if 里面的 clearTimeout，
        // 就会重新开始计算时间，直到最后一次，后面不在有新的请求，才把 setTimeout 执行完，
        // 所以是以最后一次为准
        // */
        this.$main.scroll(function(){


            if (_this.clock) {
                clearTimeout(_this.clock)
            }
            _this.clock = setTimeout(function () {
                if (_this.isToBottom()) {
                    _this.start()
                }
            }, 300)
        })
    },
    start: function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData:function(callback){
        var _this = this
        console.log(this.isFinish)
        // if(this.isFinish) return
        if (this.isLoading) return
        this.isLoading = true
        this.$loading.show()
        $.ajax({
            url: 'https://api.douban.com/v2/movie/top250',
            type: 'get',
            data: {
                start: _this.index || 0,
                count: 20
            },
            dataType: 'jsonp'
        }).done(function (ret) {
            // console.log(ret)
            _this.index += 20;
            console.log(2)
            console.log(ret)
            if(_this.index >= ret.total){
                _this.isFinish = true
            }
            callback&&callback(ret)
            // _this.render(ret)
        }).fail(function () {
            console.log('error')
        }).always(function () {
            _this.isLoading = false
            _this.$loading.hide()
        })
    },
    render:function(data){
        var _this = this
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

            _this.$node = $(template)
            _this.$node.find('.cover img').attr('src', movie.images.small)
            _this.$node.find('.detail h2').text(movie.title)
            _this.$node.find('.extra .year').text(movie.year)
            _this.$node.find('.extra .type').text(movie.genres.join(' / '))
            _this.$node.find('.extra .score').text(movie.rating.average)
            _this.$node.find('.extra .collect').text(movie.collect_count)
            _this.$node.find('.extra .director').text(_this.director(movie.directors))
            _this.$node.find('.extra .actor').text(_this.actor(movie.casts))

            _this.$container.append(_this.$node)
        })
    },
    isToBottom:function(){
        // console.log(this.$container.height())
        // console.log(this.$section.height())
        // console.log(this.$section.scrollTop())
        return this.$container.height() - 10 <= this.$section.height() + this.$section.scrollTop()
    },
    director:function(item){
        var xxx = []
        item.forEach(function (line) {
            xxx.push(line.name)
        })
        return xxx.join('、');
    },
    actor:function(item){
        var ddd = []
        item.forEach(function (line) {
            ddd.push(line.name)
        })
        return ddd.join('、');
    }
}
var usBox = {
    init:function(){
        this.$section = $('#beimei')
        this.$loading = this.$section.find('.loading')
        this.$beimeiContainer = this.$section.find('.beimeiContainer')
        this.start()
    },
    start:function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData:function(callback){
        var _this = this
        if (this.isLoading) return
        this.isLoading = true
        this.$loading.show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/us_box',
            // type: 'get',
            dataType: 'jsonp'
        }).done(function (ret) {
            callback&&callback(ret)

            // _this.render(ret)
        }).fail(function () {
            console.log('error')
        }).always(function () {
            _this.$loading.hide()
        })
    },
    render:function(data){
        var _this = this
        // console.log(data)
        var template
        data.subjects.forEach(function (movie) {
            movie = movie.subject
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

            _this.$node = $(template)
            // console.log()
            var img = movie.images.small
            var imgs = img.replace(/\/(.*?)\./,'//img3.')
            // console.log(imgs)

            _this.$node.find('.cover img').attr('src', imgs)
            _this.$node.find('.detail h2').text(movie.title)
            _this.$node.find('.extra .year').text(movie.year)
            _this.$node.find('.extra .type').text(movie.genres.join(' / '))
            _this.$node.find('.extra .score').text(movie.rating.average)
            _this.$node.find('.extra .collect').text(movie.collect_count)
            _this.$node.find('.extra .director').text(_this.director(movie.directors))
            _this.$node.find('.extra .actor').text(_this.actor(movie.casts))

            _this.$beimeiContainer.append(_this.$node)
        })
    },
    director:function(item){
        var xxx = []
        item.forEach(function (line) {
            xxx.push(line.name)
        })
        return xxx.join('、');
    },
    actor:function(item){
        var ddd = []
        item.forEach(function (line) {
            ddd.push(line.name)
        })
        return ddd.join('、');
    }
}
var search = {
    init:function(){
        this.$section = $('#search')
        this.$loading = this.$section.find('.loading')
        this.$searchContainer = this.$section.find('.searchContainer')
        this.keyword = ''

        this.bind()
        this.start()

    },
    bind:function () {
        var _this = this
        this.$section.find('.button').on('click',function(){

            _this.keyword = _this.$section.find('input').val()
            _this.start()
        })
    },
    start:function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData:function(callback){
        var _this = this
        // if (this.isLoading) return
        // this.isLoading = true
        this.$loading.show()
        $.ajax({
            url: 'https://api.douban.com/v2/movie/search',
            type: 'get',
            data:{
                q:_this.keyword
            },
            dataType: 'jsonp'
        }).done(function (ret) {
            callback&&callback(ret)
            // _this.render(ret)
        }).fail(function () {
            console.log('error')
        }).always(function () {
            _this.$loading.hide()
        })
    },
    render:function(data){
        var _this = this
        // console.log('data')
        // console.log(data)
        var template
        data.subjects.forEach(function (movie) {
            // movie = movie.subject
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

            _this.$node = $(template)
            // console.log(movie)
            _this.$node.find('.cover img').attr('src', movie.images.small)
            _this.$node.find('.detail h2').text(movie.title)
            _this.$node.find('.extra .year').text(movie.year)
            _this.$node.find('.extra .type').text(movie.genres.join(' / '))
            _this.$node.find('.extra .score').text(movie.rating.average)
            _this.$node.find('.extra .collect').text(movie.collect_count)
            _this.$node.find('.extra .director').text(_this.director(movie.directors))
            _this.$node.find('.extra .actor').text(_this.actor(movie.casts))

            _this.$searchContainer.append(_this.$node)
        })
    },
    director:function(item){
        var xxx = []
        item.forEach(function (line) {
            xxx.push(line.name)
        })
        return xxx.join('、');
    },
    actor:function(item){
        var ddd = []
        item.forEach(function (line) {
            ddd.push(line.name)
        })
        return ddd.join('、');
    }
}

app.init()