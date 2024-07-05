import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-people',
  templateUrl: './add-new-people.component.html',
  styleUrls: ['./add-new-people.component.css']
})
export class AddNewPeopleComponent {
  person = {
    firstName: '',
    lastName: '',
    yearofBirth: 0,
    type: [] as string[],
  };

  type = ['Actor', 'Director'];

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    // Implement your file handling logic here
  }

  onSubmit() {
    console.log('Person data:', this.person);
    // Implement your submit logic here
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.person.type.push(value);
    } else {
      const index = this.person.type.indexOf(value);
      if (index !== -1) {
        this.person.type.splice(index, 1);
      }
    }
  }
}
