// 商家横向显示注状图
<template>
  <div class="com-container">
   <div class="com-chart" ref="seller_ref">

   </div>
  </div>
</template>

<script>
export default {
  name:'Seller',
  data(){
    return {
      echartsInstance:null,// echarts 实例对象
      allData:null,// 服务器返回的数据
      currentPage:1,//当前页数
      totalPage:0,//总页数
      timeID :null,// 定时器标识

    }
  },
  mounted(){
    this.initChart();
    this.getData();
    // 在界面加载完成时，主动对屏幕进行适配
   
    window.addEventListener('resize',this.screenAdapter)
  },
  //组件销毁时
  destroyed(){
    // 在组件销毁的时候，把监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeID)
  },
  methods:{
    // 初始化echartsinstance对象
    initChart(){
      // div加载完成
      this.echartsInstance = this.$echarts.init(this.$refs.seller_ref,'chalk')

      // 对图表初始化的配置
      const initOption  = {
        title:{
          text:'商家销售统计',
          left:20,
          top:25

        },
        gird:{
          
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
        },
        xAxis:{
          type:'value'
        },
        yAxis:{
          type:'category',
        },
        tooltip:{
          trigger:'axis',
          axisPointer:{
            z:0,
            type:'line',
            lineStyle:{
              color:'#2D3443'
            }
          }
        },
        series:[{
          type:'bar',
          // 柱状的标签
          label:{
            show:true,
            position: 'right',
            textStyle:{
              color:'white'
            }
          },
          itemStyle:{
            // new 出 echarts 全局对象的一个线性渐变方法
              // 指明方向(第四象限坐标轴),不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0% 状态时的颜色
                { offset: 0, color: '#5052EE' },
                // 100% 的颜色
                { offset: 1, color: '#AB6EE5' },
              ]),
          }


        }
        ]
      }
      // 给chart对象设置option
      this.echartsInstance.setOption(initOption)


      // 对图表进行鼠标事件的监听、
      this.echartsInstance.on('mouseover',()=>{
        // 当鼠标移入
        this.timeID && clearInterval(this.timeID)
      })
      // 当鼠标移出
      this.echartsInstance.on('mouseout',()=>{
        this.startInterval()
      })

    },
    async getData(){
      const res = await this.$http.get('seller')
      // 对数据进行排序
      this.allData = res.data.sort((a,b)=>{
        return b.value -a.value
      })
      // 每5条数据是一个页,即数组的下标0到4为一页
      this.totalPage = this.allData.length%5 == 0 ? this.allData.length/5 :this.allData.length/5 +1
      // 获取数据之后更新图表
      this.updateChart()
      // 获取数据之后启动定时器
      this.startInterval()
    },
    //  设置 option type类型为bar
    updateChart(){
      // 处理每个页面的data
      const start = (this.currentPage-1)*5  //第一项为0.第二页第一项下标为5 
      const end =  this.currentPage*5//第一页最后项为4.第二页最后项下标为9 ，截取是不包括end项
      const showData = this.allData.slice(start,end)
      // 需要将数据对象的中每个对象的name单独成数组
      const data_name = showData.map((item)=>item.name)
      const data_value = showData.map((item)=> item.value)
      const dataOption  = {
        yAxis:{
          data:data_name
        },
        series:[{
          data:data_value,
        }
        ]
      }
      // 给chart对象设置option
      this.echartsInstance.setOption(dataOption)
    },
    // 浏览器窗口动态变化的适配
    screenAdapter(){
      // 获得窗口的大小this.$refs.seller_ref.offsetWidth
      // 得到适配的大小  分出100取3.6
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      //浏览器分辨率大小相关的配置项
  
      const adapterOption  = {
        title:{
          textStyle:{
             fontSize:titleFontSize,
          },
        },
        tooltip:{
          axisPointer:{
            lineStyle:{
              width: titleFontSize,
            }
          }
        },
        series:[{
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ]
      }
      this.echartsInstance.setOption(adapterOption)
      // 手动调用图表的 resize 才能产生效果
      this.echartsInstance.resize()
    },
     // 开启动态渲染的定时器
    startInterval(){
      // 一般使用定时器都有一个保险操作,先关闭再开启
      this.timerId && clearInterval(this.timerId)

      this.timeID = setInterval(()=>{
        this.currentPage++;
        // 当超出最大也页数的时候，返回第一页
        if(this.currentPage>this.totalPage){
          this.currentPage = 1
        }
      //  this.currentPage =  (this.currentPage++)%5+1
        this.updateChart()
        //  this.screenAdapter()
      },3000)
    }
      
  }
}

</script>
<style lang='less' scoped>
</style>