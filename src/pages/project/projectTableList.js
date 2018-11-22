const list = [
  {
    label: '序号',
    width: 50,
    prop: 'id',
    type: "index"
  },
  {
    label: '所属类型',
    width: 100,
    prop: 'typeName',

  },
  {
    label: '项目名称',
    prop: 'name',
  },
  {
    label: '优先级',
    width: 100,
    prop: 'priorityName',

  },
  {
    label: '需求提出人',
    width: 100,
    prop: 'var4',
    // prop: 'needperson',

  },
  {
    label: '开始时间',
    prop: 'starttime',
    width: 120,
  },
  {
    label: '计划完成时间',
    prop: 'finshtime',
    width: 120,
  },
  {
    label: '项目负责人',
    // prop: 'chargeperson',
    prop: 'var1',
    width: 100,
  },
  // {
  //   label: '项目延迟天数',
  //   prop: 'delaydays',
  //   width: 120,
  // },
  {
    label: '操作',
    width: 80,
  },

]

export default list
