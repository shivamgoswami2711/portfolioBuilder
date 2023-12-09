export interface JSONElement {
    tag: string;
    text?: string;
    class?: string;
    customId?: string;
    id?: string;
    children?: JSONElement[];
  }
  
  export interface JSONElementBuilder extends JSONElement {
    editable?: boolean;
  }
  interface EditTextStateDataType {
    text: string;
    id: string;
  }