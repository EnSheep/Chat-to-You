import { lazy } from 'react';

import { withPrivateRoute } from './private';

import Login from '@/pages/login';
import Register from '@/pages/register';

export interface IRouter {
	name?: string;
	redirect?: string;
	path: string;
	id: number;
	children?: Array<IRouter>;
	component: React.ComponentType;
}
//设置路由
export const router: Array<IRouter> = [
	{
		path: '/',
		component: withPrivateRoute(lazy(() => import('@/pages/home'))), // 需要登录才能访问的页面
		id: 0,
		children: [
			{
				path: 'chat',
				id: 1,
				component: withPrivateRoute(lazy(() => import('@/pages/home')))
			},
			{
				path: 'address-book',
				id: 2,
				component: withPrivateRoute(lazy(() => import('@/pages/home')))
			}
		]
	},
	{
		path: '/login',
		component: Login,
		id: 3
	},
	{
		path: '/register',
		component: Register,
		id: 4
	},
	{
		path: '*',
		component: lazy(() => import('@/pages/error')),
		redirect: '/',
		id: 5
	}
];
