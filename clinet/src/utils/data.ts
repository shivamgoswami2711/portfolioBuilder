interface JSONElement {
    tag: string;
    text?: string;
    class?: string;
    id?: string;
    children?: JSONElement[];
}

interface DataObject {
    [key: string]: JSONElement; // You can specify the type of values as per your data structure
}


export const data: Record<string, any> = {
    headers: {
        component: [{
            tag: 'header',
            class: 'header green',
            id: 'header',
            children: [
                {
                    tag: 'h1',
                    text: 'header 1',

                },
                {
                    tag: 'p',
                    text: 'menu'
                }
            ]
        },
        {
            tag: 'header',
            class: 'header Gold',
            id: 'header',
            children: [
                {
                    tag: 'h1',
                    text: 'header 2',

                },
                {
                    tag: 'p',
                    text: 'menu'
                }
            ]
        },
        {
            tag: 'header',
            class: 'header navy',
            id: 'header',
            children: [
                {
                    tag: 'h1',
                    text: 'header 3',

                },
                {
                    tag: 'p',
                    text: 'menu'
                }
            ]
        },
        {
            tag: 'header',
            class: 'header',
            id: 'header',
            children: [
                {
                    tag: 'h1',
                    text: 'header 4',

                },
                {
                    tag: 'p',
                    text: 'menu'
                }
            ]
        }
        ]
    },
    school: {
        component: [
            {
                tag: 'div',
                class: 'school 1 red',
                id: 'school',
                children: [
                    {
                        tag: 'h1',
                        text: 'school 1',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            }, {
                tag: 'div',
                class: 'school 2 green',
                id: 'school',
                children: [
                    {
                        tag: 'h1',
                        text: 'school 2',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },
            {
                tag: 'div',
                class: 'school 3 yellow',
                id: 'school',
                children: [
                    {
                        tag: 'h1',
                        text: 'school 3',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },
            {
                tag: 'div',
                class: 'school 4 blue',
                id: 'school',
                children: [
                    {
                        tag: 'h1',
                        text: 'school 4',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },

        ]
    }, footer: {
        component: [
            {
                tag: 'footer',
                class: 'footer Orange',
                id: 'footer',
                children: [
                    {
                        tag: 'h1',
                        text: 'footer 1',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            }, {
                tag: 'footer',
                class: 'footer Brown',
                id: 'footer',
                children: [
                    {
                        tag: 'h1',
                        text: 'footer 2',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },
            {
                tag: 'footer',
                class: 'footer Purple',
                id: 'footer',
                children: [
                    {
                        tag: 'h1',
                        text: 'footer 3',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },
            {
                tag: 'footer',
                class: 'footer Violet',
                id: 'footer',
                children: [
                    {
                        tag: 'h1',
                        text: 'footer 4',

                    },
                    {
                        tag: 'p',
                        text: 'menu'
                    }
                ]
            },

        ]
    }
}

export const elements: JSONElement[] = [
    {
        tag: 'h1',
        class: 'green',
        id: 'h1',
        text:"h1 Text",
        children: []
    },
    {
        tag: 'div',
        class: 'flex',
        id: 'h1',
        text:"flex",
        children: []
    },
    {
        tag: 'div',
        class: '',
        id: 'h1',
        text:"div",
        children: []
    },
    {
        tag: 'h2',
        class: 'green',
        id: 'h2',
        text:"h2 Text",
        children: []
    },
    {
        tag: 'h3',
        class: 'green',
        id: 'h3',
        text:"h3 Text",
        children: []
    },
    {
        tag: 'p',
        class: 'gray',
        id: 'p',
        text:"Text",
        children: []
    },
] 