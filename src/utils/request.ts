/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import type {
	AxiosInstance,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError
} from 'axios';

import { apiBaseURL } from '@/config';

interface ApiResponse<T> {
	code: number;
	message: string; // 用一个更具体的字段来描述错误信息
	data: T;
}

export class Request {
	private instance: AxiosInstance;
	private defaultConfig: AxiosRequestConfig = { baseURL: apiBaseURL, timeout: 6000 };
		constructor(config: AxiosRequestConfig) {
		const mergedConfig = { ...this.defaultConfig, ...config }; // 使用浅拷贝
		this.instance = axios.create(mergedConfig);//创建实例
		this.instance.interceptors.request.use(//在请求前拦截获取token
			(config: InternalAxiosRequestConfig) => {
				const token = this.getToken(); // 使用一个独立的方法来获取 token
				if (token) {//如果有token则添加到请求头中
					config.headers.Authorization = token;
				}
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		this.instance.interceptors.response.use( //在响应后拦截信息并以规定的接口格式返回
			(response: AxiosResponse) => {
				return response;
			},
			(error: AxiosError) => {
				const apiError = error.response?.data; // 修改到更具体的错误信息字段
				return Promise.reject(apiError);
			}
		);
	}

	public request(config: AxiosRequestConfig): Promise<any> {
		return this.instance.request(config);
	}

	public get<TResponse = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.get(url, config);
	}

	public post<TRequest = any, TResponse = any>(
		url: string,
		data?: TRequest,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.post(url, data, config);
	}

	public put<TRequest = any, TResponse = any>(
		url: string,
		data?: TRequest,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.put(url, data, config);
	}

	public delete<TResponse = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.delete(url, config);
	}

	private getToken(): string | null {//从sessionStorage获取数据  关闭对应浏览器标签或窗口，会清除对应的 sessionStorage
		return JSON.parse(sessionStorage.getItem('better-chat.authToken') || 'null');
	}
}

export default new Request({});
