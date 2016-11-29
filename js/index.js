var g = new NekoGal("./sample.json",
                    "scripter",
                    {
                        autoplay: 0,
                        lineheight: 3,
                        repeat: true,
                        startheight: 230,
                        scriptbg: "rgba(100,100,100,0.8)"
                        
                    });

window.onload = function() {
    g.play();
}