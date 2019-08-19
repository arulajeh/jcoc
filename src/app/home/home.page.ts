import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pages = [
    {
      title: 'Dashboard',
      url: '/home/dashboard',
      icon: 'home'
    },
    {
      title: 'Music',
      children: [
        {
          title: 'All Musics',
          url: '/home/all-music',
          icon: 'musical-notes'
        },
        {
          title: 'Add Music',
          url: '/home/add-music',
          icon: 'musical-note'
        }
      ]
    },
    {
      title: 'Add Articles',
      url: '/home/articles-add',
      icon: 'cube'
    },
    {
      title: 'Members',
      children: [
        {
          title: 'All Members',
          url: '/home/all-user',
          icon: 'contacts'
        },
        {
          title: 'Add Member',
          url: '/home/add-user',
          icon: 'person-add'
        }
      ]
    },
    {
      title: 'Schedule',
      children: [
        {
          title: 'All Schedule',
          url: '/home/all-schedule',
          icon: 'analytics'
        },
        {
          title: 'Add Schedule',
          url: '/home/add-schedule',
          icon: 'calendar'
        }
      ]
    },
    {
      title: 'Articles',
      url: '/home/articles-all',
      icon: 'cube'
    },
    {
      title: 'Content',
      url: '/home/content',
      icon: 'cube'
    },
    {
      title: 'Logout',
      url: '/home/logout',
      icon: 'log-out'
    }

  ]

  constructor() {}

}
