var __option2 = [{
  label: '安全保护范围内',
  value: '安全保护范围内',
}, {
  label: '安全保护范围外，安全控制范围内',
  value: '安全保护范围外，安全控制范围内',
}, {
  label: '安全控制范围外',
  value: '安全控制范围外',
}];

var __check = [ //
  {
    field: 'constructionSituation',
    name: '施工情况',
    // required: true,
    defaultVal: '施工',
    type: 'singleselect',
    options: [{
      label: '施工',
      value: '施工',
    }, {
      label: '未施工',
      value: '未施工',
    }]
  }, {
    field: 'exploratorySituation',
    name: '探坑开挖',
    // required: true,
    defaultVal: '已开挖',
    type: 'singleselect',
    options: [{
      label: '已开挖',
      value: '已开挖',
    }, {
      label: '未开挖',
      value: '未开挖',
    }, {
      label: '开挖中',
      value: '开挖中',
    }]
  }, {
    field: 'inspectionConstructionDesc',
    name: '巡查说明',
    // required: true,
    type: 'textarea',
    validate: {
      max: 200,
    },
  },
];

var FormConfig = {
  '上午联系': [ //
    {
      field: 'planConstructionSituation',
      name: '施工计划',
      // required: true,
      defaultVal: '计划上午施工',
      type: 'singleselect',
      options: [{
        label: '计划上午施工',
        value: '计划上午施工',
      }, {
        label: '计划上午停工',
        value: '计划上午停工',
      }, {
        label: '未联系上',
        value: '未联系上',
      }]
    }, {
      field: 'contactConstructionDesc',
      name: '施工说明',
      defaultVal: 'XXXXXXX工地，计划今日于XXXXXXXX路段XXXXXXXXX处施工。',
      // required: true,
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'safeDistance',
      name: '施工范围',
      defaultVal: '安全保护范围内',
      // required: true,
      type: 'singleselect',
      options: __option2
    },
  ],
  '上午巡查': __check,
  '中午联系': [ //
    {
      field: 'planConstructionSituation',
      name: '施工计划',
      // required: true,
      defaultVal: '计划下午施工',
      type: 'singleselect',
      options: [{
        label: '计划下午施工',
        value: '计划下午施工',
      }, {
        label: '计划下午停工',
        value: '计划下午停工',
      }, {
        label: '未联系上',
        value: '未联系上',
      }]
    }, {
      field: 'contactConstructionDesc',
      name: '施工说明',
      // required: true,
      defaultVal: 'XXXXXXX工地，计划今日于XXXXXXXX路段XXXXXXXXX处施工。',
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'safeDistance',
      name: '施工范围',
      // required: true,
      defaultVal: '安全保护范围内',
      type: 'singleselect',
      options: __option2
    },
  ],
  '下午巡查': __check,
  '下午联系': [ //
    {
      field: 'planConstructionSituation',
      name: '施工计划',
      // required: true,
      defaultVal: '计划晚上施工',
      type: 'singleselect',
      options: [{
        label: '计划晚上施工',
        value: '计划晚上施工',
      }, {
        label: '计划晚上停工',
        value: '计划晚上停工',
      }, {
        label: '未联系上',
        value: '未联系上',
      }]
    }, {
      field: 'contactConstructionDesc',
      name: '施工说明',
      // required: true,
      defaultVal: 'XXXXXXX工地，计划今日于XXXXXXXX路段XXXXXXXXX处施工。',
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'safeDistance',
      name: '施工范围',
      // required: true,
      defaultVal: '安全保护范围内',
      type: 'singleselect',
      options: __option2
    },
    {
      field: 'tomorrowPlanConstructionSituation',
      name: '明日施工计划',
      // required: true,
      type: 'singleselect',
      defaultVal: '计划明天上午施工',
      options: [{
        label: '计划明天上午施工',
        value: '计划明天上午施工',
      }, {
        label: '计划明天上午停工',
        value: '计划明天上午停工',
      }, {
        label: '明日未联系上',
        value: '明日未联系上',
      }]
    }, {
      field: 'tomorrowContactConstructionDesc',
      name: '明日施工说明',
      // required: true,
      defaultVal: 'XXXXXXX工地，计划明日上午于XXXXXXXX路段XXXXXXXXX处施工。',
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'tomorrowSafeDistance',
      name: '明日施工范围',
      // required: true,
      defaultVal: '安全保护范围内',
      type: 'singleselect',
      options: __option2
    },
  ],
  '当天巡查': __check,
  '当天联系': [ //
    {
      field: 'planConstructionSituation',
      name: '施工计划',
      // required: true,
      defaultVal: '计划上午施工',
      type: 'singleselect',
      options: [{
        label: '计划上午施工',
        value: '计划上午施工',
      }, {
        label: '计划下午施工',
        value: '计划下午施工',
      }, {
        label: '计划晚上施工',
        value: '计划晚上施工',
      }, {
        label: '计划当日停工',
        value: '计划当日停工',
      }, {
        label: '未联系上',
        value: '未联系上',
      }]
    }, {
      field: 'contactConstructionDesc',
      name: '施工说明',
      // required: true,
      defaultVal: 'XXXXXXX工地，计划今日于XXXXXXXX路段XXXXXXXXX处施工。',
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'safeDistance',
      name: '施工范围',
      // required: true,
      defaultVal: '安全保护范围内',
      type: 'singleselect',
      options: __option2
    },
    {
      field: 'tomorrowPlanConstructionSituation',
      name: '明日施工计划',
      // required: true,
      defaultVal: '计划明天上午施工',
      type: 'singleselect',
      options: [{
        label: '计划明天上午施工',
        value: '计划明天上午施工',
      }, {
        label: '计划明天上午停工',
        value: '计划明天上午停工',
      }, {
        label: '明日未联系上',
        value: '明日未联系上',
      }]
    }, {
      field: 'tomorrowContactConstructionDesc',
      name: '明日施工说明',
      // required: true,
      defaultVal: 'XXXXXXX工地，计划明日上午于XXXXXXXX路段XXXXXXXXX处施工。',
      type: 'textarea',
      validate: {
        max: 200,
      },
      placeholder: '请输入施工说明'
    }, {
      field: 'tomorrowSafeDistance',
      name: '明日施工范围',
      // required: true,
      defaultVal: '安全保护范围内',
      type: 'singleselect',
      options: __option2
    },
  ],
};