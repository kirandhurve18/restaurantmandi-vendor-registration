import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'waayu-vendor-registration';

  ngOnInit() {
    const storedData = localStorage.getItem('businessDetails');

    if (storedData) {
      // Parse the JSON string into a JavaScript object
      const parsedData = JSON.parse(storedData);

      // Access specific properties or perform operations with the parsed data
      console.log('Parsed data:', parsedData);

      // For example, accessing the email property
      const email = parsedData.data.email;
      console.log('Email:', email);
    } else {
      console.log('No value found in local storage.');
    }
  }
}
