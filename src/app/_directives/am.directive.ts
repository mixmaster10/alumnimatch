import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { College } from '../profile/_components/ps-colleges/ps-colleges.component';

@Directive({
  selector: '[appAM]'
})
export class AMDirective implements OnChanges {

  @Input() imageType: string;
  @Input() checkForCommonality: {a: any, b: any, field?: string | string[]};
  @Input() dataInCommon: boolean = false
  @Input() theme: College;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    let theme: any;
    if (localStorage.college) {
      theme = JSON.parse(localStorage.college);
    } else {
      theme = {
        color1: '585454',
        color2: 'ffffff',
        banner: 'assets/imgs/banner.png',
        logo1: 'logo1_default.png',
        logo2: 'logo2_default.png',
        slogal: 'Alumni Match',
        acronym: 'AM'
      };
    }
    this.theme = theme
    let style;
    switch (el.nativeElement.tagName) {
      case 'ION-TOOLBAR':
        style = `
          --background: #${theme.color1};
          color: #${theme.color2};
        `;
        break;
      case 'ION-FOOTER':
        style = `
          background: #${theme.color1};
        `;
        break;
      case 'ION-ITEM':
        style = `
          --background: #${theme.color1};
          --background-activated: #${theme.color1};
          --background-focused: #${theme.color1};
          --background-hover: #${theme.color1};
          --color: #${theme.color2};
        `;
        break;
      case 'ION-BUTTON':
        style = `
          --background: #${theme.color1};
          --background-activated: #${theme.color1};
          --background-focused: #${theme.color1};
          --background-hover: #${theme.color1};
          color: #${theme.color2};
        `;
        break;
      case 'ION-FAB-BUTTON':
        style = `
          --background: #${theme.color1};
          --background-activated: #${theme.color1};
          --background-focused: #${theme.color1};
          --background-hover: #${theme.color1};
          color: #${theme.color2};
        `;
        break;
      case 'ION-RANGE':
        style = `
          --bar-background-active: #${theme.color1};
          --knob-background: #${theme.color1};
        `;
        break;
      case 'ION-ICON':
        style = `
          color: #${theme.color1};
        `;
        break;
      case 'ION-BADGE':
        style = `
          color: #${theme.color2};
          background: #${theme.color1};
        `;
        break;
      case 'ION-TOGGLE':
        style = `
          --background-checked: #${theme.color1};
        `;
        break;
      case 'ION-CHECKBOX':
        style = `
          --background-checked: #${theme.color1};
          --border-color-checked: #${theme.color1};
        `;
        break;
      case 'ION-RADIO':
        style = `
          --color-checked: #${theme.color1};
        `;
        break;
      case 'ION-CARD':
        style = `
          --background: #${theme.color1};
        `;
        break;
      case 'ION-SEGMENT-BUTTON':
        style = `
          --background-checked: #${theme.color1};
          --background-focused: #${theme.color1}22;
          --background-hover: #${theme.color1}22;
          --border-color: #${theme.color1};
          --color: #${theme.color1};
        `;
        break;
      case 'ION-CONTENT':
        style = `
          --background: #${theme.color1}
        `;
        break;
      case 'ION-TEXTAREA':
        console.log("Text area")
        style = `
          --background-color: ${theme.color2};
          --border-color: yellow;
        `
        break;
      case 'DIV':
        style = `
          background: #${theme.color1}
        `;
        break;
      case 'IMG':
        style = `
          background: #${theme.color1}
        `;
        break;
      case 'BUTTON': // background = text color (it seems)
        style = `
        background: #${theme.color1}; 
        background-activated: #${theme.color1};
        background-focused: #${theme.color1};
        background-hover: #${theme.color1};
        background-color: #${theme.color1}
        color: #${theme.color2};
        `;
        break;
      default:
        style = `
          color: #${theme.color1}
        `;
        break;
    }
    this.renderer.setAttribute(el.nativeElement, 'style', style);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("Changes", changes)

    let style;
    switch (this.el.nativeElement.tagName) {
      case 'IMG':
        //console.log("Image item", this.imageType)
        if (this.imageType === 'logo1') {
          style = `
            content:url(${this.theme.logo1}) 
          `
        } else if (this.imageType === 'logo2') {
          style = `
            content:url(${this.theme.logo2}) 
          `
        } else if (this.imageType === 'banner') {
          style = `
            content:url(${this.theme.banner});
          `
        } else {
          style = `
            background: #${this.theme.color1};
          `;
        }
        
        break;
      case 'P':
        if (Array.isArray(this.checkForCommonality.b)) {
          let x = {hobby: {id: 1}}
          if (Array.isArray(this.checkForCommonality.field)) {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => this.isEquivalent(item[this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]]))
            console.log(index, this.checkForCommonality.b[0][this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 700;
              `
            }
          } else {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => item[this.checkForCommonality.field as string] === this.checkForCommonality.a[this.checkForCommonality.field as string])
            console.log(index, this.checkForCommonality.b[index], this.checkForCommonality.a[this.checkForCommonality.field])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 700;
              `
            }
          }
          
        } else {
          if (this.checkForCommonality.a === this.checkForCommonality.b) {
            style = `
              color: #${this.theme.color1};
              font-weight: 700;
            `
          }
        }
        
        break;
      case 'H4':
        if (this.checkForCommonality && Array.isArray(this.checkForCommonality.b)) {
          if (Array.isArray(this.checkForCommonality.field)) {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => this.isEquivalent(item[this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]]))
            console.log(index, this.checkForCommonality.b[0][this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 800;
              `
            }
          } else {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => item[this.checkForCommonality.field as string] === this.checkForCommonality.a[this.checkForCommonality.field as string])
            console.log(index, this.checkForCommonality.b[index], this.checkForCommonality.a[this.checkForCommonality.field])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 800;
              `
            }
          }
          
        } else if (this.checkForCommonality && this.checkForCommonality.a === this.checkForCommonality.b) {
            style = `
              color: #${this.theme.color1};
              font-weight: 800;
            `
        } else {
          style = `
            color: #${this.theme.color1};
          `
        }
        
        break;
      case 'SPAN':
        if (Array.isArray(this.checkForCommonality.b)) {
          let x = {hobby: {id: 1}}
          if (Array.isArray(this.checkForCommonality.field)) {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => this.isEquivalent(item[this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]]))
            console.log(index, this.checkForCommonality.b[0][this.checkForCommonality.field[0]], this.checkForCommonality.a[this.checkForCommonality.field[0]])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 700;
              `
            }
          } else {
            const index = (this.checkForCommonality.b as any[]).findIndex((item) => item[this.checkForCommonality.field as string] === this.checkForCommonality.a[this.checkForCommonality.field as string])
            console.log(index, this.checkForCommonality.b[index], this.checkForCommonality.a[this.checkForCommonality.field])
            if (index !== -1) {
              style = `
                color: #${this.theme.color1};
                font-weight: 700;
              `
            }
          }
          
        } else {
          if (this.checkForCommonality.a === this.checkForCommonality.b) {
            style = `
              color: #${this.theme.color1};
              font-weight: 700;
            `
          }
        }
        
        break;
      case 'DIV':
        style = `
          background: #${this.theme.color1}
        `;
        break;
      case 'ION-BADGE':
        style = `
          color: #${this.theme.color2};
          background: #${this.theme.color1};
        `;
        break;
      case 'ION-ICON':
        style = `
          color: #${this.theme.color1};
        `;
        break;
      default:
        break;
    }
    this.renderer.setAttribute(this.el.nativeElement, 'style', style);
  }

  isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

}
