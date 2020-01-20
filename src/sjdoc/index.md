# PartMan
## 🎞️
[![Build Status](https://travis-ci.org/sj-js/partman.svg?branch=master)](https://travis-ci.org/sj-js/partman)
[![All Download](https://img.shields.io/github/downloads/sj-js/partman/total.svg)](https://github.com/sj-js/partman/releases)
[![Release](https://img.shields.io/github/release/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)
[![License](https://img.shields.io/github/license/sj-js/partman.svg)](https://github.com/sj-js/partman/releases)

- 쉽게 Key Event를 다룰 수 있습니다.
- Source: https://github.com/sj-js/partman
- Document: https://sj-js.github.io/sj-js/partman



## Index
*@* **order** *@*
```
- PartMan
- Example
```



## 1. Getting Started

### 1-1. How to use

1. Load library and new instance
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/slideman/dist/css/partman.css">
    <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sj-js/fixman/dist/js/partman.js"></script>
    <script>
         var partman = new PartMan().detect();
    </script>
    ```  
    OR in ES6+
    ```js
    require('@sj-js/partman/src/css/partman.css');
    const partman = require('@sj-js/partman');
    ```
   
2. Set `data-part` to target element   
   ```html
   <div data-part>Hello Part Area 1</div>
   <div data-part>Hello Part Area 2</div>
   ```
   
3. Run `detect()` then, When Page is Loaded, detect and apply elements with a `data-part` attribute    
   ```js
   partman.detect();
   ```



### 1-2. Simple Example
- For convenience, the following code, which loads and creates a Library in the example, is omitted.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/partman/dist/css/partman.css">
    <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sj-js/partman/dist/js/partman.js"></script>
    <script>
         var partman = new PartMan().detect();
    </script>
    ```
  
    *@* *+prefix* *x* *@* 
    ```html
    <link rel="stylesheet" href="../partman/partman.css">
    <script src="../crossman/crossman.js"></script>
    <script src="../partman/partman.js"></script>
    <script>
         var partman = new PartMan().detect();
    </script>
    ```    

##### Sample A
- Example)
    *@* *!* *@*
    ```html
    <script>
        partman.setup({
            firstPartMarginHeight:100,
            partMarginHeight:50,
            lastPartMarginHeight:500            
        });
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
    *@* *!* *@*
    ```html
    <style>
        html { scroll-behavior: smooth; }
        button[data-part-fold-a] { width:150px; height:100px; cursor:pointer; }
        .part-fold-active { border:2px solid skyblue; background:skyblue; }                
    </style>
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