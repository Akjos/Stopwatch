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
            outlook.putInHtml(this.timer, outlook.timerView(this.h,this.m,this.s,this.ms));
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
            outlook.putInHtml(this.timer, outlook.timerView(this.h,this.m,this.s,this.ms));
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
                var node = document.createTextNode(outlook.timerView(stopwatch.h,stopwatch.m,stopwatch.s,stopwatch.ms)),
                    li = document.createElement('li'),
                    deleteBt = document.createElement('button');
                deleteBt.classList.add('closeBt');
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
        timerView : function (h,m,s,ms) {
            var that = this,
                check = function() { 
                if(ms != undefined ) { // Ten if jest po to abym mógł używać widoku mimo tego że nie posiadam milisekund
                    return ':' + that.checkLength(ms);
                } else
                    return ''; 
            }
            return this.checkLength(h) + ':' + this.checkLength(m) + ':' + this.checkLength(s) + check();
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
    setTimeBt: document.getElementById('setTime'),
    startTimerBt: document.getElementById('startTimer'),
    stopTimerBt: document.getElementById('stopTimer'),
    resetBt: document.getElementById('resetTimer'),
    timeLoading: document.getElementById('timeLoad'),
    tabTime: document.getElementsByTagName('input'),
    consoleEndTime: document.getElementById('consoleEndTime'),
    stopAlarmBt: document.getElementById('stopSound'),
    init : function () {
        this.setTimeBt.addEventListener('click', function () { stoper.setTime();});
        this.resetBt.addEventListener('click', function () { stoper.resetEveryThing();});
        this.startTimerBt.addEventListener('click', function () { stoper.start();});
        this.stopTimerBt.addEventListener('click', function () { stoper.stop();});
    }
},
    stoper = {
        timer: document.getElementById('meterText'),
        h: 0,
        m: 0,
        s: 0,
        clear: null,
        countSet: false,
        setTime : function () {
            var time = this.getTime();
            if(this.checkTime(time)) {
                this.h = +(time[0]); 
                this.m = +(time[1]);
                this.s = +(time[2]);
                outlook.putInHtml(this.timer, outlook.timerView(this.h,this.m,this.s));
                this.countSet = true;
            }
        },
        start : function () {
            if (this.countSet) {
                var that = this;
                this.clear = setInterval( function () {that.counter();}, 1000);
                interFaceStoper.stopTimerBt.classList.remove('display');
                interFaceStoper.startTimerBt.classList.add('display');
            }
        },
        stop : function () {
            clearInterval(this.clear);
            interFaceStoper.startTimerBt.classList.remove('display');
            interFaceStoper.stopTimerBt.classList.add('display');
        },
        counter : function () {
            if(this.s == 0){
                if(this.m == 0){
                    if(this.h == 0){
                        clearInterval(this.clear);
                        this.alarm();
                        interFaceStoper.startTimerBt.classList.remove('display');
                        interFaceStoper.consoleEndTime.classList.remove('display');
                        interFaceStoper.stopTimerBt.classList.add('display');
                        this.countSet = false;
                        return false;
                    } else {
                        this.h -= 1;
                        this.m += 59;
                        this.s += 60;
                    }
                } else {
                    this.m -= 1;
                    this.s += 60;
                }
            }
            this.s -= 1;
            outlook.putInHtml(this.timer, outlook.timerView(this.h,this.m,this.s));
        },
        checkTime : function (el)  { //metoda sprawdza czy to co podał użytkownik jest poprawną liczbą i czy nie równa się zero
            var reg = /^\d+$/,
                marker = true,
                checkNum = 0;
            el.forEach(function(el) {
                checkNum += +(el);
                if(!(reg.test(el) || el == '')) 
                   marker = false;
            })
            return (marker && checkNum != 0);
        },
        getTime : function () {            
            var time = [];
            for(var i = 0;i < interFaceStoper.tabTime.length;i++){
                time.push(interFaceStoper.tabTime[i].value);
                interFaceStoper.tabTime[i].value = '';
            }
            return time;
        },
        resetEveryThing : function () {
            this.stop();
            this.h = 0;
            this.m = 0;
            this.s = 0;
            outlook.putInHtml(this.timer, outlook.timerView(this.h,this.m,this.s));
            this.countSet = false;
            
        },
        alarm : function () {
            var alarm = new Audio('sound/alarm1.mp3'),
                that = this;
            interFaceStoper.stopAlarmBt.addEventListener('click', function () {
                alarm.pause();
                that.stopAlarm();
            });
            alarm.play();
            setTimeout(this.stopAlarm, 8000);
        },
        stopAlarm : function (alarm) {
            interFaceStoper.consoleEndTime.classList.add('display');
            console.log('')
        }
    };

interFaceStoper.init();
