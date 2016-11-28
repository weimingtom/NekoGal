((instances) => {
    class NekoGal {
        constructor(content, dom, uconfig){
            this.script = [];
            this.config = {
                animation   :  false                           ,
                anispeed    :  100                             ,
                autoplay    :  false                           ,
                repeat      :  false                           ,
                interval    :  1000                            ,
                background  :  "rgba(255,255,255,0)"           ,
                color       :  "rgba(0,0,0,1)"                 ,
                callfront   :  function(id, current) {}        ,
                callback    :  function(id, current) {}        ,
                id          :  parseInt(Math.random() * 100000)
            }
            this.current = -1;
            this.thread = null;
            this.animate = null;
            this.target = null;
            this.clickLock = false;
            this.aniLock = false;
            // Initialize
            
            if (dom === undefined) return null;
            if (uconfig != undefined) {
                for( var key in uconfig ) {
                    this.config[key] = uconfig[key];
                }
            }
            this.target = document.getElementById(dom);
            if (this.target === null) return null;
            // Update User Config
            
            if (typeof(content) === "string") {
                this.script = this.parseStringScript(content);
            }
            else if (typeof(content) === "object") {
                this.script = content;
            }
            if (this.script == null) return null;
            // Load Script
            
            var f = this.next;
            var THIS = this;
            this.target.onclick = function() {
                f.apply(THIS);
            }
            // On Click Event
            var f2 = this.myAnimate;
            this.animate = setInterval(function(){f2.apply(THIS)},500);
            // Load Animate
            
            
            this.id = this.config.id;
            window["NG_" + this.id] = THIS;
            if (window["NG_LIST"]) window["NG_LIST"].push("NG_" + this.id);
            else window["NG_LIST"] = ["NG_" + this.id];
            // Hook
            
            this.loadCSS();
            this.addClass(this.target, "ng_frame");
            // Load CSS
            
            
            
            
        }
        
        hasClass(obj, cls) {  
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
        }  
          
        addClass(obj, cls) {  
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
        }  
          
        removeClass(obj, cls) {  
            if (this.hasClass(obj, cls)) {  
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
                obj.className = obj.className.replace(reg, ' ');  
            }  
        }  
          
        toggleClass(obj,cls) {  
            if(hasClass(obj,cls)){  
                this.removeClass(obj, cls);  
            }else{  
                this.addClass(obj, cls);  
            }  
        }  

        loadCSS() {
            if (document.getElementById("NG_CSS")) return;
            var head = document.getElementsByTagName("head")[0];
            var style = document.createElement("style");
            var rules = document.createTextNode(this.curlText("css/nekogal.css"));
                style.type = "text/css";
                style.id = "NG_CSS";
                if (style.styleSheet){
                    style.styleSheet.cssText = rules.nodeValue;
                }
                else {
                    style.appendChild(rules);
                }
            head.appendChild(style);
        }
        
        parseStringScript(uri) {
            return JSON.parse(this.curlText(uri).replace(/\n/g,"")) || null;
        }
        
        curlText(uri) {
            var isie = navigator.userAgent.indexOf('MSIE') > 0;
            var pipe = (isie) ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
            pipe.open('get',uri,false);
            pipe.send(null);
            return pipe.responseText || "";
        }
        
        play() {
            if (this.thread) return;
            
            if (this.config.autoplay){
                var f = this.myThread;
                var THIS = this;
                this.thread = setInterval(function(){f.apply(THIS)},this.config.interval);
            }
            //else
                //this.next();
        }
        
        myThread(){
            this.next();
        }
        
        myAnimate(){
            if (this.aniLock) return;
            if (this.arrowOn === undefined) this.arrowOn = false;
            
            if (this.arrowOn) {
                this.toggleArrow(false);
            }
            else {
                this.toggleArrow(true);
            }
            
            this.arrowOn = !this.arrowOn;
        }
        
        toggleArrow(e) {
            if (e) {
                this.target.innerHTML += "&nbsp;&gt;&nbsp;";
            }
            else {
                if (this.target.innerHTML.substr(this.target.innerHTML.length - 16) == "&nbsp;&gt;&nbsp;") {
                    this.target.innerHTML = this.target.innerHTML.substr(0, this.target.innerHTML.length - 16);
                } 
            }
        }
        
        next() {
            if (this.clickLock) return;
            this.current++;
            if (this.current + 1 > this.script.length) {
                if (this.repeat) {
                    this.current = -1;
                }
                else {
                    if(this.thread)clearInterval(this.thread);
                    this.thread = null;
                }
                return;
            }
            this.config.callfront(this.id, this.current);
            
            this.showNextScript();
            
            this.config.callback(this.id, this.current);
            
            if (this.current + 2 > this.script.length) {
                this.toggleArrow(false);
                clearInterval(this.animate);
                this.animate = null;
            }
        }
        
        showNextScript() {
            this.aniLock = true;
            this.toggleArrow(false);
            var t = this.target;
            
            switch (this.script[this.current].type) {
                case 'text':
                    t.innerHTML += '&nbsp&gt;&nbsp' + this.script[this.current].content + '<br />';
                    if (typeof(this.script[this.current]["jump"]) === 'number') this.current = this.script[this.current]["jump"] - 1;
                    this.aniLock = false;
                    break;
                case 'option':
                    this.showOption(this.script[this.current].content,this.script[this.current].options,this.current);
                    break;
                default:
                    break;
            }
        }
        
        showOption (c, o, id){
            var t = this.target;
            t.innerHTML += '&nbsp&gt;&nbsp' + c + '<br />';
            
            this.aniLock = true;
            this.clickLock = true;
            this.toggleArrow(false);
            
            var buttonBar = "<div style='display:inline;'>";
            
            for (var key in o) {
                buttonBar += "<div style='background: rgba(0,255,0,0.2);margin-left: 10px;' class='btn btn-success btn-sm' onclick='javascript:window[\"NG_" + this.id + "\"].btn_jump(" + o[key] + ")'>" + key + "</div>";
            }
            
            buttonBar += "</div>";
            
            t.innerHTML += buttonBar;
        }
        
        btn_jump (id) {
            this.current = id - 1;
            this.target.removeChild(this.target.childNodes[this.target.childNodes.length - 1]);
            this.clickLock = false;
        }
        
        clear() {
            var t = this.target;
            t.innerHTML = "";
            this.current = -1;
        }
    }
    
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = NekoGal
    }
    else {
        window.NekoGal = NekoGal;
    }
})([]);