import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from 'src/app/_services/menu.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  menuForm: FormGroup;

  constructor(private menuService: MenuService) {}

  onSubmit() {
    const newMenuItem = {
      sequence: +this.menuForm.value.inputMenuSequence,
      name: this.menuForm.value.inputMenuName,
      link: this.menuForm.value.inputMenuLink,
      icon: this.menuForm.value.inputMenuIcon,
      description: this.menuForm.value.inputMenuDescription,
      hasParent: this.menuForm.value.inputMenuHasParent ? true : false,
      parent: this.menuForm.value.inputMenuParent || 0
    };
    this.menuService
      .addNewMenuItem(newMenuItem)
      .subscribe();
  }

  ngOnInit() {
    this.menuForm = new FormGroup({
      inputMenuSequence: new FormControl(null, Validators.required),
      inputMenuName: new FormControl(null, Validators.required),
      inputMenuLink: new FormControl(null),
      inputMenuIcon: new FormControl(null, Validators.required),
      inputMenuDescription: new FormControl(null),
      inputMenuHasParent: new FormControl(null, Validators.required),
      inputMenuParent: new FormControl(null)
    });
  }
}
