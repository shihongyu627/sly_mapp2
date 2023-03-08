var domain = 'sly.shanliangyou888.com';
var config = {
	// api请求地址
	baseUrl: 'https://' + domain,
	// 图片域名
	imgDomain: 'https://' + domain,
	// H5端域名
	h5Domain: 'https://'+ domain +'/h5',
	
	// 腾讯地图key
	mpKey: '', 
	//客服地址
	webSocket : 'wss://'+ domain +'/wss',
	//本地端主动给服务器ping的时间, 0 则不开启 , 单位秒
	pingInterval: 1500
};

export default config;