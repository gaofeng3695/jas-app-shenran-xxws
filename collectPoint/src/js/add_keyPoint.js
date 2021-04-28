var vue = new Vue({
    el : "#app",
    data : function() {
        return {
            modelOptions : [],
            form : {
                bdLat : 33.750163322125005,
                bdLon : 115.06669254718352,
                category : "1",
                code : "",
                effectiveRadius : "",
                groupId : "",
                groupName : "",
                inspectionModel : "一天一巡",
                inspectionTimes : "1",
                inspectionDays : "1",
                inspectionInterval : "12",
                location : "",
                name : "",
                origin : 5, //来源
                remark : "",
            },
            modelCode : "",
            detailInspectionModel : ""
        }
    },
    mounted : function() {
        var that = this;
        appcan.ready(function() {
            that.requestDomain();
        });
    },
    watch : {
        modelCode : function() {
            var that = this;
            var arr = that.modelOptions;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].value == that.modelCode) {
                    var desc = arr[i].desc.split(",");
                    that.detailInspectionModel = arr[i].text;
                    that.form.inspectionTimes = desc[1];
                    that.form.inspectionDays = desc[0];
                    that.form.inspectionInterval = desc[2];
                    return;
                }
            }
        },
    },
    methods : {
        requestDomain : function() {
            var that = this;
            var url = "/cloudlink-inspection-event/domain/getListByDomainName";
            var domainList = ['inspection_model'];
            jasRequest.post(url, {
                domainNameList : domainList
            }, function(oData) {
                that.modelOptions = [];
                that.modelCode = oData.rows[0].code;
                that.detailInspectionModel = oData.rows[0].value;
                oData.rows.forEach(function(item) {
                    var obj = {
                        value : item.objectId,
                        text : item.value,
                        desc : item.desc
                    }
                    that.modelOptions.push(obj);
                });
            });
        },
        selectGroup : function() {
            //请选择分组
            appcan.openWinWithUrl('select_group', '../openMap/select_group.html');
        },
        selectAddress : function() {
            var that = this;
            uexLockScreen.keyPointSelection(function(err, info) {
                if (err == 1) {
                    var result = JSON.parse(info);
                    that.form.bdLat = result.bdLat;
                    that.form.bdLon = result.bdLon;
                    that.form.location = result.address;
                }
            });
            // appcan.openWinWithUrl('select_address', '../openMap/select_address.html');
        },
        getGroup : function() {
            var that = this;
            if (appcan.locStorage.getVal("groupName")) {
                that.form.groupName = appcan.locStorage.getVal("groupName");
                that.form.groupId = appcan.locStorage.getVal("groupId");
            }
        },
        save : function() {
            var that = this;
            that.form.inspectionModel = that.detailInspectionModel;
            that._verifyObj(function() {
                that.saveToService();
            });
        },
        _verifyObj : function(callback) {
            var that = this;
            if (that.form.name.trim().length == 0) {
                baseOperation.alertToast("关键点名称不能为空");
                return;
            }
            if (that.form.name.trim().length > 45) {
                baseOperation.alertToast("关键点名称长度不能超过45个");
                return;
            }
            if (that.form.code.trim().length == 0) {
                baseOperation.alertToast("关键点编号不能为空");
                return;
            }
            if (that.form.code.trim().length > 45) {
                baseOperation.alertToast("关键点编号长度不能超过45个");
                return false;
            }
            if (that.form.inspectionModel.trim().length == 0) {
                baseOperation.alertToast("巡检模式不能为空");
                return;
            }
            if (that.form.effectiveRadius.trim().length == 0) {
                baseOperation.alertToast("有效半径不能为空");
                return;
            }
            var regNum1 = /^[0-9]+(()||(.[0-9]{3}))?$/;
            if (!regNum1.test(that.form.effectiveRadius.trim())) {
                baseOperation.alertToast("有效半径只能是数字");
                return false;
            }
            if (that.form.effectiveRadius > 200) {
                baseOperation.alertToast("有效半径不能大于200");
                return false;
            }
            if (that.form.groupName.trim().length == 0) {
                baseOperation.alertToast("请选择所属分组");
                return;
            }
            if (that.form.location.trim().length == 0) {
                baseOperation.alertToast("关键点位置不能为空");
                return;
            }
            if (callback) {
                callback();
            }
        },
        saveToService : function() {
            var that = this;
            var url = "/cloudlink-inspection-event/keyPoint/save";
            jasRequest.post(url, that.form, function(oData) {
                if (oData.success == 1) {
                    baseOperation.alertToast("新增成功");
                    appcan.window.evaluateScript('add_keyPoint', 'operations.close()');
                }
            }, function(s) {
                if (s.msg.indexOf("name") > -1) {
                    baseOperation.alertToast("关键点名称重复");
                    return;
                }
                if (s.msg.indexOf("code") > -1) {
                    baseOperation.alertToast("关键点编号重复");
                    return;
                }
                baseOperation.alertToast("网络异常，请稍候尝试");
            });
        },
    }
});
