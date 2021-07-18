import Mock from 'mockjs';

// 配置拦截 ajax 的请求时的行为，支持的配置项目有 timeout。
 Mock.setup({
    timeout: '200 - 600'
})


function getchartdata (prarms) {
    const prarmsObj = JSON.parse(prarms.body);
    return ['日期', '访问用户', '下单用户', '下单率']  
}
function getpage4data()
{
    const data=[{
        id:1,
        title:'Card title',
        description:'This is the description',
        metasrc:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        imgalt:'example',
        imgsrc:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
        id:2,
        title:'Card title1',
        description:'This is the description',
        metasrc:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        imgalt:'example',
        imgsrc:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
        id:3,
        title:'Card title2',
        description:'This is the description',
        metasrc:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        imgalt:'example',
        imgsrc:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
        id:4,
        title:'Card title3',
        description:'This is the description',
        metasrc:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        imgalt:'example',
        imgsrc:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
        id:5,
        title:'Card title4',
        description:'This is the description',
        metasrc:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        imgalt:'example',
        imgsrc:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    }];
    return data;
}

function getpage5data()
{
    const data={
            card1:'这是我们的card1',
            card2:{
                name:'zhangmin'
            }
        }
    return data;
}

Mock.mock('/getchartdata', 'get', getchartdata);
Mock.mock('/page4data', 'get', getpage4data);
Mock.mock('/page5data', 'get', getpage5data);