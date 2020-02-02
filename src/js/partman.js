/***************************************************************************
 * [Node.js] import
 ***************************************************************************/
try{
    var crossman = require('@sj-js/crossman');
    var ready = crossman.ready,
        getEl = crossman.getEl,
        newEl = crossman.newEl,
        searchEl = crossman.searchEl,
        getData = crossman.getData,
        SjEvent = crossman.SjEvent
    ;
}catch(e){}

/***************************************************************************
 * Module
 ***************************************************************************/
function PartMan(options){
    this.event = new SjEvent();
    this.globalOption = {
        partMarginHeight: null,
        firstPartMarginHeight: 50,
        lastPartMarginHeight: 50
    };
    this.nowPartFoldElement;
    this.nowPartFoldAnchorElement;
    this.hiddenDiv = newEl('div').setStyle('width', '100%').setStyle('height', '100%').setStyle('display', 'block').setStyle('position', 'absolute').setStyle('left', '-5555px').setStyle('top', '-5555px').returnElement();
    this.partFoldContextElement = newEl('div').addClass('part-fold-context').returnElement();
    this.partFoldAnchorIdAndDataMap = {};
    this.partFoldIdAndDataMap = {};
    this.latestFoldElement = null;
    var that = this;
    window.addEventListener('resize', function(e){
        that.resizePartAreaElement();
    });
    if (options)
        this.setup(options);
}

/***************************************************************************
 * [Node.js] exports
 ***************************************************************************/
try {
    module.exports = exports = PartMan;
} catch (e) {}



PartMan.EVENT_OPEN = 'open';
PartMan.EVENT_CLOSE = 'close';



/***************************************************************************
 *
 * EVENT
 *
 ***************************************************************************/
PartMan.prototype.addEventListener               = function(element, eventName, eventFunc){ this.event.addEventListener(element, eventName, eventFunc); return this; };
PartMan.prototype.addEventListenerById           = function(element, eventName, eventFunc){ this.event.addEventListenerById(element, eventName, eventFunc); return this; };
PartMan.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ this.event.addEventListenerByEventName(eventName, eventFunc); return this; };
PartMan.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
PartMan.prototype.hasEventListenerById           = function(element, eventName, eventFunc){ return this.event.hasEventListenerById(element, eventName, eventFunc); };
PartMan.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
PartMan.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
PartMan.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
PartMan.prototype.removeEventListenerById        = function(element, eventName, eventFunc){ return this.event.removeEventListenerById(element, eventName, eventFunc); };
PartMan.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
PartMan.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
PartMan.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
PartMan.prototype.execEventListenerById          = function(element, eventName, event){ return this.event.execEventListenerById(element, eventName, event); };
PartMan.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };
PartMan.prototype.execEvent                      = function(eventMap, eventNm, event){ return this.event.execEvent(eventMap, eventNm, event); };



PartMan.prototype.setup = function(options){
    for (var optionName in options){
        this.globalOption[optionName] = options[optionName];
    }
    return this;
};

PartMan.prototype.detect = function(callback){
    var that = this;
    ready(function(){
        that.makeImg(); //여기가 적당할까?..
        that.makePartAreaElement();
        that.makePartFoldElement();
        if (callback)
            callback(that);
    });
    return this;
};





/***************************************************************************
 *
 * Part Fold
 *
 ***************************************************************************/
PartMan.prototype.makePartFoldElement = function(){
    var that = this;
    searchEl('[data-part-fold]').each(function(it){
        var partFoldData = getEl(it).attr('data-part-fold');
        var partFoldId = (partFoldData) ? partFoldData : (it.id) ? it.id : 'partFoldData' + new Date().getTime();
        that.partFoldIdAndDataMap[partFoldId] = {
            element: it
        };
        getEl(it).attr('data-part-fold', partFoldId);
    });

    /* 컨텐츠에 클릭 이벤트 설정 */
    searchEl('[data-part-fold-a]').each(function(it){
        var partFoldAnchorData = getEl(it).attr('data-part-fold-a');
        var partFoldAnchorId = (partFoldAnchorData) ? partFoldAnchorData : (it.id) ? it.id : 'partFoldAnchorData' + new Date().getTime();
        that.partFoldAnchorIdAndDataMap[partFoldAnchorId] = {
            element: it
        };
        getEl(it).attr('data-part-fold-a', partFoldAnchorId).addEventListener('click', function(e){
            var partFoldId = getEl(it).attr('data-part-fold-a');
            that.toggleContent(partFoldId).moveScroll();
        });
    });
    /* 컨텐츠 숨기기 div 배치하기*/
    getEl(this.hiddenDiv).appendTo(document.body);
    /* 컨텐츠들 숨기기 */
    this.closeContentAll();
    if (!getData().isMobile){
        window.addEventListener('resize', function(event){
            that.whenResize();
        });
    }
};

