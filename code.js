var tabs = document.getElementById('tabs'),
    pages = tabs.getElementsByTagName('li'),
    page0 = document.getElementById('tab0'),
    page1 = document.getElementById('tab1');
pages[0].addEventListener('click', function () {
    noDisplay();
    pages[0].classList.add('tab_active');
    page0.classList.remove('display');
})
pages[1].addEventListener('click', function () {
    noDisplay();
    pages[1].classList.add('tab_active');
    page1.classList.remove('display');
})
function noDisplay() {
    for(var j = 0; j<pages.length;j++){
        var tab = document.getElementById('tab'+j);
        pages[j].classList.remove('tab_active');
        tab.classList.add('display');
    }
}
//////// to u góry jest naprawdę cholernie brzydkie ale jakoś dzała odpowiada za zmienianie zakładek na stronie bez przeładowania (później się tym zjamę)
var interFace = {
        startBt: document.getElementById('start'),
        stopBt: document.getElementById('stop'),
        resetartBt: document.getElementById('restart'),
        catchBt: document.getElementById('catch'),
        clearBoard: document.getElementById('clearBoard'),
        init : function () {
            this.startBt.addEventListener('click', function() { stopwatch.start() });
            this.stopBt.addEventListener('click', function() { stopwatch.stop() });
            this.resetartBt.addEventListener('click',function() { stopwatch.resetTime() });
            this.catchBt.addEventListener('click', function() { scoreboard.catchTime() });
            this.clearBoard.addEventListener('click', function() { scoreboard.clearScoreboard() });
        }
    },
    stopwatch = { //Obiekt odpowiadający za stoper i jego funkcje
        timer: document.getElementById('time'),
        s: 0,
        m: 0,
        h: 0,
        ms: 0,
        countStarted: false,
        clear: null,
        start : function () {
            var that = this;
            if (!this.countStarted) {
                this.clear = setInterval(function() { that.counter();}, 10);
                this.countStarted = true;
                interFace.stopBt.classList.remove('display');
                interFace.startBt.classList.add('display');
            };
        },
        stop : function () {
            if (this.countStarted) {
                clearInterval(this.clear);
                this.countStarted = false;
                interFace.stopBt.classList.add('display');
                interFace.startBt.classList.remove('display');
            }
        },
        resetTime: function () {
            this.s = 0;
            this.m = 0;
            this.h = 0;
            this.ms = 0;
            outlook.putInHtml(this.timer, outlook.timerView());
        },
        counter : function () {
            this.ms++;
            if (this.ms == 100) {
                this.s++;
                this.ms = 0;
            }
            if (this.s == 60) {
                this.m++;
                this.s = 0;
            }
            if (this.m == 60) {
                this.m = 0;
                this.h++;
            }
            outlook.putInHtml(this.timer, outlook.timerView());
        }
    },
    scoreboard = { //Obiekt odpowiadający za tablicę wyników
        timeList: document.getElementById('timeList'),
        clearScoreboard : function () {
            for(var i = 1; i<this.timeList.childNodes.length; i++){
                var li = this.timeList.childNodes[i],
                    deleteBt = li.childNodes[1];
                deleteBt.removeEventListener('click',this.deleteRecord);
            }
            this.timeList.innerHTML = '';
        },
        catchTime : function () {
            if(stopwatch.ms+stopwatch.s+stopwatch.m+stopwatch.h != 0) {
                var node = document.createTextNode(outlook.timerView()),
                    li = document.createElement('li'),
                    deleteBt = document.createElement('button');
                li.appendChild(node);
                li.appendChild(deleteBt);
                this.timeList.appendChild(li);
                deleteBt.addEventListener('click', this.deleteRecord);
            }
        },
        deleteRecord : function() {
            var that = this;
            this.removeEventListener('click', that.deleteRecord);//nie wiem jak uniknąć użycia tu scoreboard << już wiem hura ja :/
            var li = this.parentNode;
            li.parentNode.removeChild(li);
        }
    },
    outlook = { //Obiekt odpowiadający za wygląd stopera
        timerView : function () {
        return this.checkLength(stopwatch.h) + ':' + this.checkLength(stopwatch.m) + ':' + this.checkLength(stopwatch.s) + ':' + this.checkLength(stopwatch.ms);
        },
        putInHtml : function (wher, what) {
            wher.innerHTML = what;
        },
        checkLength : function (num) {
            return (num <= 9) ? '0' + num : num;
        }
    };
document.addEventListener('onload', interFace.init());
// Tu zaczynam pracę nad Minutnikiem
var interFaceStoper = {
    startBt: document.getElementById('startTimer'),
    resetBt: document.getElementById('resetTimer'),
    timeLoading: document.getElementById('timeLoad'),
    tabTime: document.getElementsByTagName('input'),
    init : function () {
        this.startBt.addEventListener('click', function () {
            stoper.start()});
        this.resetBt.addEventListener('click', function () {
            stoper.test();});
    }
},
    stoper = {
        h: 0,
        m: 0,
        s: 0,
        clear: null,
        start: function () {
            var time = this.getTime(),
                that = this;
            if(this.checkTime(time)) {
                this.h = time[0] || 0; 
                this.m = time[1] || 0;
                this.s = time[2] || 0;
                this.clear = setInterval( function () {that.counter();}, 1000)
            };
        },
        counter : function () {
            if(this.s == 0){
                if(this.m == 0){
                    if(this.h == 0){
                        console.log("koniec czasu");
                        clearInterval(this.clear);
                    } else {
                        this.h -= 1;
                        this.m += 59;
                        this.s += 59;
                    }
                } else {
                    this.m -= 1;
                    this.s += 59;
                }
            }
            
            this.test();
            this.s -= 1;
        },
        checkTime : function (el)  { //metoda sprawdza czy to co podał użytkownik jest poprawną liczbą i czy nie równa się zero
            var reg = /^\d+$/,
                marker = true,
                checkNum = 0;
            el.forEach(function(el,i){
                if(reg.test(el) || el == '') {
//                    el = +(el);
//                    checkNum += el;
                    console.log('liczba wczytana'+el);
                } else 
                    marker = false;
            })
            return (marker);
        },
        getTime : function () {            
            var time = [];
            for(var i = 0;i < interFaceStoper.tabTime.length;i++){
                time.push(interFaceStoper.tabTime[i].value);
                interFaceStoper.tabTime[i].value = '';
            }
            return time;
        },
        test : function () {
            console.log(this.h,this.m,this.s);
        }
    };

interFaceStoper.init();
