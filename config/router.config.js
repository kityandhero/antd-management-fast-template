import { accessWayCollection } from '../src/customConfig/accessWayCollection';

export default [
  {
    path: '/entrance',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/entrance', redirect: '/entrance/signIn' },
      { path: '/entrance/signIn', component: './Entrance' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/currentOperator' },
      {
        path: '/currentOperator',
        name: 'currentOperator',
        icon: 'user',
        routes: [
          {
            path: '/currentOperator',
            redirect: '/currentOperator/setting',
          },
          {
            path: '/currentOperator/setting',
            name: 'setting',
            icon: 'bars',
            component: './CurrentOperator/Setting',
            routes: [
              {
                path: '/currentOperator/setting',
                redirect: '/currentOperator/setting/basicInfo',
              },
              {
                path: '/currentOperator/setting/basicInfo',
                component: './CurrentOperator/Setting/BasicInfo',
              },
              {
                path: '/currentOperator/setting/password',
                component: './CurrentOperator/Setting/Password',
              },
            ],
          },
        ],
      },
    ],
  },
];