PartMan.prototype.toggleContent = function(partFoldId, targetElement){
    var that = this;
    var partFoldAnchorElement = this.getPartFoldAnchorElement(partFoldId);
    var partFoldElement = this.getPartFoldElement(partFoldId);
    if (!partFoldElement)
        return this;
    if (!partFoldAnchorElement && !targetElement)
        return this;
    /* 컨텐츠 활성화 결정 (이미 활성화되어 있다면 닫을 수 있도록 false)*/
    /* 컨텐츠 활성화 최종 결정 */
    getEl(partFoldElement).exists(function(it){
        if (getEl(it).hasClass('content-none')){
            that.openContent(partFoldId, targetElement);
        }else{
            that.closeContentAll();
        }
    });
    return this;
};

PartMan.prototype.openContent = function(partFoldId, targetElement){
    var that = this;
    var partFoldAnchorElement = this.getPartFoldAnchorElement(partFoldId);
    var partFoldElement = this.getPartFoldElement(partFoldId);
    this.latestFoldElement = null;

    if (!partFoldElement)
        return this;
    if (!partFoldAnchorElement && !targetElement)
        return this;
    if (typeof targetElement == 'string')
        targetElement = getEl(targetElement).returnElement();

    this.closeContentAll();

    /* 현재 활성화된 컨텐트 정보 저장 */
    this.nowPartFoldElement = partFoldElement;
    this.nowPartFoldAnchorElement = null;
    this.nowPartFoldTargetElement = null;

    var target = null;
    var lastThisLine = null;
    var targetToNext = null;

    if (partFoldAnchorElement){
        this.nowPartFoldAnchorElement = partFoldAnchorElement;
        this.latestFoldElement = partFoldAnchorElement;
        /* 클릭한 객체 티내기 */
        searchEl('[data-part-fold-a]').each(function(it){
            getEl(it).removeClass('part-fold-active');
        });
        getEl(partFoldAnchorElement).addClass('part-fold-active');
        /* 클릭한 기사보다 아래에 있는 기사의 첫칸의 전 객체 */
        searchEl('[data-part-fold-a]').some(function(it){
            targetToNext = it;
            if (partFoldAnchorElement.offsetTop < it.offsetTop) {
                target = it;
                return true;
            }else if (partFoldAnchorElement.offsetTop == it.offsetTop){
                lastThisLine = it.nextSibling;
            }
        });
        if (target == null)
            target = lastThisLine;

    }

    if (targetElement){
        targetToNext = targetElement;
        this.nowPartFoldTargetElement = targetElement;
        this.latestFoldElement = targetElement;
    }

    getEl(that.partFoldContextElement)
        .add(
            getEl(partFoldElement)
                .removeClass('content-none')
                .setStyle('minHeight', (partFoldElement.scrollHeight > 300) ? partFoldElement.scrollHeight+'px' : 300+'px')
                .addAsFirst([
                    // newEl('div').addClass('content-before'),
                    /* 메뉴바 추가(X버튼) */
                    searchEl('[data-part-fold-tool]').each(function(it){ getEl(it).setStyle('display', 'block'); })
                ])
                .add([
                    // newEl('div').addClass('content-after')
                ])
        )
    if (target){
        getEl(that.partFoldContextElement).appendToFrontOf(target);
    }else{
        getEl(that.partFoldContextElement).appendToNextOf(targetToNext);
    }
    /* 열린 내용으로 포커스 */
    // that.moveScroll(partFoldAnchorElement, partFoldElement);
    // this.latestFoldElement = partFoldAnchorElement;

    var eventObject = {element:partFoldElement, partFoldId:partFoldId};
    this.execEventListenerByEventName(PartMan.EVENT_OPEN, eventObject);
    return this;
};

