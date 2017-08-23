import isEmpty from 'lodash/isEmpty';

export default role => (route) => {
  const newRoute = {
    ...route,
    async action(param) {
      const { store } = param;
      const state = store.getState();
      if (!state.user || !state.user.roles || state.user.roles.length < 0
          || state.user.roles.indexOf(role) < 0) {
        return {
          redirect: '/login',
        };
      }
      const result = await route.action(param);
      return result;
    },
  };
  return newRoute;
};
export const requireAuth = (route) => {
  const newRoute = {
    ...route,
    async action(param) {
      const { store } = param;
      const state = store.getState();
      if (!state.user || !state.user.id) {
        return {
          redirect: '/login',
        };
      }
      const result = await route.action(param);
      return result;
    },
  };
  const children = route && route.children;
  if (!isEmpty(children)) {
    newRoute.children = children.map(childRoute => requireAuth(childRoute));
  }
  return newRoute;
};
export const checkAuth = (store) => {
  const state = store.getState();
  if (isEmpty(state.user)) {
    return {
      redirect: '/login',
    };
  } else if (isEmpty(state.user.buildings)) {
    return {
      redirect: '/register',
    };
  } else if (state.user.isActive === 0) {
    return {
      redirect: '/waiting',
    };
  }
  return false;
};
