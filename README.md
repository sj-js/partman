# PartMan
[![Build Status](https://travis-ci.org/sj-js/partman.svg?branch=master)](https://travis-ci.org/sj-js/partman)
[![All Download](https://img.shields.io/github/downloads/sj-js/partman/total.svg)](https://github.com/sj-js/partman/releases)
[![Release](https://img.shields.io/github/release/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)
[![License](https://img.shields.io/github/license/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)
(Detail: https://sj-js.github.io/sj-js/partman)



## Getting Started
1. Load PartMan
    - Browser  
        ```html    
        <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/sj-js/partman/dist/js/partman.js"></script>        
        ```  
    - ES6+
        ```
        npm install @sj-js/partman
        ```
        ```html
        require('@sj-js/partman');
        require('@sj-js/partman/src/css/partman.css');    
        ```

##### Sample A
- Example)
    ```html
    <script>
        var partman = new PartMan().setup({firstPartMarginHeight:100, partMarginHeight:50, lastPartMarginHeight:500}).detect();
    </script>
    <body>
        <div data-part style="background:#EEFF88;">
            Hello Part Area 1
        </div>
        <div data-part style="background:#DDAAFF;">
            Hello Part Area 2
        </div>
        <div data-part style="background:gold;">
            Hello Part Area 3
        </div>
        <div data-part style="background:skyblue;">
            Hello Part Area 4
        </div>
    </body>
    ``` 

##### Sample B
- Example)
    ```html
    <style>
        html { scroll-behavior: smooth; }
        button[data-part-fold-a] { width:150px; height:100px; cursor:pointer; }
        .part-fold-active { border:2px solid skyblue; background:skyblue; }                
    </style>
    <script>
        var partman = new PartMan().setup({firstPartMarginHeight:100, partMarginHeight:50, lastPartMarginHeight:500}).detect();  
    </script>
    <body>
        <!-- Icons -->
        <div>
            <button data-part-fold-a="fold-1">fold-1</button>
            <button data-part-fold-a="fold-2">fold-2</button>
            <button data-part-fold-a="fold-3">fold-3</button>
            <button data-part-fold-a="fold-4">fold-4</button>
            <button data-part-fold-a="fold-5">fold-5</button>
        </div>
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
