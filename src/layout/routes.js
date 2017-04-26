import { actions as userActions, User } from 'user';
import { Dashboard } from 'dashboard';

const routes = [
  {
    path: '/user',
    component: User,
    startActions: [userActions.fetchProfile]
  },
  {
    path: '/',
    component: Dashboard
  }
];

export default routes;
