export namespace Type {
    export type Data = {
        source: string
        target: string
        value: number
    }

    export type nodeType = {
        name: string|number
    }
    
    export type linkType = {
        source: string|number
        target: string|number
        value: number
    }

    export type dataObject = {
        nodes: nodeType[]
        links: linkType[]
    }
}