import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Shapes } from 'src/models/shape';
import { ShapeService } from 'src/shape/shape.service';
import { interval, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit{
  subscription: Subscription;
  public normalDimension: number = 20;
  public formGroup: FormGroup;
  //emit value in sequence every 10 second
public timer = interval(1);
  constructor(private elementRef:ElementRef, private render:Renderer2, private shapesService: ShapeService, private fb: FormBuilder) {}


  title = 'shapeDrawer';

  @ViewChild("container", {read: ElementRef}) private divMessages: ElementRef;

  public currentDiv: string = "";
  public areaFilled: boolean = false;
  public intervalId: any;
 
  ngOnInit(): void {
    this.createFormGroup();
  }
  createFormGroup():void {
    this.formGroup = this.fb.group({
      shapeSize: new FormControl(null, Validators.required),
    }, {updateOn: 'submit'});
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if(this.formGroup.valid){
      let shapeSize = +this.formGroup.get('shapeSize').value
      this.normalDimension = shapeSize;
      this.resetShapes();
      this.addDiv();
      this.draw();
    }

  }
  public addDiv(): void {
    this.shapesService.buildMatrixArray();
    this.subscription = this.timer.subscribe(callFunction => this.draw());
  }
  public draw(): void {
      let shapehHeight = this.shapesService.generateItemDimension(this.normalDimension)
      let shapeWidth =  this.shapesService.generateItemDimension(this.normalDimension)
      let shapeAttribs: Shapes = this.shapesService.getShapeSpot(shapehHeight,shapeWidth);
      if(shapeAttribs.endingX > 0 && shapeAttribs.endingY > 0){
      let colorCode = this.shapesService.generateRandomHexColorCode();
      this.shapesService.addShapeToMatrix(shapeAttribs)
      let shape = document.createElement('div');
      let styleAttribs = " position: absolute; top: " + (shapeAttribs.startingY)+"px; left: " + (shapeAttribs.startingX) + "px; height: " + (shapehHeight)+ "px; width: " + (shapeWidth) + "px; background-color: " + colorCode + ";";
      shape.setAttribute("style", styleAttribs);
      const container = document.getElementById('container');
      container?.appendChild(shape);
    } 
    else {
      if(this.normalDimension === 1){
        this.subscription.unsubscribe();
      } else {
        if(this.normalDimension > 1 ) {
          this.normalDimension = this.normalDimension - 1;
        }
      }
    }
  }

  public resetShapes() {
    const container = document.getElementById('container');
    if(container.hasChildNodes){
      while(container?.firstChild) {
        container.removeChild(container.firstChild);
      }
  }

  }

}
