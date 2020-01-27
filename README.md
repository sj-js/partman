# PartMan
## 🎞️
[![Build Status](https://travis-ci.org/sj-js/partman.svg?branch=master)](https://travis-ci.org/sj-js/partman)
[![All Download](https://img.shields.io/github/downloads/sj-js/partman/total.svg)](https://github.com/sj-js/partman/releases)
[![Release](https://img.shields.io/github/release/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)
[![License](https://img.shields.io/github/license/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)

- 구역을 분리하여 강조합니다. 
- ✨ Source: https://github.com/sj-js/partman
- ✨ Document: https://sj-js.github.io/sj-js/partman



## Getting Started
0. Load
    - Browser  
        ```html    
        <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/js/partman.min.js"></script>
        <script>
            var partman = new PartMan();
        </script>        
        ```  
    - ES6+
        ```
        npm install @sj-js/partman
        ```
        ```html
        require('@sj-js/partman/dist/css/partman.css');    
        const PartMan = require('@sj-js/partman');
        const partman = new PartMan();
        ```

##### Sample A
1. Set `data-part` attribute to target element and set color   
   ```html
   <div data-part style="background:#EEFF88;">Hello Part Area 1</div>
   <div data-part style="background:#DDAAFF;">Hello Part Area 2</div>
   ```
   
2. Run `detect()` then, When Page is Loaded, detect and apply elements with a `data-part` attribute    
   ```js
   partman.detect();
   ```
   
3. Simple Example
    ```html
    <!DOCTYPE html>
    <HTML>
        <head>
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/js/partman.min.js"></script>
            <script>
                var partman = new PartMan();
            </script>
            <script>
                partman.setup({firstPartMarginHeight:100, partMarginHeight:50, lastPartMarginHeight:500}).detect();
            </script>
        </head>
    
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
    </HTML>
    ``` 

##### Sample B
1. Set `data-part-fold-a` attribute to button element to open folded content
   ```html
   <button data-part-fold-a="fold-1">fold-1</button>
   <button data-part-fold-a="fold-2">fold-2</button>
   ```
2. Set `data-part-fold-tool` attribute to tool element on top of content
   ```html
   <div data-part-fold-tool>
       <button onclick="partman.closeContentAll();">X</button>
   </div>  
   ```
3. Set `data-part-fold` attribute to folded content   
   ```html
   <div data-part-fold="fold-1">
       1
   </div>
   <div data-part-fold="fold-2">
       2     
   </div>
   ```   
4. Run `detect()` then, When Page is Loaded, detect and apply elements with a `data-part` attribute    
   ```js
   partman.detect();
   ```
5. Simple Example
    ```html
    <!DOCTYPE html>
    <HTML>
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/css/partman.min.css">
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/partman/dist/js/partman.min.js"></script>
            <script>
                var partman = new PartMan();
            </script>
            <script>
                partman.setup({firstPartMarginHeight:100, partMarginHeight:50, lastPartMarginHeight:500}).detect();
            </script>
            <style>
                html { scroll-behavior: smooth; }
                button[data-part-fold-a] { width:150px; height:100px; cursor:pointer; }
                .part-fold-active { border:2px solid skyblue; background:skyblue; }
            </style>
        </head>
    
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
    </HTML>
    ``` 
