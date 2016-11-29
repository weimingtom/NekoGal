((instances) => { 
    class NekoGal {
        constructor(content, dom, uconfig){
            this.script = [];
            this.config = {
                animation   :  true                            ,
                anispeed    :  50                              ,
                autoplay    :  false                           ,
                repeat      :  false                           ,
                interval    :  1000                            ,
                background  :  "rgba(0,0,0,1)"                 ,
                color       :  "rgba(255,255,255,1)"           ,
                lineheight  :  10                              ,
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
            this.onscreen = 0;
            this.previous_withdraw = false;
            this.bgmPlayer = null;
            this.dialogPlayer = null;
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
            document.onkeydown = function(e) {
                if (e.keyCode in {13:0,32:0}) {
                    f.apply(THIS);
                }
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
            
            var body = document.getElementsByTagName("body")[0];
            var audio = document.createElement("audio");
            audio.id = "NG_AUDIO_" + this.id;
            body.appendChild(audio);
            this.bgmPlayer = audio;
            // Load BGM Player
            
            var body = document.getElementsByTagName("body")[0];
            var audio = document.createElement("audio");
            audio.id = "NG_DIALOG_" + this.id;
            body.appendChild(audio);
            this.dialogPlayer = audio;
            // Load DIALOG Player
            
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
            if (window["NG_ANI"]) return;
            if (this.clickLock) return;
            this.current++;
            if (this.current + 1 > this.script.length) {
                if (this.config.repeat) {
                    this.current = -1;
                    this.onscreen = 0;
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
            
            if (this.previous_withdraw) {
                this.previous_withdraw = false;
                t.removeChild(t.childNodes[t.childNodes.length - 1]);
                this.onscreen --;
            }
            //Withdraw Previous
            
            if (typeof(this.script[this.current]["dialog"]) === 'string') {
                if (this.script[this.current]["dialog"] == "1"){
                    //Keep Playing
                }
                else {
                    this.bgmPlayer.src = this.script[this.current]["dialog"];
                    this.bgmPlayer.play();
                }
            } else {
                this.bgmPlayer.pause();
            }
            //Dialog
            
            if (typeof(this.script[this.current]["bgm"]) === 'string') {
                if (this.script[this.current]["bgm"] == "0")
                    this.bgmPlayer.pause();
                else if (this.script[this.current]["bgm"] == "1")
                    this.bgmPlayer.play();
                else {
                    this.bgmPlayer.src = this.script[this.current]["bgm"];
                    this.bgmPlayer.play();
                }
            }
            //Bgm
            
            if (typeof(this.script[this.current]["bgp"]) === 'string') {
                if (this.script[this.current]["bgp"] == "0") {
                    t.style.backgroundColor = this.config.background;
                    t.style.backgroundImage = '';
                }
                else {
                    t.style.backgroundImage = 'url(' + this.script[this.current]["bgp"] + ')';
                    t.style.backgroundColor = '';
                }
            }
            //Bgp
            
            if (typeof(this.script[this.current]["clear"]) === 'boolean')
                if (this.script[this.current]["clear"] == true)
                    t.innerHTML = '';
            //Clear Screen
            //Global Options
            var THIS = this;
            switch (this.script[this.current].type) {
                case 'text':
                    var f = function () {
                        if (typeof(this.script[this.current]["jump"]) === 'number') this.current = this.script[this.current]["jump"] - 1;
                        // Jump
                        this.aniLock = false;
                    }
                    this.showPlainText(function() {f.apply(THIS)});
                    break;
                case 'picture':
                    var f = function () {
                        if (typeof(this.script[this.current]["jump"]) === 'number') this.current = this.script[this.current]["jump"] - 1;
                        // Jump
                        this.aniLock = false;
                    }
                    this.showPicture(function() {f.apply(THIS)});
                    break;
                case 'option':
                    var f = function () {
                        this.showOption(this.script[this.current].content,this.script[this.current].options,this.current);
                    }
                    this.showPlainText(function() {f.apply(THIS)});
                    break;
                default:
                    break;
            }
        }
        
        showPicture (callback) {
            var t = this.target;
            t.innerHTML += '<div class="NG_SCRIPT_' + this.current + '">&nbsp&gt;&nbsp' + '<img src="' + this.script[this.current].content + '"></img><br /></div>';
            // Text
            this.onscreen ++;
            // ShowCount + 1
            if (typeof(this.script[this.current]["withdraw"]) === 'boolean') this.previous_withdraw = true;
            if (this.onscreen > this.config.lineheight) {
                t.removeChild(t.childNodes[0]);
                this.onscreen --;
            }
            callback();
        }
        
        showPlainText (callback) {
            var t = this.target;
            var cls = "";
            if (typeof(this.script[this.current]["color"]) === 'string') cls = 'style="color: ' + this.script[this.current]["color"] + '"';
            // Color
            t.innerHTML += '<div class="NG_SCRIPT_' + this.current + '" ' + cls + '>&nbsp&gt;&nbsp</div>';
            // Text
            this.onscreen ++;
            // ShowCount + 1
            if (typeof(this.script[this.current]["withdraw"]) === 'boolean') this.previous_withdraw = true;
            if (this.onscreen > this.config.lineheight) {
                t.removeChild(t.childNodes[0]);
                this.onscreen --;
            }
            
            if (typeof(this.script[this.current]["animation"]) != 'boolean') this.script[this.current]["animation"] = this.config.animation;
            if (this.script[this.current]["animation"]) {
                var inv = this.script[this.current]["duration"] || this.config.anispeed;
                if (typeof(inv) != 'number') inv = 10;
                this.showAnime(this.script[this.current].content, inv, document.getElementsByClassName("NG_SCRIPT_" + this.current)[document.getElementsByClassName("NG_SCRIPT_" + this.current).length - 1], callback);
            }
            else {
                document.getElementsByClassName("NG_SCRIPT_" + this.current)[document.getElementsByClassName("NG_SCRIPT_" + this.current).length - 1].innerHTML += this.script[this.current].content + '<br />';
                callback();
            }
        }
        
        showAnime (c, inv, t, callback) {
            window["NG_ANI_N"] = 0;
            window["NG_ANI_C"] = c;
            window["NG_ANI_T"] = t;
            window["NG_ANI_CALLBACK"] = callback;
            window["NG_ANI"] = setInterval(function(){
                if (window["NG_ANI_N"] >= window["NG_ANI_C"].length) {
                    window["NG_ANI_T"].innerHTML += '<br />';
                    clearInterval(window["NG_ANI"]);
                    window["NG_ANI"] = null;
                    window["NG_ANI_CALLBACK"]();
                } else {
                    window["NG_ANI_T"].innerHTML += window["NG_ANI_C"][window["NG_ANI_N"]];
                    window["NG_ANI_N"] ++;
                }
            }, inv);
        }
        
        showOption (c, o, id){
            var t = this.target;
            
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