'use strict'

// 拼接字符串
var queryString = require('query-string')
// 克隆对象
var _ = require('lodash')

var request = {}
var Mock =require('mockjs')


var config = require('./config')

request.get = function(url, params) {
	if (params) {
		url += '?' + queryString.stringify(params)
	}
	console.log(url);
	return fetch(url)
		      .then((response) => response.json())
		      .then((response) => Mock.mock(response))
}

request.post = function(url, body) {
	var option = _.extend(config.header, {
		body: JSON.stringify(body)
	})
	return  fetch(url, option)
		      .then((response) => response.json())
		      .then((response) => Mock.mock(response))
}

module.exports = request