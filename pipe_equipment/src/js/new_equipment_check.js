 // window.onerror = function(msg, url, line) {
     // alert("erro" + msg + "\n" + url + ":" + line);
     // return true;
 // };

 appcan.ready(function() {

     newEquipmentCheckObj.init();

 });

 (function(appcan, window, $, baseOperation, JasHttpRequest, imagesObj, voiceObj, getLocationObj) {
     var obj = {
         paramsObj: null,
         eventsMap: {
             'click #selectEquip': 'e_selectEquip',
             'click #seefacilityAddress': 'e_seefacilityAddress',
             'change input[type="radio"]': 'e_triggerRadioChange',
             'blur #combustibleGasConcentration': 'e_checkCombustibleGasConcentration',
             'blur #pressureIn': 'e_checkPressureIn',
             'blur #pressureOut': 'e_checkPressureOut',
         },
         elem: {
             maskWrapper: '#maskWrapper',
             pressWrapper: '.press',
             flowWrapper: '.flow',
             wellWrapper: '.well',
             result: '#result',

             facilityCheckTime: '#facilityCheckTime',
             facilityName: '#facilityName',
             facilityTypeName: '#facilityTypeName',
             facilityAddress: '#facilityAddress',
             isLeakage: '.isLeakage',
             combustibleGasConcentration: '#combustibleGasConcentration',
             isFacilityWork: '.isFacilityWork',
             facilityWorkDesc: '#facilityWorkDesc',
             pressureSituation: '.pressureSituation',
             pressureIn: '#pressureIn',
             pressureOut: '#pressureOut',
             isSeeper: '.isSeeper',
             isWellCoverDamage: '.isWellCoverDamage',
             isOccupy: '.isOccupy',
             flowmeterData: '#flowmeterData',
             remark: '#remark'
         },
         init: function() {
             imagesObj.init({
                 wrapper: '.photo_list',
                 max: 6,
                 domCount: '#pic_count',
                 domMax: '#pic_count_max',
             });
             this.initAppcanParams();

             this.initParamsObj();
             this.initElem();
             this.initParamsObjandRender();
             this.bindEvent();
             baseOperation.addEmojiFliterEvent('textarea');
             //????????????emoji?????????
         },
         initAppcanParams: function() {
             this.jasHttpRequest = new JasHttpRequest();
         },
         initParamsObj: function() {
             //var recordId = baseOperation.createuuid();
             this.paramsObj = {
                 facilityName: '',
                 address: '',
                 facilityTypeCode: '',
                 facilityTypeName: '',
                 localbdLat: '',
                 localbdLon: '',

                 objectId: baseOperation.createuuid(), //ID
                 facilityId: '', //??????ID
                 facilityCheckTime: (new Date()).Format("yyyy-MM-dd HH:mm:ss"), // ????????????????????????????????????????????????????????????

                 facilityCheckResult: '', //????????????(0:??????  1:??????)
                 isLeakage: 0, //??????????????????????????????0??????   1??????   ???
                 combustibleGasConcentration: '', //??????????????????
                 isFacilityWork: 0, //?????????????????????0:??????  1????????????
                 facilityWorkDesc: '', //??????????????????
                 pressureSituation: 0, //???????????????0:??????  1????????????
                 pressureIn: '', //????????????
                 pressureOut: '', //????????????
                 isSeeper: 0, //?????????????????????0:???  1?????????
                 isWellCoverDamage: 0, //?????????????????????0:???  1?????????
                 isOccupy: 0, //???????????????0:???  1?????????
                 flowmeterData: '', //???????????????
                 remark: '', //??????
                 inspector_address: '', // ????????????????????????????????????????????????
                 bdLon: '', //????????????lon 
                 bdLat: '', //????????????lat 
                 lon: '', //GPS??????lon 
                 lat: '', //GPS??????lat
                 attas: [
                     // {
                     //     attaType: "pic",
                     //     src: '../src/images/map_h.png'
                     // }                        
                 ],
                 voiceSrc: '', //????????????
                 inspRecordId:uexLockScreen.getRecordId()//inspRecordId ??????????????? inspRecordId  sf 2017-06-27 ???
             };
         },
         initParamsObjandRender: function() {
             var that = this;
             var clickResource = appcan.locStorage.getVal('equipmentCheckEntrance');
             that.Entrance = clickResource;
             appcan.locStorage.remove('equipmentCheckEntrance');

             if (clickResource === "new") {
                 that.renderPage(that.paramsObj);
                 that.getUserLocation();
                 return;
             }

             if (clickResource === "dailyCheck") {                
                 that.renderPage(that.paramsObj);
                 that.getUserLocation();
                 //that.facilityAddress.parent().removeClass('bgSelectLoca');
                 return;
             }


             if (clickResource === "map") {
                 that.trigerEquipmentSelected();
                 that.renderPage(that.paramsObj);
                 that.getUserLocation();
                 return;
             }
             if (clickResource === "local") {
                 //????????????????????????????????????????????????
                 var recordId = appcan.locStorage.getVal('facilityCheckId');
                 selectOfflineFacilityRecord(recordId, function(result) { //???????????????????????????
                     if (result.success == 1) {
                         //alert(JSON.stringify(result));
                         $.extend(that.paramsObj, result.data);
                         that.renderPage(that.paramsObj);
                        that.checkPostData(that.paramsObj);                         
                         //that.initImg(recordId);
                     } else {
                         baseOperation.alertToast("??????????????????,???????????????");
                     }
                 });
             }
         },
         renderPage: function(obj) { //recordObject
             var that = this;
             //?????????????????????

             that.facilityCheckTime.html(obj.facilityCheckTime);
             that._renderFacilityInfo(obj);
             that._renderSwitchForm(obj);

             that.remark.val(obj.remark || '');

             imagesObj.renderPicAndCount(obj.attas.map(function(item) { //????????????
                 return item.url;
             }));

             voiceObj.init(obj.voiceSrc || ''); //??????????????????????????????
         },
         getUserLocation: function() {
             var that = this;
             getLocationObj.init(function(sObj) {
                 var obj = JSON.parse(sObj);
                 that.paramsObj.bdLon = obj.bdLon; //????????????lon 
                 that.paramsObj.bdLat = obj.bdLat; //????????????lat 
                 that.paramsObj.lon = obj.lon; //GPS??????lon 
                 that.paramsObj.lat = obj.lat; //GPS??????lat            
             });
         },
         _renderFacilityInfo: function(obj) {
             var that = this;
             // ??????????????????
             var sName = obj.facilityName || '';
             if (sName) {
                 $('.disableMask').removeClass('disableMask');
             } else {
                 sName = '<span class="sc-text-active">???????????????</span>';
             }
             that.facilityName.html(sName);
             //??????????????????
             that.facilityTypeName.html(obj.facilityTypeName || '');
             //????????????
             that.facilityAddress.html(obj.address || '');
             if (obj.address && that.Entrance !== 'dailyCheck') {
                 that.facilityAddress.parent().addClass('bgSelectLoca');
             } else {
                 that.facilityAddress.parent().removeClass('bgSelectLoca');
             }
         },
         _renderSwitchForm: function(obj) {
             var that = this;

             that.isLeakage.filter('[value = "' + obj.isLeakage + '"]').attr('checked', true);
             that.combustibleGasConcentration.val(obj.combustibleGasConcentration || '');
             that.isFacilityWork.filter('[value = "' + obj.isFacilityWork + '"]').attr('checked', true);
             that.facilityWorkDesc.val(obj.facilityWorkDesc || '');

             var sType = obj.facilityTypeCode || '';

             if (sType === 'FT_01') { //????????????
                 that.wellWrapper.addClass('uhide');
                 that.flowWrapper.addClass('uhide');
                 that.pressWrapper.removeClass('uhide');
                 that.pressureSituation.filter('[value = "' + obj.pressureSituation + '"]').attr('checked', true);
                 that.pressureIn.val(obj.pressureIn || '');
                 that.pressureOut.val(obj.pressureOut || '');
                 if(!obj.pressureIn){
                      that.pressureIn.parent().addClass('bgMustDone');
                 }
                 if(!obj.pressureOut){
                      that.pressureOut.parent().addClass('bgMustDone');
                 }
             } else if (sType === 'FT_04') { //???
                 that.wellWrapper.removeClass('uhide');
                 that.flowWrapper.addClass('uhide');
                 that.pressWrapper.addClass('uhide');
                 that.isSeeper.filter('[value = "' + obj.isSeeper + '"]').attr('checked', true);
                 that.isWellCoverDamage.filter('[value = "' + obj.isWellCoverDamage + '"]').attr('checked', true);
                 that.isOccupy.filter('[value = "' + obj.isOccupy + '"]').attr('checked', true);
             } else if (sType === 'FT_10') { //?????????
                 that.wellWrapper.addClass('uhide');
                 that.flowWrapper.removeClass('uhide');
                 that.pressWrapper.addClass('uhide');
                 that.flowmeterData.val(obj.flowmeterData || '');
                 
             } else {
                 that.wellWrapper.addClass('uhide');
                 that.flowWrapper.addClass('uhide');
                 that.pressWrapper.addClass('uhide');
             }
             that._renderAndUpdateResult(obj);
         },
         _renderAndUpdateResult: function(obj) {
             var that = this;
             var sType = obj.facilityTypeCode || '';
             if (!sType) {
                 that.result.html('--').removeClass('clrWarn');
                 return;
             }
             that.maskWrapper.removeClass('disableMask');
             that._setResult(false);
             if ((obj.isLeakage == 1) || (obj.isFacilityWork == 1)) {
                 that._setResult(true);
                 return;
             }
             if (sType === 'FT_01') { //????????????
                 that._setResult(obj.pressureSituation == 1);
                 return;
             }
             if (sType === 'FT_04') { //???
                 that._setResult((obj.isSeeper == 1) || (obj.isWellCoverDamage == 1) || (obj.isOccupy == 1));
             }
         },
         _setResult: function(isdanger) {
             var that = this;
             if (isdanger) {
                 that.result.html('??????').addClass('clrWarn');
                 that.paramsObj.facilityCheckResult = 1;
             } else {
                 that.result.html('??????').removeClass('clrWarn');
                 that.paramsObj.facilityCheckResult = 0;
             }
         },

         checkPostData: function(obj) {
             var that = this;
             if (!that._checkSwitchFrom(obj)) {
                 return false;
             }
             return true;
         },
         _checkSwitchFrom: function(obj) {
             var that = this;

             var sType = obj.facilityTypeCode || '';
             if (!sType) {
                 baseOperation.alertToast("???????????????", 2000);
                 return false;
             }
             //?????????????????????????????????????????????????????????????????????0.000-9999.000
             if (!that.e_checkCombustibleGasConcentration()) {
                return false;
             }             
             // if (!obj.combustibleGasConcentration || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(obj.combustibleGasConcentration)) {
             //     baseOperation.alertToast("????????????????????????????????????0.000-9999.999", 3000);
             //     return false;
             // }
             if (!that.e_checkPressureIn()) {
                return false;
             }  
             if (!that.e_checkPressureOut()) {
                return false;
             }  
             // if (sType === 'FT_01') { //????????????
             //     if (!obj.pressureIn || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(obj.pressureIn)) {
             //         baseOperation.alertToast('???????????????????????????0.000~9999.999', 3000);
             //         return false;
             //     }
             //     if (!obj.pressureOut || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(obj.pressureOut)) {
             //         baseOperation.alertToast('???????????????????????????0.000~9999.999', 3000);
             //         return false;
             //     }
             // }         

             if (sType === 'FT_10') { //?????????
                 if (obj.flowmeterData && !(/^[0-9]{1,7}(\.[0-9]{1,2})?$/g).test(obj.flowmeterData)) {
                     baseOperation.alertToast('?????????????????????0.00-9999999.99', 3000);
                     return false;
                 }
                 return true;
             }
             return true;
         },
         e_checkCombustibleGasConcentration: function() {
             var that = this;
             var sVal = that.combustibleGasConcentration.val();
             //?????????????????????????????????????????????????????????????????????0.000-9999.000
             if (!sVal || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(sVal)) {
                 baseOperation.alertToast("????????????????????????????????????0.000-9999.999", 3000);
                 that.combustibleGasConcentration.parent().addClass('bgMustDone');
                 return false;
             }          
             that.combustibleGasConcentration.parent().removeClass('bgMustDone');
             return true;                
         },
         e_checkPressureIn: function() {
             var that = this;
             var sVal = that.pressureIn.val();
             var sType = that.paramsObj.facilityTypeCode || '';             
             if (sType === 'FT_01') { //????????????
                 if (!sVal || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(sVal)) {
                     that.pressureIn.parent().addClass('bgMustDone');
                     baseOperation.alertToast('???????????????????????????0.000~9999.999', 3000);
                     return false;
                 }
             }
             that.pressureIn.parent().removeClass('bgMustDone');
             return true;
         },
         e_checkPressureOut: function() {
             var that = this;
             var sVal = that.pressureOut.val();
             var sType = that.paramsObj.facilityTypeCode || '';             
             if (sType === 'FT_01') { //????????????
                 if (!sVal || !(/^[0-9]{1,4}(\.[0-9]{1,3})?$/g).test(sVal)) {
                     that.pressureOut.parent().addClass('bgMustDone');
                     baseOperation.alertToast('???????????????????????????0.000~9999.999', 3000);
                     return false;
                 }
             }
             that.pressureOut.parent().removeClass('bgMustDone');             
             return true;
         },
         initElem: function() {
             var eles = this.elem;
             for (var name in eles) {
                 if (eles.hasOwnProperty(name)) {
                     this[name] = $(eles[name]);
                 }
             }
         },
         updateParamsObj: function() {
             var that = this;
             var obj = {
                 combustibleGasConcentration: that.combustibleGasConcentration.val().trim(),
                 facilityWorkDesc: that.facilityWorkDesc.val().trim(),
                 pressureIn: that.pressureIn.val().trim(), //????????????
                 pressureOut: that.pressureOut.val().trim(), //???????????? 
                 flowmeterData: that.flowmeterData.val().trim(),
                 remark: that.remark.val().trim(),
             };
             $.extend(that.paramsObj, obj);
             that._updateAttaArr(); //????????????
             that.paramsObj.voiceSrc = voiceObj.recordPath;

             //alert(JSON.stringify(that.paramsObj));
         },
         _updateAttaArr: function() {
             var that = this;
             that.paramsObj.attas = imagesObj.imgArray.map(function(item, index) {
                 return {
                     bizType: 'pic', //pic ???esignature 
                     url: item.src
                 };
             });
         },
         bindEvent: function() {
             this.initializeOrdinaryEvent(this.eventsMap);
         },
         initializeOrdinaryEvent: function(maps) {
             this._scanEventsMap(maps, true);
         },
         _scanEventsMap: function(maps, isOn) {
             var delegateEventSplitter = /^(\S+)\s*(.*)$/;
             var type = isOn ? 'on' : 'off';
             for (var keys in maps) {
                 if (maps.hasOwnProperty(keys)) {
                     if (typeof maps[keys] === 'string') {
                         maps[keys] = this[maps[keys]].bind(this);
                     }
                     var matchs = keys.match(delegateEventSplitter);
                     $('body')[type](matchs[1], matchs[2], maps[keys]);
                 }
             }
         },
         trigerSaveToLocal: function() {
             this.updateParamsObj();
             if (this.checkPostData(this.paramsObj)) {
                 this.saveDataTOLocal();
             }
         },
         triggerToUpload: function() {
             var that = this;
             this.updateParamsObj();
             if (this.checkPostData(this.paramsObj)) {
                 appcan.window.evaluateScript('new_check', 'wrapperObj.isPostReady = false;');
                 uploadObj.uploadRecordByBO(this.paramsObj, function() {
                     if (that.Entrance === 'local') {
                         deleteOfflineFacilityRecord([that.paramsObj.objectId]);
                         appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                         return;
                     }
                     if (that.Entrance === 'dailyCheck') {
                         that.upInsEventCount();
                         appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                         appcan.openWinWithUrl("daily_check", "../../daily_check/daily_check.html");
                         return;
                     }
                     that.upInsEventCount(); 
                     appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                 }, function() {
                     //baseOperation.alertToast('????????????????????????');
                     appcan.window.evaluateScript('new_check', 'wrapperObj.isPostReady = true;');
                 });
             }

         },
         saveDataTOLocal: function() {
             var that = this;
             var oData = $.extend({}, this.paramsObj);
             var arrayData = [{
                 objectId: oData.objectId, //????????????ID
                 facilityId: oData.facilityId, //??????ID
                 facilityName: oData.facilityName, //????????????
                 address: oData.address, //????????????
                 facilityTypeCode: oData.facilityTypeCode, //??????????????????
                 facilityTypeName: oData.facilityTypeName, //??????????????????
                 facilityCheckTime: oData.facilityCheckTime, //????????????
                 facilityCheckResult: oData.facilityCheckResult, //????????????
                 postData: JSON.stringify(oData), //?????????
             }];
             //alert(JSON.stringify(oData));
             //alert("baocin"+JSON.stringify(arrayData));
             appcan.window.evaluateScript('new_check', 'wrapperObj.isSaveReady = false;');
             if (that.Entrance === "local") {
                 updateOfflineFacilityRecord(arrayData[0], function(result) {
                     //alert(JSON.stringify(result));
                     if (+result.success === 1) {
                         baseOperation.alertToast("????????????", 2000); //??????????????????????????????????????????????????????
                         that.upInsEventCount();
                         appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                         appcan.openWinWithUrl("daily_check", "../../daily_check/daily_check.html");
                         return;
                     } else {
                         baseOperation.alertToast("?????????????????????");
                     }
                     appcan.window.evaluateScript('new_check', 'wrapperObj.isSaveReady = true;');
                 });
                 return;
             }
             //alert(JSON.stringify(arrayData));
             saveOfflineFacilityRecord(arrayData, function(result) {
                 //alert(JSON.stringify(result))
                 if (+result.success === 1) {
                     baseOperation.alertToast("????????????", 2000); //??????????????????????????????????????????????????????
                    if (that.Entrance === 'dailyCheck') {
                         that.upInsEventCount();
                         appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                         appcan.openWinWithUrl("daily_check", "../../daily_check/daily_check.html");
                         return;
                    }  
                     that.upInsEventCount();                   
                     appcan.window.evaluateScript('new_check', 'appcan.window.close(-1);');
                     return;
                 } else {
                     baseOperation.alertToast("?????????????????????");
                 }
                 appcan.window.evaluateScript('new_check', 'wrapperObj.isSaveReady = true;');
             });
         },
         e_seefacilityAddress: function() {
             if (!this.paramsObj.address || !this.facilityAddress.parent().hasClass('bgSelectLoca')) {
                 return;
             }
             appcan.locStorage.val('bdPointObj', {
                 bdLon: this.paramsObj.localbdLon || '',
                 bdLat: this.paramsObj.localbdLat || '',
                 address: this.paramsObj.address || ''
             });
             appcan.openWinWithUrl('maplocation', '../detail_check/maplocation.html');
         },
         e_selectEquip: function() {
             var that = this;
             appcan.openWinWithUrl('choosePipe', '../new_check/choosePipe.html');
             appcan.locStorage.remove('equipmentSelectedObjs');
         },
         e_triggerRadioChange: function(e) {
             var that = this;
             var me = $(e.target);
             var type = me.attr('name');
             that.paramsObj[type] = me.attr('value');
             that._renderAndUpdateResult(that.paramsObj);
         },
         trigerEquipmentSelected: function() {
             var that = this;
             var sObj = appcan.locStorage.val('equipmentSelectedObjs');
             if (sObj) {
                 var obj = JSON.parse(sObj);
                 that.paramsObj.facilityId = obj.objectId;
                 that.paramsObj.facilityName = obj.facilityName;
                 that.paramsObj.facilityTypeName = obj.facilityTypeName;
                 that.paramsObj.facilityTypeCode = obj.facilityTypeCode;
                 that.paramsObj.address = obj.address;
                 that.paramsObj.localbdLon = obj.bdLon;
                 that.paramsObj.localbdLat = obj.bdLat;
                 that._renderFacilityInfo(that.paramsObj);
                 that._renderSwitchForm(that.paramsObj);
                 
             }
         },
         /*
          * ??????????????????????????????????????????????????????
          */
         upInsEventCount:function(){
             if(uexLockScreen.checkServerIsRunning()==1){
                var rcxj_facilities_count = appcan.locStorage.getVal("RCXJ_FACILITIES_COUNT");
                appcan.locStorage.setVal("RCXJ_FACILITIES_COUNT",++rcxj_facilities_count);
            }
         }
     };
     window.newEquipmentCheckObj = obj;
 })(appcan, window, Zepto, baseOperation, JasHttpRequest, imagesObj, voiceObj, getLocationObj);
