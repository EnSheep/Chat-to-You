import React from 'react';
import { Navigate } from 'react-router-dom';

import { tokenStorage } from '@/utils/storage';
interface IPrivateRouteProps {
	element: React.ReactNode;
}

const PrivateRoute = (props: IPrivateRouteProps) => {
	const { element } = props;
	const authToken = tokenStorage.getItem();
	if (authToken) {
		return <>{element}</>;
	}
	return (
		<>
			<Navigate to="/login" />;
		</>
	);
};
// 高阶组件HOC，用于给需要登录才能访问的页面添加路由守卫
// 接受一个组件作为参数，并返回一个包装了 PrivateRoute 组件的新组件 WrappedComponent, 新组件会将传入的原始组件作为 element 属性传递给 PrivateRoute 组件
/** 
 * @param Component 接收一个需要授权登录的页面组件
 * @returns 返回一个包装了 PrivateRoute 组件的新组件 WrappedComponent
*/
export const withPrivateRoute = (Component: React.ElementType) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const WrappedComponent = (props: any) => {
		return <PrivateRoute element={<Component {...props} />} />;
	};
	return WrappedComponent;
};
