// ==UserScript==
// @name          Planets.nu map drawing
// @description   Allows marking up map with circles, lines, points, and text
// @include       http://planets.nu/home
// @include       http://planets.nu/games/*
// @include       http://*.planets.nu/*
// @include       http://planets.nu/*
// @version 1
// ==/UserScript==

/*------------------------------------------------------------------------------
Creates 2 new map tools:

"Draw" - Allows drawing various things on map. Once "Draw" is selected, clicks
    on the map will draw instead of accessing ships, setting waypoints etc.
    You can also use the options at top to create/rename/delete separate layers
    to organize your drawn objects. To exit "Draw" mode, click "Starmap".

"Layers" - Brings up a list of all the layers you have created with the "Draw"
    tool above. Each has a checkbox which can be used to show or hide that
    particular layer.

NOTE: "snap waypoints" under the point settings will override snapping to other
    ships' waypoints, if a click is near both.

(ver 0.6) fix for client vgap2.js ver 1.30
(ver 0.7) fix for using time machine
(ver 0.7) patch for changes to note color functions
(ver 0.8) fixes color selector box size
(ver 0.9) fixes new color box position issue
(ver 0.10)adds basic editing tools
(ver 0.13)update for new .nu version (3+)
------------------------------------------------------------------------------*/


function wrapper() { // wrapper for injection

  vgaPlanets.prototype.setupAddOn = function(addOnName) {
    if (vgaPlanets.prototype.addOns == null) vgaPlanets.prototype.addOns = {};
    vgaPlanets.prototype.addOns[addOnName] = {};
    var settings = localStorage.getItem(addOnName + ".settings");
    if (settings != null)
      vgaPlanets.prototype.addOns[addOnName].settings = JSON.parse(settings);
    else
      vgaPlanets.prototype.addOns[addOnName].settings = {};
    vgaPlanets.prototype.addOns[addOnName].saveSettings = function() {
      localStorage.setItem(addOnName + ".settings", JSON.stringify(vgaPlanets.prototype.addOns[addOnName].settings));
    }
    vgaPlanets.prototype.addOns[addOnName].current = {};
  };

  vgaPlanets.prototype.setupAddOn("Minefields");



  console.log("Vue stuff: ");



  //vue Bindings

  var vueapp = {};









  var old_hotkey = vgap.hotkey;
  var toggleMinecalc = true;
  //overwriting the original method
  vgap.hotkey = function(e) {

    //minefield calculator bie shit + F9
    if (e.keyCode == 120 && e.shiftKey == true) {
      console.log("Minefield: Key Event: ", e);
      console.log("Koordinaten:", vgap.map.x, vgap.map.y);



      if (toggleMinecalc) {
        vgap.addOns.Minefields.vueapp.notActive = false;
        toggleMinecalc = false;
      } else {
        vgap.addOns.Minefields.vueapp.notActive = true;
        toggleMinecalc = true;
      }


      /*

            var markup = {
              type: "circle",
              x: vgap.map.x,
              y: vgap.map.y,
              r: 100,
              attr: {
                stroke: "yellow"
              }};

            vgap.addOns.vgapMapMarkUp.showDrawTools();
            vgap.addOns.vgapMapMarkUp.current.markup = markup;
            vgap.addOns.vgapMapMarkUp.showMarkupParams(markup);
            vgap.map.draw();

      */

    }

    old_hotkey.apply(this, arguments);

  };


  /*
   *  Specify your plugin
   *  You need to have all those methods defined or errors will be thrown.
   *  I inserted the print-outs in order to demonstrate when each method is
   *  being called. Just comment them out once you know your way around.
   *
   *  For any access to plugin class variables and methods from inside these
   *  reserved methods, "vgap.plugins["nameOfMyPlugin"].my_variable" has to be
   *  used instead of "this.my_variable".
   */
  var plugin = {

    /*
     * processload: executed whenever a turn is loaded: either the current turn or
     * an older turn through time machine
     */
    processload: function() {
      console.log("ProcessLoad: plugin called.");
      //var overlays = vgap.getObjectFromNote(0, vgap.addOns.vgapMapMarkUp.notetype);
      //if (overlays == null)
      //  overlays = [];
      //vgap.addOns.vgapMapMarkUp.overlays = overlays;
    },

    /*
     * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
     */
    loaddashboard: function() {
      console.log("LoadDashboard: plugin called.");
    },

    /*
     * showdashboard: executed when switching from starmap to dashboard
     */
    showdashboard: function() {
      console.log("ShowDashboard: plugin called.");
      //vgap.addOns.vgapMapMarkUp.resetDrawTools();
    },

    /*
     * showsummary: executed when returning to the main screen of the dashboard
     */
    showsummary: function() {
      console.log("ShowSummary: plugin called.");
    },

    /*
     * loadmap: executed after the first turn has been loaded to create the map
     * as far as I can tell not executed again when using time machine
     */
    loadmap: function() {
      console.log("LoadMap: plugin called.");
      buildMFView();
      vgap.addOns.Minefields.vueapp = buildVueApp();

      //if (this.overlays != null) this.overlays.remove();
      //vgap.map.overlays_canvas = document.createElement("canvas");
      // vgap.map.overlays = vgap.map.overlays_canvas.getContext("2d");
      if (!vgap.map.zoomlevels) vgap.map.zoomlevels = [
        0.2,
        0.6,
        1,
        1.5,
        2.3,
        3.4,
        5.1,
        7.6,
        11.4,
        17.1,
        25.7,
        38.5,
        57.8,
        86.7,
        130.1,
        195.1,
        292.6,
        438.9,
        658.3
      ];
      //vgap.map.drawOverlays();
      //vgap.map.addMapTool("Draw", "ShowMinerals", vgap.addOns.vgapMapMarkUp.showDrawTools);
      //vgap.map.addMapTool("Layers", "ShowMinerals", vgap.addOns.vgapMapMarkUp.showOverlayFilter);


    },

    /*
     * showmap: executed when switching from dashboard to starmap
     */
    showmap: function() {
      console.log("ShowMap: plugin called.");
      //vgap.addOns.vgapMapMarkUp.resetDrawTools();
    },

    /*
     * draw: executed on any click or drag on the starmap
     */
    draw: function() {
      //console.log("Draw: plugin called.");
      //vgap.map.overlays.width = vgap.map.canvas.width;
      //vgap.map.overlays.height = vgap.map.canvas.height;
      //vgap.map.overlays = vgap.map.canvas.getContext("2d");
      //vgap.map.drawOverlays();
    },

    /*
     * loadplanet: executed a planet is selected on dashboard or starmap
     * loadstarbase: executed a planet is selected on dashboard or starmap
     * Inside the function "load" of vgapPlanetScreen (vgapPlanetScreen.prototype.load) the normal planet screen
     * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadplanet");'.
     *
     * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
     * can be accessed here as "vgap.planetScreen.X".
     */
    loadplanet: function() {
      //				console.log("LoadPlanet: plugin called.");
      //				console.log("Planet id: " + vgap.planetScreen.planet.id);
    },

    /*
     * loadstarbase: executed a planet is selected on dashboard or starmap
     * Inside the function "load" of vgapStarbaseScreen (vgapStarbaseScreen.prototype.load) the normal starbase screen
     * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadstarbase");'.
     *
     * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
     * can be accessed here as "vgap.starbaseScreen.X".
     */
    loadstarbase: function() {
      //				console.log("LoadStarbase: plugin called.");
      //				console.log("Starbase id: " + vgap.starbaseScreen.starbase.id + " on planet id: " + vgap.starbaseScreen.planet.id);
    },

    /*
     * loadship: executed a planet is selected on dashboard or starmap
     * Inside the function "load" of vgapShipScreen (vgapShipScreen.prototype.load) the normal ship screen
     * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadship");'.
     *
     * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
     * can be accessed here as "vgap.shipScreen.X".
     */
    loadship: function() {
      //				console.log("LoadShip: plugin called.");
    },

    // END PLUGIN FUNCS




  };

  // register your plugin with NU
  vgap.registerPlugin(plugin, "Minefields");



  function buildMFView() {
    let html = "<div id='minefieldcalc' v-bind:class='{hide: notActive}'>";

    //<input type="text" autofocus v-bind:disabled="inputDisabled" v-model:value="inputValue" v-on:input="handleInput" name="inputfield">


    html += "#: <input id='nom' maxlenght='4' size='4' v-model='nom' v-on:input='calculate'>";

    html += "<label for='torp-select'>Torp: </label>";
    html += "<select v-model='selected' v-on:change='calculate'>";
    html += "<option v-for='option in options' v-bind:value='option.value'>{{ option.text }} </option>";
    html += "</select>";
    html += "<label for='checkbox'>Robot:</label><input type='checkbox' id='checkbox' v-model='isrobot' v-on:change='calculate'>"
    html += "<table>";
    html += "<tr><td id='units'>Units: {{units}}</td><td id='radius'>Radius: {{radius}}</td><td class='red'>mc: {{fieldmc}}</td></tr>";
    html += "<tr><td id='units'>Units: {{decay}}</td><td id='radius'>Radius: {{decayradius}}</td><td class='red'>diff: {{diff}}</td></tr>";
    html += "<tr><td id='units'>mine hit: {{mhit}}%</td><td id='radius'>cloakd hit: {{cmhit}}%</td><td id='radius'>web hit: {{webhit}}%</td></tr>";
    html += "</table>";
    html += "<select v-model='sweeping' v-on:change='sweep'>";
    html += "<option v-for='beam in beams' v-bind:value='beam.value'>{{ beam.text }} </option>";
    html += "</select>";
    html += "<table>";
    html += "<tr><td id='units'>sweep: {{sweepmine}}</td><td id='radius'>web: {{sweepweb}}</td></tr>";
    html += "</table>";
    html += "<select v-model='selectrace'>";
    html += "<option v-for='race in races' v-bind:value='race.id'>{{ race.adjective }} </option>";
    html += "</select>";
    html += "<select v-model='selecthull' v-on:change='getHullSpec();calculateSum()'>";
    html += "<option v-for='hull in hulls' v-bind:value='hull.id'>TL:{{hull.techlevel}} - {{ hull.name }} </option>";
    html += "</select>";
    html += "<table>";
    html += "<tr><td><div class='lvalmines mc'>{{hullmc}}</div></td><td><div class='lvalmines dur'>{{hulldur}}</div></td>";
    html += "<td><div class='lvalmines tri'>{{hulltri}}</div></td><td><div class='lvalmines mol'>{{hullmol}}</div></td></tr>";
    html += "</table>";



    html += "<div class='specialInfo'>";
    html += "{{vgap.getHull(this.selecthull).special}}"
    html += "</div>";

    html += "<div id='myBuildPartInfo'>";
    html += "<div class='BuildPartProp'><label>Mass</label><span>{{currhull.mass}} kt</span></div>";
    html += "<div class='BuildPartProp'><label>Cargo</label><span>{{currhull.cargo}} kt</span></div>";
    html += "<div class='BuildPartProp'><label>Crew</label><span>{{currhull.crew}}</span></div>";
    html += "<div class='BuildPartProp'><label>Engines</label><span>{{currhull.engines}}</span></div>";
    html += "<div class='BuildPartProp'><label>Fuel</label><span>{{currhull.fueltank}} kt</span></div>";
    html += "<div class='BuildPartProp'><label>Beams</label><span>{{currhull.beams}}</span></div>";
    html += "<div class='BuildPartProp'><label>Torps</label><span>{{currhull.launchers}}</span></div>";
    html += "<div class='BuildPartProp'><label>F-Bays</label><span>{{currhull.fighterbays}}</span></div>";
    html += "</div>";



    html += "<div id='myPartInfo'>";

    // Sum all costs
    html += "<div class='restable'><span class='sumcosts'>Sum.:</span><table class='engineres'>";
    html += "<tr><td><div class='lvalmines mc'>{{summc}}</div></td>";
    html += "<td><div class='lvalmines dur'>{{sumdur}}</div></td>";
    html += "<td><div class='lvalmines tri'>{{sumtri}}</div></td>";
    html += "<td><div class='lvalmines mol'>{{summol}}</div></td></tr>";
    html += "</table>";

    html += "<div class='engineres'><table class='engineres'>";
    html += "<tr><td><div class='lvalmines mc'>{{vgap.getEngine(this.selectengine).cost * vgap.getHull(this.selecthull).engines}}</div></td>";
    html += "<td><div class='lvalmines dur'>{{vgap.getEngine(this.selectengine).duranium * vgap.getHull(this.selecthull).engines}}</div></td>";
    html += "<td><div class='lvalmines tri'>{{vgap.getEngine(this.selectengine).tritanium * vgap.getHull(this.selecthull).engines}}</div></td>";
    html += "<td><div class='lvalmines mol'>{{vgap.getEngine(this.selectengine).molybdenum * vgap.getHull(this.selecthull).engines}}</div></td></tr>";
    html += "</table>";
    html += "<select v-model='selectengine' v-on:change='calculateSum'>";
    html += "<option v-for='engine in vgap.engines' v-bind:value='engine.id'>TL:{{engine.techlevel}} - {{ engine.name }} </option>";
    html += "</select></div>";


    html += "<div class='restable'><table class='engineres' v-bind:class='{hide: !hasbeams}'>";
    html += "<tr><td><div class='lvalmines mc'>{{vgap.getBeam(this.selectbeam).cost * vgap.getHull(this.selecthull).beams}}</div></td>";
    html += "<td><div class='lvalmines dur'>{{vgap.getBeam(this.selectbeam).duranium * vgap.getHull(this.selecthull).beams}}</div></td>";
    html += "<td><div class='lvalmines tri'>{{vgap.getBeam(this.selectbeam).tritanium * vgap.getHull(this.selecthull).beams}}</div></td>";
    html += "<td><div class='lvalmines mol'>{{vgap.getBeam(this.selectbeam).molybdenum * vgap.getHull(this.selecthull).beams}}</div></td>";
    html += "<td><div class=''>m: {{vgap.getBeam(this.selectbeam).mass * vgap.getHull(this.selecthull).beams}} kt</div></td>";
    html += "</tr></table>";
    html += "<select v-model='selectbeam' v-bind:class='{hide: !hasbeams}' v-on:change='calculateSum'>";
    html += "<option v-for='beam in vgap.beams' v-bind:value='beam.id'>TL:{{beam.techlevel}} - {{ beam.name }} </option>";
    html += "</select></div>";


    html += "<div class='restable'><table class='engineres' v-bind:class='{hide: !hastorps}'>";
    html += "<tr><td><div class='lvalmines mc'>{{vgap.getTorpedo(this.selecttorp).launchercost * vgap.getHull(this.selecthull).launchers}}</div></td>";
    html += "<td><div class='lvalmines dur'>{{vgap.getTorpedo(this.selecttorp).duranium * vgap.getHull(this.selecthull).launchers}}</div></td>";
    html += "<td><div class='lvalmines tri'>{{vgap.getTorpedo(this.selecttorp).tritanium * vgap.getHull(this.selecthull).launchers}}</div></td>";
    html += "<td><div class='lvalmines mol'>{{vgap.getTorpedo(this.selecttorp).molybdenum * vgap.getHull(this.selecthull).launchers}}</div></td>";
    html += "<td><div class=''>m: {{vgap.getTorpedo(this.selecttorp).mass * vgap.getHull(this.selecthull).launchers}} kt</div></td>";
    html += "</tr></table>";
    html += "<select v-model='selecttorp' v-bind:class='{hide: !hastorps}' v-on:change='calculateSum'>";
    html += "<option v-for='torp in vgap.torpedos' v-bind:value='torp.id'>TL:{{torp.techlevel}} - {{ torp.name }} </option>";
    html += "</select></div>";




    html += "</div>"; // myPartInfo


    html += "</div>";

    $("#PlanetsContainer").prepend(html);

  }


  function buildVueApp() {

    let vueapp = new Vue({
      el: '#minefieldcalc',
      data: {
        notActive: true,
        hasbeams: false,
        hastorps: false,
        summc: 0,
        sumtri: 0,
        sumdur: 0,
        summol: 0,
        selectbeam: 1,
        selectengine: 1,
        selecttorp: 1,
        hullmc: 0,
        hulldur: 0,
        hulltri: 0,
        hullmol: 0,
        units: 0,
        nom: 10,
        isrobot: false,
        minedecay: 5,
        decay: 0,
        minetravelcloaked: 0.5,
        minetravel: 1,
        webtravel: 5,
        decayradius: 0,
        minesweeprate: 4,
        websweeprate: 3,
        sweeping: 1,
        selectrace: 1,
        selecthull: 1,
        races: vgap.races,
        selected: 1,
        options: [{
            text: 'MK 1 Photon',
            value: 1,
            mc: 1
          },
          {
            text: 'Proton Torp',
            value: 4,
            mc: 2
          },
          {
            text: 'MK 1 Photon',
            value: 9,
            mc: 5
          },
          {
            text: 'Gamma Bomb',
            value: 16,
            mc: 10
          },
          {
            text: 'MK 3 Photon',
            value: 25,
            mc: 12
          },
          {
            text: 'MK 4 Photon',
            value: 36,
            mc: 13
          },
          {
            text: 'MK 5 Photon',
            value: 49,
            mc: 31
          },
          {
            text: 'MK 6 Photon',
            value: 64,
            mc: 35
          },
          {
            text: 'MK 7 Photon',
            value: 81,
            mc: 36
          },
          {
            text: 'MK 8 Photon',
            value: 100,
            mc: 54
          }
        ],
        beams: [{
            text: 'Laser',
            value: 1
          },
          {
            text: 'X-Ray Laser',
            value: 4
          },
          {
            text: 'Plasma Bolt',
            value: 9
          },
          {
            text: 'Blaster',
            value: 16
          },
          {
            text: 'Positron Beam',
            value: 25
          },
          {
            text: 'Disruptor',
            value: 36
          },
          {
            text: 'Heavy Blaster',
            value: 49
          },
          {
            text: 'Phaser',
            value: 64
          },
          {
            text: 'Heavy Disruptor',
            value: 81
          },
          {
            text: 'Heavy Phaser',
            value: 100
          }
        ]
      },
      methods: {
        calculate: function() {
          console.log("VUE Event fired");

          this.units = this.nom * this.selected;
          this.isrobot ? this.units *=4 : this.unis;
          //this.radius = Math.round(Math.sqrt(this.units));
          this.decay = Math.round((100 - this.minedecay) / 100 * this.units);
          this.decayradius = Math.round(Math.sqrt(this.decay));
        },
        sweep: function(){
          this.sweepmine = Math.round((this.units/(this.sweeping * this.minesweeprate))*100)/100;
          this.sweepweb = Math.round((this.units/(this.sweeping * this.websweeprate))*100)/100;
        },
        getHullSpec: function(){
          this.hullmc = vgap.getHull(this.selecthull).cost;
          this.hulldur = vgap.getHull(this.selecthull).duranium;
          this.hulltri = vgap.getHull(this.selecthull).tritanium;
          this.hullmol = vgap.getHull(this.selecthull).molybdenum;
          this.hasbeams = vgap.getHull(this.selecthull).beams && 1;
          this.hastorps = vgap.getHull(this.selecthull).launchers && 1;
        },
        calculateSum: function(){

          let enginecount = vgap.getHull(this.selecthull).engines;

          this.summc = this.hullmc + enginecount * vgap.getEngine(this.selectengine).cost ;
          this.sumdur = this.hulldur + enginecount * vgap.getEngine(this.selectengine).duranium;
          this.summol = this.hullmol + enginecount * vgap.getEngine(this.selectengine).molybdenum;
          this.sumtri = this.hulltri + enginecount * vgap.getEngine(this.selectengine).tritanium;

          if (this.hasbeams) {
            let beamcount = vgap.getHull(this.selecthull).beams;
            this.summc += beamcount * vgap.getBeam(this.selectbeam).cost;
            this.sumdur += beamcount * vgap.getBeam(this.selectbeam).duranium;
            this.summol += beamcount * vgap.getBeam(this.selectbeam).molybdenum;
            this.sumtri += beamcount * vgap.getBeam(this.selectbeam).tritanium;
          }
          if (this.hastorps) {
            let torpcount = vgap.getHull(this.selecthull).launchers;
            this.summc += torpcount * vgap.getTorpedo(this.selecttorp).launchercost;
            this.sumdur += torpcount * vgap.getTorpedo(this.selecttorp).duranium;
            this.summol += torpcount * vgap.getTorpedo(this.selecttorp).molybdenum;
            this.sumtri += torpcount * vgap.getTorpedo(this.selecttorp).tritanium;
          }


        }
      },
      computed: {
        mhit: function() {
          return 100 - Math.round(Math.pow((100-this.minetravel)/100,this.radius)*100);
        },
        cmhit: function() {
          return 100 - Math.round(Math.pow((100-this.minetravelcloaked)/100,this.radius)*100);
        },
        webhit: function() {
          return 100 - Math.round(Math.pow((100-this.webtravel)/100,this.radius)*100);
        },
        radius: function() {
          return Math.round(Math.sqrt(this.units));
        },
        diff:function() {
          return this.decay - this.units;
        },
        sweepmine: function() {
          return Math.round((this.units/(this.sweeping * this.minesweeprate))*100)/100;
        },
        sweepweb: function() {
          return Math.round((this.units/(this.sweeping * this.websweeprate))*100)/100;
        },
        fieldmc: function (){
          let price = 1;
          for (let i in this.options) {
            if (this.options[i].value == this.selected) {
              price = this.options[i].mc;
              break;
            }
          }
          return this.nom * price;
        },
        hulls: function(){
          let result = [];
          let hullstring = vgap.races[this.selectrace].basehulls;
          if(vgap.settings.campaignmode) hullstring = vgap.races[this.selectrace].hulls;

          let hullarray = hullstring.split(",");

          for (let i=0; i<hullarray.length; i++){
            result.push(vgap.getHull(hullarray[i]));
          }
          return result.sort(compareHulls);
        },
        currhull: function(){
          return vgap.getHull(this.selecthull);
        }


      }
    });

    return vueapp;
  }

//helpers

function compareHulls(a, b){
  if (a.techlevel < b.techlevel) return -1;
  else if (a.techlevel > b.techlevel) return 1;
}


} //wrapper for injection

//vue stuff

var vu = document.createElement("script");
vu.type = "application/javascript";
vu.src = "https://cdn.jsdelivr.net/npm/vue";
document.head.appendChild(vu);


var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
//document.body.removeChild(script);
