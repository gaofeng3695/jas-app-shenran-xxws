appcan.ready(function() {
    userObj.init();
});

// window.onerror = function(msg, url, line) {
// alert("erro" + msg + "\n" + url + ":" + line);
// return true;
// };

(function(appcan, window, $, baseOperation) {
    var obj = {
        address : "",
        jasHttpRequest : new JasHttpRequest(),
        eventMap : {
            'blur #residential' : 'e_checkarea',
            'blur #building' : 'e_checkbuilding',
            'blur #unit' : 'e_checkunit',
            'blur #room' : 'e_checkroom',
            'blur #userFileCode' : 'e_checkuserfilecode',
            'blur #userFileName' : 'e_checkuserfilename',
            'blur #contactUser' : 'e_checkcontactuser',
            'blur #contactPhone' : 'e_checkcontactphone',
            'click #chooseaddress' : 'loadarea',
        },
        paramsObj : {},
        elem : {
            location : '#location',
            residential : '#residential',
            building : '#building',
            unit : '#unit',
            room : '#room',
            userFileCode : '#userFileCode',
            userFileName : '#userFileName',
            contactUser : '#contactUser',
            contactPhone : '#contactPhone',
            region : ".region"
        },
        initElem : function() {
            var eles = this.elem;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        renderForm : function(obj) {
            var that = this;
            obj.location && this.location.val(obj.location).parent().removeClass('bgMustDone');
            obj.residential && this.residential.val(obj.residential).parent().removeClass('bgMustDone');
            this.building.val(obj.biulding);
            this.unit.val(obj.unit);

            obj.enterhomeUserTypeCode && $('#usertype select').val(obj.enterhomeUserTypeCode).trigger('change');
            obj.userStatusCode && $('#userstatus select').val(obj.userStatusCode).trigger('change');

            appcan.on('regionReady', function() {
                if (obj.userRegionList && obj.userRegionList.length > 0) {
                    that.region.val(obj.userRegionList[0].regionId).trigger('change');
                }
            });

        },
        initParamObj : function() {
            var sUser = appcan.locStorage.val('newUserObj');
            var oUser = sUser ? JSON.parse(sUser) : {};
            var regionInfo = window.uexRegionSelection && uexRegionSelection.getRegionInfo();
            var oRegionInfo = regionInfo ? JSON.parse(regionInfo) : {};

            //alert(JSON.stringify(oUser),'',4)
            this.paramsObj = {

                areaCode : oRegionInfo.regionCode || '',
                location : oRegionInfo.region || '',
                residential : oUser.residential || '',
                biulding : oUser.biulding || '', //???????????????biulding?????????????????????????????????
                unit : oUser.unit || '',
                room : '',
                userRegionList : oUser.userRegionList || null,
                userFileCode : '',
                userFileName : '',
                enterhomeUserTypeCode : oUser.enterhomeUserTypeCode || '',
                userStatusCode : oUser.userStatusCode || '',
                contactUser : '',
                contactPhone : '',
                userPlanList : [{
                    "planId" : appcan.locStorage.val("planId")
                }],
            };
        },
        init : function() {
            this.initAllRegion();
            this.initElem();
            this.initParamObj();
            this.bindEvent();
            this.renderForm(this.paramsObj);
        },
        initAllRegion : function() {
            var that = this;
            var params = {
                planId : appcan.locStorage.val("planId"),
                pageNum : 1,
                pageSize : 1000,
            };
            // alert(JSON.stringify(params));
            var url = "cloudlink-inspection-event/commonData/region/getPageList";
            that.jasHttpRequest.jasHttpPost(url, function(id, status, dbSource) {
                if (dbSource == "") {
                    baseOperation.alertToast("??????????????????????????????");
                    return;
                }
                var result = JSON.parse(dbSource);
                if (result.success == 1) {
                    that.createOption(result.rows);
                }
            }, JSON.stringify(params));

        },
        createOption : function(aData) {
            var s = " <option value=''>?????????????????????</option>";
            aData.forEach(function(item, index, arr) {
                s += '<option value="' + item.objectId + '">' + item.regionName + '</option>'
            });
            //   s += '<option value="none">?????????</option>';
            this.region.html(s);
            appcan.trigger('regionReady');
        },
        bindEvent : function() {
            var that = this;
            that.initializeOrdinaryEvent(that.eventMap);
            appcan.select("#usertype", function(ele, value) {
                that.paramsObj.enterhomeUserTypeCode = value;
            });
            appcan.select("#userstatus", function(ele, value) {
                that.paramsObj.userStatusCode = value;
            });
            appcan.select("#selectregion", function(ele, value) {
                if (value.trim().length == 0) {
                    that.paramsObj.userRegionList = null;
                    return;
                }
                var regionList = [{
                    "regionId" : value,
                }];
                that.paramsObj.userRegionList = regionList;

            });
        },
        initializeOrdinaryEvent : function(maps) {
            this._scanEventsMap(maps, true);
        },
        _scanEventsMap : function(maps, isOn) {
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var type = isOn ? 'on' : 'off';
            for (var keys in maps) {
                if (maps.hasOwnProperty(keys)) {
                    if ( typeof maps[keys] === 'string') {
                        maps[keys] = this[maps[keys]].bind(this);
                    }
                    var matchs = keys.match(delegateEventSplitter);
                    $('body')[type](matchs[1], matchs[2], maps[keys]);
                }
            }
        },
        checkForm : function(resource) {//??????????????????????????????????????????
            this.updataParamObj();
            if (this.checkInput()) {
                this.paramsObj.address = this.address;
                this.paramsObj.objectId = baseOperation.createuuid();
                appcan.locStorage.val('newUserObj', this.paramsObj);
                //alert(appcan.locStorage.val('newUserObj'));
                this.saveUserToService(resource);
                return;
            }

        },
        updataParamObj : function() {
            var that = this;
            var obj = {
                location : that.location.val(),
                residential : that.residential.val().trim(),
                biulding : that.building.val().trim(),
                unit : that.unit.val().trim(),
                room : that.room.val().trim(),
                userFileCode : that.userFileCode.val().trim(),
                userFileName : that.userFileName.val().trim(),
                contactUser : that.contactUser.val().trim(),
                contactPhone : that.contactPhone.val().trim(),

            };
            $.extend(that.paramsObj, obj);
        },
        saveUserToService : function(resource) {
            var that = this;
            var url = 'cloudlink-inspection-event/userArchive/save';
            that.jasHttpRequest.jasHttpPost(url, function(id, status, dbSource) {

                // uexLog.sendLog(that.paramsObj.objectId);
                if (dbSource == "") {
                    baseOperation.alertToast("??????????????????????????????");
                    return;
                }
                var result = JSON.parse(dbSource);
                if (result.success == 1) {
                    baseOperation.alertToast("????????????");
                    if (resource == "save") {
                        appcan.window.evaluateScript('new_user', 'wrapperObj.close()');
                        // appcan.openWinWithUrl('useraddresslist', 'useraddresslist.html');
                    } else {
                        appcan.locStorage.val('userFileId', that.paramsObj.objectId);
                        appcan.locStorage.val('recordEntrance', 'new');
                        //??????????????????????????????????????????????????????????????????????????????????????????????????????
                        appcan.openWinWithUrl('new_record', '../new_record/new_record.html');
                    }
                } else {
                    if (result.code == "XE03001") {
                        baseOperation.alertToast("????????????????????????");
                        return;
                    }
                    if (result.code == "XE03002") {
                        baseOperation.alertToast("??????????????????");
                        return;
                    }
                    baseOperation.alertToast("??????????????????????????????");
                    return;
                }
            }, JSON.stringify(that.paramsObj));

        },
        checkInput : function() {
            var that = this;
            if (!that.checkAddress()) {//??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                return false;
            } else if (!that.e_checkarea()) {
                return false;
            } else if (!that.e_checkbuilding()) {
                return false;
            } else if (!that.e_checkunit()) {
                return false;
            } else if (!that.e_checkroom()) {
                return false;
            } else if (!that.e_checkuserfilecode()) {
                return false;
            } else if (!that.e_checkuserfilename()) {
                return false;
            } else if (!that.e_checkcontactuser()) {
                return false;
            } else if (!that.e_checkcontactphone()) {
                return false;
            } else {
                return true;
            }
        },
        loadarea : function() {
            var that = this;
            if (window.uexRegionSelection) {
                if (!that.isRegionCbSeted) {
                    that.isRegionCbSeted = true;
                    uexRegionSelection.cbOpenRegionPicker = function(opId, dataType, data) {
                        var regionData = JSON.parse(data);
                        that.location.val(regionData.region);
                        that.location.parent().removeClass('bgMustDone');
                        that.paramsObj.location = regionData.region;
                        that.paramsObj.areaCode = regionData.regionCode;
                    }
                }
                uexRegionSelection.openRegionPicker();
            } else {
                alert('??????????????????');
                that.location.val('???????????????????????????');
                that.location.parent().removeClass('bgMustDone');
                that.paramsObj.location = '???????????????????????????';
                that.paramsObj.areaCode = 100012301230000;
            }

        },
        checkAddress : function() {
            var location = this.location.val().trim();
            if (location) {
                this.address = location;
                this.location.parent().removeClass('bgMustDone');
                return true;
            } else {
                this.location.parent().addClass('bgMustDone');
                baseOperation.alertToast("?????????????????????");
                return false;
            }
        },
        e_checkarea : function() {
            var area = this.residential.val().trim();
            if (area.length == 0) {
                this.residential.parent().addClass('bgMustDone');
                baseOperation.alertToast("???????????????/???");
                return false;
            } else if (area.length > 25) {
                this.residential.parent().addClass('bgMustDone');
                baseOperation.alertToast("?????????????????????????????????/??????????????????25??????");
                return false;
            } else {
                this.address += area + "-";
                this.residential.parent().removeClass('bgMustDone');
                return true;
            }
        },
        e_checkbuilding : function() {
            var building = this.building.val().trim();
            if (building) {
                if (building.length > 15) {
                    baseOperation.alertToast("??????????????????????????????????????????15??????");
                    return false;
                } else {
                    this.address += building + "-";
                    return true;
                }
            } else {
                return true;
            }

        },
        e_checkunit : function() {
            var unit = this.unit.val().trim();
            if (unit) {
                if (unit.length > 15) {
                    baseOperation.alertToast("?????????????????????????????????????????????15??????");
                    return false;
                } else {
                    this.address += unit + "-";
                    return true;
                }
            } else {
                return true;
            }

        },
        e_checkroom : function() {
            var room = this.room.val().trim();
            if (room.length == 0) {
                this.room.parent().addClass('bgMustDone');
                baseOperation.alertToast("?????????????????????");
                return false;
            } else if (room.length > 50) {
                this.room.parent().addClass('bgMustDone');
                baseOperation.alertToast("?????????????????????????????????????????????50??????");
                return false;
            } else {
                this.address += room;
                this.room.parent().removeClass('bgMustDone');
                return true;
            }
        },
        e_checkuserfilecode : function() {
            var userfilecode = this.userFileCode.val().trim();
            if (userfilecode.length > 25) {
                baseOperation.alertToast("????????????????????????????????????????????????25??????");
                return false;
            } else {
                return true;
            }
        },
        e_checkuserfilename : function() {
            var userfilename = this.userFileName.val().trim();
            if (userfilename.length > 25) {
                baseOperation.alertToast("????????????????????????????????????????????????25??????");
                return false;
            } else {
                return true;
            }
        },
        e_checkcontactuser : function() {
            var contactuser = this.contactUser.val().trim();
            if (contactuser.length > 25) {
                baseOperation.alertToast("?????????????????????????????????????????????25??????");
                return false;
            } else {
                return true;
            }
        },
        e_checkcontactphone : function() {
            var tel = this.contactPhone.val().trim();
            var reg = /^((1\d{10})|(([0-9]{3,4}-)?[0-9]{7,8}))$/;
            if (tel && !reg.test(tel)) {
                baseOperation.alertToast("??????????????????????????????", 1000);
                return false;
            }
            return true;
        },
    };
    window.userObj = obj;
})(appcan, window, $, baseOperation)
