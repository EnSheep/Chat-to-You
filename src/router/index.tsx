import { Spin } from 'antd';
import { Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { IRouter, router } from './config';

const CenteredSpin = () => (
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
		<Spin />
	</div>
);

const RouteRender = () => {
	const routeRender = (router: Array<IRouter>) => {
		return router.map(item => {
			const { name, path, redirect, component: Component, children } = item;
	
			// 使用稳定唯一的key，这里假设每个item都有id属性
			const key = item.id || item.name || item.path;
	
			// 优化条件渲染逻辑
			const element = redirect ? <Navigate to={redirect} /> : <Suspense fallback={<CenteredSpin />}><Component /></Suspense>;
	
			return (
				<Route key={key} path={path} element={element}> {children && routeRender(children)}
				</Route>
			);
		});
	};
	// 使用 useMemo 来记忆化 router 映射的结果，避免每次渲染都重新计算
	const routes = useMemo(() => {
		return routeRender(router);
	}, [router]);

	return <Routes>{routes}</Routes>;
};

export default RouteRender;
