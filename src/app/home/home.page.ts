import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hasLogin = localStorage.getItem('token') ? true : false;

  pages = [
    {
      title: 'Dashboard',
      url: '/home/dashboard',
      icon: 'home',
      hidden: false
    },
    {
      title: 'Music',
      children: [
        {
          title: 'All Musics',
          url: '/home/all-music',
          icon: 'musical-notes',
          hidden: false
        },
        {
          title: 'Add Music',
          url: '/home/add-music',
          icon: 'musical-note',
          hidden: false
        }
      ]
    },
    {
      title: 'All Members',
      url: '/home/all-user',
      icon: 'contacts',
      hidden: JSON.parse(localStorage.getItem('data')).akses === 2 ? false : true
    },
    {
      title: 'Members',
      children: [
        {
          title: 'All Members',
          url: '/home/all-user',
          icon: 'contacts',
          hidden: false
        },
        {
          title: 'Add Member',
          url: '/home/add-user',
          icon: 'person-add',
          hidden: false
        }
      ],
      hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
    },
    {
      title: 'Schedule',
      children: [
        {
          title: 'All Schedule',
          url: '/home/all-schedule',
          icon: 'analytics',
          hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
        },
        {
          title: 'Add Schedule',
          url: '/home/add-schedule',
          icon: 'calendar',
          hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
        }
      ],
      hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
    },
    {
      title: 'All Schedule',
      url: '/home/all-schedule',
      icon: 'analytics',
      hidden: JSON.parse(localStorage.getItem('data')).akses === 2 ? false : true
    },
    {
      title: 'Articles',
      children: [
        {
          title: 'Articles',
          url: '/home/articles-all',
          icon: 'paper',
          hidden: false
        },
        {
          title: 'Add Articles',
          url: '/home/articles-add',
          icon: 'today',
          hidden: false
        }
      ],
      hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
    },
    {
      title: 'Articles',
      url: '/home/articles-all',
      icon: 'paper',
      hidden: JSON.parse(localStorage.getItem('data')).akses === 2 ? false : true
    },
    {
      title: 'Content',
      url: '/home/content',
      icon: 'cube',
      hidden: JSON.parse(localStorage.getItem('data')).akses === 1 ? false : true
    },
    {
      title: 'Logout',
      url: '/home/logout',
      icon: 'log-out',
      hidden: false
    }

  ]

  constructor() {}

}
