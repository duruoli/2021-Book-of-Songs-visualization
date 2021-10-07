export namespace Types { //different types for data 
    export type glyType = {
        cx: number
        cy: number
        r: number
        op: number
        fill: string
        a1: number
        a2: number
        height: number
        r2: number
        r1: number 
    }
    
    
    
    export type glyEmoType = {
        Emotion: string
        n1: number
        r: number
        a1: number
        a2: number
        height: number
        r2: number
        r1: number
        fill: string
    }

    export type glyTheType = {
        Emotion: string
        Theme: string
        n1: number
        r: number
        a1: number
        a2: number
        height: number
        r2: number
        r1: number
        fill: string
        op: number
    }

    export type glyFunType = {
        Emotion: string
        Theme: string
        Function: string
        n1: number
        r: number
        a1: number
        a2: number
        height: number
        r2: number
        r1: number
        fill: string
        op: number
    }

    export type glyGenType = {
        Emotion: string
        Theme: string
        Function: string
        Genre: string
        n1: number
        r: number
        a1: number
        a2: number
        height: number
        r2: number
        r1: number
        fill: string
    }

    export type glyImageType = {
        name: string
        dir: string
        cx: number
        cy:number
    }

    export type glyRelateType = {
        Name: string
        name: string
        cx: number
        cy:number
        n: number
        a1: number
        a2: number
        r: number
        ratio: number
    }

    
}