import DependencyGraph from './DependencyGraph'; const DependencyGraphComponent = () => { return ( <main> 
<button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button> 

<DependencyGraph /> 

</main> ); }; export { DependencyGraphComponent as default };