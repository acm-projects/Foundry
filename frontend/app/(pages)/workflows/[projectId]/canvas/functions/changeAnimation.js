export function changeAnimation() { 


const edges = JSON.parse(localStorage.getItem('edges')) || []

if(edges.length == 0 ) { 

    return;
}

let updatedEdges = edges.map(edge => ({
    ...edge,               
    animated: false       
  }));
  
  localStorage.setItem('edges',JSON.stringify(updatedEdges))

}