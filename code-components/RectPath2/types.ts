export namespace Types { //different types for data 
    export type rectType = {
        node: string
        sum: number
        dy: number
        height: number
        EngName: string
        dx: number
        color: string
        rectWidth: number
    }

    export type circleType = {
        node: string
        sum: number
        dy: number
        height: number
        EngName: string
        dx: number
        color: string
        rectWidth: number
        dr: number
        image: string
    }

    export type sectionType = {
        section: string
        n: number
        a1: number
        a2: number
        opacity: number
        cx: number
        cy:number
    }

    export type subsectionType = {
        subsection: string
        n: number
        a1: number
        a2: number
        opacity: number
        cx: number
        cy:number
    }

    export type linkType =  {
        source: string,
        target: string,
        value: number,
        z1: number,
        z2: number,
        k1: number,
        k2: number,
        dx_z: number,
        dx_k: number,
        color: string,
    
    }

    
}