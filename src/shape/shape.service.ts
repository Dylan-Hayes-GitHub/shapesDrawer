import { Injectable } from '@angular/core';
import { Shapes } from 'src/models/shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  public shapesArray: any [] = [];

  public matrixWidth: number = 500;
  public matrixHeight: number = 500;
  constructor() { }

  public buildMatrixArray(): void {
    for (let row = 0; row <= this.matrixHeight; row++) {
        this.shapesArray[row] = [];
        for (let col = 0; col <= this.matrixWidth; col++) {
            this.shapesArray[row][col] = false;
        }
    }
}


  public getShapeSpot(height: number, width: number): Shapes {
    let shapes: Shapes = {
        startingX: 0,
        startingY: 0,
        endingX: 0,
        endingY: 0,
        height: 0,
        width: 0
    }
      outerLoop: for (let row = 0; row < this.matrixHeight; row++) {
          for (let col = 0; col < this.matrixWidth; col++) {
              // As the outer loop itterates through each element of the 2d array / matrix this if statement is checking for the first element which has been marked as having no
              // items in it currently this is determined by the current row and col === false
              if (!this.shapesArray[row][col]) {
                  // this is a quick check to see if the item can actually fit in the found area
                  if ((col + width) <= this.matrixWidth && (row + height) <= this.matrixHeight) {
                      shapes.startingX = col;
                      shapes.startingY = row;

                      const innerRowControl = (height + row);
                      const innerColControl = (width + col);
                      let result = true;
                      innerLoop: for (let innerRow = row; innerRow <= innerRowControl; innerRow++) {
                          for (let innerCol = col; innerCol <= innerColControl; innerCol++) {
                              //the reason to check innerrow and innerCol in comparison to their controls is to prevent an edge case happening when the matrix is on its last row/col
                              //check and it finds a marked slot this is fine so we prevent the matrix from finding a new position by checking if we are at the end of the search
                              if ((this.shapesArray[innerRow][innerCol] && innerCol != innerColControl && innerRow != innerRowControl ) ) {
                                  result = false;
                                  //we reset canItFit to 0, 0, 0, 0 we dont want to remember old points that the matrix had found and prevent breaking of validation errors
                                  shapes.startingX = 0;
                                  shapes.startingY = 0;
                                  shapes.endingX = 0;
                                  shapes.endingY = 0;
                                  break innerLoop;
                              }
                              else{
                                  shapes.endingX = innerCol;
                                  shapes.endingY = innerRow;
                              }
                          }
                      }
                      if (result) {
                          break outerLoop;
                      }
                  }
              }
          }
      }
return shapes;
  }

  public addShapeToMatrix(shape: Shapes) {
    for(let row = shape.startingY; row < shape.endingY; row++){
      for(let col = shape.startingX; col < shape.endingX; col++){
        this.shapesArray[row][col] = true;
      }
    }
  }

  public generateItemDimension(max: number) {
    if(max === 1){
      return 1;
    } else {
      return Math.floor(Math.random() * (max - 1 + 1) + max);
    }
  }

  public generateRandomHexColorCode(): string {
    let hexCode = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + hexCode.slice(0, 6);

  }

  public resetArray() : void {
    this.shapesArray = [];
  }
}
