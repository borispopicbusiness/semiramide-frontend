// Composables
import {createRouter, createWebHistory} from 'vue-router'
import EmployeeView from "@/views/employee/EmployeeView.vue";
import WorklogView from "@/views/worklog/WorklogView.vue"
import ProjectView from "@/views/project/ProjectView.vue"
import LeaveView from "@/views/leave/LeaveView.vue";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        children: [
          {
            name: 'employees',
            path: '/employees',
            component: EmployeeView
          },
          {
            name: 'worklogs',
            path: '/worklogs',
            component: WorklogView
          },
          {
            name: 'projects',
            path: '/projects',
            component: ProjectView
          },
          {
            name: 'leaves',
            path: '/leaves',
            component: LeaveView
          }

        ]
      },
    ],
  },
  {}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
