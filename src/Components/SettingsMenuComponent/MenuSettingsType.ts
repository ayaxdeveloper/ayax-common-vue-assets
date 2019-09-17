export class MenuSettingsType {
  contentClass = "";
  menuWidth = "";
  menuSettingsTitle = "";
  listType = "";
  listOfOptions: Array<{
    hiddenable: boolean,
    isVisible: boolean,
    text: string,
  }>;
  radioGroupCancel: Function; //функция вызываемая для отмены выбранных опций в radioGroupMenuItemsComponent,
  listChange: Function;  // функция вызываемая при клике на пункте CheckboxMenuitemsComponent
  dragItem: Function; // функция вызываемая при претаскивании пнкта в CheckboxMenuitemsComponent
  isDraggable = true;
  isDivider = false;
  clickOnItem: Function; //функция вызываемая при клике на пункте меню
  constructor(init?: Partial<MenuSettingsType>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}


