var vue = new Vue({
    el : "#app",
    data : function() {
        return {
            dataArray : [],
            total : "",
            updateForm : {},
            queryObj : {
                pageNum : 1,
                pageSize : 20,
                keyword : "",
            }
        }
    },

    mounted : function() {
        var that = this;
        appcan.ready(function() {
            that.setBounce();
            that.requestList();
        });

    },
    methods : {
        requestList : function() {
            var that = this;
            var partURL = "cloudlink-inspection-event/keyPoint/app/page";
            baseOperation.londingToast('数据加载中，请稍后...', 99999);
            // appcan.logs(JSON.stringify(that.queryObj))
            jasRequest.post(partURL, that.queryObj, function(oData) {
                baseOperation.closeToast();
                that.total = oData.total;
                if (that.queryObj.pageNum == 1) {
                    that.dataArray = oData.rows;
                } else {
                    if (oData.rows.length > 0) {
                        that.dataArray = that.dataArray.concat(oData.rows);
                    } else {
                        baseOperation.alertToast('没有更多数据了');
                    }
                }
            });
        },
        refreshList : function() {
            var that = this;
            if (+that.queryObj.pageNum === 1) {
                this.requestList();
            } else {
                that.queryObj.pageNum = 1;
                that.requestList();
            }
        },
        setBounce : function() {
            var that = this;
            refreshBounce(function() {
                that.refreshList();
            }, function() {
                that.queryObj.pageNum++;
                that.requestList();
            });
        },
        dosearch : function(param) {
            var that = this;
            that.queryObj.keyword = param;
            that.queryObj.pageNum = 1;
            that.requestList();
        },
        changeAddress : function(obj) {         
            var that = this;
            var url = "/cloudlink-inspection-event/keyPoint/update";
            that.updateForm = obj;
            var param = {
                "bdLat" : obj.bdLat,
                "bdLon" : obj.bdLon,
                "radius" : obj.effectiveRadius
            };
            uexLockScreen.keyPointSelection(JSON.stringify(param), function(err, info) {
                if (err == 1) {
                    var resulat = JSON.parse(info);
                    that.updateForm.bdLat = resulat.bdLat;
                    that.updateForm.bdLon = resulat.bdLon;
                    jasRequest.post(url, that.updateForm, function(oData) {
                        if (oData.success == 1) {
                            baseOperation.alertToast("位置更新成功");
                        }
                    }, function(s) {
                        baseOperation.alertToast(s.msg);
                    });
                }
            });

        }
    }
});
