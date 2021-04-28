// 实现列表组件展示
Vue.component('point-list', {
            props: {
                dataobj: Object,

            },
            template: [
                ' <li  class="sectionMargin sectionShadow" @click="changeAddress">',
                '<div class="point_list us1" >',
                ' <div class="point_title">',
                '<div class="code ulim100">{{dataobj.code}}</div>',
                '<div class="model_status">',
                '<span class="model">{{dataobj.inspectionModel}}</span>',
                '<span  class="status" :class="fontColor">{{dataobj.distributionStatusValue}}</span>',
                '</div>',
                '</div>',
                '<div class="point_main   ub-ver">',
                ' <div class="line ">',
                '<div class=" wid_hf pointName line ulim100 ufl">{{dataobj.name}}',
                '</div>',
                ' <div class="wid_hf orgName   line ulim100 tx-r ufr">{{dataobj.groupParentName}} — {{dataobj.groupName}}',
                '  </div>',
                ' </div>',
                '<div class="ub ub-ac">',
                '<div class="ub-f1  ulim100 address">   {{dataobj.location}}',
                ' </div>',
                ' <div class="address_error" >',
                '</div>',
                ' </div>',
                '</div>',
                '</div>',
                ' </li>'
            ].join(" "),
            data: function () {
                return {

                }
            },
            methods: {
                changeAddress: function () {
                    this.$emit("changeaddress", this.dataobj)
                }
            },
            computed: {
                fontColor: function () {
                        return this.dataobj.distributionStatus === 0 ? 'colred':'colbule';

        }


    },




});

