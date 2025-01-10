declare module '*.svg' {
    import { SVGProps } from 'react';
    const ReactComponent: React.FC<SVGProps<SVGSVGElement>>;
    export { ReactComponent };
    export default ReactComponent;
}
