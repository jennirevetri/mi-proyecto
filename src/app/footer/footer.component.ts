import { Component } from '@angular/core';
import { TangramComponent } from '../tangram/tangram.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TangramComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
