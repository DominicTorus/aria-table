export interface ufGravityCompdetail {
    componentsId: string;
    label: string;
    controls: string[];
    layoutFlag: string;
    grid: {
        columnStart: number;
        columnEnd: number;
        rowStart: number;
        rowEnd: number;
        gap: string;
    };
    height: number;
    isTable:boolean;
}