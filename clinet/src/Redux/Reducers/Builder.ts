import {createReducer} from '@reduxjs/toolkit'
import {JSONElement} from "../../utils/preview/HTMLRendererBuilder"
import {generateRandomString} from '../../utils/util';


interface stack {
    section?: string[];
    template?: Record<string, any>;
    custom?: JSONElement
}

interface BuilderState {
    section: string[];
    template: Record<string, any>;
    custom: JSONElement;
    corousel: string[],
    actionStack: stack[];
    undoStack: stack[];

}

const init: BuilderState = {
    section: [],
    template: [],
    custom: {
        tag: "section",
        text: "",
        class: "section",
        id: "custom",
        customId: "doZ6iZUR",
        children: []
    },
    corousel: [],
    actionStack: [],
    undoStack: []
}

const BuilderReducer = createReducer(init, {


    // section action
    sectionlocalSectionAdd: (state, action) => {
        state.section = action.payload
    },
    AddSection: (state) => {
        state.section.push("")
        state.actionStack.push({section: state.section})
        state.undoStack = []
        localStorage.setItem('section', JSON.stringify(state.section))
    },
    SectionSelectType: (state, action) => {
        state.section[action.index] = action.value
        state.actionStack.push({section: state.section})
        state.undoStack = []
        localStorage.setItem('section', JSON.stringify(state.section))
    },
    DeleteSectionSelectType: (state, action) => {
        state.section.splice(action.index, 1);
        state.actionStack.push({section: state.section})
        state.undoStack = []
        localStorage.setItem('section', JSON.stringify(state.section))
    },
    DragAndDropSection: (state, action) => {
        const draggeIndex = action.draggedElement.index
        const targetIndex = action.targetElement.index
        if (targetIndex !== -1 && draggeIndex !== -1) {
            const removedValue = state.section.splice(draggeIndex, 1)[0];
            state.section.splice(targetIndex, 0, removedValue);
            const removedIndex = state.corousel.splice(draggeIndex, 1)[0];
            state.corousel.splice(targetIndex, 0, removedIndex);
        }
        state.actionStack.push({section: state.section})
        state.undoStack = []
        localStorage.setItem('corousel', JSON.stringify(state.corousel));
        localStorage.setItem('section', JSON.stringify(state.section))
    },


    DropElement: (state, action) => {
        state.custom = addChildByCustomId(state.custom, action.customId, action.draggedElement, action.dropId, action.dropPosition);
        state.actionStack.push({custom: state.custom})
        state.undoStack = []
    },
    CustomTextEdit: (state, action) => {
        state.custom = textChange(state.custom, action.text, action.id)
    },

    // template action 

    TemplatelocalAdd: (state, action) => {
        state.template = action.payload
    },
    AddTemplate: (state, action) => {
        state.template[action.index] = action.element
        localStorage.setItem('template', JSON.stringify(state.template));
        if (state.template) {
            state.actionStack.push({template: state.template})
            state.undoStack = []
        }
    },
    DeleteTemplate: (state, action) => {
        state.template.splice(action.index, 1);

        if (state.template.length >= 1) {
            localStorage.setItem('template', JSON.stringify(state.template));
            state.actionStack.push({template: state.template})
            state.undoStack = []
        }
    },


    // Corousel
    LocalCorouselData: (state, action) => {
        state.corousel = action.payload
        localStorage.setItem('corousel', JSON.stringify(state.corousel));
    },
    AddCorouselIndex: (state, action) => {
        state.corousel[action.index] = action.CorouselIndex
        localStorage.setItem('corousel', JSON.stringify(state.corousel));
    },
    DeleteCorousel: (state, action) => {
        state.corousel.splice(action.index, 1);
        localStorage.setItem('corousel', JSON.stringify(state.corousel));
    },






    // stack for action history
    do: (state, action) => {
        if (state.undoStack.length >= 1) {
            const copy = [...state.undoStack]
            const lastValue = copy.pop()
            const key = Object.keys(lastValue || "")
            if (key[0] === "section" && lastValue?.section) {
                state.section = lastValue?.section
                localStorage.setItem('section', JSON.stringify(state.section))
            } else if (key[0] === "template" && lastValue?.template) {
                state.template = lastValue?.template
                localStorage.setItem('template', JSON.stringify(state.template));
            }
            else if (key[0] === "custom" && lastValue?.custom) {
                state.custom = lastValue?.custom
            }
            state.actionStack.push(state.undoStack.pop() || {})

        }
    },
    undo: (state, action) => {
        if (state.actionStack.length >= 1) {
            const copy = [...state.actionStack]
            const lastValue = copy.pop()
            const key = Object.keys(lastValue || "")
            if (key[0] === "section" && lastValue?.section) {
                state.section = lastValue?.section
                localStorage.setItem('section', JSON.stringify(state.section))
            } else if (key[0] === "template" && lastValue?.template) {
                state.template = lastValue?.template
                localStorage.setItem('template', JSON.stringify(state.template));
            } else if (key[0] === "custom" && lastValue?.custom) {
                state.custom = lastValue?.custom;
            }

            const actionStackLast = state.actionStack.pop()
            if (actionStackLast) {
                state.undoStack.push(actionStackLast)
            }

        }
    }
})


function textChange(data: JSONElement, text: string, id: string): JSONElement {
    if (data.customId === id) {
        data.text = text
    } else {
        if (data.children) {
            for (const child of data.children) {
                textChange(child, text, id)
            }
        }
    }
    return data
}

function addChildByCustomId(data: JSONElement, customIdToMatch: string, childToAdd: JSONElement, dropId: string, dropPosition: string): JSONElement {
    const string = generateRandomString(8);
    let updatedData = childToAdd;
    if (!childToAdd.customId) {
        updatedData = {
            ...childToAdd,
            customId: string
        };

    }

    if (data.customId === customIdToMatch) {
        if (!data.children) {
            data.children = [];
        }
        if (dropId) {
            data.children.forEach((child, index) => {
                if (child.customId === dropId) {
                    if (dropPosition === "above") {
                        dropId = ""
                        data.children && data.children.splice(index, 0, updatedData);
                    } else {
                        dropId = ""
                        data.children && data.children.splice(index + 1, 0, updatedData);
                    }

                }
            })
        } else {
            data.children.push(updatedData);
        }
    } else {
        if (data.children) {
            for (const child of data.children) {
                addChildByCustomId(child, customIdToMatch, updatedData, dropId, dropPosition);
            }
        }
    }
    return data;
}

export default BuilderReducer


