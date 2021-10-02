export namespace Types { //data types
    export type rectType = {
        node: string
        sum: number
        dy: number
        height: number
        EngName: string
        dx: number
        color: string
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
        color: string
    }

    
}