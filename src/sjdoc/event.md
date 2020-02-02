# Event

#### ※ 표
 종류 | Template속성 | Event Data | 설명
------|--------------|------------|-------
open | data-open | {partFoldId, element} | PartFold가 열렸을 때
close | data-close | null | PartFold가 닫혔을 때

#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/css/partman.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/js/partman.min.js"></script>
    <script>
        var partman = new PartMan();
    </script>
    ```
    
    *@* *+prefix* *x* *@* 
    ```html
    <link rel="stylesheet" href="../partman/partman.css">
    <script src="../crossman/crossman.js"></script>
    <script src="../partman/partman.js"></script>
    <script> 
        var partman = new PartMan();
    </script>
    ```



## Test
- PartFold가 열리거나 닫힐 때
    *@* *!* *@*
    ```html
    <style>
        html { scroll-behavior: smooth; }
        button[data-part-fold-a] { width:120px; height:100px; cursor:pointer; }
        .part-fold-active { border:2px solid skyblue; background:skyblue; }                
    </style>
    <script> 
        partman.detect(); 
        partman
            .addEventListenerByEventName('open', function(event){
                event.element.style.fontSize = '25px';
                event.element.appendChild( document.createTextNode('💛'));
            })
            .addEventListenerByEventName('close', function(event){
                //None
            });
    </script>
    <body>
        <!-- Icons -->
        <button data-part-fold-a="fold-1">fold-1</button>
        <button data-part-fold-a="fold-2">fold-2</button>
        <button data-part-fold-a="fold-3">fold-3</button>
        <button data-part-fold-a="fold-4">fold-4</button>
        <button data-part-fold-a="fold-5">fold-5</button>
        <!-- Tools -->
        <div data-part-fold-tool>
            <button onclick="partman.closeContentAll();">X</button>
        </div>  
        <!-- Contents -->
        <div data-part-fold="fold-1">
            1
        </div>
        <div data-part-fold="fold-2">
            2     
        </div>
        <div data-part-fold="fold-3">
            3
        </div>
        <div data-part-fold="fold-4">
            4
        </div>
        <div data-part-fold="fold-5">
            5
        </div> 
    </body>
    ```
