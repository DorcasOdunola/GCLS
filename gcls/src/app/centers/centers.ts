import { Component } from '@angular/core';
import { CenterService } from '../service/center-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-centers',
  standalone: false,
  templateUrl: './centers.html',
  styleUrl: './centers.css',
})
export class Centers {

  constructor(public centerService: CenterService, public snackbar: MatSnackBar) { }

  centerName: string = '';
  centerCode: string = '';

  centersList: any[] = [];

  ngOnInit() {
    this.getAllCenters();
  }

  createCenter() {
    if (this.centerName && this.centerCode) {
      let obj = {
        center_name: this.centerName,
        code_name: this.centerCode
      };

      this.centerService.addCenter(obj).subscribe((response: any) => {
        console.log(response);
        if (response.status === 'success') {
          this.snackbar.open(response.message, 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          this.getAllCenters();
          this.centerName = '';
          this.centerCode = '';
        }
      });
    }
  }

  getAllCenters() {
    this.centerService.getCenters().subscribe((response: any) => {
      console.log(response);
      if (response.status === 'success') {
        this.centersList = response.data;
      }
    });
  }
}
