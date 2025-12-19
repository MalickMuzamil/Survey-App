import { Component } from '@angular/core';

@Component({
  selector: 'app-superset-dashboard',
  imports: [],
  templateUrl: './superset-dashboard.html',
  styleUrl: './superset-dashboard.css',
})
export class SupersetDashboard {
  ngAfterViewInit() {
    const iframe = document.getElementById(
      'supersetFrame'
    ) as HTMLIFrameElement;

    iframe.onload = () => {
      console.log('IFRAME LOADED SUCCESSFULLY — Superset allowed embedding.');
    };

    iframe.onerror = (err) => {
      console.error('❌ Superset refused to load inside iframe.', err);
    };

    setTimeout(() => {
      try {
        const test = iframe.contentWindow?.document;
        console.log('Iframe content:', test);
      } catch (e) {
        console.error(
          '💥 BLOCKED BY BROWSER SECURITY: Superset set X-Frame-Options.',
          e
        );
      }
    }, 1200);
  }

  openSupersetInNewTab() {
    window.open('http://192.168.100.59:8088/superset/dashboard/24/', '_blank');
  }
}