PartMan.prototype.closeContentAll = function(){
    /* 활성화 컨텐츠 모두 닫기 */
    var that = this;
    searchEl('[data-part-fold-a]').each(function(it){
        getEl(it).removeClass('part-fold-active');
    });
    searchEl('[data-part-fold]').each(function(it){
        var partFoldId = getEl(it).attr('data-part-fold');
        var partFoldElement = that.getPartFoldElement(partFoldId);
        getEl(partFoldElement).exists(function(obj){
            obj.addClass('content-none').setStyle('minHeight', '0px').appendTo(that.hiddenDiv);
        });
    });

    //PartFoldContext to Hidden Area
    // getEl(that.partFoldContextElement).appendTo(that.hiddenDiv);
    getEl(that.hiddenDiv).add([
        that.partFoldContextElement,
        searchEl('[data-part-fold-tool]')
    ]);
    this.latestFoldElement = null;
    this.nowPartFoldAnchorElement = null;
    this.nowPartFoldTargetElement = null;
    //Event
    var eventObject = {};
    this.execEventListenerByEventName(PartMan.EVENT_CLOSE, eventObject);
};

PartMan.prototype.whenResize = function(){
    if (!this.nowPartFoldElement && !this.nowPartFoldAnchorElement)
        return;
    /* 클릭한 기사보다 아래에 있는 기사의 첫칸의 전 객체 */
    var that = this;
    var target = null;
    var lastThisLine = null;
    var targetToNext = null;
    getEl(this.hiddenDiv).add(this.partFoldContextElement);

    if (this.nowPartFoldAnchorElement){
        searchEl('[data-part-fold]').some(function(it){
            targetToNext = it;
            if (that.nowPartFoldAnchorElement.offsetTop < it.offsetTop){
                target = it;
                return true;
            }else if(that.nowPartFoldAnchorElement.offsetTop == it.offsetTop){
                lastThisLine = it.nextSibling;
            }
        });
        if (target == null)
            target = lastThisLine;
    }

    if (this.nowPartFoldTargetElement){
        targetToNext = this.nowPartFoldTargetElement;
    }

    if (target){
        getEl(that.partFoldContextElement).appendToFrontOf(target);
    }else{
        getEl(that.partFoldContextElement).appendToNextOf(targetToNext);
    }
    // sj.whenResize();
};

/* 편의를 위한 스크롤 내리기 임시 방편 */
PartMan.prototype.moveScroll = function(targetElement, partFoldElement){
    //Check Auto Latest Opened PartFold Target
    if (!targetElement && !partFoldElement){
        if (this.latestFoldElement){
            targetElement = this.latestFoldElement;
        }else{
            return this;
        }
    }

    //TODO: TEST
    PartMan.scrollTo(targetElement);

    //TODO: TEst...
    // var deltaForScroll = -55;
    // var offsetTop = targetElement.offsetTop +deltaForScroll;
    // setTimeout(function(){ PartMan.moveScroll(offsetTop); }, 50);
    // setTimeout(function(){ PartMan.moveScroll(offsetTop); }, 100);
    // setTimeout(function(){ PartMan.moveScroll(offsetTop); }, 125);
    // setTimeout(function(){ PartMan.moveScroll(offsetTop); }, 150);

    //TODO: Mobile?
    // setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 350);
    // setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 500);
};

//TODO: Test
PartMan.moveScroll = function(y){
    console.error('y,', y);
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var isEdge = /Edge/.test(navigator.userAgent);
    if (isIE11 || isEdge) {
        window.scrollTo(0, y);
        // setTimeout(function(){ window.scrollTo(0, 0); }, 300);  // adjust time according to your page. The better solution would be to possibly tie into some event and trigger once the autoscrolling goes to the top.
    }else{
        document.documentElement.scrollTop = y;
    }
};

//TODO: Test
//REF: https://stackoverflow.com/questions/52276194/window-scrollto-with-options-not-working-on-microsoft-edge
//REF: https://nicegist.github.io/d210786daa23fd57db59634dd231f341
PartMan.scrollTo = function(element){
    // native smooth scrolling for Chrome, Firefox & Opera
    // @see: https://caniuse.com/#feat=css-scroll-behavior
    var nativeSmoothScrollTo = function(elem){
        window.scroll({behavior: 'smooth', left: 0, top: elem.getBoundingClientRect().top + window.pageYOffset});
    };

    // polyfilled smooth scrolling for IE, Edge & Safari
    var smoothScrollTo = function(to, duration){
        var element = document.scrollingElement || document.documentElement,
            start = element.scrollTop,
            change = to - start,
            startDate = +new Date();
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        var easeInOutQuad = function(t, b, c, d){
            t /= d/2;
            if (t < 1)
                return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };
        var animateScroll = function(){
            var currentDate = +new Date();
            var currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }else {
                element.scrollTop = to;
            }
        };
        animateScroll();
    };

    // detect support for the behavior property in ScrollOptions
    var supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    // smooth scrolling stub
    var scrollToElem = function(elemSelector){
        if (!elemSelector)
            return;
        var elem;
        if (elemSelector instanceof Element){
            elem = elemSelector;
        }else{
            elem = document.querySelector(elemSelector);
        }
        if (elem) {
            if (supportsNativeSmoothScroll) {
                nativeSmoothScrollTo(elem);
            } else {
                smoothScrollTo(elem.offsetTop, 600);
            }
        }
    };

    return scrollToElem(element);
};



