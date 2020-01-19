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
            that.toggleContent(partFoldId);
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

PartMan.prototype.toggleContent = function(partFoldId){
    var that = this;
    var partFoldAnchorElement = this.getPartFoldAnchorElement(partFoldId);
    var partFoldElement = this.getPartFoldElement(partFoldId);
    if (!partFoldAnchorElement || !partFoldElement)
        return false;
    /* 컨텐츠 활성화 결정 (이미 활성화되어 있다면 닫을 수 있도록 false)*/
    /* 컨텐츠 활성화 최종 결정 */
    getEl(partFoldElement).exists(function(it){
        if (getEl(it).hasClass('content-none')){
            that.openContent(partFoldId);
        }else{
            that.closeContentAll();
        }
    });
};

PartMan.prototype.openContent = function(partFoldId){
    var that = this;
    var partFoldAnchorElement = this.getPartFoldAnchorElement(partFoldId);
    var partFoldElement = this.getPartFoldElement(partFoldId);
    if (!partFoldAnchorElement || !partFoldElement)
        return false;

    this.closeContentAll();

    /* 현재 활성화된 컨텐트 정보 저장 */
    this.nowPartFoldElement = partFoldElement;
    this.nowPartFoldAnchorElement = partFoldAnchorElement;

    /* 클릭한 객체 티내기 */
    searchEl('[data-part-fold-a]').each(function(it){
        getEl(it).removeClass('part-fold-active');
    });
    getEl(partFoldAnchorElement).addClass('part-fold-active');

    /* 클릭한 기사보다 아래에 있는 기사의 첫칸의 전 객체 */
    var target = null;
    var lastThisLine = null;
    searchEl('[data-part-fold-a]').some(function(it){
        if (partFoldAnchorElement.offsetTop < it.offsetTop) {
            target = it;
            return true;
        }else if(partFoldAnchorElement.offsetTop == it.offsetTop){
            lastThisLine = it.nextSibling;
        }
    });
    if (target == null)
        target = lastThisLine;

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
        .appendToFrontOf(target);
    // sj.whenResize();

    /* 열린 내용으로 포커스 */
    that.moveScroll(partFoldAnchorElement, partFoldElement);
};

PartMan.prototype.closeContentAll = function(){
    /* 활성화 컨텐츠 모두 닫기 */
    var that = this;;
    searchEl('[data-part-fold-a]').each(function(it){
        getEl(it).removeClass('part-fold-active');
        var partFoldId = getEl(it).attr('data-part-fold-a');
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
};

PartMan.prototype.whenResize = function(){
    if (!this.nowPartFoldElement && !this.nowPartFoldAnchorElement)
        return;
    /* 클릭한 기사보다 아래에 있는 기사의 첫칸의 전 객체 */
    var that = this;
    var target = null;
    var lastThisLine = null;

    getEl(this.hiddenDiv).add(this.partFoldContextElement);

    searchEl('[data-part-fold-a]').some(function(it){
        if (that.nowPartFoldAnchorElement.offsetTop < it.offsetTop){
            target = it;
            return true;
        }else if(that.nowPartFoldAnchorElement.offsetTop == it.offsetTop){
            lastThisLine = it.nextSibling;
        }
    });
    if (target == null)
        target = lastThisLine;

    getEl(this.partFoldContextElement).appendToFrontOf(target);
    // sj.whenResize();
};

/* 편의를 위한 스크롤 내리기 임시 방편 */
PartMan.prototype.moveScroll = function(obj, contentObj){
    var deltaForScroll = -55;
    setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 50);
    setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 100);
    setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; contentObj.style.height = 'auto'; }, 125);
    setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 150);
    // setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 350);
    // setTimeout(function(){ document.documentElement.scrollTop = obj.offsetTop +deltaForScroll; }, 500);
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
    newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(rgba(255,255,255,0), ' +partElement.style.background+ ')').appendToFrontOf(partElement);
    //- Last
    partElement = partElementList[(partElementList.length -1)];
    newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(' +partElement.style.background+ ', rgba(255,255,255,0))').appendToNextOf(partElement);
    //- ...
    for (var i=0; i<partElementList.length -1; i++){
        partElement = partElementList[i];
        var nextPartElement = partElementList[i +1];
        newEl('div').attr('data-part-margin', true).setStyle('background', 'linear-gradient(' +partElement.style.background+ ', ' +nextPartElement.style.background+ ')').appendToFrontOf(nextPartElement);
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