PartMan.prototype.getPartFoldElement = function(id){
    var data = this.partFoldIdAndDataMap[id];
    if (data)
        return data.element;
};
PartMan.prototype.getPartFoldAnchorElement = function(id){
    var data = this.partFoldAnchorIdAndDataMap[id];
    if (data)
        return data.element;
};
PartMan.prototype.eachPartIcon = function(closure){
    var iconElement = null;
    for (var key in this.partFoldAnchorIdAndDataMap){
        iconElement = this.partFoldAnchorIdAndDataMap[key].element;
        closure(iconElement);
    }
    return this;
};
PartMan.prototype.eachPartRef = function(closure){
    searchEl('[data-part-fold-ref]').each(function(it){
        closure(it);
    });
    return this;
};




/***************************************************************************
 *
 * Part Area
 *
 ***************************************************************************/
PartMan.prototype.makeImg = function(){
    /** 객체마다 적용(이미지) **/
    var that = this;
    searchEl('[data-img]').each(function(it){
        if (it.isAdaptedImg)
            return;
        it.isAdaptedImg = true;
        it.img = new Image();
        it.img.src = it.getAttribute('data-img');
        it.style.backgroundImage = 'url(' +it.img.src+ ')';
        it.style.backgroundRepeat = 'no-repeat';
        it.style.backgroundPosition = 'center';
        it.style.backgroundSize = '100% 100%';
        it.img.objDiv = it;
        it.img.onload = function(){
            /* 사이즈가 설정되어 있다면 그에 따른다 */
            var w = this.objDiv.getAttribute('width');
            var h = this.objDiv.getAttribute('height');
            this.objDiv.style.width = (w) ? w+'px' : this.width+'px';
            this.objDiv.style.height =(h) ? h+'px' : this.height+'px';
        };
    });
};

PartMan.prototype.makePartAreaElement = function(){
    var partElementList = searchEl('[data-part]').returnElement();
    if (partElementList.length == 0)
        return;
    var partElement = null;
    //Insert Slider-Margin before Slider-Item
    //- First
    partElement = partElementList[0];
    newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(rgba(255,255,255,0), ' +partElement.style.backgroundColor+ ')').appendToFrontOf(partElement);
    //- Last
    partElement = partElementList[(partElementList.length -1)];
    newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(' +partElement.style.backgroundColor+ ', rgba(255,255,255,0))').appendToNextOf(partElement);
    //- ...
    for (var i=0; i<partElementList.length -1; i++){
        partElement = partElementList[i];
        var nextPartElement = partElementList[i +1];
        newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(' +partElement.style.backgroundColor+ ', ' +nextPartElement.style.backgroundColor+ ')').appendToFrontOf(nextPartElement);
    }

    this.resizePartAreaElement();
};

PartMan.prototype.resizePartAreaElement = function(){
    var windowHeight = window.innerHeight;
    var halfHeight = Math.floor((windowHeight /2 +1));
    /** Resize part height **/
    searchEl('[data-part]').each(function(it){
        getEl(it).setStyle('minHeight', windowHeight +'px');
    });
    /** Resize part margin height **/
    var partMarginElementList = searchEl('[data-part-margin]').returnElement();
    if (partMarginElementList.length < 2)
        return;
    var partElement = null;
    var defaultPartMarginHeightValue = (this.globalOption.partMarginHeight != null) ? this.globalOption.partMarginHeight : halfHeight;
    var firstPartMarginHeightValue = (this.globalOption.firstPartMarginHeight != null) ? this.globalOption.firstPartMarginHeight : defaultPartMarginHeightValue;
    var lastPartMarginHeightValue = (this.globalOption.lastPartMarginHeight != null) ? this.globalOption.lastPartMarginHeight : defaultPartMarginHeightValue;
    //- First
    partElement = partMarginElementList[0];
    getEl(partElement).setStyle('height', firstPartMarginHeightValue +'px');
    //- Last
    getEl(partMarginElementList[(partMarginElementList.length -1)]).setStyle('height', lastPartMarginHeightValue +'px');
    //- ...
    for (var i=1; i<partMarginElementList.length -1; i++){
        getEl(partMarginElementList[i]).setStyle('height', defaultPartMarginHeightValue +'px');
    }
};